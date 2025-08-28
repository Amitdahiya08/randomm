/**
 * User-related enums and literal types
 * Provides type safety and eliminates magic strings
 */

/**
 * User roles in the system
 */
export enum UserRole {
  LEARNER = 'Learner',
  INSTRUCTOR = 'Author',
  ADMIN = 'Admin',
  MODERATOR = 'Moderator'
}

/**
 * User account status
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

/**
 * Authentication methods
 */
export enum AuthMethod {
  EMAIL = 'email',
  USERNAME = 'username',
  SOCIAL = 'social'
}

/**
 * Storage types for user sessions
 */
export enum StorageType {
  LOCAL = 'local',
  SESSION = 'session'
}

/**
 * User preference themes
 */
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

/**
 * Course difficulty levels
 */
export enum CourseDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

/**
 * Course categories
 */
export enum CourseCategory {
  PROGRAMMING = 'programming',
  DESIGN = 'design',
  BUSINESS = 'business',
  MARKETING = 'marketing',
  DATA_SCIENCE = 'data-science',
  PHOTOGRAPHY = 'photography',
  MUSIC = 'music',
  LANGUAGE = 'language'
}

/**
 * Enrollment status
 */
export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
  PAUSED = 'paused'
}

/**
 * Progress status
 */
export enum ProgressStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped'
}

/**
 * Content types
 */
export enum ContentType {
  VIDEO = 'video',
  ARTICLE = 'article',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  RESOURCE = 'resource'
}

/**
 * Notification types
 */
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * API response status
 */
export enum ApiStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  LOADING = 'loading'
}

/**
 * Sort directions
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * Sort fields for users
 */
export enum UserSortField {
  USERNAME = 'username',
  EMAIL = 'email',
  FULL_NAME = 'fullName',
  JOIN_DATE = 'joinDate',
  ROLE = 'role'
}

/**
 * Sort fields for courses
 */
export enum CourseSortField {
  TITLE = 'title',
  CREATED_DATE = 'createdDate',
  UPDATED_DATE = 'updatedDate',
  DIFFICULTY = 'difficulty',
  RATING = 'rating',
  ENROLLMENT_COUNT = 'enrollmentCount'
}
