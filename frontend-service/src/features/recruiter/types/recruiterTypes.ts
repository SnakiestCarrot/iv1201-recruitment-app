/**
 * Represents a summary of a recruitment application for list display.
 */
export interface ApplicationSummary {
  /** The person ID of the applicant. */
  personID: number;
  /** The full name of the applicant. */
  fullName: string;
  /** The current status of the application (UNHANDLED, ACCEPTED, REJECTED). */
  status: string;
}

/**
 * Represents a competence entry with years of experience.
 */
export interface CompetenceEntry {
  /** The unique identifier for the competence. */
  competenceId: number;
  /** The name of the competence. */
  name: string;
  /** The number of years of experience. */
  yearsOfExperience: number;
}

/**
 * Represents a period of availability.
 */
export interface AvailabilityEntry {
  /** The start date of the availability period (ISO date string). */
  fromDate: string;
  /** The end date of the availability period (ISO date string). */
  toDate: string;
}

/**
 * Represents the full details of a recruitment application.
 */
export interface ApplicationDetail {
  /** The person ID of the applicant. */
  personID: number;
  /** The applicant's first name. */
  name: string;
  /** The applicant's last name. */
  surname: string;
  /** The applicant's email address. */
  email: string;
  /** The applicant's personal number. */
  pnr: string;
  /** The current status of the application (UNHANDLED, ACCEPTED, REJECTED). */
  status: string;
  /** Version number for optimistic locking. */
  version: number;
  /** Array of competences with years of experience. */
  competences: CompetenceEntry[];
  /** Array of availability periods. */
  availabilities: AvailabilityEntry[];
}
