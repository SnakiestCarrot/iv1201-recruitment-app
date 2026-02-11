import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useApplicationDetailPresenter } from '../presenters/useApplicationDetailPresenter';
import { recruiterService } from '../services/recruiterService';

vi.mock('../services/recruiterService');

const mockApplication = {
  personID: 1,
  name: 'John',
  surname: 'Doe',
  email: 'john@example.com',
  pnr: '19900101-1234',
  status: 'UNHANDLED',
  version: 0,
  competences: [{ competenceId: 1, name: 'Java', yearsOfExperience: 3 }],
  availabilities: [{ fromDate: '2026-06-01', toDate: '2026-08-31' }],
};

describe('useApplicationDetailPresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads application details on mount', async () => {
    (recruiterService.getApplicationById as any).mockResolvedValue(mockApplication);

    const { result } = renderHook(() => useApplicationDetailPresenter(1));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.application).toEqual(mockApplication);
    expect(result.current.error).toBe('');
  });

  it('handles fetch error', async () => {
    (recruiterService.getApplicationById as any).mockRejectedValue(
      new Error('Not found')
    );

    const { result } = renderHook(() => useApplicationDetailPresenter(999));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Not found');
    expect(result.current.application).toBeNull();
  });

  it('updates status successfully and increments version', async () => {
    (recruiterService.getApplicationById as any).mockResolvedValue(mockApplication);
    (recruiterService.updateApplicationStatus as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useApplicationDetailPresenter(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateStatus('ACCEPTED');
    });

    expect(recruiterService.updateApplicationStatus).toHaveBeenCalledWith(1, 'ACCEPTED', 0);
    expect(result.current.application?.status).toBe('ACCEPTED');
    expect(result.current.application?.version).toBe(1);
    expect(result.current.updateSuccess).toBe(true);
    expect(result.current.updateError).toBe('');
    expect(result.current.isConflict).toBe(false);
  });

  it('handles status update error', async () => {
    (recruiterService.getApplicationById as any).mockResolvedValue(mockApplication);
    (recruiterService.updateApplicationStatus as any).mockRejectedValue(
      new Error('Update failed')
    );

    const { result } = renderHook(() => useApplicationDetailPresenter(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateStatus('INVALID');
    });

    expect(result.current.updateError).toBe('Update failed');
    expect(result.current.updateSuccess).toBe(false);
    expect(result.current.isConflict).toBe(false);
  });

  it('handles version conflict by re-fetching application', async () => {
    const updatedApplication = { ...mockApplication, status: 'REJECTED', version: 1 };
    (recruiterService.getApplicationById as any)
      .mockResolvedValueOnce(mockApplication)
      .mockResolvedValueOnce(updatedApplication);
    (recruiterService.updateApplicationStatus as any).mockRejectedValue(
      new Error('CONFLICT')
    );

    const { result } = renderHook(() => useApplicationDetailPresenter(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateStatus('ACCEPTED');
    });

    expect(result.current.isConflict).toBe(true);
    expect(result.current.updateError).toBe('CONFLICT');
    expect(result.current.application?.status).toBe('REJECTED');
    expect(result.current.application?.version).toBe(1);
  });
});
