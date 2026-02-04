import { jwtDecode } from 'jwt-decode';
import { type UserProfile, type TokenPayload } from '../types/dashboardTypes';

/**
 * Service for handling dashboard operations and user session management.
 * Provides methods for retrieving user profiles from JWT tokens and logout functionality.
 */
export const dashboardService = {
  /**
   * Retrieves the current user profile from the stored JWT token.
   * Decodes the token from localStorage and extracts user information.
   *
   * @returns The user profile containing username and roleId, or null if no token exists or token is invalid.
   */
  getUserFromToken(): UserProfile | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const decoded = jwtDecode<TokenPayload>(token);

      return {
        username: decoded.sub,
        roleId: decoded.role,
      };
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  },

  /**
   * Logs out the current user by removing the authentication token from localStorage.
   * This effectively ends the user's session.
   */
  logout(): void {
    localStorage.removeItem('authToken');
  },
};
