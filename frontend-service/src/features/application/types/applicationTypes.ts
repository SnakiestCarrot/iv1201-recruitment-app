/**
 * Represents a competence (skill) available in the system.
 */
export interface Competence {
  /** The unique identifier for the competence. */
  competenceId: number;
  /** The name of the competence. */
  name: string;
}

/**
 * Represents a period of availability for a job application.
 */
export interface AvailabilityDTO {
  /** The start date of the availability period (ISO date string). */
  fromDate: string;
  /** The end date of the availability period (ISO date string). */
  toDate: string;
}

/**
 * Represents a competence with years of experience for an application.
 */
export interface CompetenceProfileDTO {
  /** The unique identifier for the competence. */
  competenceId: number;
  /** The number of years of experience with this competence. */
  yearsOfExperience: number;
  /** Optional: The name of the competence (for display purposes). */
  name?: string;
}

/**
 * Represents the complete data transfer object for creating a job application.
 */
export interface ApplicationCreateDTO {
  /** The applicant's first name. */
  name: string;
  /** The applicant's last name. */
  surname: string;
  /** Array of competences with years of experience. */
  competences: CompetenceProfileDTO[];
  /** Array of availability periods. */
  availabilities: AvailabilityDTO[];
}

/**
 * Represents the full application details as returned by the backend.
 * This mirrors ApplicationDetailDTO on the recruitment-service side.
 */
export interface ApplicationDetailDTO {
  personID: number;
  name: string;
  surname: string;
  email: string;
  pnr: string;
  status: string;
  version: number;
  competences: CompetenceProfileDTO[];
  availabilities: AvailabilityDTO[];
}

/**
 * Represents the status of an application submission operation.
 */
export type ApplicationStatus = 'idle' | 'loading' | 'success' | 'error';
