import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { CourseDiscoveryComponent } from './course-discovery/course-discovery.component';
import { CourseDetailsComponent } from './course-details/course-details.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'search', component: CourseDiscoveryComponent, canActivate: [authGuard] },
    { path: 'courses/:id', component: CourseDetailsComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'dashboard' }
];
