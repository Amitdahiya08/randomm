import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export interface Course {
    id: number;
    title: string;
    subtitle: string;
    authorId: number;
    provider: { name: string; logoUrl: string };
    thumbnailUrl: string;
    rating: number;
    reviewCount: number;
    enrollmentCount: number;
    difficulty: Level;
    durationText: string;          // e.g., "6 months", "5 weeks", "8 weeks"
    skills?: string[];
    whatYoullLearn?: string[];
    status: 'Published' | 'Draft';
    publishedDate: string;         // ISO
}

@Injectable({ providedIn: 'root' })
export class CourseService {
    private http = inject(HttpClient);
    private API = 'http://localhost:3000';
    loading = signal(false);

    getAll() {
        this.loading.set(true);
        return this.http.get<Course[]>(`${this.API}/courses`).pipe(
            map(res => { this.loading.set(false); return res; })
        );
    }

    search(term: string) {
        const q = term.trim().toLowerCase();
        if (!q) return this.getAll(); // empty query = all results

        return this.http.get<Course[]>(`${this.API}/courses`).pipe(
            map(courses =>
                courses.filter(c =>
                    c.title.toLowerCase().includes(q) ||
                    c.skills?.some(s => s.toLowerCase().includes(q))
                )
            )
        );
    }
    getById(id: number) {
        return this.http.get<Course>(`${this.API}/courses/${id}`);
    }

    getAuthor(userId: number) {
        return this.http.get<any>(`${this.API}/users/${userId}`);
    }

    /** simple related: share at least 1 skill with current, exclude itself, top 5 by rating */
    getRelated(base: Course, limit = 5) {
        return this.getAll().pipe(
            map(list => list
                .filter(c => c.id !== base.id && c.skills?.some(s => base.skills?.includes(s)))
                .sort((a, b) => b.rating - a.rating)
                .slice(0, limit)
            )
        );
    }

    /** curriculum, testimonials (json-server arrays) */
    getCurriculum(courseId: number) {
        return this.http.get<any[]>(`${this.API}/curriculum?courseId=${courseId}`);
    }
    getTestimonials(courseId: number) {
        return this.http.get<any[]>(`${this.API}/testimonials?courseId=${courseId}`);
    }


    getNewlyLaunched(limit = 12) {
        return this.getAll().pipe(
            map(list => [...list].sort((a, b) => +new Date(b.publishedDate) - +new Date(a.publishedDate)).slice(0, limit))
        );
    }

    byIds(ids: number[]) {
        if (!ids?.length) return this.getAll().pipe(map(() => [] as Course[]));
        const params = ids.map(id => `id=${id}`).join('&');
        return this.http.get<Course[]>(`${this.API}/courses?${params}`);
    }

    /** ===== Helpers for facets ===== */

    // Duration bucket in days
    parseDurationDays(d: string): number {
        const t = d.toLowerCase();
        const n = parseInt(t.replace(/[^\d]/g, ''), 10) || 0;
        if (t.includes('week')) return n * 7;
        if (t.includes('month')) return n * 30;
        if (t.includes('day')) return n;
        return n;
    }

    durationBucket(d: string): 'lt1w' | '1to4w' | '1to3m' | '3to6m' | '6to12m' | 'gt12m' {
        const days = this.parseDurationDays(d);
        if (days < 7) return 'lt1w';
        if (days <= 28) return '1to4w';
        if (days <= 90) return '1to3m';
        if (days <= 180) return '3to6m';
        if (days <= 365) return '6to12m';
        return 'gt12m';
    }

    publishedBucket(iso: string): 'thisWeek' | 'thisMonth' | 'last6m' | 'thisYear' | 'older' {
        const dt = new Date(iso);
        const now = new Date();
        const ms = now.getTime() - dt.getTime();
        const d = ms / 86400000;
        if (d <= 7) return 'thisWeek';
        if (d <= 30) return 'thisMonth';
        if (d <= 180) return 'last6m';
        if (now.getFullYear() === dt.getFullYear()) return 'thisYear';
        return 'older';
    }
}
