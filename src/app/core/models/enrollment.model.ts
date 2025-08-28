/**
 * Enrollment-related models and interfaces
 * Provides strong typing for enrollment data structures
 */

import { EnrollmentStatus, ProgressStatus } from '../enums/user.enums';

/**
 * Base enrollment interface representing a user's enrollment in a course
 */
export interface Enrollment {
  readonly id: number;
  readonly userId: number;
  readonly courseId: number;
  progressPercent: number;
  status?: EnrollmentStatus;
  enrolledDate?: string;
  completedDate?: string;
  lastAccessedDate?: string;
}

/**
 * Enrollment creation request interface
 */
export interface CreateEnrollmentRequest {
  userId: number;
  courseId: number;
  status?: EnrollmentStatus;
}

/**
 * Enrollment update request interface
 */
export interface UpdateEnrollmentRequest {
  progressPercent?: number;
  status?: EnrollmentStatus;
  lastAccessedDate?: string;
  completedDate?: string;
}

/**
 * Enrollment with course details for display purposes
 */
export interface EnrollmentWithCourse extends Enrollment {
  courseTitle: string;
  courseThumbnailUrl?: string;
  courseProvider?: string;
  courseDifficulty?: string;
  courseDurationText?: string;
}

/**
 * Enrollment statistics interface
 */
export interface EnrollmentStats {
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  droppedCourses: number;
  averageProgress: number;
}

/**
 * Enrollment filter options
 */
export interface EnrollmentFilters {
  status?: EnrollmentStatus;
  progressStatus?: ProgressStatus;
  courseCategory?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Enrollment sort options
 */
export interface EnrollmentSortOptions {
  field: 'enrolledDate' | 'lastAccessedDate' | 'progressPercent' | 'courseTitle';
  direction: 'asc' | 'desc';
}
