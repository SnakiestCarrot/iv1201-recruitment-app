import { useState } from 'react';
import { profileService } from '../services/profileService';
import {
  type ProfileState,
  type UpdateProfileRequest,
} from '../types/profileTypes';

/**
 * Custom hook for managing profile update operations.
 * Handles loading, success, and error state for updating user profile.
 */
export const useProfilePresenter = () => {
  const [state, setState] = useState<ProfileState>({
    status: 'idle',
    message: '',
  });

  /**
   * Updates the authenticated user's profile information.
   *
   * @param data - The profile update data (email and/or pnr).
   */
  const updateProfile = async (data: UpdateProfileRequest) => {
    setState({ status: 'loading', message: 'Updating profile...' });

    try {
      await profileService.updateProfile(data);

      setState({
        status: 'success',
        message: 'Profile updated successfully.',
      });
    } catch (error) {
      setState({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Profile update failed.',
      });
    }
  };

  return {
    state,
    updateProfile,
  };
};
