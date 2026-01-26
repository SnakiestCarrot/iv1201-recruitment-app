import { jwtDecode } from 'jwt-decode';
import { type UserProfile, type TokenPayload } from '../types/dashboardTypes';

export const dashboardService = {
  /**
   * Retrieves the current user profile from the stored token.
   * Returns null if no token exists or if it is invalid.
   */
  getUserFromToken(): UserProfile | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      
      return {
        username: decoded.sub,
        roleId: decoded.role
      };
    } catch (error) {
      console.error("Failed to decode token", error);
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('authToken');
  }
};