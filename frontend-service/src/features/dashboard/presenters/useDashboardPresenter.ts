import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { type UserProfile } from '../types/dashboardTypes';

/**
 * Custom React hook for managing dashboard state and authentication.
 * Retrieves user information from the JWT token and handles logout functionality.
 * Automatically redirects to login if no valid user token exists.
 *
 * @returns An object containing the username, roleId, and logout function.
 */
export const useDashboardPresenter = () => {
  const navigate = useNavigate();
  const [user] = useState<UserProfile | null>(() => {
    return dashboardService.getUserFromToken();
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  /**
   * Logs out the current user and navigates to the login page.
   * Clears the authentication token from localStorage.
   */
  const logout = () => {
    dashboardService.logout();
    navigate('/login');
  };

  return {
    username: user?.username || '',
    roleId: user?.roleId || null,
    logout,
  };
};
