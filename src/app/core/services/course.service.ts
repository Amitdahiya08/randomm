import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
    Course,
    CourseAuthor,
    CourseCurriculum,
    CourseTestimonial,
    DurationBucket,
    PublishedBucket,
    DifficultyLevel as Level
} from '../models';
import { API_CONFIG, COURSE_SERVICE_CONSTANTS, UI_CONSTANTS } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class CourseService {
    private readonly http = inject(HttpClient);
    private readonly baseApiUrl = API_CONFIG.BASE_URL;

    // Public signals
    readonly loading = signal(false);

    // Private helper methods
    private setLoading(isLoading: boolean): void {
        this.loading.set(isLoading);
    }

    private buildApiUrl(endpoint: string): string {
        return `${this.baseApiUrl}${endpoint}`;
    }

    /**
     * Retrieves all courses from the API
     * @returns Observable<Course[]> - All courses
     */
    getAll(): Observable<Course[]> {
        this.setLoading(true);
        return this.http.get<Course[]>(this.buildApiUrl(API_CONFIG.ENDPOINTS.COURSES)).pipe(
            map(courses => {
                this.setLoading(false);
                return courses;
            })
        );
    }

    /**
     * Searches for courses based on a search term
     * @param searchTerm - The term to search for
     * @returns Observable<Course[]> - Filtered courses matching the search term
     */
    search(searchTerm: string): Observable<Course[]> {
        const normalizedQuery = searchTerm.trim().toLowerCase();
        if (!normalizedQuery) {
            return this.getPublished(); // empty query = all published results
        }

        return this.http.get<Course[]>(this.buildApiUrl(API_CONFIG.ENDPOINTS.COURSES)).pipe(
            map(courses =>
                courses.filter(course =>
                    course.status === COURSE_SERVICE_CONSTANTS.STATUS.PUBLISHED && // Only search published courses
                    (course.title.toLowerCase().includes(normalizedQuery) ||
                        course.skills?.some(skill => skill.toLowerCase().includes(normalizedQuery)))
                )
            )
        );
    }

    /**
     * Retrieves a specific course by ID
     * @param courseId - The course ID
     * @returns Observable<Course> - The requested course
     */
    getById(courseId: number | string): Observable<Course> {
        return this.http.get<Course>(this.buildApiUrl(`${API_CONFIG.ENDPOINTS.COURSES}/${courseId}`));
    }

    /**
     * Retrieves author information by user ID
     * @param authorId - The author's user ID
     * @returns Observable<CourseAuthor> - The author information
     */
    getAuthor(authorId: number): Observable<CourseAuthor> {
        return this.http.get<CourseAuthor>(this.buildApiUrl(`${API_CONFIG.ENDPOINTS.USERS}/${authorId}`));
    }

    /**
     * Retrieves related courses based on shared skills
     * Excludes the base course itself and returns top courses by rating
     * @param baseCourse - The course to find related courses for
     * @param maxResults - Maximum number of related courses to return
     * @returns Observable<Course[]> - Related courses sorted by rating
     */
    getRelated(baseCourse: Course, maxResults: number = COURSE_SERVICE_CONSTANTS.DEFAULT_LIMITS.RELATED_COURSES): Observable<Course[]> {
        return this.getAll().pipe(
            map(courseList => courseList
                .filter(course =>
                    course.id !== baseCourse.id &&
                    course.status === COURSE_SERVICE_CONSTANTS.STATUS.PUBLISHED && // Only show published related courses
                    course.skills?.some(skill => baseCourse.skills?.includes(skill))
                )
                .sort((courseA, courseB) => courseB.rating - courseA.rating)
                .slice(0, maxResults)
            )
        );
    }

    /**
     * Retrieves curriculum data for a specific course
     * @param courseId - The course ID
     * @returns Observable<CourseCurriculum[]> - Course curriculum data
     */
    getCurriculum(courseId: number | string): Observable<CourseCurriculum[]> {
        const queryParam = `${COURSE_SERVICE_CONSTANTS.QUERY_PARAMS.COURSE_ID}=${courseId}`;
        return this.http.get<CourseCurriculum[]>(this.buildApiUrl(`/curriculum?${queryParam}`));
    }

    /**
     * Retrieves testimonials for a specific course
     * @param courseId - The course ID
     * @returns Observable<CourseTestimonial[]> - Course testimonials
     */
    getTestimonials(courseId: number | string): Observable<CourseTestimonial[]> {
        const queryParam = `${COURSE_SERVICE_CONSTANTS.QUERY_PARAMS.COURSE_ID}=${courseId}`;
        return this.http.get<CourseTestimonial[]>(this.buildApiUrl(`/testimonials?${queryParam}`));
    }


    /**
     * Retrieves newly launched courses sorted by publication date
     * @param maxResults - Maximum number of courses to return
     * @returns Observable<Course[]> - Newly launched courses
     */
    getNewlyLaunched(maxResults: number = COURSE_SERVICE_CONSTANTS.DEFAULT_LIMITS.NEWLY_LAUNCHED): Observable<Course[]> {
        return this.getAll().pipe(
            map(courseList => [...courseList]
                .filter(course => course.status === COURSE_SERVICE_CONSTANTS.STATUS.PUBLISHED) // Only show published courses
                .sort((courseA, courseB) => +new Date(courseB.publishedDate) - +new Date(courseA.publishedDate))
                .slice(0, maxResults)
            )
        );
    }

    /**
     * Retrieves courses by their IDs
     * @param courseIds - Array of course IDs
     * @returns Observable<Course[]> - Courses matching the provided IDs
     */
    getByIds(courseIds: number[]): Observable<Course[]> {
        if (!courseIds?.length) {
            return this.getAll().pipe(map(() => [] as Course[]));
        }
        const queryParams = courseIds.map(courseId => `${COURSE_SERVICE_CONSTANTS.QUERY_PARAMS.ID}=${courseId}`).join('&');
        return this.http.get<Course[]>(this.buildApiUrl(`${API_CONFIG.ENDPOINTS.COURSES}?${queryParams}`));
    }

    /**
     * Retrieves only published courses
     * @returns Observable<Course[]> - Published courses only
     */
    getPublished(): Observable<Course[]> {
        return this.getAll().pipe(
            map(courses => courses.filter(course => course.status === COURSE_SERVICE_CONSTANTS.STATUS.PUBLISHED))
        );
    }

    // ===== Helper Methods for Course Categorization =====

    /**
     * Parses duration text and converts it to days
     * @param durationText - Duration string (e.g., "6 months", "5 weeks")
     * @returns number - Duration in days
     */
    parseDurationInDays(durationText: string): number {
        const normalizedText = durationText.toLowerCase();
        const numericValue = parseInt(normalizedText.replace(/[^\d]/g, ''), UI_CONSTANTS.NUMERIC_BASE) || 0;

        if (normalizedText.includes(COURSE_SERVICE_CONSTANTS.DURATION_KEYWORDS.WEEK)) {
            return numericValue * COURSE_SERVICE_CONSTANTS.TIME_CALCULATIONS.DAYS_PER_WEEK;
        }
        if (normalizedText.includes(COURSE_SERVICE_CONSTANTS.DURATION_KEYWORDS.MONTH)) {
            return numericValue * COURSE_SERVICE_CONSTANTS.TIME_CALCULATIONS.DAYS_PER_MONTH;
        }
        if (normalizedText.includes(COURSE_SERVICE_CONSTANTS.DURATION_KEYWORDS.DAY)) {
            return numericValue;
        }
        return numericValue;
    }

    /**
     * Categorizes course duration into predefined buckets
     * @param durationText - Duration string
     * @returns DurationBucket - The appropriate duration category
     */
    getDurationBucket(durationText: string): DurationBucket {
        const durationInDays = this.parseDurationInDays(durationText);
        const { TIME_CALCULATIONS, DURATION_BUCKETS } = COURSE_SERVICE_CONSTANTS;

        if (durationInDays < TIME_CALCULATIONS.DAYS_PER_WEEK) {
            return DURATION_BUCKETS.LESS_THAN_1_WEEK;
        }
        if (durationInDays <= TIME_CALCULATIONS.WEEKS_IN_MONTH * TIME_CALCULATIONS.DAYS_PER_WEEK) {
            return DURATION_BUCKETS.ONE_TO_FOUR_WEEKS;
        }
        if (durationInDays <= TIME_CALCULATIONS.DAYS_PER_QUARTER) {
            return DURATION_BUCKETS.ONE_TO_THREE_MONTHS;
        }
        if (durationInDays <= TIME_CALCULATIONS.DAYS_PER_HALF_YEAR) {
            return DURATION_BUCKETS.THREE_TO_SIX_MONTHS;
        }
        if (durationInDays <= TIME_CALCULATIONS.DAYS_PER_YEAR) {
            return DURATION_BUCKETS.SIX_TO_TWELVE_MONTHS;
        }
        return DURATION_BUCKETS.GREATER_THAN_12_MONTHS;
    }

    /**
     * Categorizes course publication date into time-based buckets
     * @param publishedDateIso - ISO date string
     * @returns PublishedBucket - The appropriate time category
     */
    getPublishedBucket(publishedDateIso: string): PublishedBucket {
        const publishedDate = new Date(publishedDateIso);
        const currentDate = new Date();
        const timeDifferenceMs = currentDate.getTime() - publishedDate.getTime();
        const daysDifference = timeDifferenceMs / COURSE_SERVICE_CONSTANTS.TIME_CALCULATIONS.MILLISECONDS_PER_DAY;
        const { PUBLISHED_BUCKETS, TIME_CALCULATIONS } = COURSE_SERVICE_CONSTANTS;

        if (daysDifference <= TIME_CALCULATIONS.DAYS_PER_WEEK) {
            return PUBLISHED_BUCKETS.THIS_WEEK;
        }
        if (daysDifference <= TIME_CALCULATIONS.DAYS_PER_MONTH) {
            return PUBLISHED_BUCKETS.THIS_MONTH;
        }
        if (daysDifference <= TIME_CALCULATIONS.DAYS_IN_SIX_MONTHS) {
            return PUBLISHED_BUCKETS.LAST_SIX_MONTHS;
        }
        if (currentDate.getFullYear() === publishedDate.getFullYear()) {
            return PUBLISHED_BUCKETS.THIS_YEAR;
        }
        return PUBLISHED_BUCKETS.OLDER;
    }
}
