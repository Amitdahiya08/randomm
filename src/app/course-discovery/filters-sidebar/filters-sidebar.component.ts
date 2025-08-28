import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MATERIAL } from '../../shared/material.imports';

@Component({
    selector: 'app-filters-sidebar',
    standalone: true,
    imports: [CommonModule, ...MATERIAL],
    templateUrl: './filters-sidebar.component.html',
    styleUrls: ['./filters-sidebar.component.scss']
})
export class FiltersSidebarComponent {
    @Output() filtersChange = new EventEmitter<any>();

    duration = signal<string[]>([]);
    rating = signal<number | null>(null);
    level = signal<string[]>([]);

    emit() {
        this.filtersChange.emit({
            duration: this.duration(),
            rating: this.rating(),
            level: this.level()
        });
    }

    toggleArray(currentArray: string[], toggleValue: string): string[] {
        return currentArray.includes(toggleValue)
            ? currentArray.filter(item => item !== toggleValue)
            : [...currentArray, toggleValue];
    }

    toggleDuration(durationValue: string) {
        this.duration.set(this.toggleArray(this.duration(), durationValue));
        this.emit();
    }

    setRating(ratingValue: number) {
        this.rating.set(ratingValue);
        this.emit();
    }

    toggleLevel(levelValue: string) {
        this.level.set(this.toggleArray(this.level(), levelValue));
        this.emit();
    }
}
