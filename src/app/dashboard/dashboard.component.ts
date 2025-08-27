import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { CourseService, Course } from '../core/services/course.service';
import { EnrollmentService, Enrollment } from '../core/services/enrollment.service';
import { AuthService } from '../core/services/auth.service';
import { CourseCardComponent } from '../shared/ui/course-card/course-card.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, CourseCardComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    private courses = inject(CourseService);
    private enrollments = inject(EnrollmentService);
    private auth = inject(AuthService);

    @ViewChild('railLast', { static: false }) railLast?: ElementRef<HTMLDivElement>;
    @ViewChild('railNew', { static: false }) railNew?: ElementRef<HTMLDivElement>;

    enrolled: Enrollment[] = [];
    lastViewed: { course: Course; progressPercent: number }[] = [];
    newlyLaunched: Course[] = [];
    myGoalsCount = 3;

    ngOnInit() {
        const user = this.auth.currentUser;
        if (!user) return;

        this.enrollments.forUser(user.id).subscribe(enrs => {
            this.enrolled = enrs;
            const ids = enrs.map(e => e.courseId);
            this.courses.byIds(ids).subscribe(cs => {
                const mapById = new Map(cs.map(c => [c.id, c]));
                this.lastViewed = enrs.map(e => ({ course: mapById.get(e.courseId)!, progressPercent: e.progressPercent }));
            });
        });

        this.courses.getNewlyLaunched(16).subscribe(cs => this.newlyLaunched = cs);
    }

    get enrolledCount() { return this.enrolled.length; }
    get certificatesCount() { return this.enrolled.filter(e => e.progressPercent >= 100).length; }

    /** Smooth horizontal scroll with buttons */
    scrollRail(ref: 'last' | 'new', dir: 1 | -1) {
        const rail = ref === 'last' ? this.railLast?.nativeElement : this.railNew?.nativeElement;
        if (!rail) return;
        const cardWidth = 296; // card + gap
        rail.scrollBy({ left: dir * cardWidth * 2, behavior: 'smooth' });
    }

    /** Convert vertical wheel to horizontal, prevent page scroll */
    onWheel(event: WheelEvent, ref: 'last' | 'new') {
        const rail = ref === 'last' ? this.railLast?.nativeElement : this.railNew?.nativeElement;
        if (!rail) return;
        // only when content actually overflows
        const canScroll = rail.scrollWidth > rail.clientWidth;
        if (!canScroll) return;
        event.preventDefault(); // stop page scroll
        rail.scrollBy({ left: (event.deltaY || event.deltaX), behavior: 'auto' });
    }
}
