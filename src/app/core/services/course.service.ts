import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

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
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    durationText: string;
    status: 'Published' | 'Draft';
    publishedDate: string;
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
        const q = encodeURIComponent(term.trim());
        if (!q) return this.getAll();
        // json-server simple contains on title via q parameter
        return this.http.get<Course[]>(`${this.API}/courses?q=${q}`);
    }

    getNewlyLaunched(limit = 12) {
        return this.getAll().pipe(
            map(list =>
                [...list]
                    .sort((a, b) => +new Date(b.publishedDate) - +new Date(a.publishedDate))
                    .slice(0, limit)
            )
        );
    }

    byIds(ids: number[]) {
        const params = ids.map(id => `id=${id}`).join('&');
        return this.http.get<Course[]>(`${this.API}/courses?${params}`);
    }
}
