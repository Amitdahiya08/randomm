import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MATERIAL } from '../../material.imports';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CourseService, Course } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatMenuModule, MatBadgeModule, ...MATERIAL],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    private courses = inject(CourseService);
    private auth = inject(AuthService);
    private router = inject(Router);

    productName = 'LearnHub';
    query = new FormControl('', { nonNullable: true });
    options = signal<Course[]>([]);
    user$ = this.auth.currentUser$;

    constructor() {
        // live autocomplete
        effect(() => {
            const term = (this.query.value || '').trim();
            if (term.length < 2) { this.options.set([]); return; }
            this.courses.search(term).subscribe(res => this.options.set(res.slice(0, 8)));
        });
    }
    goSearch() {
        const q = (this.query.value || '').trim();
        if (!q) return;
        this.router.navigate(['/search'], { queryParams: { q } });
        this.clear();
    }

    selectCourse(c: Course) {
        this.router.navigate(['/discover'], { queryParams: { q: this.query.value } });
        this.clear();
    }


    clear() { this.query.setValue(''); this.options.set([]); }
    // selectCourse(c: Course) { this.router.navigate(['/dashboard'], { queryParams: { highlight: c.id } }); this.clear(); }
    logout() { this.auth.logout(); this.router.navigateByUrl('/auth/login'); }
}
