import { renderHook, act } from '@testing-library/react';
import { useDashboardPresenter } from '../presenters/useDashboardPresenter';
import { dashboardService } from '../services/dashboardService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../services/dashboardService', () => ({
  dashboardService: {
    getUserFromToken: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('useDashboardPresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns user data when user exists', () => {
    const mockUser = { username: 'testuser', roleId: 1 };
    (dashboardService.getUserFromToken as any).mockReturnValue(mockUser);

    const { result } = renderHook(() => useDashboardPresenter());

    expect(result.current.username).toBe('testuser');
    expect(result.current.roleId).toBe(1);
  });

  it('returns empty username and null roleId when user is null', () => {
    (dashboardService.getUserFromToken as any).mockReturnValue(null);

    const { result } = renderHook(() => useDashboardPresenter());

    expect(result.current.username).toBe('');
    expect(result.current.roleId).toBeNull();
  });

  it('navigates to login when no user is found', () => {
    (dashboardService.getUserFromToken as any).mockReturnValue(null);

    renderHook(() => useDashboardPresenter());

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('does not navigate when user exists', () => {
    const mockUser = { username: 'testuser', roleId: 1 };
    (dashboardService.getUserFromToken as any).mockReturnValue(mockUser);

    renderHook(() => useDashboardPresenter());

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('calls logout service and navigates when logout is called', () => {
    const mockUser = { username: 'testuser', roleId: 1 };
    (dashboardService.getUserFromToken as any).mockReturnValue(mockUser);

    const { result } = renderHook(() => useDashboardPresenter());

    act(() => {
      result.current.logout();
    });

    expect(dashboardService.logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('handles different role IDs correctly', () => {
    const mockRecruiter = { username: 'recruiter1', roleId: 2 };
    (dashboardService.getUserFromToken as any).mockReturnValue(mockRecruiter);

    const { result } = renderHook(() => useDashboardPresenter());

    expect(result.current.username).toBe('recruiter1');
    expect(result.current.roleId).toBe(2);
  });

  it('calls getUserFromToken on initialization', () => {
    (dashboardService.getUserFromToken as any).mockReturnValue({
      username: 'user',
      roleId: 1,
    });

    renderHook(() => useDashboardPresenter());

    expect(dashboardService.getUserFromToken).toHaveBeenCalledTimes(1);
  });

  it('provides logout function in returned object', () => {
    const mockUser = { username: 'testuser', roleId: 1 };
    (dashboardService.getUserFromToken as any).mockReturnValue(mockUser);

    const { result } = renderHook(() => useDashboardPresenter());

    expect(typeof result.current.logout).toBe('function');
  });
});
