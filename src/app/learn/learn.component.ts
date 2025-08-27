import { Component, OnInit, inject, signal, computed, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { CourseService, Course } from '../core/services/course.service';
import { ProgressService } from '../core/services/progress.service';
import { AuthService } from '../core/services/auth.service';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { CurriculumPanelComponent } from './curriculum-panel/curriculum-panel.component';
import { OverviewPanelComponent } from '../shared/ui/overview-panel/overview-panel.component';
import { AuthorPanelComponent } from '../shared/ui/author-panel/author-panel.component';
import { TestimonialsGridComponent } from '../shared/ui/testimonials-grid/testimonials-grid.component';
import { MATERIAL } from '../shared/material.imports';

@Component({
    selector: 'app-learn',
    standalone: true,
    imports: [
        CommonModule, RouterLink, HeaderComponent, MatTabsModule, ...MATERIAL,
        VideoPlayerComponent, CurriculumPanelComponent,
        OverviewPanelComponent, AuthorPanelComponent, TestimonialsGridComponent
    ],
    templateUrl: './learn.component.html',
    styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit, AfterViewInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private svc = inject(CourseService);
    private progress = inject(ProgressService);
    private auth = inject(AuthService);

    @ViewChild('player') videoPlayer!: VideoPlayerComponent;

    course = signal<Course | null>(null);
    sections = signal<any[]>([]);
    testimonials = signal<any[]>([]);
    author = signal<any | null>(null);

    lectureId = signal<number>(0);
    completedIds = signal<Set<number>>(new Set());

    // Default requirements for courses
    defaultRequirements = [
        'Basic computer literacy',
        'Internet connection',
        'Willingness to learn'
    ];

    // Random YouTube id per lecture
    private YT = ['ysz5S6PUM-U', 'M7lc1UVf-VE', 'aqz-KE-bpKQ', 'hTWKbfoikeg', '2Vv-BfVoq4g'];
    videoId = computed(() => {
        const id = this.lectureId();
        if (!id) return this.YT[0];
        return this.YT[id % this.YT.length];
    });

    ngOnInit() {
        const courseId = Number(this.route.snapshot.paramMap.get('courseId'));
        const lecId = Number(this.route.snapshot.paramMap.get('lectureId') || 0);
        this.lectureId.set(lecId);

        this.svc.getById(courseId).subscribe(c => {
            this.course.set(c);
            this.svc.getAuthor(c.authorId).subscribe(a => this.author.set(a));
            this.svc.getCurriculum(c.id).subscribe(cs => this.sections.set(cs[0]?.sections ?? []));
            this.svc.getTestimonials(c.id).subscribe(ts => this.testimonials.set(ts));
        });

        const userId = this.auth.currentUser!.id;
        this.progress.list(userId, courseId).subscribe(list => {
            this.completedIds.set(new Set(list.filter(r => r.completed).map(r => r.lectureId)));
        });
    }

    ngAfterViewInit() {
        // Set up the video player callback
        if (this.videoPlayer) {
            this.videoPlayer.onEnded = this.onEnded;
        }
    }

    onEnded = () => {
        const c = this.course(); if (!c) return;
        const userId = this.auth.currentUser!.id;
        const lec = this.lectureId();
        const courseId = typeof c.id === 'string' ? Number(c.id) : c.id;
        this.progress.setCompleted(userId, courseId, lec, true).subscribe(() => {
            const set = new Set(this.completedIds()); set.add(lec);
            this.completedIds.set(set);
        });
    };

    pickLecture(lectureId: number) {
        const c = this.course(); if (!c) return;
        this.router.navigate(['/learn', c.id, 'lecture', lectureId]);
        this.lectureId.set(lectureId);
    }
}
