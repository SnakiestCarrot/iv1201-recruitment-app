/**
 * Represents a user's profile information extracted from the JWT token.
 */
export interface UserProfile {
  /** The username of the authenticated user. */
  username: string;
  /** The role identifier (1 for recruiter, 2 for applicant). */
  roleId: number;
}

/**
 * Represents the decoded payload structure of a JWT token.
 */
export interface TokenPayload {
  /** The subject (username) of the token. */
  sub: string;
  /** The role identifier of the user. */
  role: number;
  /** The expiration timestamp of the token (Unix timestamp). */
  exp: number;
  /** The issued-at timestamp of the token (Unix timestamp). */
  iat: number;
}
