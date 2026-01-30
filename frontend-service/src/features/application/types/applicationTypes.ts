export interface Competence {
  competenceId: number;
  name: string;
}

export interface AvailabilityDTO {
  fromDate: string;
  toDate: string;
}

export interface CompetenceProfileDTO {
  competenceId: number;
  yearsOfExperience: number;
  name?: string;
}

export interface ApplicationCreateDTO {
  name: string;
  surname: string;
  email: string;
  pnr: string;
  competences: CompetenceProfileDTO[];
  availabilities: AvailabilityDTO[];
}

export type ApplicationStatus = 'idle' | 'loading' | 'success' | 'error';