import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { RecruiterRegisterSchema } from '../../../utils/validation';
import { type AuthState, type RecruiterRegisterRequest, AuthError } from '../types/authTypes';

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
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const navigate = useNavigate();

  /**
   * Registers a new recruiter with the provided credentials and secret code.
   * On success, navigates to the login page after a 2-second delay.
   * Updates the state to reflect loading, success, or error status.
   *
   * @param credentials - The recruiter's registration data including username, password, and secret code.
   */
  const registerRecruiter = async (
    credentials: RecruiterRegisterRequest & { confirmPassword?: string }
  ) => {
    setValidationErrors({});

    if (credentials.password !== credentials.confirmPassword) {
      setValidationErrors({ confirmPassword: AuthError.PASSWORD_MISMATCH });
      return;
    }

    const result = RecruiterRegisterSchema.safeParse(credentials);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setState({ status: 'loading', message: '' });

    try {
      const payload = {
        username: credentials.username,
        password: credentials.password,
        email: credentials.email,
        pnr: credentials.pnr,
        secretCode: credentials.secretCode,
      };

      const message = await authService.registerRecruiter(payload);
      setState({ status: 'success', message });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AuthError.REGISTRATION_FAILED;
      setState({ status: 'error', message: errorMessage });
    }
  };

  /**
   * Clears the validation error for a specific field.
   * * @param field - The name of the field to clear the error for.
   */
  const clearError = (field: string) => {
    setValidationErrors((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([key]) => key !== field))
    );
  };

  return {
    state,
    validationErrors,
    registerRecruiter,
    clearError,
  };
};
