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

  const handleInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

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

  const removeCompetence = (index: number) => {
    setAddedCompetences((prev) => prev.filter((_, i) => i !== index));
  };

  const addAvailability = () => {
    if (!currentFromDate || !currentToDate) return;

    setAddedAvailabilities((prev) => [
      ...prev,
      { fromDate: currentFromDate, toDate: currentToDate },
    ]);

    setCurrentFromDate('');
    setCurrentToDate('');
  };

  const removeAvailability = (index: number) => {
    setAddedAvailabilities((prev) => prev.filter((_, i) => i !== index));
  };

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
