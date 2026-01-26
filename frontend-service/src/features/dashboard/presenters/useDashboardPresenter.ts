import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { type UserProfile } from '../types/dashboardTypes';

export const useDashboardPresenter = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const currentUser = dashboardService.getUserFromToken();

    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const logout = () => {
    dashboardService.logout();
    navigate('/login');
  };

  return {
    username: user?.username || '',
    roleId: user?.roleId || null,
    logout
  };
};