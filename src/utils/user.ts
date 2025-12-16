/**
 * User utility functions
 */

import type { User } from '@/types/auth.types';

/**
 * Get user's full name from User object
 * @param user - User object with firstName and lastName
 * @returns Full name as "FirstName LastName"
 */
export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

/**
 * Get user's initials
 * @param user - User object with firstName and lastName
 * @returns Initials (e.g., "JD" for John Doe)
 */
export function getUserInitials(user: User): string {
  const firstInitial = user.firstName[0] || '';
  const lastInitial = user.lastName[0] || '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

/**
 * Get user's display name (full name with optional title)
 * @param user - User object
 * @param includeRole - Whether to include role in display name
 * @returns Display name, optionally with role
 */
export function getUserDisplayName(user: User, includeRole: boolean = false): string {
  const fullName = getUserFullName(user);
  if (includeRole && user.role) {
    return `${fullName} (${user.role})`;
  }
  return fullName;
}
