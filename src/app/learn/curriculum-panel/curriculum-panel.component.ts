import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumSection } from '../../core/models/curriculum.model';
import { CompletionIcon } from '../../core/enums/curriculum.enums';
import { CURRICULUM_PANEL_CONSTANTS } from '../../core/constants/app.constants';

/**
 * Curriculum Panel Component
 * Displays course curriculum with sections and lectures
 * Supports lecture selection and completion tracking
 */
@Component({
  selector: 'app-curriculum-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curriculum-panel.component.html',
  styleUrls: ['./curriculum-panel.component.scss']
})
export class CurriculumPanelComponent {
  /** Array of curriculum sections to display */
  @Input() sections: CurriculumSection[] = [];

  /** Currently active/selected lecture ID */
  @Input() activeLectureId!: number;

  /** Set of completed lecture IDs */
  @Input() completedIds: Set<number> | null = null;

  /** Event emitted when a lecture is selected */
  @Output() pick = new EventEmitter<number>();

  /** UI constants for template usage */
  readonly uiConstants = CURRICULUM_PANEL_CONSTANTS.UI;

  /**
   * Gets the display number for a section (1-based)
   * @param index - Zero-based section index
   * @returns 1-based section number
   */
  getSectionNumber(index: number): number {
    return index + 1;
  }

  /**
   * Gets the display number for a lecture within its section (1-based)
   * @param index - Zero-based lecture index within the section
   * @param section - The curriculum section (unused but kept for future extensibility)
   * @returns 1-based lecture number within the section
   */
  getLectureNumber(index: number, section: CurriculumSection): number {
    return index + 1;
  }

  /**
   * Checks if a lecture is completed
   * @param lectureId - The lecture ID to check
   * @returns True if the lecture is completed
   */
  isLectureCompleted(lectureId: number): boolean {
    return this.completedIds?.has(lectureId) ?? false;
  }

  /**
   * Gets the appropriate completion icon for a lecture
   * @param lectureId - The lecture ID
   * @returns The completion icon string
   */
  getCompletionIcon(lectureId: number): string {
    return this.isLectureCompleted(lectureId)
      ? CompletionIcon.COMPLETED
      : CompletionIcon.NOT_STARTED;
  }

  /**
   * Handles lecture selection
   * @param lectureId - The selected lecture ID
   */
  onLectureSelect(lectureId: number): void {
    this.pick.emit(lectureId);
  }
}
