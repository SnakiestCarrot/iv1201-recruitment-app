import {
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { applicationService } from '../services/applicationService';
import type {
  Competence,
  CompetenceProfileDTO,
  AvailabilityDTO,
  ApplicationCreateDTO,
  ApplicationStatus,
} from '../types/applicationTypes';

/**
 * Custom React hook for managing job application form state and operations.
 * Handles fetching available competences, managing personal information,
 * adding/removing competences and availability periods, and submitting applications.
 *
 * @returns An object containing:
 * - State variables for competences, status, personal info, and form inputs
 * - Setter functions for form inputs
 * - Handler functions for managing competences and availabilities
 * - Submit function for the application
 */
export const useApplicationPresenter = () => {
  const [availableCompetences, setAvailableCompetences] = useState<
    Competence[]
  >([]);
  const [status, setStatus] = useState<ApplicationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    surname: '',
    email: '',
    pnr: '',
  });

  const [addedCompetences, setAddedCompetences] = useState<
    CompetenceProfileDTO[]
  >([]);
  const [addedAvailabilities, setAddedAvailabilities] = useState<
    AvailabilityDTO[]
  >([]);

  const [currentCompetenceId, setCurrentCompetenceId] = useState<string>('');
  const [currentYoe, setCurrentYoe] = useState<string>('');
  const [currentFromDate, setCurrentFromDate] = useState<string>('');
  const [currentToDate, setCurrentToDate] = useState<string>('');

  /**
   * Loads available competences from the server.
   * Filters out duplicates based on competenceId.
   */
  const loadCompetences = useCallback(async () => {
    try {
      const data = await applicationService.getCompetences();
      const uniqueData = data.filter(
        (item: Competence, index: number, self: Competence[]) =>
          index === self.findIndex((t) => t.competenceId === item.competenceId)
      );

      setAvailableCompetences(uniqueData);
    } catch (error) {
      console.error('Failed to load competences', error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCompetences();
  }, [loadCompetences]);

  /**
   * Handles changes to personal information input fields.
   *
   * @param e - The change event from an input element.
   */
  const handleInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  /**
   * Adds a competence with years of experience to the application.
   * Validates that both competenceId and years of experience are provided.
   * Clears the current input fields after adding.
   */
  const addCompetence = () => {
    if (!currentCompetenceId || !currentYoe) return;

    const compId = parseInt(currentCompetenceId);
    const compName = availableCompetences.find(
      (c) => c.competenceId === compId
    )?.name;

    setAddedCompetences((prev) => [
      ...prev,
      {
        competenceId: compId,
        yearsOfExperience: parseFloat(currentYoe),
        name: compName,
      },
    ]);

    setCurrentCompetenceId('');
    setCurrentYoe('');
  };

  /**
   * Removes a competence from the application at the specified index.
   *
   * @param index - The index of the competence to remove.
   */
  const removeCompetence = (index: number) => {
    setAddedCompetences((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Adds an availability period to the application.
   * Validates that both from date and to date are provided.
   * Clears the current date input fields after adding.
   */
  const addAvailability = () => {
    if (!currentFromDate || !currentToDate) return;

    setAddedAvailabilities((prev) => [
      ...prev,
      { fromDate: currentFromDate, toDate: currentToDate },
    ]);

    setCurrentFromDate('');
    setCurrentToDate('');
  };

  /**
   * Removes an availability period from the application at the specified index.
   *
   * @param index - The index of the availability period to remove.
   */
  const removeAvailability = (index: number) => {
    setAddedAvailabilities((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Submits the complete job application to the server.
   * Combines personal information, competences, and availabilities into a single payload.
   * Updates status to loading, success, or error based on the result.
   *
   * @param e - The form submit event.
   */
  const submitApplication = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const payload: ApplicationCreateDTO = {
      ...personalInfo,
      competences: addedCompetences,
      availabilities: addedAvailabilities,
    };

    try {
      await applicationService.submitApplication(payload);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage('Failed to submit application. Please try again.');
    }
  };

  return {
    availableCompetences,
    status,
    errorMessage,
    personalInfo,
    addedCompetences,
    addedAvailabilities,
    currentCompetenceId,
    currentYoe,
    currentFromDate,
    currentToDate,

    setCurrentCompetenceId,
    setCurrentYoe,
    setCurrentFromDate,
    setCurrentToDate,

    handleInfoChange,
    addCompetence,
    removeCompetence,
    addAvailability,
    removeAvailability,
    submitApplication,
  };
};
