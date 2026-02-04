import {
  type AuthRequest,
  type AuthResponse,
  type RecruiterRegisterRequest,
} from '../types/authTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : 'http://localhost:8080/auth';

export const authService = {
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
