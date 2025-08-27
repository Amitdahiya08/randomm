import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-two-column-auth',
    standalone: true,
    templateUrl: './two-column-auth.component.html',
    styleUrls: ['./two-column-auth.component.scss']
})
export class TwoColumnAuthComponent {
    @Input() title = 'LearnHub';
    @Input() subtitle = '';
}
