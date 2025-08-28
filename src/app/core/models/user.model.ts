/**
 * User-related models and interfaces
 * Provides strong typing for user data structures
 */

import { UserRole, UserStatus, Theme } from '../enums/user.enums';

/**
 * Base user interface with all user properties
 */
export interface User {
  readonly id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  joinDate: string;
  lastLoginDate?: string;
  preferences?: UserPreferences;
  profile?: UserProfile;
}

/**
 * User without sensitive information (for client-side use)
 */
export interface SafeUser extends Omit<User, 'password'> {
  // Explicitly excludes password field
}

/**
 * User with password (for server-side operations only)
 */
export interface UserWithPassword extends User {
  password: string;
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  theme: Theme;
  language: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  courseUpdates: boolean;
  promotions: boolean;
  reminders: boolean;
}

/**
 * Privacy settings
 */
export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showProgress: boolean;
  allowMessages: boolean;
}

/**
 * Extended user profile information
 */
export interface UserProfile {
  bio?: string;
  website?: string;
  location?: string;
  socialLinks?: SocialLinks;
  skills?: string[];
  interests?: string[];
  experience?: ExperienceLevel;
}

/**
 * Social media links
 */
export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  portfolio?: string;
}

/**
 * Experience level
 */
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * User creation payload (for registration)
 */
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  preferences?: Partial<UserPreferences>;
}

/**
 * User update payload
 */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  preferences?: Partial<UserPreferences>;
  profile?: Partial<UserProfile>;
}

/**
 * Password change request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * User search/filter criteria
 */
export interface UserSearchCriteria {
  query?: string;
  role?: UserRole;
  status?: UserStatus;
  joinDateFrom?: string;
  joinDateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * User statistics
 */
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<UserRole, number>;
  usersByStatus: Record<UserStatus, number>;
}

/**
 * User activity log entry
 */
export interface UserActivity {
  id: string;
  userId: number;
  action: string;
  details?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Type guard to check if user has password
 */
export function isUserWithPassword(user: User | UserWithPassword): user is UserWithPassword {
  return 'password' in user;
}

/**
 * Type guard to check if user is admin
 */
export function isAdmin(user: User): boolean {
  return user.role === UserRole.ADMIN;
}

/**
 * Type guard to check if user is instructor
 */
export function isInstructor(user: User): boolean {
  return user.role === UserRole.INSTRUCTOR;
}

/**
 * Type guard to check if user can moderate
 */
export function canModerate(user: User): boolean {
  return user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR;
}
