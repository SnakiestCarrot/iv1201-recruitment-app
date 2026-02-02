export interface AuthRequest {
  username: string;
  password: string;
}

export interface RecruiterRegisterRequest {
  username: string;
  password: string;
  secretCode: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}
