import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { AdminCardComponent } from './ui/admin-card/admin-card.component';
import { UserService } from '../core/services/user.service';

@Component({
    selector: 'app-admin-console',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, AdminCardComponent],
    templateUrl: './admin-console.component.html',
    styleUrls: ['./admin-console.component.scss']
})
export class AdminConsoleComponent implements OnInit {
    private users = inject(UserService);
    userCount = 0;

    ngOnInit() {
        this.users.count().subscribe(n => this.userCount = n);
    }
}
