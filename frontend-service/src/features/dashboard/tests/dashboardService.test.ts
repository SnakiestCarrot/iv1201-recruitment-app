import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardService } from '../services/dashboardService';
import { jwtDecode } from 'jwt-decode';

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

describe('dashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getUserFromToken', () => {
    it('returns null when no token exists', () => {
      (localStorage.getItem as any).mockReturnValue(null);

      const result = dashboardService.getUserFromToken();

      expect(result).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith('authToken');
    });

    it('returns user profile when token is valid', () => {
      const mockToken = 'fake-jwt-token';
      const mockDecodedToken = {
        sub: 'testuser',
        role: 1,
        exp: 1234567890,
        iat: 1234567890,
      };

      (localStorage.getItem as any).mockReturnValue(mockToken);
      (jwtDecode as any).mockReturnValue(mockDecodedToken);

      const result = dashboardService.getUserFromToken();

      expect(result).toEqual({
        username: 'testuser',
        roleId: 1,
      });
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    });

    it('returns null and logs error when token is invalid', () => {
      const mockToken = 'invalid-token';

      (localStorage.getItem as any).mockReturnValue(mockToken);
      (jwtDecode as any).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = dashboardService.getUserFromToken();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to decode token',
        expect.any(Error)
      );
    });

    it('handles different role IDs correctly', () => {
      const mockToken = 'fake-jwt-token';
      const mockDecodedToken = {
        sub: 'recruiter1',
        role: 2,
        exp: 1234567890,
        iat: 1234567890,
      };

      (localStorage.getItem as any).mockReturnValue(mockToken);
      (jwtDecode as any).mockReturnValue(mockDecodedToken);

      const result = dashboardService.getUserFromToken();

      expect(result).toEqual({
        username: 'recruiter1',
        roleId: 2,
      });
    });

    it('extracts username from sub claim', () => {
      const mockToken = 'fake-jwt-token';
      const mockDecodedToken = {
        sub: 'unique-username-123',
        role: 1,
        exp: 1234567890,
        iat: 1234567890,
      };

      (localStorage.getItem as any).mockReturnValue(mockToken);
      (jwtDecode as any).mockReturnValue(mockDecodedToken);

      const result = dashboardService.getUserFromToken();

      expect(result?.username).toBe('unique-username-123');
    });
  });

  describe('logout', () => {
    it('removes authToken from localStorage', () => {
      dashboardService.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    });

    it('only removes authToken, not other items', () => {
      dashboardService.logout();

      expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    });
  });
});
