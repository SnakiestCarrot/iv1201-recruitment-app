import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthPresenter } from '../presenters/useAuthPresenter';
import { authService } from '../services/authService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

describe('useAuthPresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      clear: vi.fn()
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

    expect(authService.login).toHaveBeenCalledWith({ username: 'user', password: 'pw' });

    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'fake-jwt-token');

    expect(result.current.state).toEqual({
      status: 'success',
      message: 'Login successful! Token saved.',
    });
  });

  it('handles login failure', async () => {
    (authService.login as any).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.loginUser({ username: 'user', password: 'wrong' });
    });

    expect(result.current.state).toEqual({
      status: 'error',
      message: 'Invalid credentials',
    });
  });

  it('handles successful registration', async () => {
    (authService.register as any).mockResolvedValue('Registration successful');

    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.registerUser({ username: 'new', password: 'pw' });
    });

    expect(authService.register).toHaveBeenCalledWith({ username: 'new', password: 'pw' });

    expect(result.current.state).toEqual({
      status: 'success',
      message: 'Registration successful',
    });
  });

  it('handles registration failure', async () => {
    (authService.register as any).mockRejectedValue(new Error('User exists'));

    const { result } = renderHook(() => useAuthPresenter());

    await act(async () => {
      await result.current.registerUser({ username: 'exists', password: 'pw' });
    });

    expect(result.current.state).toEqual({
      status: 'error',
      message: 'User exists',
    });
  });
});