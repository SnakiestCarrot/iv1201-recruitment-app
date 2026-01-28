import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from '../services/authService';

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
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/register'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'new', password: 'pw' }),
      }
    );

    expect(result).toBe('User created successfully');
  });

  it('register throws error on failure', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Username already taken'),
    });

    await expect(
      authService.register({ username: 'taken', password: 'pw' })
    ).rejects.toThrow('Username already taken');
  });

  it('register throws default error if backend response is empty', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve(''),
    });

    await expect(
      authService.register({ username: 'user', password: 'pw' })
    ).rejects.toThrow('Registration failed');
  });

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

  it('login throws specific error for invalid credentials', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Invalid credentials provided'),
    });

    await expect(
      authService.login({ username: 'user', password: 'wrong' })
    ).rejects.toThrow('Invalid username or password');
  });

  it('login throws generic error for other failures', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Database connection failed'),
    });

    await expect(
      authService.login({ username: 'user', password: 'pw' })
    ).rejects.toThrow('Database connection failed');
  });
});
