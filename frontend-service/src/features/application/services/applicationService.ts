import type {
  Competence,
  ApplicationCreateDTO,
} from '../types/applicationTypes';

/**
 * Base URL for recruitment application API endpoints.
 * Uses VITE_API_URL environment variable if set, otherwise defaults to localhost.
 */
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/recruitment`
  : 'http://localhost:8080/api/recruitment';

/**
 * Service for handling recruitment application operations.
 * Provides methods for fetching competences and submitting job applications.
 */
export const applicationService = {
  /**
   * Fetches the list of available competences (skills) from the server.
   * Requires authentication via Bearer token stored in localStorage.
   *
   * @returns A promise that resolves to an array of available competences.
   * @throws {Error} If the request fails or returns a non-OK status.
   */
  async getCompetences(): Promise<Competence[]> {
    const token = localStorage.getItem('authToken'); // Matches your Presenter

    const response = await fetch(`${BASE_URL}/competences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Manually attach the token
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch competences: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Submits a complete job application with competences and availability periods.
   * Requires authentication via Bearer token stored in localStorage.
   *
   * @param data - The application data including personal info, competences, and availabilities.
   * @returns A promise that resolves when the application is successfully submitted.
   * @throws {Error} If the submission fails or returns a non-OK status.
   */
  async submitApplication(data: ApplicationCreateDTO): Promise<void> {
    const token = localStorage.getItem('authToken'); // Matches your Presenter

    const response = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Manually attach the token
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to submit application');
    }
  },
};
