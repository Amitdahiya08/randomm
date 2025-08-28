import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Enrollment, CreateEnrollmentRequest } from '../models';
import { API_CONFIG } from '../constants/app.constants';
import { EnrollmentStatus } from '../enums/user.enums';

/**
 * Enrollment service for managing user course enrollments
 * Handles enrollment-related API operations with proper typing and constants
 */
@Injectable({ providedIn: 'root' })
export class EnrollmentService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiBaseUrl = API_CONFIG.BASE_URL;

    /**
     * Get all enrollments for a specific user
     * @param userId - The ID of the user
     * @returns Observable of user's enrollments
     */
    forUser(userId: number): Observable<Enrollment[]> {
        const url = `${this.apiBaseUrl}${API_CONFIG.ENDPOINTS.ENROLLMENTS}?userId=${userId}`;
        return this.httpClient.get<Enrollment[]>(url);
    }

    /**
     * Enroll a user in a course
     * @param userId - The ID of the user
     * @param courseId - The ID of the course
     * @returns Observable of the created enrollment
     */
    enrollUser(userId: number, courseId: number): Observable<Enrollment> {
        const enrollmentData: CreateEnrollmentRequest = {
            userId,
            courseId,
            status: EnrollmentStatus.ENROLLED
        };

        const url = `${this.apiBaseUrl}${API_CONFIG.ENDPOINTS.ENROLLMENTS}`;
        return this.httpClient.post<Enrollment>(url, {
            ...enrollmentData,
            progressPercent: 0,
            enrolledDate: new Date().toISOString()
        });
    }

    /**
     * Check if a user is enrolled in a specific course
     * @param userId - The ID of the user
     * @param courseId - The ID of the course
     * @returns Observable<boolean> - True if enrolled, false otherwise
     */
    isEnrolled(userId: number, courseId: number): Observable<boolean> {
        return this.forUser(userId).pipe(
            map(enrollments => enrollments.some(e => e.courseId === courseId))
        );
    }
}
