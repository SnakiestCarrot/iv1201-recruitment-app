import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { type UserProfile } from '../types/dashboardTypes';

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
