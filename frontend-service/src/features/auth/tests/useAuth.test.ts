import { renderHook, waitFor } from '@testing-library/react';
import { useAuth, AUTH_CHANGED_EVENT } from '../hooks/useAuth';
import { dashboardService } from '../../dashboard/services/dashboardService';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('../../dashboard/services/dashboardService', () => ({
  dashboardService: {
    getUserFromToken: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with null user when no token exists', () => {
    (dashboardService.getUserFromToken as any).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('initializes with user when valid token exists', () => {
    const mockUser = { username: 'testuser', roleId: 1 };
    (dashboardService.getUserFromToken as any).mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('updates auth state when custom AUTH_CHANGED_EVENT is dispatched', async () => {
    const mockUser = { username: 'testuser', roleId: 1 };
    (dashboardService.getUserFromToken as any).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);

    // Simulate login by updating mock and dispatching event
    (dashboardService.getUserFromToken as any).mockReturnValue(mockUser);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('updates auth state when storage event is dispatched', async () => {
    (dashboardService.getUserFromToken as any).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);

    // Simulate login in another tab
    const mockUser = { username: 'testuser', roleId: 1 };
    (dashboardService.getUserFromToken as any).mockReturnValue(mockUser);
    window.dispatchEvent(new Event('storage'));

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('updates to null when logout happens', async () => {
    const mockUser = { username: 'testuser', roleId: 1 };
    (dashboardService.getUserFromToken as any).mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);

    // Simulate logout
    (dashboardService.getUserFromToken as any).mockReturnValue(null);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    (dashboardService.getUserFromToken as any).mockReturnValue(null);

    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'storage',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      AUTH_CHANGED_EVENT,
      expect.any(Function)
    );
  });
});
