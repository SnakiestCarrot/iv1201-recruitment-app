import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { AuthState, RecruiterRegisterRequest } from '../types/authTypes';

export const useRecruiterAuthPresenter = () => {
  const [state, setState] = useState<AuthState>({
    status: 'idle',
    message: '',
  });
  const navigate = useNavigate();

  const registerRecruiter = async (credentials: RecruiterRegisterRequest) => {
    setState({ status: 'loading', message: '' });

    try {
      const message = await authService.registerRecruiter(credentials);
      setState({ status: 'success', message });

      // Navigate to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      setState({ status: 'error', message: errorMessage });
    }
  };

  return {
    state,
    registerRecruiter,
  };
};
