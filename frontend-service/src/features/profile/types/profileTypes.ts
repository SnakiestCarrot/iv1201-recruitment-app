export type UpdateProfileRequest = {
  email?: string;
  pnr?: string;
};

export type ProfileState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};