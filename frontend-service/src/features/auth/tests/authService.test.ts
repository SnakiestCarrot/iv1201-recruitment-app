import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from '../services/authService';
import { AuthError, AuthStatus } from '../types/authTypes';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('authService', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('register sends correct request and returns message on success', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('User created successfully'),
    });

    const result = await authService.register({
      username: 'new',
      password: 'pw',
      email: 'new@example.com',
      pnr: '19900101-1234',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/register'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'new',
          password: 'pw',
          email: 'new@example.com',
          pnr: '19900101-1234',
        }),
      }
    );

    expect(result).toBe('User created successfully');
  });

  it('register throws i18n key on failure', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(
      authService.register({
        username: 'taken',
        password: 'pw',
        email: 'taken@example.com',
        pnr: '19900101-1234',
      })
    ).rejects.toThrow(AuthError.REGISTRATION_FAILED);
  });

  it('register throws username-taken key on 409', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
    });

    await expect(
      authService.register({
        username: 'taken',
        password: 'pw',
        email: 'taken@example.com',
        pnr: '19900101-1234',
      })
    ).rejects.toThrow(AuthError.USERNAME_TAKEN);
  });

  it('register throws server-error on network failure', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(
      authService.register({
        username: 'user',
        password: 'pw',
        email: 'user@example.com',
        pnr: '19900101-1234',
      })
    ).rejects.toThrow(AuthError.SERVER_ERROR);
  });

  // --- Register Recruiter Tests (Added) ---

  it('registerRecruiter sends correct request and returns message on success', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('Recruiter created successfully'),
    });

    const result = await authService.registerRecruiter({
      username: 'recruiter',
      password: 'pw',
      email: 'recruiter@example.com',
      pnr: '19900101-1234',
      secretCode: 'code123',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/register/recruiter'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'recruiter',
          password: 'pw',
          email: 'recruiter@example.com',
          pnr: '19900101-1234',
          secretCode: 'code123',
        }),
      }
    );

    expect(result).toBe('Recruiter created successfully');
  });

  it('registerRecruiter throws i18n key for 403 Forbidden (Invalid code)', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
    });

    await expect(
      authService.registerRecruiter({
        username: 'recruiter',
        password: 'pw',
        email: 'recruiter@example.com',
        pnr: '19900101-1234',
        secretCode: 'bad_code',
      })
    ).rejects.toThrow(AuthError.INVALID_SECRET_CODE);
  });

  it('registerRecruiter throws username-taken key for 409', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
    });

    await expect(
      authService.registerRecruiter({
        username: 'recruiter',
        password: 'pw',
        secretCode: 'code123',
      })
    ).rejects.toThrow(AuthError.USERNAME_TAKEN);
  });

  it('registerRecruiter throws registration-failed for other errors', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(
      authService.registerRecruiter({
        username: 'recruiter',
        password: 'pw',
        secretCode: 'code123',
      })
    ).rejects.toThrow(AuthError.REGISTRATION_FAILED);
  });

  it('registerRecruiter throws server-error on network failure', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(
      authService.registerRecruiter({
        username: 'recruiter',
        password: 'pw',
        secretCode: 'code123',
      })
    ).rejects.toThrow(AuthError.SERVER_ERROR);
  });

  // --- Login Tests ---

  it('login returns token on success', async () => {
    const mockResponse = { token: 'jwt-token-123' };
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await authService.login({
      username: 'user',
      password: 'pw',
    });

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user', password: 'pw' }),
    });

    expect(result).toEqual(mockResponse);
  });

  it('login throws i18n key for 401 invalid credentials', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
    });

    await expect(
      authService.login({ username: 'user', password: 'wrong' })
    ).rejects.toThrow(AuthError.INVALID_CREDENTIALS);
  });

  it('login throws login-failed for other server errors', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(
      authService.login({ username: 'user', password: 'pw' })
    ).rejects.toThrow(AuthError.LOGIN_FAILED);
  });

  it('login throws server-error on network failure', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(
      authService.login({ username: 'user', password: 'pw' })
    ).rejects.toThrow(AuthError.SERVER_ERROR);
  });
  it('requestOldUserReset sends correct request and returns backend message', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('Reset instructions sent'),
    });

    const result = await authService.requestOldUserReset('test@mail.com');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/recruitment/migrated-user'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@mail.com' }),
      }
    );

    expect(result).toBe('Reset instructions sent');
  });

  it('requestOldUserReset returns generic message when request fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
    });

    const result = await authService.requestOldUserReset('test@mail.com');

    expect(result).toBe(AuthStatus.OLD_USER_RESET_MESSAGE);
  });
});