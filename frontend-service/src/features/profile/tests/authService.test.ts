import { describe, it, expect, vi, beforeEach } from 'vitest';
import { profileService } from '../services/profileService';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('profileService', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('fake-token'),
    });
  });

  it('sends correct PUT request on success', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(''),
    });

    await profileService.updateProfile({
      email: 'test@mail.com',
      pnr: '199001011234',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/profile'),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer fake-token',
        },
        body: JSON.stringify({
          email: 'test@mail.com',
          pnr: '199001011234',
        }),
      }
    );
  });

  it('throws error when backend returns error text', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Email already in use'),
    });

    await expect(
      profileService.updateProfile({ email: 'taken@mail.com' })
    ).rejects.toThrow('Email already in use');
  });

  it('throws default error if backend response is empty', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve(''),
    });

    await expect(
      profileService.updateProfile({ email: 'test@mail.com' })
    ).rejects.toThrow('Profile update failed');
  });
});
