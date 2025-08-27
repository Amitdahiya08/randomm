import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CurriculumSection {
    id: number;
    title: string;
    lectures: { id: number; title: string; durationMinutes: number; }[];
}

@Component({
    selector: 'app-curriculum-panel',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="panel card p-3">
      <div class="title">Course Content</div>
      @for (s of sections; track s.id) {
        <div class="sec">
          <div class="sec-title">Section {{ i($index)+1 }}: {{ s.title }}</div>
          <ul class="list-unstyled m-0">
            @for (l of s.lectures; track l.id) {
              <li class="lec"
                  [class.active]="l.id === activeLectureId"
                  [class.done]="completedIds?.has(l.id)"
                  (click)="pick.emit(l.id)">
                <span class="cbox">
                  @if (completedIds?.has(l.id)) { ✓ } @else { ○ }
                </span>
                <span class="t">{{ i2($index, s) }}. {{ l.title }}</span>
                <span class="time">{{ l.durationMinutes }}min</span>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
    styles: [`
    .card{ background: var(--surface); border:1px solid #1b2a38; border-radius:16px; }
    .title{ font-weight:800; margin-bottom:8px; }
    .sec{ margin-bottom:10px; }
    .sec-title{ color: var(--muted); font-weight:600; margin:6px 0; }
    .lec{ display:flex; align-items:center; gap:8px; padding:10px 8px; border-radius:8px; cursor:pointer; }
    .lec:hover{ background:#1b2531; }
    .lec.active{ background:#18c07433; outline:1px solid #18c07466; }
    .lec.done .t{ text-decoration: line-through; opacity:.85; }
    .t{ flex:1; }
    .time{ color: var(--muted); font-size:.9rem; }
  `]
})
export class CurriculumPanelComponent {
    @Input() sections: CurriculumSection[] = [];
    @Input() activeLectureId!: number;
    @Input() completedIds: Set<number> | null = null;

    @Output() pick = new EventEmitter<number>();

    i(n: number) { return (n as number) + 1; }
    i2(n: number, s: CurriculumSection) {
        // 1-based across section
        return (n as number) + 1;
    }
}
