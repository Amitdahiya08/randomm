/**
 * Curriculum-related enums and literal types
 * Provides type safety and eliminates magic strings
 */

/**
 * Types of lecture content available in the curriculum
 */
export enum LectureType {
  VIDEO = 'Video',
  TEXT = 'Text',
  PDF = 'PDF',
  QUIZ = 'Quiz',
  ASSIGNMENT = 'Assignment',
  INTERACTIVE = 'Interactive'
}

/**
 * Completion status indicators for lectures
 */
export enum CompletionStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

/**
 * Visual icons for completion status
 */
export enum CompletionIcon {
  NOT_STARTED = '○',
  IN_PROGRESS = '◐',
  COMPLETED = '✓'
}

/**
 * CSS classes for different lecture states
 */
export enum LectureStateClass {
  ACTIVE = 'active',
  COMPLETED = 'done',
  HOVER = 'hover'
}

/**
 * Curriculum panel UI text constants
 */
export enum CurriculumText {
  COURSE_CONTENT_TITLE = 'Course Content',
  SECTION_PREFIX = 'Section',
  MINUTES_SUFFIX = 'min'
}

/**
 * Curriculum panel CSS selectors
 */
export enum CurriculumSelectors {
  PANEL = 'panel',
  CARD = 'card',
  TITLE = 'title',
  SECTION = 'sec',
  SECTION_TITLE = 'sec-title',
  LECTURE = 'lec',
  CHECKBOX = 'cbox',
  LECTURE_TITLE = 't',
  TIME = 'time'
}
