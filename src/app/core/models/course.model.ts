/**
 * Course-related models and interfaces
 * Centralized type definitions for course entities
 */

import { COURSE_SERVICE_CONSTANTS } from '../constants/app.constants';

// Type definitions using constants
export type CourseStatus = typeof COURSE_SERVICE_CONSTANTS.STATUS[keyof typeof COURSE_SERVICE_CONSTANTS.STATUS];
export type DifficultyLevel = typeof COURSE_SERVICE_CONSTANTS.DIFFICULTY_LEVELS[keyof typeof COURSE_SERVICE_CONSTANTS.DIFFICULTY_LEVELS];
export type DurationBucket = typeof COURSE_SERVICE_CONSTANTS.DURATION_BUCKETS[keyof typeof COURSE_SERVICE_CONSTANTS.DURATION_BUCKETS];
export type PublishedBucket = typeof COURSE_SERVICE_CONSTANTS.PUBLISHED_BUCKETS[keyof typeof COURSE_SERVICE_CONSTANTS.PUBLISHED_BUCKETS];

// Provider interface
export interface CourseProvider {
    name: string;
    logoUrl: string;
}

// Main Course interface
export interface Course {
    id: number | string;
    title: string;
    subtitle: string;
    authorId: number;
    provider: CourseProvider;
    thumbnailUrl: string;
    rating: number;
    reviewCount: number;
    enrollmentCount: number;
    difficulty: DifficultyLevel;
    durationText: string;          // e.g., "6 months", "5 weeks", "8 weeks"
    skills?: string[];
    whatYoullLearn?: string[];
    status: CourseStatus;
    publishedDate: string;         // ISO date string
}

// Author/User interface
export interface CourseAuthor {
    id: number;
    fullName: string;
    avatarUrl: string;
    track: string;
    bio: string;
}

// Curriculum-related interfaces
export interface Lecture {
    id: number;
    title: string;
    type: 'Text' | 'Video' | 'PDF';
    durationMinutes: number;
}

export interface CourseSection {
    id: number;
    title: string;
    lectures: Lecture[];
}

export interface CourseCurriculum {
    courseId: number | string;
    sections: CourseSection[];
}

// Testimonial interface
export interface CourseTestimonial {
    id: number;
    courseId: number | string;
    name: string;
    avatarUrl: string;
    affiliation: string;
    rating: number;
    comment: string;
}

// Search and filter interfaces
export interface CourseSearchFilters {
    duration?: string[];
    rating?: number;
    level?: string[];
    status?: CourseStatus;
}

export interface CourseSearchParams {
    query?: string;
    filters?: CourseSearchFilters;
    sortBy?: string;
    limit?: number;
    offset?: number;
}

// API Response interfaces
export interface CourseListResponse {
    courses: Course[];
    total: number;
    page: number;
    pageSize: number;
}

export interface CourseDetailsResponse extends Course {
    author?: CourseAuthor;
    curriculum?: CourseCurriculum;
    testimonials?: CourseTestimonial[];
    relatedCourses?: Course[];
}
