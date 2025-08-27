import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Enrollment { id: number; userId: number; courseId: number; progressPercent: number; }

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
    private http = inject(HttpClient);
    private API = 'http://localhost:3000';

    forUser(userId: number) {
        return this.http.get<Enrollment[]>(`${this.API}/enrollments?userId=${userId}`);
    }
}
