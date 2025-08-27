import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-testimonials-grid',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="card p-4">
      <div class="row g-3">
        @for (t of items; track t.id) {
          <div class="col-md-6 col-lg-4">
            <div class="review">
              <div class="stars">★ {{ t.rating }}</div>
              <p class="text">{{ t.comment }}</p>
              <div class="user d-flex align-items-center gap-2">
                <img [src]="t.avatarUrl" class="avatar">
                <div>
                  <div class="name">{{ t.name }}</div>
                  <small class="muted">{{ t.affiliation }}</small>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    .card{ background: var(--surface); border:1px solid #1b2a38; border-radius:16px; }
    .review{ background: var(--surface-2); border:1px solid #1c2a38; border-radius:12px; padding:12px; }
    .user .avatar{ width:28px; height:28px; border-radius:50%; }
    .stars{ font-weight:800; margin-bottom:4px; }
  `]
})
export class TestimonialsGridComponent {
    @Input() items: any[] = [];
}
