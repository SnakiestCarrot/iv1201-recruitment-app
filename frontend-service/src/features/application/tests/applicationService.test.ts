import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { applicationService } from '../services/applicationService';
import type { Competence, ApplicationCreateDTO } from '../types/applicationTypes';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('applicationService', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'fake-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getCompetences', () => {
    it('fetches competences with auth token', async () => {
      const mockCompetences: Competence[] = [
        { competenceId: 1, name: 'JavaScript' },
        { competenceId: 2, name: 'Python' },
      ];

      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCompetences),
      });

      const result = await applicationService.getCompetences();

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/competences'),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token',
          },
        }
      );

      expect(result).toEqual(mockCompetences);
    });

    it('throws error when fetch fails', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(applicationService.getCompetences()).rejects.toThrow(
        'Failed to fetch competences: 500 Internal Server Error'
      );
    });
  });

  describe('getMyApplication', () => {
    it('fetches my application details', async () => {
      const mockAppDetails = { name: 'John', surname: 'Doe' };
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockAppDetails),
      });

      const result = await applicationService.getMyApplication();

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/applications/me'),
        {
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-token',
          }),
        }
      );
      expect(result).toEqual(mockAppDetails);
    });

    it('throws specific error on 404', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(applicationService.getMyApplication()).rejects.toThrow('APPLICATION_NOT_FOUND');
    });
  });

  describe('updateMyApplication', () => {
    const mockApplicationData: ApplicationCreateDTO = {
      name: 'John',
      surname: 'Doe',
      competences: [],
      availabilities: [],
    };

    it('updates application using PUT', async () => {
      fetchMock.mockResolvedValue({ ok: true });

      await applicationService.updateMyApplication(mockApplicationData);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/applications/me'),
        {
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token',
          }),
          body: JSON.stringify(mockApplicationData),
        }
      );
    });

    it('throws error when update fails', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('Update failed'),
      });

      await expect(applicationService.updateMyApplication(mockApplicationData))
        .rejects.toThrow('Update failed');
    });
  });
});