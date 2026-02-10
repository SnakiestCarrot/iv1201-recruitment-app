import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApplicationListPresenter } from '../presenters/useApplicationListPresenter';
import { recruiterService } from '../services/recruiterService';

vi.mock('../services/recruiterService');

describe('useApplicationListPresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads applications on mount', async () => {
    const mockApps = [
      { personID: 1, fullName: 'John Doe', status: 'UNHANDLED' },
      { personID: 2, fullName: 'Jane Smith', status: 'ACCEPTED' },
    ];
    (recruiterService.getAllApplications as any).mockResolvedValue(mockApps);

    const { result } = renderHook(() => useApplicationListPresenter());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.applications).toEqual(mockApps);
    expect(result.current.error).toBe('');
  });

  it('handles fetch error', async () => {
    (recruiterService.getAllApplications as any).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useApplicationListPresenter());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.applications).toEqual([]);
  });

  it('returns empty array when no applications exist', async () => {
    (recruiterService.getAllApplications as any).mockResolvedValue([]);

    const { result } = renderHook(() => useApplicationListPresenter());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.applications).toEqual([]);
  });
});
