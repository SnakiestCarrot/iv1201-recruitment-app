import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProfilePresenter } from '../presenters/useProfilePresenter';
import { profileService } from '../services/profileService';

vi.mock('../services/profileService', () => ({
  profileService: {
    updateProfile: vi.fn(),
  },
}));

describe('useProfilePresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with idle state', () => {
    const { result } = renderHook(() => useProfilePresenter());

    expect(result.current.state).toEqual({
      status: 'idle',
      message: '',
    });
  });

  it('handles successful update', async () => {
    (profileService.updateProfile as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useProfilePresenter());

    await act(async () => {
      await result.current.updateProfile({
        email: 'test@mail.com',
      });
    });

    expect(profileService.updateProfile).toHaveBeenCalledWith({
      email: 'test@mail.com',
    });

    expect(result.current.state).toEqual({
      status: 'success',
      message: 'Profile updated successfully.',
    });
  });

  it('handles update failure', async () => {
    (profileService.updateProfile as any).mockRejectedValue(
      new Error('Email already in use')
    );

    const { result } = renderHook(() => useProfilePresenter());

    await act(async () => {
      await result.current.updateProfile({
        email: 'taken@mail.com',
      });
    });

    expect(result.current.state).toEqual({
      status: 'error',
      message: 'Email already in use',
    });
  });

  it('rejects update with invalid email format', async () => {
    const { result } = renderHook(() => useProfilePresenter());

    await act(async () => {
      await result.current.updateProfile({
        email: 'not-an-email',
      });
    });

    expect(result.current.validationErrors.email).toBe(
      'validation.email-invalid'
    );
    expect(profileService.updateProfile).not.toHaveBeenCalled();
  });

  it('rejects update with invalid pnr format', async () => {
    const { result } = renderHook(() => useProfilePresenter());

    await act(async () => {
      await result.current.updateProfile({
        pnr: '12345',
      });
    });

    expect(result.current.validationErrors.pnr).toBe('validation.pnr-format');
    expect(profileService.updateProfile).not.toHaveBeenCalled();
  });

  it('allows update with only valid email', async () => {
    (profileService.updateProfile as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useProfilePresenter());

    await act(async () => {
      await result.current.updateProfile({
        email: 'valid@mail.com',
      });
    });

    expect(result.current.validationErrors).toEqual({});
    expect(profileService.updateProfile).toHaveBeenCalledWith({
      email: 'valid@mail.com',
    });
  });

  it('allows update with only valid pnr', async () => {
    (profileService.updateProfile as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useProfilePresenter());

    await act(async () => {
      await result.current.updateProfile({
        pnr: '19900101-1234',
      });
    });

    expect(result.current.validationErrors).toEqual({});
    expect(profileService.updateProfile).toHaveBeenCalledWith({
      pnr: '19900101-1234',
    });
  });

  it('clears validation errors with clearError', async () => {
    const { result } = renderHook(() => useProfilePresenter());

    await act(async () => {
      await result.current.updateProfile({
        email: 'not-an-email',
      });
    });

    expect(result.current.validationErrors.email).toBe(
      'validation.email-invalid'
    );

    act(() => {
      result.current.clearError('email');
    });

    expect(result.current.validationErrors.email).toBeUndefined();
  });
});
