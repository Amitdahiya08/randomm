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

    toggleArray(arr: string[], value: string) {
        return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    }

    toggleDuration(value: string) {
        this.duration.set(this.toggleArray(this.duration(), value));
        this.emit();
    }
    setRating(v: number) { this.rating.set(v); this.emit(); }
    toggleLevel(value: string) {
        this.level.set(this.toggleArray(this.level(), value));
        this.emit();
    }
}
