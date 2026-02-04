/**
 * Represents user credentials for authentication requests (login or registration).
 */
export interface AuthRequest {
  /** The user's username. */
  username: string;
  /** The user's password. */
  password: string;
}

/**
 * Represents registration data for a recruiter, including a secret code.
 */
export interface RecruiterRegisterRequest {
  /** The recruiter's username. */
  username: string;
  /** The recruiter's password. */
  password: string;
  /** The secret registration code required for recruiter registration. */
  secretCode: string;
}

/**
 * Represents the server response after successful authentication.
 */
export interface AuthResponse {
  /** The JWT authentication token. */
  token: string;
}

/**
 * Represents the state of an authentication operation.
 */
export interface AuthState {
  /** The current status of the authentication operation. */
  status: 'idle' | 'loading' | 'success' | 'error';
  /** A message describing the result or error of the operation. */
  message: string;
}
