import { renderHook, act, waitFor } from '@testing-library/react';
import { useApplicationPresenter } from '../presenters/useApplicationPresenter';
import { applicationService } from '../services/applicationService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../services/applicationService', () => ({
  applicationService: {
    getCompetences: vi.fn(),
    getMyApplication: vi.fn().mockRejectedValue(new Error('APPLICATION_NOT_FOUND')),
    updateMyApplication: vi.fn().mockResolvedValue({ status: 'success' }),
  },
}));

describe('useApplicationPresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates personal info when handleInfoChange is called', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);
    const { result } = renderHook(() => useApplicationPresenter());
    await waitFor(() => expect(result.current.initialLoadDone).toBe(true));

    act(() => {
      result.current.handleInfoChange({ target: { name: 'name', value: 'John' } } as any);
    });
    expect(result.current.personalInfo.name).toBe('John');
  });

  it('adds a competence when addCompetence is called', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([{ competenceId: 1, name: 'JavaScript' }]);
    const { result } = renderHook(() => useApplicationPresenter());
    await waitFor(() => expect(result.current.initialLoadDone).toBe(true));

    act(() => {
      result.current.setCurrentCompetenceId('1');
      result.current.setCurrentYoe('3.5');
    });
    act(() => {
      result.current.addCompetence();
    });

    expect(result.current.addedCompetences).toHaveLength(1);
  });

  it('removes a competence by index', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([
      { competenceId: 1, name: 'JavaScript' },
      { competenceId: 2, name: 'Python' },
    ]);
    const { result } = renderHook(() => useApplicationPresenter());
    await waitFor(() => expect(result.current.initialLoadDone).toBe(true));

    act(() => {
      result.current.setCurrentCompetenceId('1');
      result.current.setCurrentYoe('3');
    });
    act(() => { result.current.addCompetence(); });

    act(() => {
      result.current.setCurrentCompetenceId('2');
      result.current.setCurrentYoe('2');
    });
    act(() => { result.current.addCompetence(); });

    expect(result.current.addedCompetences).toHaveLength(2);

    act(() => {
      result.current.removeCompetence(0);
    });

    expect(result.current.addedCompetences).toHaveLength(1);
  });

  it('adds an availability when addAvailability is called', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);
    const { result } = renderHook(() => useApplicationPresenter());
    await waitFor(() => expect(result.current.initialLoadDone).toBe(true));

    act(() => {
      result.current.setCurrentFromDate('2026-03-01');
      result.current.setCurrentToDate('2026-06-01');
    });
    act(() => {
      result.current.addAvailability();
    });

    expect(result.current.addedAvailabilities).toHaveLength(1);
  });

  it('removes an availability by index', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);
    const { result } = renderHook(() => useApplicationPresenter());
    await waitFor(() => expect(result.current.initialLoadDone).toBe(true));

    act(() => {
      result.current.setCurrentFromDate('2026-03-01');
      result.current.setCurrentToDate('2026-06-01');
    });
    act(() => { result.current.addAvailability(); });

    act(() => {
      result.current.setCurrentFromDate('2026-07-01');
      result.current.setCurrentToDate('2026-09-01');
    });
    act(() => { result.current.addAvailability(); });

    expect(result.current.addedAvailabilities).toHaveLength(2);

    act(() => {
      result.current.removeAvailability(0);
    });

    expect(result.current.addedAvailabilities).toHaveLength(1);
  });

  it('submits application successfully', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([
      { competenceId: 1, name: 'JavaScript' },
    ]);
    (applicationService.updateMyApplication as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useApplicationPresenter());
    await waitFor(() => expect(result.current.initialLoadDone).toBe(true));

    act(() => {
      result.current.handleInfoChange({ target: { name: 'name', value: 'John' } } as any);
    });
    act(() => {
      result.current.handleInfoChange({ target: { name: 'surname', value: 'Doe' } } as any);
    });

    act(() => {
      result.current.setCurrentCompetenceId('1');
      result.current.setCurrentYoe('5');
    });
    act(() => { result.current.addCompetence(); });

    act(() => {
      result.current.setCurrentFromDate('2026-03-01');
      result.current.setCurrentToDate('2026-06-01');
    });
    act(() => { result.current.addAvailability(); });

    await act(async () => {
      await result.current.submitApplication({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.status).toBe('success');
    expect(applicationService.updateMyApplication).toHaveBeenCalled();
  });

  it('sets status to loading during submission', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);
    (applicationService.updateMyApplication as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useApplicationPresenter());
    await waitFor(() => expect(result.current.initialLoadDone).toBe(true));

    act(() => {
      result.current.handleInfoChange({ target: { name: 'name', value: 'John' } } as any);
    });
    act(() => {
      result.current.handleInfoChange({ target: { name: 'surname', value: 'Doe' } } as any);
    });

    act(() => {
      result.current.submitApplication({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.status).toBe('loading');
  });

  it('handles application submission error', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);
    (applicationService.updateMyApplication as any).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useApplicationPresenter());
    await waitFor(() => expect(result.current.initialLoadDone).toBe(true));

    act(() => {
      result.current.handleInfoChange({ target: { name: 'name', value: 'John' } } as any);
    });
    act(() => {
      result.current.handleInfoChange({ target: { name: 'surname', value: 'Doe' } } as any);
    });

    await act(async () => {
      await result.current.submitApplication({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe('Failed to submit application. Please try again.');
  });
});