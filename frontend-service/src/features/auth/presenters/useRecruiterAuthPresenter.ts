import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { AuthState, RecruiterRegisterRequest } from '../types/authTypes';

/**
 * Custom React hook for managing recruiter registration operations.
 * Provides state management and functionality for registering recruiters with a secret code.
 * Automatically navigates to login page after successful registration.
 *
 * @returns An object containing the current auth state and the registerRecruiter function.
 */
export const useRecruiterAuthPresenter = () => {
  const [state, setState] = useState<AuthState>({
    status: 'idle',
    message: '',
  });
  const navigate = useNavigate();

  /**
   * Registers a new recruiter with the provided credentials and secret code.
   * On success, navigates to the login page after a 2-second delay.
   * Updates the state to reflect loading, success, or error status.
   *
   * @param credentials - The recruiter's registration data including username, password, and secret code.
   */
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
