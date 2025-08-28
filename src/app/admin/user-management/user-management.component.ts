import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { MATERIAL } from '../../shared/material.imports';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService, AppUser } from '../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from './edit-user-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type SortKey = 'latest' | 'az' | 'za' | 'role';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, HeaderComponent, ReactiveFormsModule, MatTabsModule, ...MATERIAL],
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
    private userService = inject(UserService);
    private dialog = inject(MatDialog);

    // data & state
    allUsers = signal<AppUser[]>([]);
    query = new FormControl('', { nonNullable: true });
    sort = signal<SortKey>('latest');

    // pagination
    page = signal(1);
    pageSize = signal(10);

    // derived result set
    filtered = computed(() => {
        const q = this.query.value?.trim().toLowerCase() || '';
        const s = this.sort();

        let list = [...this.allUsers()];

        // Apply search filter - only show users that match the query
        if (q.length > 0) {
            list = list.filter(u =>
                u.fullName.toLowerCase().includes(q) ||
                u.username.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                (u.location ?? '').toLowerCase().includes(q)
            );
        }

        // Apply sorting
        switch (s) {
            case 'latest': list.sort((a, b) => +new Date(b.joinDate) - +new Date(a.joinDate)); break;
            case 'az': list.sort((a, b) => a.fullName.localeCompare(b.fullName)); break;
            case 'za': list.sort((a, b) => b.fullName.localeCompare(a.fullName)); break;
            case 'role': list.sort((a, b) => a.role.localeCompare(b.role)); break;
        }
        return list;
    });

    paginated = computed(() => {
        const start = (this.page() - 1) * this.pageSize();
        return this.filtered().slice(start, start + this.pageSize());
    });

    totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));

    ngOnInit() {
        this.userService.list().subscribe(users => this.allUsers.set(users));

        // Reset to page 1 when search query changes
        this.query.valueChanges.pipe(
            debounceTime(200),
            distinctUntilChanged()
        ).subscribe(() => {
            this.page.set(1);
        });
    }

    openEdit(user: AppUser) {
        const ref = this.dialog.open(EditUserDialogComponent, { width: '780px', data: user });
        ref.afterClosed().subscribe((updated?: AppUser) => {
            if (updated) {
                const arr = this.allUsers().map(u => u.id === updated.id ? updated : u);
                this.allUsers.set(arr);
            }
        });
    }
}
