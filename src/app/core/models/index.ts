/**
 * Barrel export for models
 * Provides clean imports for all application models and interfaces
 */

export * from './user.model';
export * from './auth.model';
export * from './enrollment.model';
export * from './course.model';

// Re-export commonly used types for backward compatibility
export type { Course, DifficultyLevel as Level } from './course.model';
