import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recruiterService } from '../services/recruiterService';

describe('recruiterService', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('test-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  describe('getAllApplications', () => {
    it('fetches all applications successfully', async () => {
      const mockData = [
        { personID: 1, fullName: 'John Doe', status: 'UNHANDLED' },
        { personID: 2, fullName: 'Jane Smith', status: 'ACCEPTED' },
      ];
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await recruiterService.getAllApplications();

      expect(result).toEqual(mockData);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/applications'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('throws an error when the request fails', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(recruiterService.getAllApplications()).rejects.toThrow(
        'Failed to fetch applications'
      );
    });
  });

  describe('getApplicationById', () => {
    it('fetches application details successfully', async () => {
      const mockData = {
        personID: 1,
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        pnr: '19900101-1234',
        status: 'UNHANDLED',
        competences: [{ competenceId: 1, name: 'Java', yearsOfExperience: 3 }],
        availabilities: [{ fromDate: '2026-06-01', toDate: '2026-08-31' }],
      };
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await recruiterService.getApplicationById(1);

      expect(result).toEqual(mockData);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/applications/1'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('throws an error when the application is not found', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(recruiterService.getApplicationById(999)).rejects.toThrow(
        'Failed to fetch application'
      );
    });
  });

  describe('updateApplicationStatus', () => {
    it('updates status successfully with version', async () => {
      fetchMock.mockResolvedValue({ ok: true });

      await recruiterService.updateApplicationStatus(1, 'ACCEPTED', 0);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/applications/1/status'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ status: 'ACCEPTED', version: 0 }),
        })
      );
    });

    it('throws CONFLICT error on 409 response', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 409,
      });

      await expect(
        recruiterService.updateApplicationStatus(1, 'ACCEPTED', 0)
      ).rejects.toThrow('CONFLICT');
    });

    it('throws an error when status update fails', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => 'Invalid status',
      });

      await expect(
        recruiterService.updateApplicationStatus(1, 'INVALID', 0)
      ).rejects.toThrow('Invalid status');
    });
  });
});
