import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MATERIAL } from '../../shared/material.imports';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppUser, UserService } from '../../core/services/user.service';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-edit-user-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatTabsModule, ...MATERIAL],
    templateUrl: './edit-user-dialog.component.html',
    styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent {
    private fb = new FormBuilder();

    profileForm = this.fb.nonNullable.group({
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        role: <'Admin' | 'Author' | 'Learner'>'Learner',
        bio: ['']
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public user: AppUser,
        private ref: MatDialogRef<EditUserDialogComponent>,
        private users: UserService
    ) {
        this.profileForm.patchValue({
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            bio: user.bio || ''
        });
    }

    save() {
        if (this.profileForm.invalid) return;
        const v = this.profileForm.getRawValue();
        const updated: AppUser = {
            ...this.user,
            fullName: v.fullName,
            email: v.email,
            role: v.role,
            bio: v.bio
        };
        this.users.update(updated).subscribe(u => this.ref.close(u));
    }

    close() { this.ref.close(); }
}
