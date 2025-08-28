import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-card.component.html',
    styleUrls: ['./admin-card.component.scss']
})
export class AdminCardComponent {
    @Input() icon: string = 'groups';
    @Input() title: string = '';
    @Input() countText: string = '';
    @Input() link?: string;

    getBootstrapIcon(materialIcon: string): string {
        const iconMap: { [key: string]: string } = {
            'groups': 'people-fill',
            'image': 'image-fill',
            'dashboard': 'speedometer2',
            'person': 'person-fill',
            'school': 'book-fill',
            'article': 'journal-text',
            'logout': 'box-arrow-right',
            'notifications': 'bell-fill',
            'close': 'x-lg',
            'visibility': 'eye',
            'visibility_off': 'eye-slash'
        };
        return iconMap[materialIcon] || 'question-circle';
    }
}
