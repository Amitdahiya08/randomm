import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authorGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const u = auth.currentUser;
    const ok = !!u && (u.role === 'Author' || u.role === 'Admin');
    if (!ok) router.navigateByUrl('/dashboard');
    return ok;
};
