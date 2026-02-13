import { type UpdateProfileRequest } from '../types/profileTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/recruitment`
  : 'http://localhost:8080/api/recruitment';

export const profileService = {
  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Profile update failed');
    }
  },
};
