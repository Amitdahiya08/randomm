import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-author-panel',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="card p-4">
      <h6>Author</h6>
      <div class="author d-flex gap-3 align-items-start">
        <img [src]="avatarUrl" class="avatar-lg" alt="">
        <div>
          <div class="fw-bold">{{ fullName }}</div>
          <div class="muted">{{ track }}</div>
          <p class="mt-2">{{ bio }}</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .card{ background: var(--surface); border:1px solid #1b2a38; border-radius:16px; }
    .avatar-lg{ width:64px; height:64px; border-radius:50%; border:2px solid #2a3646; }
  `]
})
export class AuthorPanelComponent {
    @Input() fullName = '';
    @Input() track = '';
    @Input() avatarUrl = '';
    @Input() bio = '';
}
