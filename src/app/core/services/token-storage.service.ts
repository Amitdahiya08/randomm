import { Injectable } from '@angular/core';

const KEY = 'lh_user';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
    private storage(remember: boolean) {
        return remember ? localStorage : sessionStorage;
    }

    setUser(user: any, remember: boolean) {
        this.clear();
        this.storage(remember).setItem(KEY, JSON.stringify(user));
    }

    getUser(): any | null {
        const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    }

    clear() {
        localStorage.removeItem(KEY);
        sessionStorage.removeItem(KEY);
    }

    isLoggedIn(): boolean { return !!this.getUser(); }
}
