export const AuthError = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  REGISTRATION_FAILED: 'REGISTRATION_FAILED',
  INVALID_SECRET_CODE: 'INVALID_SECRET_CODE',
  SERVER_ERROR: 'SERVER_ERROR',
  LOGIN_FAILED: 'LOGIN_FAILED',
  PASSWORD_MISMATCH: 'PASSWORD_MISMATCH',
} as const;

export const AuthStatus = {
  LOGGING_IN: 'LOGGING_IN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  REGISTERING: 'REGISTERING',
  OLD_USER_SENDING: 'OLD_USER_SENDING',
  OLD_USER_RESET_MESSAGE: 'OLD_USER_RESET_MESSAGE',
} as const;

/**
 * Represents user credentials for login requests.
 */
export interface AuthRequest {
  /** The user's username. */
  username: string;
  /** The user's password. */
  password: string;
}

/**
 * Represents registration data for a new applicant, including email and personal number.
 */
export interface ApplicantRegisterRequest {
  /** The applicant's username. */
  username: string;
  /** The applicant's password. */
  password: string;
  /** The applicant's email address. */
  email: string;
  /** The applicant's personal number (personnummer). */
  pnr: string;
}

/**
 * Represents registration data for a recruiter, including a secret code.
 */
export interface RecruiterRegisterRequest {
  /** The recruiter's username. */
  username: string;
  /** The recruiter's password. */
  password: string;
  /** The recruiter's email address. */
  email: string;
  /** The recruiter's personal number (personnummer). */
  pnr: string;
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
