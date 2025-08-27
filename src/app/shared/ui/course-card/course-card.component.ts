import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-course-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './course-card.component.html',
    styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent {
    @Input({ required: true }) thumbnailUrl!: string;
    @Input({ required: true }) title!: string;
    @Input({ required: true }) provider!: string;
    @Input() rating = 0;
    @Input() reviewCount = 0;
    @Input() enrollmentCount = 0;
    @Input() difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
    @Input() durationText = '';
    @Input() progressPercent?: number; // optional overlay
    @Input() badgeText?: string;       // e.g., "New Launch"
}
