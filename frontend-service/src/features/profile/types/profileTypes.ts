/**
 * Data transfer object for updating a user's profile.
 */
export interface UpdateProfileRequest {
  email?: string;
  pnr?: string;
}

/**
 * Represents the state of a profile update operation.
 */
export interface ProfileState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}
