import { Injectable } from '@angular/core';

import { SafeUser } from '../models';
import { StorageType } from '../enums';
import { STORAGE_KEYS } from '../constants';

/**
 * Token storage service with improved naming, strong typing, and constants
 * Handles user session storage in localStorage or sessionStorage
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {

    /**
     * Get appropriate storage based on remember preference
     * @param rememberUser - Whether to use persistent storage
     * @returns Storage interface (localStorage or sessionStorage)
     */
    private getStorageProvider(rememberUser: boolean): Storage {
        return rememberUser ? localStorage : sessionStorage;
    }

    /**
     * Store user data in appropriate storage
     * @param user - User data to store
     * @param rememberUser - Whether to persist across browser sessions
     */
    public setCurrentUser(user: SafeUser, rememberUser: boolean): void {
        this.clearUserSession(); // Clear any existing session first
        const storage = this.getStorageProvider(rememberUser);
        storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    /**
     * Retrieve current user from storage
     * @returns Current user or null if not found
     */
    public getCurrentUser(): SafeUser | null {
        try {
            // Check both storages for user data
            const localData = localStorage.getItem(STORAGE_KEYS.USER);
            const sessionData = sessionStorage.getItem(STORAGE_KEYS.USER);

            const userData = localData ?? sessionData;

            if (userData) {
                return JSON.parse(userData) as SafeUser;
            }

            return null;
        } catch (error) {
            console.error('Error parsing user data from storage:', error);
            this.clearUserSession(); // Clear corrupted data
            return null;
        }
    }

    /**
     * Clear user session from all storage types
     */
    public clearUserSession(): void {
        localStorage.removeItem(STORAGE_KEYS.USER);
        sessionStorage.removeItem(STORAGE_KEYS.USER);
    }

    /**
     * Check if user is currently logged in
     * @returns True if user session exists
     */
    public isUserLoggedIn(): boolean {
        return this.getCurrentUser() !== null;
    }

    /**
     * Get storage type currently being used
     * @returns StorageType enum value
     */
    public getCurrentStorageType(): StorageType | null {
        if (localStorage.getItem(STORAGE_KEYS.USER)) {
            return StorageType.LOCAL;
        }
        if (sessionStorage.getItem(STORAGE_KEYS.USER)) {
            return StorageType.SESSION;
        }
        return null;
    }

    /**
     * Update specific user properties in storage
     * @param updates - Partial user data to update
     */
    public updateCurrentUser(updates: Partial<SafeUser>): void {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            const storageType = this.getCurrentStorageType();
            const updatedUser = { ...currentUser, ...updates };
            this.setCurrentUser(updatedUser, storageType === StorageType.LOCAL);
        }
    }

    /**
     * Clear all application data from storage
     */
    public clearAllStorageData(): void {
        // Clear user data
        this.clearUserSession();

        // Clear other app-specific data
        localStorage.removeItem(STORAGE_KEYS.THEME);
        localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
        sessionStorage.removeItem(STORAGE_KEYS.THEME);
        sessionStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    }
}
