import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MATERIAL } from '../shared/material.imports';
import { CourseService } from '../core/services/course.service';
import { Course } from '../core/models';
import { EnrollmentService } from '../core/services/enrollment.service';
import { AuthService } from '../core/services/auth.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderComponent } from '../shared/ui/header/header.component';
import {
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    UI_CONSTANTS,
    COURSE_DETAILS_CONSTANTS,
    TIME_CONSTANTS
} from '../core/constants/app.constants';
import { CurriculumSection } from '../core/models/curriculum.model';

@Component({
    selector: 'app-course-details',
    standalone: true,
    imports: [
        CommonModule, RouterLink, HeaderComponent,
        MatTabsModule, MatExpansionModule, ...MATERIAL
    ],
    templateUrl: './course-details.component.html',
    styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private svc = inject(CourseService);
    private enrollmentService = inject(EnrollmentService);
    private authService = inject(AuthService);
    private snackBar = inject(MatSnackBar);

    course = signal<Course | null>(null);
    author = signal<any | null>(null);
    sections = signal<CurriculumSection[]>([]);
    testimonials = signal<any[]>([]);
    related = signal<Course[]>([]);
    isEnrolled = signal<boolean>(false);
    isEnrolling = signal<boolean>(false);

    private routeSubscription?: Subscription;

    ngOnInit() {
        // Subscribe to route parameter changes to handle navigation between courses
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            const idParam = params.get('id');
            if (!idParam) return;

            // Handle both string and number IDs from the database
            const id = isNaN(Number(idParam)) ? idParam : Number(idParam);

            this.loadCourseData(id);
        });
    }

    ngOnDestroy() {
        this.routeSubscription?.unsubscribe();
    }

    private loadCourseData(id: number | string) {
        this.svc.getById(id).subscribe(course => {
            this.course.set(course);
            this.svc.getAuthor(course.authorId).subscribe(author => this.author.set(author));
            this.svc.getCurriculum(course.id).subscribe(curriculumData => this.sections.set((curriculumData[0]?.sections) ?? []));
            this.svc.getTestimonials(course.id).subscribe(testimonials => this.testimonials.set(testimonials));
            this.svc.getRelated(course).subscribe(relatedCourses => this.related.set(relatedCourses));

            // Check if user is enrolled in this course
            const currentUser = this.authService.currentUser;
            if (currentUser) {
                const courseId = typeof course.id === 'string' ? parseInt(course.id, UI_CONSTANTS.NUMERIC_BASE) : course.id;
                this.enrollmentService.isEnrolled(currentUser.id, courseId).subscribe(enrolled => {
                    this.isEnrolled.set(enrolled);
                });
            }
        });
    }

    totalSummary() {
        const sections = this.sections();
        const totalLectures = sections.reduce((count, section) => count + section.lectures.length, 0);
        const totalMinutes = sections.flatMap(section => section.lectures).reduce((count, lecture) => count + (lecture.durationMinutes || 0), 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${sections.length} ${COURSE_DETAILS_CONSTANTS.LABELS.SECTIONS}${UI_CONSTANTS.COURSE_CONTENT.SECTIONS_SEPARATOR}${totalLectures} ${COURSE_DETAILS_CONSTANTS.LABELS.LECTURES}${UI_CONSTANTS.COURSE_CONTENT.LECTURES_SEPARATOR}${hours}${UI_CONSTANTS.COURSE_CONTENT.DURATION_SEPARATOR}${minutes}${UI_CONSTANTS.COURSE_CONTENT.MINUTES_SUFFIX}${UI_CONSTANTS.COURSE_CONTENT.TOTAL_LENGTH_SUFFIX}`;
    }

    enroll() {
        const currentUser = this.authService.currentUser;
        const currentCourse = this.course();

        if (!currentUser) {
            this.snackBar.open(COURSE_DETAILS_CONSTANTS.MESSAGES.LOGIN_REQUIRED, UI_CONSTANTS.SNACKBAR.ACTION_CLOSE, { duration: TIME_CONSTANTS.TOAST_DURATION });
            this.router.navigate([UI_CONSTANTS.ROUTES.LOGIN]);
            return;
        }

        if (!currentCourse) {
            this.snackBar.open(COURSE_DETAILS_CONSTANTS.MESSAGES.COURSE_NOT_AVAILABLE, UI_CONSTANTS.SNACKBAR.ACTION_CLOSE, { duration: TIME_CONSTANTS.TOAST_DURATION });
            return;
        }

        if (this.isEnrolled()) {
            this.snackBar.open(COURSE_DETAILS_CONSTANTS.MESSAGES.ALREADY_ENROLLED, UI_CONSTANTS.SNACKBAR.ACTION_CLOSE, { duration: TIME_CONSTANTS.TOAST_DURATION });
            return;
        }

        this.isEnrolling.set(true);
        const courseId = typeof currentCourse.id === 'string' ? parseInt(currentCourse.id, UI_CONSTANTS.NUMERIC_BASE) : currentCourse.id;

        this.enrollmentService.enrollUser(currentUser.id, courseId).subscribe({
            next: (enrollment) => {
                this.isEnrolled.set(true);
                this.isEnrolling.set(false);
                this.snackBar.open(SUCCESS_MESSAGES.COURSE.ENROLLMENT_SUCCESS, UI_CONSTANTS.SNACKBAR.ACTION_CLOSE, {
                    duration: TIME_CONSTANTS.SNACKBAR_DURATION,
                    panelClass: UI_CONSTANTS.SNACKBAR.CLASSES.SUCCESS
                });

                // Update the course enrollment count
                if (currentCourse) {
                    currentCourse.enrollmentCount = (currentCourse.enrollmentCount || 0) + 1;
                    this.course.set({ ...currentCourse });
                }
            },
            error: (error) => {
                this.isEnrolling.set(false);
                console.error('Enrollment failed:', error);
                this.snackBar.open(COURSE_DETAILS_CONSTANTS.MESSAGES.ENROLLMENT_FAILED, UI_CONSTANTS.SNACKBAR.ACTION_CLOSE, {
                    duration: TIME_CONSTANTS.SNACKBAR_DURATION,
                    panelClass: UI_CONSTANTS.SNACKBAR.CLASSES.ERROR
                });
            }
        });
    }

    getSectionDurationHours(section: CurriculumSection): number {
        const totalMinutes = section.lectures.reduce((count: number, lecture) => count + lecture.durationMinutes, 0);
        return Math.floor(totalMinutes / 60);
    }

    getSectionDurationMinutes(section: CurriculumSection): number {
        const totalMinutes = section.lectures.reduce((count: number, lecture) => count + lecture.durationMinutes, 0);
        return totalMinutes % 60;
    }

    expandAllSections() {
        document.querySelectorAll(UI_CONSTANTS.SELECTORS.MAT_EXPANSION_PANEL).forEach(panel => {
            (panel as any).expanded = true;
        });
    }

    navigateToCourse(courseId: number | string) {
        this.router.navigate([UI_CONSTANTS.ROUTES.COURSES, courseId]).then(() => {
            window.scrollTo(UI_CONSTANTS.SCROLL.TOP_POSITION, UI_CONSTANTS.SCROLL.TOP_POSITION);
        });
    }

    startLearning() {
        const currentCourse = this.course();
        const currentSections = this.sections();

        if (!currentCourse) {
            this.snackBar.open(COURSE_DETAILS_CONSTANTS.MESSAGES.COURSE_NOT_AVAILABLE, UI_CONSTANTS.SNACKBAR.ACTION_CLOSE, { duration: TIME_CONSTANTS.TOAST_DURATION });
            return;
        }

        // Find the first lecture in the first section
        const firstSection = currentSections[0];
        if (!firstSection || !firstSection.lectures || firstSection.lectures.length === 0) {
            this.snackBar.open(COURSE_DETAILS_CONSTANTS.MESSAGES.NO_LECTURES_AVAILABLE, UI_CONSTANTS.SNACKBAR.ACTION_CLOSE, { duration: TIME_CONSTANTS.TOAST_DURATION });
            return;
        }

        const firstLecture = firstSection.lectures[0];
        const courseId = typeof currentCourse.id === 'string' ? parseInt(currentCourse.id, UI_CONSTANTS.NUMERIC_BASE) : currentCourse.id;

        // Navigate to the first lecture
        this.router.navigate([UI_CONSTANTS.ROUTES.LEARN, courseId, UI_CONSTANTS.ROUTE_PARAMS.LECTURE, firstLecture.id]).then(() => {
            window.scrollTo(UI_CONSTANTS.SCROLL.TOP_POSITION, UI_CONSTANTS.SCROLL.TOP_POSITION);
        });
    }
}
