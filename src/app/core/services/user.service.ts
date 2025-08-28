import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface AppUser {
    id: string | number;
    username: string;
    email: string;
    password: string;
    fullName: string;
    track: string;
    avatarUrl: string;
    joinDate: string;  // ISO
    role: 'Admin' | 'Author' | 'Learner';
    bio?: string;
    location?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private API = 'http://localhost:3000';

    list(): Observable<AppUser[]> {
        return this.http.get<AppUser[]>(`${this.API}/users`);
    }
    count(): Observable<number> {
        return this.list().pipe(map(arr => arr.length));
    }
    update(user: AppUser): Observable<AppUser> {
        return this.http.patch<AppUser>(`${this.API}/users/${user.id}`, user);
    }
}
