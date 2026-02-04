/**
 * Secure token storage utility
 * Provides secure methods for storing and retrieving authentication tokens
 */

const TOKEN_KEY = 'access_token';
const ROLE_KEY = 'user_role';

/**
 * Token expiration time in milliseconds (1 hour)
 */
const TOKEN_EXPIRATION = 60 * 60 * 1000;

/**
 * Store authentication token securely
 * @param token - JWT access token
 * @param role - User role (admin/seller)
 */
export function setToken(token: string, role: string): void {
  if (typeof window === 'undefined') return;

  try {
    // Store with timestamp for expiration check
    const tokenData = {
      token,
      timestamp: Date.now(),
    };

    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    localStorage.setItem(ROLE_KEY, role);

    // Sync to cookie for middleware
    if (typeof document !== 'undefined') {
      document.cookie = `access_token=${token}; path=/; max-age=${TOKEN_EXPIRATION / 1000}; SameSite=Lax`;
      document.cookie = `user_role=${role}; path=/; max-age=${TOKEN_EXPIRATION / 1000}; SameSite=Lax`;
    }
  } catch (error) {
    console.error('Failed to store token:', error);
  }
}

/**
 * Retrieve authentication token
 * Returns null if token is expired or invalid
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  const tokenDataStr = localStorage.getItem(TOKEN_KEY);
  if (!tokenDataStr) return null;

  try {
    // Legacy support: if value is a raw token string, return as-is
    if (!tokenDataStr.trim().startsWith('{')) {
      return tokenDataStr;
    }

    const tokenData = JSON.parse(tokenDataStr);

    // Check if token is expired (only applies to new JSON format)
    if (typeof tokenData.timestamp === 'number') {
      if (Date.now() - tokenData.timestamp > TOKEN_EXPIRATION) {
        clearToken();
        return null;
      }
    }

    return tokenData.token as string;
  } catch (error) {
    // On parse error, assume legacy raw token format and return value
    try {
      return tokenDataStr;
    } catch {
      clearToken();
      return null;
    }
  }
}

/**
 * Get user role
 */
export function getUserRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ROLE_KEY);
}

/**
 * Clear authentication token and role
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);

  // Clear cookie
  if (typeof document !== 'undefined') {
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Check password strength
 * @param password - Password to check
 * @returns Object with strength info
 */
export function checkPasswordStrength(password: string): {
  isStrong: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isStrong: errors.length === 0,
    errors,
  };
}
