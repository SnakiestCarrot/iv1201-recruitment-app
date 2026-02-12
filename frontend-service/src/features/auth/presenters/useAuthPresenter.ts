import { useState } from 'react';
import { authService } from '../services/authService';
import {
  type ApplicantRegisterRequest,
  type AuthRequest,
  type AuthState,
} from '../types/authTypes';
import { AUTH_CHANGED_EVENT } from '../hooks/useAuth';

/**
 * Custom React hook for managing authentication operations (registration and login).
 * Provides state management and functions for user registration and login flows.
 *
 * @returns An object containing the current auth state and functions for registerUser and loginUser.
 */
export const useAuthPresenter = () => {
  const [state, setState] = useState<AuthState>({
    status: 'idle',
    message: '',
  });

  /**
   * Registers a new applicant user with the provided credentials.
   * Updates the state to reflect loading, success, or error status.
   *
   * @param credentials - The user's registration credentials (username and password).
   */
  const registerUser = async (credentials: ApplicantRegisterRequest) => {
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

  /**
   * Authenticates a user with the provided credentials.
   * On success, stores the JWT token in localStorage and dispatches an auth changed event.
   * Updates the state to reflect loading, success, or error status.
   *
   * @param credentials - The user's login credentials (username and password).
   */
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

  const requestOldUserReset = async (email: string) => {
    setState({ status: 'loading', message: 'Sending instructions...' });

    try {
      const message = await authService.requestOldUserReset(email);

      setState({
        status: 'success',
        message,
      });
    } catch {
      setState({
        status: 'success',
        message:
          'If this email exists in our system, you will receive password reset instructions shortly.',
      });
    }
  };

  return {
    state,
    registerUser,
    loginUser,
    requestOldUserReset,
  };
};
