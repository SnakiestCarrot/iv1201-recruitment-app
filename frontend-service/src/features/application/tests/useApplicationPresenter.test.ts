import { renderHook, act, waitFor } from '@testing-library/react';
import { useApplicationPresenter } from '../presenters/useApplicationPresenter';
import { applicationService } from '../services/applicationService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../services/applicationService', () => ({
  applicationService: {
    getCompetences: vi.fn(),
    submitApplication: vi.fn(),
  },
}));

describe('useApplicationPresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty state', () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);

    const { result } = renderHook(() => useApplicationPresenter());

    expect(result.current.status).toBe('idle');
    expect(result.current.personalInfo).toEqual({
      name: '',
      surname: '',
    });
    expect(result.current.addedCompetences).toEqual([]);
    expect(result.current.addedAvailabilities).toEqual([]);
  });

  it('loads competences on mount', async () => {
    const mockCompetences = [
      { competenceId: 1, name: 'JavaScript' },
      { competenceId: 2, name: 'Python' },
    ];

    (applicationService.getCompetences as any).mockResolvedValue(
      mockCompetences
    );

    const { result } = renderHook(() => useApplicationPresenter());

    await waitFor(() => {
      expect(result.current.availableCompetences).toEqual(mockCompetences);
    });

    expect(applicationService.getCompetences).toHaveBeenCalledTimes(1);
  });

  it('removes duplicate competences when loading', async () => {
    const mockCompetences = [
      { competenceId: 1, name: 'JavaScript' },
      { competenceId: 1, name: 'JavaScript' },
      { competenceId: 2, name: 'Python' },
    ];

    (applicationService.getCompetences as any).mockResolvedValue(
      mockCompetences
    );

    const { result } = renderHook(() => useApplicationPresenter());

    await waitFor(() => {
      expect(result.current.availableCompetences).toHaveLength(2);
    });
  });

  it('updates personal info when handleInfoChange is called', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);

    const { result } = renderHook(() => useApplicationPresenter());

    act(() => {
      result.current.handleInfoChange({
        target: { name: 'name', value: 'John' },
      } as any);
    });

    expect(result.current.personalInfo.name).toBe('John');

    act(() => {
      result.current.handleInfoChange({
        target: { name: 'surname', value: 'Doe' },
      } as any);
    });

    expect(result.current.personalInfo.surname).toBe('Doe');
  });

  it('adds a competence when addCompetence is called', async () => {
    const mockCompetences = [
      { competenceId: 1, name: 'JavaScript' },
      { competenceId: 2, name: 'Python' },
    ];

    (applicationService.getCompetences as any).mockResolvedValue(
      mockCompetences
    );

    const { result } = renderHook(() => useApplicationPresenter());

    await waitFor(() => {
      expect(result.current.availableCompetences).toHaveLength(2);
    });

    act(() => {
      result.current.setCurrentCompetenceId('1');
      result.current.setCurrentYoe('3.5');
    });

    act(() => {
      result.current.addCompetence();
    });

    expect(result.current.addedCompetences).toEqual([
      {
        competenceId: 1,
        yearsOfExperience: 3.5,
        name: 'JavaScript',
      },
    ]);

    expect(result.current.currentCompetenceId).toBe('');
    expect(result.current.currentYoe).toBe('');
  });

  it('does not add competence if id or yoe is missing', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);

    const { result } = renderHook(() => useApplicationPresenter());

    act(() => {
      result.current.setCurrentCompetenceId('1');
      result.current.setCurrentYoe('');
    });

    act(() => {
      result.current.addCompetence();
    });

    expect(result.current.addedCompetences).toEqual([]);
  });

  it('removes a competence by index', async () => {
    const mockCompetences = [
      { competenceId: 1, name: 'JavaScript' },
      { competenceId: 2, name: 'Python' },
    ];

    (applicationService.getCompetences as any).mockResolvedValue(
      mockCompetences
    );

    const { result } = renderHook(() => useApplicationPresenter());

    await waitFor(() => {
      expect(result.current.availableCompetences).toHaveLength(2);
    });

    act(() => {
      result.current.setCurrentCompetenceId('1');
      result.current.setCurrentYoe('3');
    });

    act(() => {
      result.current.addCompetence();
    });

    act(() => {
      result.current.setCurrentCompetenceId('2');
      result.current.setCurrentYoe('2');
    });

    act(() => {
      result.current.addCompetence();
    });

    expect(result.current.addedCompetences).toHaveLength(2);

    act(() => {
      result.current.removeCompetence(0);
    });

    expect(result.current.addedCompetences).toEqual([
      {
        competenceId: 2,
        yearsOfExperience: 2,
        name: 'Python',
      },
    ]);
  });

  it('adds an availability when addAvailability is called', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);

    const { result } = renderHook(() => useApplicationPresenter());

    act(() => {
      result.current.setCurrentFromDate('2026-03-01');
      result.current.setCurrentToDate('2026-06-01');
    });

    act(() => {
      result.current.addAvailability();
    });

    expect(result.current.addedAvailabilities).toEqual([
      {
        fromDate: '2026-03-01',
        toDate: '2026-06-01',
      },
    ]);

    expect(result.current.currentFromDate).toBe('');
    expect(result.current.currentToDate).toBe('');
  });

  it('does not add availability if dates are missing', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);

    const { result } = renderHook(() => useApplicationPresenter());

    act(() => {
      result.current.setCurrentFromDate('2026-03-01');
      result.current.setCurrentToDate('');
    });

    act(() => {
      result.current.addAvailability();
    });

    expect(result.current.addedAvailabilities).toEqual([]);
  });

  it('removes an availability by index', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);

    const { result } = renderHook(() => useApplicationPresenter());

    act(() => {
      result.current.setCurrentFromDate('2026-03-01');
      result.current.setCurrentToDate('2026-06-01');
    });

    act(() => {
      result.current.addAvailability();
    });

    act(() => {
      result.current.setCurrentFromDate('2026-07-01');
      result.current.setCurrentToDate('2026-09-01');
    });

    act(() => {
      result.current.addAvailability();
    });

    expect(result.current.addedAvailabilities).toHaveLength(2);

    act(() => {
      result.current.removeAvailability(0);
    });

    expect(result.current.addedAvailabilities).toEqual([
      {
        fromDate: '2026-07-01',
        toDate: '2026-09-01',
      },
    ]);
  });

  it('submits application successfully', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([
      { competenceId: 1, name: 'JavaScript' },
    ]);
    (applicationService.submitApplication as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useApplicationPresenter());

    await waitFor(() => {
      expect(result.current.availableCompetences).toHaveLength(1);
    });

    act(() => {
      result.current.handleInfoChange({
        target: { name: 'name', value: 'John' },
      } as any);
    });

    act(() => {
      result.current.handleInfoChange({
        target: { name: 'surname', value: 'Doe' },
      } as any);
    });

    act(() => {
      result.current.setCurrentCompetenceId('1');
      result.current.setCurrentYoe('5');
    });

    act(() => {
      result.current.addCompetence();
    });

    act(() => {
      result.current.setCurrentFromDate('2026-03-01');
      result.current.setCurrentToDate('2026-06-01');
    });

    act(() => {
      result.current.addAvailability();
    });

    await act(async () => {
      await result.current.submitApplication({
        preventDefault: vi.fn(),
      } as any);
    });

    expect(result.current.status).toBe('success');
    expect(applicationService.submitApplication).toHaveBeenCalledWith({
      name: 'John',
      surname: 'Doe',
      competences: [
        {
          competenceId: 1,
          yearsOfExperience: 5,
          name: 'JavaScript',
        },
      ],
      availabilities: [
        {
          fromDate: '2026-03-01',
          toDate: '2026-06-01',
        },
      ],
    });
  });

  it('sets status to loading during submission', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);
    (applicationService.submitApplication as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useApplicationPresenter());

    act(() => {
      result.current.handleInfoChange({ target: { name: 'name', value: 'John' } } as any);
    });
    act(() => {
      result.current.handleInfoChange({ target: { name: 'surname', value: 'Doe' } } as any);
    });

    act(() => {
      result.current.submitApplication({
        preventDefault: vi.fn(),
      } as any);
    });

    expect(result.current.status).toBe('loading');
  });

  it('rejects submission with invalid name characters', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);

    const { result } = renderHook(() => useApplicationPresenter());

    act(() => {
      result.current.handleInfoChange({ target: { name: 'name', value: 'John123' } } as any);
    });
    act(() => {
      result.current.handleInfoChange({ target: { name: 'surname', value: 'Doe' } } as any);
    });

    await act(async () => {
      await result.current.submitApplication({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.errors.name).toBe('validation.name-invalid-characters');
    expect(applicationService.submitApplication).not.toHaveBeenCalled();
  });

  it('rejects submission with invalid surname characters', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);

    const { result } = renderHook(() => useApplicationPresenter());

    act(() => {
      result.current.handleInfoChange({ target: { name: 'name', value: 'John' } } as any);
    });
    act(() => {
      result.current.handleInfoChange({ target: { name: 'surname', value: 'Doe456' } } as any);
    });

    await act(async () => {
      await result.current.submitApplication({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.errors.surname).toBe('validation.surname-invalid-characters');
    expect(applicationService.submitApplication).not.toHaveBeenCalled();
  });

  it('handles application submission error', async () => {
    (applicationService.getCompetences as any).mockResolvedValue([]);
    (applicationService.submitApplication as any).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useApplicationPresenter());

    act(() => {
      result.current.handleInfoChange({ target: { name: 'name', value: 'John' } } as any);
    });
    act(() => {
      result.current.handleInfoChange({ target: { name: 'surname', value: 'Doe' } } as any);
    });

    await act(async () => {
      await result.current.submitApplication({
        preventDefault: vi.fn(),
      } as any);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe(
      'Failed to submit application. Please try again.'
    );
  });
});
