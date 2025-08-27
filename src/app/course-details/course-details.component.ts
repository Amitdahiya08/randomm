import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MATERIAL } from '../shared/material.imports';
import { CourseService, Course } from '../core/services/course.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderComponent } from '../shared/ui/header/header.component';

interface Section {
    id: number;
    title: string;
    lectures: { id: number; title: string; type: 'Text' | 'Video' | 'PDF'; durationMinutes: number; }[];
}

@Component({
    selector: 'app-course-details',
    standalone: true,
    imports: [
        CommonModule, RouterLink, HeaderComponent,
        MatTabsModule, MatExpansionModule, ...MATERIAL
    ],
    templateUrl: './course-details.component.html',
    styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private svc = inject(CourseService);

    course = signal<Course | null>(null);
    author = signal<any | null>(null);
    sections = signal<Section[]>([]);
    testimonials = signal<any[]>([]);
    related = signal<Course[]>([]);

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) return;

        this.svc.getById(id).subscribe(c => {
            this.course.set(c);
            this.svc.getAuthor(c.authorId).subscribe(a => this.author.set(a));
            this.svc.getCurriculum(c.id).subscribe(cs => this.sections.set((cs[0]?.sections) ?? []));
            this.svc.getTestimonials(c.id).subscribe(ts => this.testimonials.set(ts));
            this.svc.getRelated(c).subscribe(r => this.related.set(r));
        });
    }

    totalSummary() {
        const secs = this.sections();
        const lectures = secs.reduce((n, s) => n + s.lectures.length, 0);
        const mins = secs.flatMap(s => s.lectures).reduce((n, l) => n + (l.durationMinutes || 0), 0);
        const h = Math.floor(mins / 60), m = mins % 60;
        return `${secs.length} Sections • ${lectures} Lectures • ${h}h ${m}m total length`;
    }

    enroll() {
        // Wire to enrollment later; for now: feedback only
        alert('Enrolled! (placeholder)');
    }

    getSectionDurationHours(section: Section): number {
        const totalMinutes = section.lectures.reduce((n, l) => n + l.durationMinutes, 0);
        return Math.floor(totalMinutes / 60);
    }

    getSectionDurationMinutes(section: Section): number {
        const totalMinutes = section.lectures.reduce((n, l) => n + l.durationMinutes, 0);
        return totalMinutes % 60;
    }

    expandAllSections() {
        document.querySelectorAll('mat-expansion-panel').forEach(panel => {
            (panel as any).expanded = true;
        });
    }
}
