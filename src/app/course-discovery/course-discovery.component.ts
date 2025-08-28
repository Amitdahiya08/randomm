import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersSidebarComponent } from './filters-sidebar/filters-sidebar.component';
import { CourseService } from '../core/services/course.service';
import { Course } from '../core/models';
import { CourseCardComponent } from '../shared/ui/course-card/course-card.component';
import { FormsModule } from '@angular/forms';
import { MATERIAL } from '../shared/material.imports';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { COURSE_DISCOVERY_CONSTANTS } from '../core/constants/app.constants';

@Component({
    selector: 'app-course-discovery',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, FiltersSidebarComponent, HeaderComponent, CourseCardComponent, ...MATERIAL],
    templateUrl: './course-discovery.component.html',
    styleUrls: ['./course-discovery.component.scss']
})
export class CourseDiscoveryComponent implements OnInit {
    private courseService = inject(CourseService);

    courses = signal<Course[]>([]);
    filters = signal<any>({});
    query = signal<string>('');
    sort = signal<'latest' | 'rating' | 'reviews' | 'az' | 'za'>(COURSE_DISCOVERY_CONSTANTS.SORT_OPTIONS.LATEST as any);

    // pagination
    page = signal<number>(COURSE_DISCOVERY_CONSTANTS.PAGINATION.DEFAULT_PAGE);
    pageSize = COURSE_DISCOVERY_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE;

    private route = inject(ActivatedRoute);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const searchQuery = params[COURSE_DISCOVERY_CONSTANTS.QUERY_PARAMS.SEARCH_QUERY] || '';
            this.query.set(searchQuery);
            if (searchQuery) {
                this.courseService.search(searchQuery).subscribe(courses => this.courses.set(courses));
            } else {
                this.courses.set([]);
            }
        });
    }

    loadCourses() {
        this.courseService.getPublished().subscribe(courses => this.courses.set(courses));
    }

    onFiltersChange(filterData: any) {
        this.filters.set(filterData);
        this.page.set(COURSE_DISCOVERY_CONSTANTS.PAGINATION.DEFAULT_PAGE);
    }

    onSortChange(sortValue: string) {
        this.sort.set(sortValue as any);
    }

    // derived courses
    filtered = computed(() => {
        let courseList = [...this.courses()];
        const activeFilters = this.filters();

        // Duration filter
        if (activeFilters.duration?.length) {
            courseList = courseList.filter(course => {
                const durationInMonths = this.durationToMonths(course.durationText);
                return activeFilters.duration.some((durationRange: string) => this.matchDuration(durationInMonths, durationRange));
            });
        }

        // Rating filter
        if (activeFilters.rating) {
            courseList = courseList.filter(course => course.rating >= activeFilters.rating);
        }

        // Level filter
        if (activeFilters.level?.length) {
            courseList = courseList.filter(course => activeFilters.level.includes(course.difficulty));
        }

        // Sorting
        switch (this.sort()) {
            case COURSE_DISCOVERY_CONSTANTS.SORT_OPTIONS.LATEST:
                courseList.sort((courseA, courseB) => +new Date(courseB.publishedDate) - +new Date(courseA.publishedDate));
                break;
            case COURSE_DISCOVERY_CONSTANTS.SORT_OPTIONS.RATING:
                courseList.sort((courseA, courseB) => courseB.rating - courseA.rating);
                break;
            case COURSE_DISCOVERY_CONSTANTS.SORT_OPTIONS.REVIEWS:
                courseList.sort((courseA, courseB) => courseB.reviewCount - courseA.reviewCount);
                break;
            case COURSE_DISCOVERY_CONSTANTS.SORT_OPTIONS.A_TO_Z:
                courseList.sort((courseA, courseB) => courseA.title.localeCompare(courseB.title));
                break;
            case COURSE_DISCOVERY_CONSTANTS.SORT_OPTIONS.Z_TO_A:
                courseList.sort((courseA, courseB) => courseB.title.localeCompare(courseA.title));
                break;
        }

        return courseList;
    });

    paginated = computed(() => {
        const startIndex = (this.page() - 1) * this.pageSize;
        return this.filtered().slice(startIndex, startIndex + this.pageSize);
    });

    totalPages = computed(() => Math.ceil(this.filtered().length / this.pageSize));

    private durationToMonths(durationText: string): number {
        const numericValue = parseInt(durationText);
        if (durationText.includes(COURSE_DISCOVERY_CONSTANTS.DURATION_KEYWORDS.WEEK)) {
            return numericValue / COURSE_DISCOVERY_CONSTANTS.DURATION_CALCULATIONS.WEEKS_PER_MONTH;
        }
        if (durationText.includes(COURSE_DISCOVERY_CONSTANTS.DURATION_KEYWORDS.MONTH)) {
            return numericValue;
        }
        return 0;
    }

    private matchDuration(durationInMonths: number, filterRange: string): boolean {
        const { DURATION_FILTERS, DURATION_CALCULATIONS } = COURSE_DISCOVERY_CONSTANTS;

        if (filterRange === DURATION_FILTERS.LESS_THAN_1_WEEK) {
            return durationInMonths < DURATION_CALCULATIONS.QUARTER_MONTH;
        }
        if (filterRange === DURATION_FILTERS.ONE_TO_FOUR_WEEKS) {
            return durationInMonths >= DURATION_CALCULATIONS.QUARTER_MONTH && durationInMonths <= DURATION_CALCULATIONS.ONE_MONTH;
        }
        if (filterRange === DURATION_FILTERS.ONE_TO_THREE_MONTHS) {
            return durationInMonths >= DURATION_CALCULATIONS.ONE_MONTH && durationInMonths <= DURATION_CALCULATIONS.THREE_MONTHS;
        }
        if (filterRange === DURATION_FILTERS.THREE_TO_SIX_MONTHS) {
            return durationInMonths > DURATION_CALCULATIONS.THREE_MONTHS && durationInMonths <= DURATION_CALCULATIONS.SIX_MONTHS;
        }
        if (filterRange === DURATION_FILTERS.SIX_TO_TWELVE_MONTHS) {
            return durationInMonths > DURATION_CALCULATIONS.SIX_MONTHS && durationInMonths <= DURATION_CALCULATIONS.TWELVE_MONTHS;
        }
        return true;
    }

    goToPreviousPage() {
        if (this.page() > COURSE_DISCOVERY_CONSTANTS.PAGINATION.DEFAULT_PAGE) {
            this.page.set(this.page() - 1);
        }
    }

    goToNextPage() {
        if (this.page() < this.totalPages()) {
            this.page.set(this.page() + 1);
        }
    }

    canGoToPreviousPage(): boolean {
        return this.page() > COURSE_DISCOVERY_CONSTANTS.PAGINATION.DEFAULT_PAGE;
    }

    canGoToNextPage(): boolean {
        return this.page() < this.totalPages();
    }
}
