import { useState, useEffect } from 'react';
import { dashboardService } from '../../dashboard/services/dashboardService';
import type { UserProfile } from '../../dashboard/types/dashboardTypes';

// Custom event for auth state changes
export const AUTH_CHANGED_EVENT = 'auth-state-changed';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    return dashboardService.getUserFromToken();
  });

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = dashboardService.getUserFromToken();
      setUser(currentUser);
    };

    // Check auth on mount
    checkAuth();

    // Check auth when localStorage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkAuth);

    // Check auth when custom event is dispatched (e.g., login/logout in same tab)
    window.addEventListener(AUTH_CHANGED_EVENT, checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener(AUTH_CHANGED_EVENT, checkAuth);
    };
  }, []);

  const isAuthenticated = user !== null;

  return {
    user,
    isAuthenticated,
  };
};
