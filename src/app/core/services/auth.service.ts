import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, map, throwError, of, catchError } from 'rxjs';

import { TokenStorageService } from './token-storage.service';
import { SafeUser, CreateUserRequest, LoginRequest, RegisterRequest, AuthResponse } from '../models';
import { UserRole } from '../enums';
import { API_CONFIG, DEFAULT_VALUES, ERROR_MESSAGES } from '../constants';

/**
 * Authentication service with improved naming, strong typing, and constants
 * Handles user authentication, registration, and session management
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly httpClient = inject(HttpClient);
    private readonly tokenStorageService = inject(TokenStorageService);
    private readonly apiBaseUrl = API_CONFIG.BASE_URL;

    private readonly currentUserSubject = new BehaviorSubject<SafeUser | null>(
        this.tokenStorageService.getCurrentUser()
    );

    public readonly currentUser$ = this.currentUserSubject.asObservable();

    /**
     * Automatically login user if valid session exists
     */
    public initializeAuthState(): void {
        const storedUser = this.tokenStorageService.getCurrentUser();
        if (storedUser) {
            this.currentUserSubject.next(storedUser);
        }
    }

    /**
     * Get current authenticated user
     */
    public getCurrentUser(): SafeUser | null {
        return this.currentUserSubject.value;
    }

    /**
     * Register a new user with validation checks
     * @param registrationData - User registration information
     * @returns Observable<SafeUser> - The created user without sensitive data
     */
    public registerUser(registrationData: RegisterRequest): Observable<SafeUser> {
        const encodedEmail = encodeURIComponent(registrationData.email);
        const encodedUsername = encodeURIComponent(registrationData.username);

        const newUserData: CreateUserRequest = {
            username: registrationData.username,
            email: registrationData.email,
            password: registrationData.password,
            fullName: registrationData.fullName,
            role: UserRole.LEARNER
        };

        const userWithDefaults = {
            ...newUserData,
            avatarUrl: `${DEFAULT_VALUES.AVATAR_BASE_URL}${registrationData.username}`,
            joinDate: new Date().toISOString()
        };

        return this.checkEmailAvailability(encodedEmail).pipe(
            switchMap(() => this.checkUsernameAvailability(encodedUsername)),
            switchMap(() => this.createUserAccount(userWithDefaults)),
            catchError(this.handleAuthError.bind(this))
        );
    }

    /**
     * Authenticate user with username/email and password
     * @param loginData - Login credentials
     * @returns Observable<SafeUser> - Authenticated user data
     */
    public authenticateUser(loginData: LoginRequest): Observable<SafeUser> {
        const encodedIdentifier = encodeURIComponent(loginData.identifier);

        return this.findUserByIdentifier(encodedIdentifier).pipe(
            switchMap(user => this.validateCredentials(user, loginData.password)),
            map(user => this.processSuccessfulLogin(user, loginData.rememberMe || false)),
            catchError(this.handleAuthError.bind(this))
        );
    }

    /**
     * Logout current user and clear session
     */
    public logoutUser(): void {
        this.tokenStorageService.clearUserSession();
        this.currentUserSubject.next(null);
    }

    /**
     * Check if user is currently authenticated
     */
    public isUserAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    // Backward compatibility methods (deprecated - use new method names)

    /**
     * @deprecated Use initializeAuthState() instead
     */
    public autoLogin(): void {
        this.initializeAuthState();
    }

    /**
     * @deprecated Use authenticateUser() instead
     */
    public login(identifier: string, password: string, remember = false): Observable<SafeUser> {
        const loginData: LoginRequest = {
            identifier,
            password,
            rememberMe: remember
        };
        return this.authenticateUser(loginData);
    }

    /**
     * @deprecated Use registerUser() instead
     */
    public register(payload: { username: string; email: string; password: string; fullName: string }): Observable<SafeUser> {
        const registrationData: RegisterRequest = {
            username: payload.username,
            email: payload.email,
            password: payload.password,
            confirmPassword: payload.password,
            fullName: payload.fullName,
            acceptTerms: true
        };
        return this.registerUser(registrationData);
    }

    /**
     * @deprecated Use logoutUser() instead
     */
    public logout(): void {
        this.logoutUser();
    }

    /**
     * @deprecated Use isUserAuthenticated() instead
     */
    public isAuthenticated(): boolean {
        return this.isUserAuthenticated();
    }

    /**
     * @deprecated Use getCurrentUser() instead
     */
    public get currentUser(): SafeUser | null {
        return this.getCurrentUser();
    }

    // Private helper methods

    /**
     * Check if email is available for registration
     */
    private checkEmailAvailability(encodedEmail: string): Observable<null> {
        const url = `${this.apiBaseUrl}${API_CONFIG.ENDPOINTS.USERS}?email=${encodedEmail}`;
        return this.httpClient.get<SafeUser[]>(url).pipe(
            switchMap(users =>
                users.length > 0
                    ? throwError(() => new Error(ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS))
                    : of(null)
            )
        );
    }

    /**
     * Check if username is available for registration
     */
    private checkUsernameAvailability(encodedUsername: string): Observable<null> {
        const url = `${this.apiBaseUrl}${API_CONFIG.ENDPOINTS.USERS}?username=${encodedUsername}`;
        return this.httpClient.get<SafeUser[]>(url).pipe(
            switchMap(users =>
                users.length > 0
                    ? throwError(() => new Error(ERROR_MESSAGES.AUTH.USERNAME_ALREADY_EXISTS))
                    : of(null)
            )
        );
    }

    /**
     * Create new user account
     */
    private createUserAccount(userData: any): Observable<SafeUser> {
        const url = `${this.apiBaseUrl}${API_CONFIG.ENDPOINTS.USERS}`;
        return this.httpClient.post<SafeUser>(url, userData);
    }

    /**
     * Find user by username or email identifier
     */
    private findUserByIdentifier(encodedIdentifier: string): Observable<any> {
        const usernameUrl = `${this.apiBaseUrl}${API_CONFIG.ENDPOINTS.USERS}?username=${encodedIdentifier}`;

        return this.httpClient.get<any[]>(usernameUrl).pipe(
            switchMap(users => {
                if (users.length > 0) {
                    return of(users[0]);
                }

                const emailUrl = `${this.apiBaseUrl}${API_CONFIG.ENDPOINTS.USERS}?email=${encodedIdentifier}`;
                return this.httpClient.get<any[]>(emailUrl).pipe(
                    map(emailUsers => emailUsers[0] || null)
                );
            })
        );
    }

    /**
     * Validate user credentials
     */
    private validateCredentials(user: any, password: string): Observable<any> {
        if (!user || user.password !== password) {
            return throwError(() => new Error(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS));
        }
        return of(user);
    }

    /**
     * Process successful login and update session
     */
    private processSuccessfulLogin(user: any, rememberMe: boolean): SafeUser {
        // Remove password from user object for client-side storage
        const safeUser: SafeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            status: user.status,
            avatarUrl: user.avatarUrl,
            joinDate: user.joinDate,
            lastLoginDate: user.lastLoginDate,
            preferences: user.preferences,
            profile: user.profile
        };

        this.tokenStorageService.setCurrentUser(safeUser, rememberMe);
        this.currentUserSubject.next(safeUser);

        return safeUser;
    }

    /**
     * Handle authentication errors with proper error messages
     */
    private handleAuthError(error: HttpErrorResponse | Error): Observable<never> {
        let errorMessage: string = ERROR_MESSAGES.AUTH.LOGIN_FAILED;

        if (error instanceof HttpErrorResponse) {
            switch (error.status) {
                case 401:
                    errorMessage = ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
                    break;
                case 404:
                    errorMessage = ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
                    break;
                case 500:
                    errorMessage = ERROR_MESSAGES.NETWORK.SERVER_ERROR;
                    break;
                default:
                    errorMessage = ERROR_MESSAGES.NETWORK.CONNECTION_ERROR;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return throwError(() => new Error(errorMessage));
    }
}
