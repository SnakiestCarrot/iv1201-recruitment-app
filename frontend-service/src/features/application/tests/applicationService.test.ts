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

    it('includes authorization header with token from localStorage', async () => {
      (localStorage.getItem as any).mockReturnValue('my-custom-token');

      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await applicationService.getCompetences();

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-custom-token',
          }),
        })
      );
    });
  });

  describe('submitApplication', () => {
    const mockApplicationData: ApplicationCreateDTO = {
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      pnr: '19900101-1234',
      competences: [
        { competenceId: 1, yearsOfExperience: 5, name: 'JavaScript' },
      ],
      availabilities: [
        { fromDate: '2026-03-01', toDate: '2026-06-01' },
      ],
    };

    it('submits application with auth token', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
      });

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

    it('throws error when submission fails with error text', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('Application already submitted'),
      });

      await expect(
        applicationService.submitApplication(mockApplicationData)
      ).rejects.toThrow('Application already submitted');
    });

    it('throws default error when submission fails without error text', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(''),
      });

      await expect(
        applicationService.submitApplication(mockApplicationData)
      ).rejects.toThrow('Failed to submit application');
    });

    it('includes authorization header with token from localStorage', async () => {
      (localStorage.getItem as any).mockReturnValue('another-token');

      fetchMock.mockResolvedValue({
        ok: true,
      });

      await applicationService.submitApplication(mockApplicationData);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer another-token',
          }),
        })
      );
    });

    it('sends correct JSON payload in request body', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
      });

      await applicationService.submitApplication(mockApplicationData);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(mockApplicationData),
        })
      );
    });
  });
});
