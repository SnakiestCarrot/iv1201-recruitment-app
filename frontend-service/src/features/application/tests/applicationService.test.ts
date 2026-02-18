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

  describe('submitApplication', () => {
    const mockApplicationData: ApplicationCreateDTO = {
      name: 'John',
      surname: 'Doe',
      competences: [{ competenceId: 1, yearsOfExperience: 3 }],
      availabilities: [{ fromDate: '2026-06-01', toDate: '2026-08-31' }],
    };

    it('submits application with auth token', async () => {
      fetchMock.mockResolvedValue({ ok: true });

      await applicationService.submitApplication(mockApplicationData);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/applications'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token',
          },
          body: JSON.stringify(mockApplicationData),
        }
      );
    });

    it('throws error with server message on failure', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('Duplicate application'),
      });

      await expect(
        applicationService.submitApplication(mockApplicationData)
      ).rejects.toThrow('Duplicate application');
    });

    it('throws fallback error when server returns empty text', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(''),
      });

      await expect(
        applicationService.submitApplication(mockApplicationData)
      ).rejects.toThrow('Failed to submit application');
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

    it('throws error with server message on non-404 failure', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal server error'),
      });

      await expect(applicationService.getMyApplication()).rejects.toThrow(
        'Internal server error'
      );
    });

    it('throws fallback error when server returns empty text on non-404 failure', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(''),
      });

      await expect(applicationService.getMyApplication()).rejects.toThrow(
        'Failed to load application'
      );
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