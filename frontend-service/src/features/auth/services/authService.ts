import {
  type ApplicantRegisterRequest,
  type AuthRequest,
  type AuthResponse,
  type RecruiterRegisterRequest,
  AuthError,
  AuthStatus,
} from '../types/authTypes';

/**
 * Base URL for authentication API endpoints.
 * Uses VITE_API_URL environment variable if set, otherwise defaults to localhost.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : 'http://localhost:8080/auth';

/**
 * Service for handling authentication-related operations.
 * Provides methods for user registration, recruiter registration, and login.
 */
export const authService = {
  /**
   * Registers a new applicant user.
   *
   * @param data - The registration data containing username and password.
   * @returns A promise that resolves to a success message.
   * @throws {Error} If registration fails or username is already taken.
   */
  async register(data: ApplicantRegisterRequest): Promise<string> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      throw new Error(AuthError.SERVER_ERROR);
    }

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error(AuthError.USERNAME_TAKEN);
      }
      throw new Error(AuthError.REGISTRATION_FAILED);
    }
    return await response.text();
  },

  /**
   * Registers a new recruiter user with a secret registration code.
   *
   * @param data - The registration data containing username, password, and secret code.
   * @returns A promise that resolves to a success message.
   * @throws {Error} If registration fails, username is taken, or secret code is invalid.
   */
  async registerRecruiter(data: RecruiterRegisterRequest): Promise<string> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/register/recruiter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      throw new Error(AuthError.SERVER_ERROR);
    }

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(AuthError.INVALID_SECRET_CODE);
      }
      if (response.status === 409) {
        throw new Error(AuthError.USERNAME_TAKEN);
      }
      throw new Error(AuthError.REGISTRATION_FAILED);
    }
    return await response.text();
  },

  /**
   * Requests password reset instructions for migrated (old) users.
   *
   * Always returns a generic message for security reasons.
   *
   * @param email - The email address of the old user.
   * @returns A promise that resolves to a success message.
   */
  async requestOldUserReset(email: string): Promise<string> {
    const baseUrl = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api/recruitment`
      : 'http://localhost:8080/api/recruitment';

    const response = await fetch(`${baseUrl}/migrated-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    // We intentionally do NOT expose whether the email exists
    if (!response.ok) {
      return AuthStatus.OLD_USER_RESET_MESSAGE;
    }

    return await response.text();
  },

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @param data - The login credentials containing username and password.
   * @returns A promise that resolves to an authentication response with JWT token.
   * @throws {Error} If login fails or credentials are invalid.
   */
  async login(data: AuthRequest): Promise<AuthResponse> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      throw new Error(AuthError.SERVER_ERROR);
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(AuthError.INVALID_CREDENTIALS);
      }
      throw new Error(AuthError.LOGIN_FAILED);
    }
    return await response.json();
  },
};
