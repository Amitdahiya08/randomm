import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.currentUser;
    const allowed = !!user && user.role === 'Admin';
    if (!allowed) router.navigateByUrl('/dashboard');
    return allowed;
};
