/**
 * Authentication-related models and interfaces
 * Provides strong typing for auth operations
 */

import { User, SafeUser } from './user.model';
import { AuthMethod, StorageType } from '../enums/user.enums';

/**
 * Login request payload
 */
export interface LoginRequest {
  identifier: string; // Can be username or email
  password: string;
  rememberMe?: boolean;
  authMethod?: AuthMethod;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
}

/**
 * Authentication response from server
 */
export interface AuthResponse {
  success: boolean;
  user: SafeUser;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  message?: string;
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirmation {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Email verification request
 */
export interface EmailVerificationRequest {
  email: string;
}

/**
 * Email verification confirmation
 */
export interface EmailVerificationConfirmation {
  token: string;
  email: string;
}

/**
 * Social login request
 */
export interface SocialLoginRequest {
  provider: 'google' | 'facebook' | 'github' | 'linkedin';
  token: string;
  rememberMe?: boolean;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: SafeUser | null;
  isLoading: boolean;
  error: string | null;
  lastActivity: Date | null;
}

/**
 * Login options
 */
export interface LoginOptions {
  rememberMe: boolean;
  storageType: StorageType;
  redirectUrl?: string;
}

/**
 * Registration options
 */
export interface RegistrationOptions {
  autoLogin: boolean;
  sendWelcomeEmail: boolean;
  redirectUrl?: string;
}

/**
 * Session information
 */
export interface SessionInfo {
  userId: number;
  username: string;
  role: string;
  loginTime: Date;
  lastActivity: Date;
  expiresAt: Date;
  isRemembered: boolean;
  deviceInfo?: DeviceInfo;
}

/**
 * Device information for session tracking
 */
export interface DeviceInfo {
  userAgent: string;
  platform: string;
  browser: string;
  ipAddress?: string;
  location?: string;
}

/**
 * Authentication error details
 */
export interface AuthError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

/**
 * Multi-factor authentication request
 */
export interface MfaRequest {
  userId: number;
  method: 'sms' | 'email' | 'authenticator';
  code: string;
}

/**
 * Account verification status
 */
export interface VerificationStatus {
  email: boolean;
  phone: boolean;
  identity: boolean;
  twoFactor: boolean;
}

/**
 * User permissions
 */
export interface UserPermissions {
  canRead: string[];
  canWrite: string[];
  canDelete: string[];
  canAdmin: string[];
}

/**
 * Authentication configuration
 */
export interface AuthConfig {
  sessionTimeout: number;
  rememberMeDuration: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  requireEmailVerification: boolean;
  enableSocialLogin: boolean;
  enableMfa: boolean;
}

/**
 * Login attempt tracking
 */
export interface LoginAttempt {
  identifier: string;
  timestamp: Date;
  success: boolean;
  ipAddress: string;
  userAgent: string;
  failureReason?: string;
}

/**
 * Type guards for auth responses
 */
export function isAuthSuccess(response: AuthResponse): response is AuthResponse & { success: true } {
  return response.success === true;
}

export function isAuthError(response: AuthResponse): response is AuthResponse & { success: false } {
  return response.success === false;
}

/**
 * Utility type for auth form validation
 */
export interface AuthFormErrors {
  identifier?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  general?: string;
}
