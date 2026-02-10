import { useState, useEffect, useCallback } from 'react';
import { recruiterService } from '../services/recruiterService';
import type { ApplicationSummary } from '../types/recruiterTypes';

/**
 * Presenter hook for the application list view.
 * Manages the state for fetching and displaying all recruitment applications.
 *
 * @returns An object containing the applications list, loading state, error state, and a refetch function.
 */
export const useApplicationListPresenter = () => {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetches all applications from the server.
   */
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await recruiterService.getAllApplications();
      setApplications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load applications'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
};
