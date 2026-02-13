import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthPresenter } from '../presenters/useAuthPresenter';
import { authService } from '../services/authService';
import { AUTH_CHANGED_EVENT } from '../hooks/useAuth';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    requestOldUserReset: vi.fn(),
  },
}));

describe('useAuthPresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('initializes with idle state', () => {
    const { result } = renderHook(() => useAuthPresenter());

    expect(result.current.state).toEqual({
      status: 'idle',
      message: '',
    });
  });

  it('handles successful login', async () => {
    (authService.login as any).mockResolvedValue({ token: 'fake-jwt-token' });

    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.loginUser({ username: 'user', password: 'pw' });
    });

    expect(authService.login).toHaveBeenCalledWith({
      username: 'user',
      password: 'pw',
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'authToken',
      'fake-jwt-token'
    );

    expect(result.current.state).toEqual({
      status: 'success',
      message: 'Login successful! Token saved.',
    });
  });

  it('dispatches AUTH_CHANGED_EVENT on successful login', async () => {
    (authService.login as any).mockResolvedValue({ token: 'fake-jwt-token' });
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.loginUser({ username: 'user', password: 'pw' });
    });

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: AUTH_CHANGED_EVENT })
    );
  });

  it('handles login failure', async () => {
    (authService.login as any).mockRejectedValue(
      new Error('Invalid credentials')
    );

    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.loginUser({ username: 'user', password: 'wrong' });
    });

    expect(result.current.state).toEqual({
      status: 'error',
      message: 'Invalid credentials',
    });
  });

  it('rejects registration with invalid username characters', async () => {
    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.registerUser({
        username: '€σđuser',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'test@example.com',
        pnr: '19900101-1234',
      });
    });

    expect(result.current.validationErrors.username).toBe(
      'auth.username-invalid-characters'
    );
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('rejects registration with invalid password characters', async () => {
    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.registerUser({
        username: 'validuser',
        password: '¡£€pass',
        confirmPassword: '¡£€pass',
        email: 'test@example.com',
        pnr: '19900101-1234',
      });
    });

    expect(result.current.validationErrors.password).toBe(
      'auth.password-invalid-characters'
    );
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('handles successful registration', async () => {
    (authService.register as any).mockResolvedValue('Registration successful');

    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.registerUser({
        username: 'new',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'new@example.com',
        pnr: '19900101-1234',
      });
    });

    expect(authService.register).toHaveBeenCalledWith({
      username: 'new',
      password: 'password123',
      email: 'new@example.com',
      pnr: '19900101-1234',
    });

    expect(result.current.state).toEqual({
      status: 'success',
      message: 'Registration successful',
    });
  });

  it('handles registration failure', async () => {
    (authService.register as any).mockRejectedValue(new Error('User exists'));

    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.registerUser({
        username: 'exists',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'exists@example.com',
        pnr: '19900101-1234',
      });
    });

    expect(result.current.state).toEqual({
      status: 'error',
      message: 'User exists',
    });
  });

  it('handles successful old user reset request', async () => {
    (authService.requestOldUserReset as any).mockResolvedValue(
      'If this email exists in our system, you will receive password reset instructions shortly.'
    );

    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.requestOldUserReset('old@test.com');
    });

    expect(authService.requestOldUserReset).toHaveBeenCalledWith('old@test.com');

    expect(result.current.state).toEqual({
      status: 'success',
      message:
        'If this email exists in our system, you will receive password reset instructions shortly.',
    });
  });

  it('returns generic success message even if old user reset fails', async () => {
    (authService.requestOldUserReset as any).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.requestOldUserReset('old@test.com');
    });

    expect(result.current.state.status).toBe('success');
    expect(result.current.state.message).toContain(
      'If this email exists'
    );
  });
});
