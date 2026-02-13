import { useState } from 'react';
import { profileService } from '../services/profileService';
import {
  type ProfileState,
  type UpdateProfileRequest,
} from '../types/profileTypes';
import { UpdateProfileSchema } from '../../../utils/validation';

/**
 * Custom hook for managing profile update operations.
 * Handles loading, success, and error state for updating user profile.
 */
export const useProfilePresenter = () => {
  const [state, setState] = useState<ProfileState>({
    status: 'idle',
    message: '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const clearError = (field: string) => {
    setValidationErrors((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([key]) => key !== field))
    );
  };

  /**
   * Updates the authenticated user's profile information.
   *
   * @param data - The profile update data (email and/or pnr).
   */
  const updateProfile = async (data: UpdateProfileRequest) => {
    const result = UpdateProfileSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        fieldErrors[fieldName] = issue.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setValidationErrors({});
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
    validationErrors,
    clearError,
    updateProfile,
  };
};
