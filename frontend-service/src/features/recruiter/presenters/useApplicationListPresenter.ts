import { useState, useEffect, useCallback, useMemo } from 'react';
import { recruiterService } from '../services/recruiterService';
import type { ApplicationSummary } from '../types/recruiterTypes';

/**
 * Presenter hook for the application list view.
 * Manages the state for fetching and displaying all recruitment applications,
 * including client-side filtering by status and name search.
 *
 * @returns An object containing the filtered applications list, filter state, loading state, error state, and a refetch function.
 */
export const useApplicationListPresenter = () => {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [nameSearch, setNameSearch] = useState('');

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

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus =
        statusFilter === 'ALL' || app.status === statusFilter;
      const matchesName =
        nameSearch === '' ||
        app.fullName.toLowerCase().includes(nameSearch.toLowerCase());
      return matchesStatus && matchesName;
    });
  }, [applications, statusFilter, nameSearch]);

  return {
    applications: filteredApplications,
    totalCount: applications.length,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    nameSearch,
    setNameSearch,
    refetch: fetchApplications,
  };
};
