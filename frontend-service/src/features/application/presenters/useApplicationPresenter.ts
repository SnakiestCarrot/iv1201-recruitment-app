import {
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { applicationService } from '../../application/services/applicationService'; // Check this path matches your structure
import type {
  Competence,
  CompetenceProfileDTO,
  AvailabilityDTO,
  ApplicationCreateDTO,
  ApplicationStatus,
  ApplicationDetailDTO,
} from '../../application/types/applicationTypes'; // Check this path matches your structure
import { ApplicationSchema } from '../../../utils/validation';

/**
 * Custom React hook for managing job application form state and operations.
 * Handles fetching available competences, managing personal information,
 * adding/removing competences and availability periods, and submitting applications.
 */
export const useApplicationPresenter = () => {
  const [availableCompetences, setAvailableCompetences] = useState<
    Competence[]
  >([]);
  const [status, setStatus] = useState<ApplicationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);

  // NEW: State to hold validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    surname: '',
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
  const fetchCompetences = useCallback(async () => {
    const data = await applicationService.getCompetences();
    return data.filter(
      (item: Competence, index: number, self: Competence[]) =>
        index === self.findIndex((t) => t.competenceId === item.competenceId)
    );
  }, []);

  useEffect(() => {
    let alive = true;

    const loadInitialData = async () => {
      try {
        const uniqueCompetences = await fetchCompetences();
        if (!alive) return;
        setAvailableCompetences(uniqueCompetences);

        try {
          const existingApplication: ApplicationDetailDTO =
            await applicationService.getMyApplication();

          if (!alive) return;

          setPersonalInfo({
            name: existingApplication.name ?? '',
            surname: existingApplication.surname ?? '',
          });

          setAddedCompetences(
            existingApplication.competences?.map((c) => ({
              competenceId: c.competenceId,
              yearsOfExperience: c.yearsOfExperience,
              name: c.name,
            })) ?? []
          );

          setAddedAvailabilities(
            existingApplication.availabilities?.map((a) => ({
              fromDate: a.fromDate,
              toDate: a.toDate,
            })) ?? []
          );
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === 'APPLICATION_NOT_FOUND'
          ) {
            // No existing application is fine; keep defaults.
          } else {
            console.error('Failed to load existing application', error);
          }
        }
      } finally {
        if (alive) {
          setInitialLoadDone(true);
        }
      }
    };

    void loadInitialData();

    return () => {
      alive = false;
    };
  }, [fetchCompetences]);

  /**
   * Handles changes to personal information input fields.
   */
  const handleInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });

    if (errors[name]) {
      setErrors((prev) =>
        Object.fromEntries(Object.entries(prev).filter(([key]) => key !== name))
      );
    }
  };

  /**
   * Adds a competence with years of experience to the application.
   */
  const addCompetence = () => {
    if (!currentCompetenceId || !currentYoe) return;

    const yoe = parseFloat(currentYoe);
    if (yoe < 0) {
      setErrors((prev) => ({ ...prev, yearsOfExperience: 'validation.experience-negative' }));
      return;
    }
    setErrors((prev) => {
      const { yearsOfExperience, ...rest } = prev;
      return rest;
    });

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
   */
  const removeCompetence = (index: number) => {
    setAddedCompetences((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Adds an availability period to the application.
   */
  const addAvailability = () => {
    if (!currentFromDate || !currentToDate) return;

    if (currentFromDate >= currentToDate) {
      setErrors((prev) => ({ ...prev, dateRange: 'validation.date-range-invalid' }));
      return;
    }
    setErrors((prev) => {
      const { dateRange, ...rest } = prev;
      return rest;
    });

    setAddedAvailabilities((prev) => [
      ...prev,
      { fromDate: currentFromDate, toDate: currentToDate },
    ]);

    setCurrentFromDate('');
    setCurrentToDate('');
  };

  /**
   * Removes an availability period from the application at the specified index.
   */
  const removeAvailability = (index: number) => {
    setAddedAvailabilities((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Submits the complete job application to the server.
   * NOW INCLUDES FRONTEND VALIDATION.
   */
  const submitApplication = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Zod Validation
    const validationResult = ApplicationSchema.safeParse(personalInfo);

    if (!validationResult.success) {
      // Transform Zod array into a simple object { field: message }
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        formattedErrors[fieldName] = issue.message;
      });
      setErrors(formattedErrors);
      // Stop execution here so we don't call the API
      return;
    }

    // 2. Clear errors if validation passed
    setErrors({});
    setStatus('loading');
    setErrorMessage('');

    const payload: ApplicationCreateDTO = {
      ...personalInfo,
      competences: addedCompetences,
      availabilities: addedAvailabilities,
    };

    try {
      await applicationService.updateMyApplication(payload);
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
    initialLoadDone,
    errors,
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
