import { useState } from 'react';
import { authService } from '../services/authService';
import { LoginSchema, RegisterUserSchema } from '../../../utils/validation';
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

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  /**
   * Registers a new applicant user with the provided credentials.
   * Updates the state to reflect loading, success, or error status.
   *
   * @param credentials - The user's registration credentials (username, password, and confirmation).
   */
  const registerUser = async (
    credentials: ApplicantRegisterRequest & { confirmPassword?: string }
  ) => {
    setValidationErrors({});

    if (credentials.password !== credentials.confirmPassword) {
      setValidationErrors({ confirmPassword: 'auth.password-mismatch' });
      return;
    }

    const result = RegisterUserSchema.safeParse({
      username: credentials.username,
      password: credentials.password,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setState({ status: 'loading', message: 'Registering...' });
    try {
      const payload: AuthRequest = {
        username: credentials.username,
        password: credentials.password,
      };
      const successMessage = await authService.register(payload);

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
    setValidationErrors({});

    const result = LoginSchema.safeParse(credentials);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setState({ status: 'loading', message: 'Logging in...' });
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('authToken', data.token);
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

  /**
   * Clears the validation error for a specific field.
   *
   * @param field - The name of the field to clear.
   */
  const clearError = (field: string) => {
    setValidationErrors((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([key]) => key !== field))
    );
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
    validationErrors,
    registerUser,
    loginUser,
    clearError,
    requestOldUserReset,
  };
};
