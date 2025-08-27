import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenStorage } from '../../core/services/token-storage.service';
import { MATERIAL } from '../../shared/material.imports';
import { TwoColumnAuthComponent } from '../../shared/ui/two-column-auth/two-column-auth.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, TwoColumnAuthComponent, ...MATERIAL],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);
    private snack = inject(MatSnackBar);

    hide = signal(true);
    loading = signal(false);

    form = this.fb.nonNullable.group({
        identifier: ['', [Validators.required]], // username or email
        password: ['', [Validators.required, Validators.minLength(6)]],
        remember: [false]
    });

    ngOnInit() {
        this.auth.autoLogin();
        if (this.auth.isAuthenticated()) this.router.navigateByUrl('/dashboard');
    }

    toggle() { this.hide.update(v => !v); }

    submit() {
        if (this.form.invalid) return;
        const { identifier, password, remember } = this.form.getRawValue();
        this.loading.set(true);
        this.auth.login(identifier, password, remember).subscribe({
            next: () => {
                this.loading.set(false);
                this.snack.open('Signed in', 'Close', { duration: 1500 });
                this.router.navigateByUrl('/dashboard');
            },
            error: (e) => {
                this.loading.set(false);
                this.snack.open(e?.message || 'Login failed', 'Close', { duration: 2500 });
            }
        });
    }
}
