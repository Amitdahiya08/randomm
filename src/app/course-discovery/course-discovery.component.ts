import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersSidebarComponent } from './filters-sidebar/filters-sidebar.component';
import { CourseService, Course } from '../core/services/course.service';
import { CourseCardComponent } from '../shared/ui/course-card/course-card.component';
import { FormsModule } from '@angular/forms';
import { MATERIAL } from '../shared/material.imports';
import { HeaderComponent } from '../shared/ui/header/header.component';

@Component({
    selector: 'app-course-discovery',
    standalone: true,
    imports: [CommonModule, FormsModule, FiltersSidebarComponent, HeaderComponent, CourseCardComponent, ...MATERIAL],
    templateUrl: './course-discovery.component.html',
    styleUrls: ['./course-discovery.component.scss']
})
export class CourseDiscoveryComponent implements OnInit {
    private courseService = inject(CourseService);

    courses = signal<Course[]>([]);
    filters = signal<any>({});
    sort = signal<'latest' | 'rating' | 'reviews' | 'az' | 'za'>('latest');

    // pagination
    page = signal(1);
    pageSize = 8;

    ngOnInit() {
        this.loadCourses();
    }

    loadCourses() {
        this.courseService.getAll().subscribe(cs => this.courses.set(cs));
    }

    onFiltersChange(f: any) { this.filters.set(f); this.page.set(1); }
    onSortChange(v: string) { this.sort.set(v as any); }

    // derived courses
    filtered = computed(() => {
        let list = [...this.courses()];
        const f = this.filters();

        // Duration filter
        if (f.duration?.length) {
            list = list.filter(c => {
                const months = this.durationToMonths(c.durationText);
                return f.duration.some((r: string) => this.matchDuration(months, r));
            });
        }

        // Rating filter
        if (f.rating) list = list.filter(c => c.rating >= f.rating);

        // Level filter
        if (f.level?.length) list = list.filter(c => f.level.includes(c.difficulty));

        // Sorting
        switch (this.sort()) {
            case 'latest':
                list.sort((a, b) => +new Date(b.publishedDate) - +new Date(a.publishedDate)); break;
            case 'rating':
                list.sort((a, b) => b.rating - a.rating); break;
            case 'reviews':
                list.sort((a, b) => b.reviewCount - a.reviewCount); break;
            case 'az':
                list.sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'za':
                list.sort((a, b) => b.title.localeCompare(a.title)); break;
        }

        return list;
    });

    paginated = computed(() => {
        const start = (this.page() - 1) * this.pageSize;
        return this.filtered().slice(start, start + this.pageSize);
    });

    totalPages = computed(() => Math.ceil(this.filtered().length / this.pageSize));

    private durationToMonths(txt: string): number {
        const n = parseInt(txt);
        if (txt.includes('week')) return n / 4;
        if (txt.includes('month')) return n;
        return 0;
    }
    private matchDuration(months: number, filter: string) {
        if (filter === '<1w') return months < 0.25;
        if (filter === '1-4w') return months >= 0.25 && months <= 1;
        if (filter === '1-3m') return months >= 1 && months <= 3;
        if (filter === '3-6m') return months > 3 && months <= 6;
        if (filter === '6-12m') return months > 6 && months <= 12;
        return true;
    }
}
