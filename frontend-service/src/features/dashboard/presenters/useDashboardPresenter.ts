import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDashboardPresenter = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('User');

  // Check authentication on load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // If no token, kick them back to login
      navigate('/login');
    } else {
      // Optional: You could decode the JWT here to get the real username
      // For now, we just assume they are valid
      setUsername('Applicant'); 
    }
  }, [navigate]);

  const logout = () => {
    // 1. Clear the token
    localStorage.removeItem('authToken');
    // 2. Redirect to Login
    navigate('/login');
  };

  return {
    username,
    logout
  };
};