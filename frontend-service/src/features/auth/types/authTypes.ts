export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}
