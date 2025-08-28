/**
 * Curriculum-related models and interfaces
 * Provides strong typing for curriculum data structures
 */

/**
 * Represents a single lecture within a curriculum section
 */
export interface Lecture {
  /** Unique identifier for the lecture */
  readonly id: number;
  
  /** Display title of the lecture */
  title: string;
  
  /** Duration of the lecture in minutes */
  durationMinutes: number;
  
  /** Type of lecture content (Video, Text, PDF, etc.) */
  type?: 'Video' | 'Text' | 'PDF';
}

/**
 * Represents a curriculum section containing multiple lectures
 */
export interface CurriculumSection {
  /** Unique identifier for the section */
  readonly id: number;
  
  /** Display title of the section */
  title: string;
  
  /** Array of lectures within this section */
  lectures: Lecture[];
}

/**
 * Represents the complete curriculum structure for a course
 */
export interface Curriculum {
  /** Course ID this curriculum belongs to */
  readonly courseId: number;
  
  /** Array of curriculum sections */
  sections: CurriculumSection[];
}

/**
 * Represents lecture progress and completion status
 */
export interface LectureProgress {
  /** Lecture ID */
  readonly lectureId: number;
  
  /** Whether the lecture is completed */
  isCompleted: boolean;
  
  /** Progress percentage (0-100) */
  progressPercent: number;
  
  /** Last accessed timestamp */
  lastAccessedAt?: Date;
  
  /** Completion timestamp */
  completedAt?: Date;
}

/**
 * Curriculum panel component input properties
 */
export interface CurriculumPanelData {
  /** Array of curriculum sections to display */
  sections: CurriculumSection[];
  
  /** Currently active/selected lecture ID */
  activeLectureId: number;
  
  /** Set of completed lecture IDs */
  completedIds: Set<number> | null;
}
