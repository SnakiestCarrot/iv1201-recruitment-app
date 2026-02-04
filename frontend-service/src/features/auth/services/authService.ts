import {
  type AuthRequest,
  type AuthResponse,
  type RecruiterRegisterRequest,
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
  async register(data: AuthRequest): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Registration failed');
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
    const response = await fetch(`${API_BASE_URL}/register/recruiter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 403) {
        throw new Error('Invalid registration code');
      }
      throw new Error(errorText || 'Registration failed');
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
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (errorText.includes('Invalid')) {
        throw new Error('Invalid username or password');
      } else {
        throw new Error(errorText || 'Login failed');
      }
    }
    return await response.json();
  },
};
