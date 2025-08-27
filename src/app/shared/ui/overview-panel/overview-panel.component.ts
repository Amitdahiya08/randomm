import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-overview-panel',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="card p-4">
      <h6 class="mb-2">What you'll learn</h6>
      <ul class="learn">
        @for (it of whatYoullLearn; track it) { <li>{{ it }}</li> }
      </ul>

      <h6 class="mt-4 mb-2">Skills you'll gain</h6>
      <div class="skills">
        @for (s of skills; track s) { <span class="pill">{{ s }}</span> }
      </div>

      <h6 class="mt-4 mb-2">Requirements</h6>
      <ul class="req">
        @for (r of requirements; track r) { <li>{{ r }}</li> }
      </ul>

      <ng-content></ng-content>
    </div>
  `,
    styles: [`
    .card{ background: var(--surface); border:1px solid #1b2a38; border-radius:16px; }
    .learn,.req{ padding-left:1rem; }
    .skills{ display:flex; flex-wrap:wrap; gap:8px; }
    .pill{ background:#233143; color:#cfe7ff; padding:4px 10px; border-radius:999px; font-size:.85rem; }
  `]
})
export class OverviewPanelComponent {
    @Input() whatYoullLearn: string[] = [];
    @Input() skills: string[] = [];
    @Input() requirements: string[] = [];
}
