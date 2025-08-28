import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { CourseDiscoveryComponent } from './course-discovery/course-discovery.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { authorGuard } from './core/guards/author.guard';
import { LearnComponent } from './learn/learn.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { AdminConsoleComponent } from './admin/admin-console.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { adminGuard } from './core/guards/admin.guard';


export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'learn/:courseId/lecture/:lectureId', component: LearnComponent, canActivate: [authGuard] },
    { path: 'search', component: CourseDiscoveryComponent, canActivate: [authGuard] },
    { path: 'courses/:id', component: CourseDetailsComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminConsoleComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin/users', component: UserManagementComponent, canActivate: [authGuard, adminGuard] },
    { path: 'author/courses', component: MyCoursesComponent, canActivate: [authGuard, authorGuard] },
    { path: '**', redirectTo: 'dashboard' }
];
