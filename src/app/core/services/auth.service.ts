import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, switchMap, map, throwError, of } from 'rxjs';
import { TokenStorage } from './token-storage.service';

export interface User {
    id: number; username: string; email: string; fullName: string;
    password?: string; track?: string; avatarUrl?: string; role?: string; joinDate?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private store = inject(TokenStorage);
    private API = 'http://localhost:3000';

    private currentUserSubject = new BehaviorSubject<User | null>(this.store.getUser());
    currentUser$ = this.currentUserSubject.asObservable();

    autoLogin() {
        const u = this.store.getUser();
        if (u) this.currentUserSubject.next(u);
    }

    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /** Full registration flow: dup checks + POST */
    register(payload: { username: string; email: string; password: string; fullName: string }) {
        const email = encodeURIComponent(payload.email);
        const username = encodeURIComponent(payload.username);
        const body: User = {
            ...payload,
            role: 'Learner',
            avatarUrl: `https://i.pravatar.cc/150?u=${payload.username}`,
            joinDate: new Date().toISOString()
        } as any;

        return this.http.get<User[]>(`${this.API}/users?email=${email}`).pipe(
            switchMap(users => users.length ? throwError(() => new Error('Email already registered')) : of(null)),
            switchMap(() => this.http.get<User[]>(`${this.API}/users?username=${username}`)),
            switchMap(users => users.length ? throwError(() => new Error('Username already taken')) : of(null)),
            switchMap(() => this.http.post<User>(`${this.API}/users`, body))
        );
    }

    /** Username OR email + password */
    login(identifier: string, password: string, remember = false) {
        const id = encodeURIComponent(identifier);
        return this.http.get<User[]>(`${this.API}/users?username=${id}`).pipe(
            switchMap(list =>
                list.length ? of(list[0]) :
                    this.http.get<User[]>(`${this.API}/users?email=${id}`).pipe(map(l => l[0] ?? null))
            ),
            map(user => {
                if (!user || user.password !== password) throw new Error('Invalid credentials');
                const safe = { ...user } as User;
                delete (safe as any).password;
                this.store.setUser(safe, remember);
                this.currentUserSubject.next(safe);
                return safe;
            })
        );
    }

    logout() { this.store.clear(); this.currentUserSubject.next(null); }
    isAuthenticated() { return !!this.currentUserSubject.value; }
}
