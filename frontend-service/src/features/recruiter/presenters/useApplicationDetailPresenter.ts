import { useState, useEffect, useCallback } from 'react';
import { recruiterService } from '../services/recruiterService';
import type { ApplicationDetail } from '../types/recruiterTypes';

/**
 * Presenter hook for the application detail view.
 * Manages the state for fetching application details and updating the application status.
 * Supports optimistic locking: detects concurrent modifications and re-fetches on conflict.
 *
 * @param id - The person ID of the application to display.
 * @returns An object containing the application detail, loading/error states, and a status update handler.
 */
export const useApplicationDetailPresenter = (id: number) => {
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isConflict, setIsConflict] = useState(false);

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await recruiterService.getApplicationById(id);
      setApplication(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load application'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  /**
   * Updates the status of the current application.
   * Sends the current version for optimistic locking.
   * On conflict (409), re-fetches the application to show the latest state.
   *
   * @param newStatus - The new status to set (UNHANDLED, ACCEPTED, or REJECTED).
   */
  const updateStatus = useCallback(
    async (newStatus: string) => {
      if (!application) return;

      setUpdating(true);
      setUpdateError('');
      setUpdateSuccess(false);
      setIsConflict(false);
      try {
        await recruiterService.updateApplicationStatus(
          id,
          newStatus,
          application.version
        );
        setApplication({
          ...application,
          status: newStatus,
          version: application.version + 1,
        });
        setUpdateSuccess(true);
      } catch (err) {
        if (err instanceof Error && err.message === 'CONFLICT') {
          setIsConflict(true);
          setUpdateError('CONFLICT');
          const freshData = await recruiterService.getApplicationById(id);
          setApplication(freshData);
        } else {
          setUpdateError(
            err instanceof Error ? err.message : 'Failed to update status'
          );
        }
      } finally {
        setUpdating(false);
      }
    },
    [id, application]
  );

  return {
    application,
    loading,
    error,
    updating,
    updateError,
    updateSuccess,
    isConflict,
    updateStatus,
  };
};
