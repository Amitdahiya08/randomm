import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MATERIAL } from '../shared/material.imports';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../core/services/course.service';
import { Course } from '../core/models';
import { AuthService } from '../core/services/auth.service';
import { CourseCardComponent } from '../shared/ui/course-card/course-card.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HeaderComponent } from "../shared/ui/header/header.component";

type SortKey = 'latest' | 'rating' | 'reviews' | 'az' | 'za';
type TabKey = 'Published' | 'Draft' | 'Archived';

@Component({
    selector: 'app-my-courses',
    standalone: true,
    imports: [
        CommonModule, RouterLink, ReactiveFormsModule,
        MatTabsModule, ...MATERIAL, CourseCardComponent,
        HeaderComponent
    ],
    templateUrl: './my-courses.component.html',
    styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {
    private coursesSvc = inject(CourseService);
    private auth = inject(AuthService);
    private router = inject(Router);

    // raw data
    myCourses = signal<Course[]>([]);

    // UI state
    tab = signal<TabKey>('Published');
    sort = signal<SortKey>('latest');
    q = new FormControl('', { nonNullable: true });

    // derived: filtered by tab + search + sort
    view = computed(() => {
        const status = this.tab();
        const s = this.sort();
        const query = this.q.value.trim().toLowerCase();

        let list = this.myCourses().filter(c => c.status === status);

        if (query) {
            list = list.filter(c =>
                c.title.toLowerCase().includes(query) ||
                (c.skills ?? []).some((skill: string) => skill.toLowerCase().includes(query))
            );
        }

        switch (s) {
            case 'latest': list.sort((a, b) => +new Date(b.publishedDate) - +new Date(a.publishedDate)); break;
            case 'rating': list.sort((a, b) => b.rating - a.rating); break;
            case 'reviews': list.sort((a, b) => b.reviewCount - a.reviewCount); break;
            case 'az': list.sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'za': list.sort((a, b) => b.title.localeCompare(a.title)); break;
        }
        return list;
    });

    ngOnInit() {
        const me = this.auth.currentUser;
        if (!me) return;

        // fetch only once, filter locally by author
        this.coursesSvc.getAll().subscribe(all => {
            // Convert user ID to number for comparison since authorId is stored as number
            const userId = typeof me.id === 'string' ? parseInt(me.id, 10) : me.id;
            const myCourses = all.filter(c => c.authorId === userId);
            this.myCourses.set(myCourses);
        });

        // debounce search input
        this.q.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe();
    }

    setTab(label: TabKey) { this.tab.set(label); }
    setSort(v: SortKey) { this.sort.set(v); }

    createNewCourse() {
        this.router.navigate(['/author/create']);
    }
}
