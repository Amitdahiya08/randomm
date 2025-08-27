import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MATERIAL } from '../../shared/material.imports';
import { TwoColumnAuthComponent } from '../../shared/ui/two-column-auth/two-column-auth.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, TwoColumnAuthComponent, ...MATERIAL],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);
    private snack = inject(MatSnackBar);

    hide = signal(true);
    loading = signal(false);

    form = this.fb.nonNullable.group({
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        agree: [false, Validators.requiredTrue]
    });

    toggle() { this.hide.update(v => !v); }

    submit() {
        if (this.form.invalid) return;
        const { fullName, username, email, password } = this.form.getRawValue();
        this.loading.set(true);

        this.auth.register({ fullName, username, email, password }).subscribe({
            next: () => {
                this.loading.set(false);
                this.snack.open('Registration successful. Please sign in.', 'Close', { duration: 1800 });
                this.router.navigateByUrl('/auth/login');
            },
            error: (e) => {
                this.loading.set(false);
                this.snack.open(e?.message || 'Registration failed', 'Close', { duration: 2500 });
            }
        });
    }
}
