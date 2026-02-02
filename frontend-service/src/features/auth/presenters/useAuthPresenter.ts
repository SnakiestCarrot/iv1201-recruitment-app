import { useState } from 'react';
import { authService } from '../services/authService';
import { type AuthRequest, type AuthState } from '../types/authTypes';
import { AUTH_CHANGED_EVENT } from '../hooks/useAuth';

export const useAuthPresenter = () => {
  const [state, setState] = useState<AuthState>({
    status: 'idle',
    message: '',
  });

  const registerUser = async (credentials: AuthRequest) => {
    setState({ status: 'loading', message: 'Registering...' });
    try {
      const successMessage = await authService.register(credentials);
      setState({ status: 'success', message: successMessage });
    } catch (error: unknown) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  };

  const loginUser = async (credentials: AuthRequest) => {
    setState({ status: 'loading', message: 'Logging in...' });
    try {
      const data = await authService.login(credentials);
      // save token to storage
      localStorage.setItem('authToken', data.token);
      // Dispatch custom event to notify auth state changed
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      setState({
        status: 'success',
        message: 'Login successful! Token saved.',
      });
    } catch (error: unknown) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  return {
    state,
    registerUser,
    loginUser,
  };
};
