export interface UpdateProfileRequest {
  email?: string;
  pnr?: string;
}

export interface ProfileState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}
