import { renderHook, act } from '@testing-library/react';
import { useRecruiterAuthPresenter } from '../presenters/useRecruiterAuthPresenter';
import { authService } from '../services/authService';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../services/authService', () => ({
  authService: {
    registerRecruiter: vi.fn(),
  },
}));

describe('useRecruiterAuthPresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with idle state', () => {
    const { result } = renderHook(() => useRecruiterAuthPresenter());

    expect(result.current.state).toEqual({
      status: 'idle',
      message: '',
    });
  });

  it('handles successful recruiter registration', async () => {
    (authService.registerRecruiter as any).mockResolvedValue(
      'Recruiter registered successfully'
    );

    const { result } = renderHook(() => useRecruiterAuthPresenter());

    await act(async () => {
      await result.current.registerRecruiter({
        username: 'recruiter1',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'recruiter1@example.com',
        pnr: '19900101-1234',
        secretCode: 'secret123',
      });
    });

    expect(authService.registerRecruiter).toHaveBeenCalledWith({
      username: 'recruiter1',
      password: 'password123',
      secretCode: 'secret123',
    });

    expect(result.current.state).toEqual({
      status: 'success',
      message: 'Recruiter registered successfully',
    });
  });

  it('navigates to login page after successful registration', async () => {
    (authService.registerRecruiter as any).mockResolvedValue(
      'Recruiter registered successfully'
    );

    const { result } = renderHook(() => useRecruiterAuthPresenter());

    await act(async () => {
      await result.current.registerRecruiter({
        username: 'recruiter1',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'recruiter1@example.com',
        pnr: '19900101-1234',
        secretCode: 'secret123',
      });
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('handles registration failure with error object', async () => {
    (authService.registerRecruiter as any).mockRejectedValue(
      new Error('Invalid secret code')
    );

    const { result } = renderHook(() => useRecruiterAuthPresenter());

    await act(async () => {
      await result.current.registerRecruiter({
        username: 'recruiter1',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'recruiter1@example.com',
        pnr: '19900101-1234',
        secretCode: 'wrongcode',
      });
    });

    expect(result.current.state).toEqual({
      status: 'error',
      message: 'Invalid secret code',
    });
  });

  it('handles registration failure with non-error object', async () => {
    (authService.registerRecruiter as any).mockRejectedValue(
      'Something went wrong'
    );

    const { result } = renderHook(() => useRecruiterAuthPresenter());

    await act(async () => {
      await result.current.registerRecruiter({
        username: 'recruiter1',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'recruiter1@example.com',
        pnr: '19900101-1234',
        secretCode: 'secret123',
      });
    });

    expect(result.current.state).toEqual({
      status: 'error',
      message: 'Registration failed',
    });
  });

  it('sets status to loading during registration', async () => {
    let resolvePromise: (value: string) => void;
    const promise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });

    (authService.registerRecruiter as any).mockReturnValue(promise);

    const { result } = renderHook(() => useRecruiterAuthPresenter());

    act(() => {
      result.current.registerRecruiter({
        username: 'recruiter1',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'recruiter1@example.com',
        pnr: '19900101-1234',
        secretCode: 'secret123',
      });
    });

    expect(result.current.state).toEqual({
      status: 'loading',
      message: '',
    });

    await act(async () => {
      resolvePromise!('Success');
      await promise;
    });
  });

  it('does not navigate if registration fails', async () => {
    (authService.registerRecruiter as any).mockRejectedValue(
      new Error('Invalid secret code')
    );

    const { result } = renderHook(() => useRecruiterAuthPresenter());

    await act(async () => {
      await result.current.registerRecruiter({
        username: 'recruiter1',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'recruiter1@example.com',
        pnr: '19900101-1234',
        secretCode: 'wrongcode',
      });
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
