import type { ApplicationSummary, ApplicationDetail } from '../types/recruiterTypes';

/**
 * Base URL for recruitment API endpoints.
 * Uses VITE_API_URL environment variable if set, otherwise defaults to localhost.
 */
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/recruitment`
  : 'http://localhost:8080/api/recruitment';

/**
 * Service for recruiter application management operations.
 * Provides methods for listing applications, viewing details, and updating status.
 */
export const recruiterService = {
  /**
   * Fetches all recruitment applications as summaries.
   * Requires authentication via Bearer token stored in localStorage.
   *
   * @returns A promise that resolves to an array of application summaries.
   * @throws {Error} If the request fails or returns a non-OK status.
   */
  async getAllApplications(): Promise<ApplicationSummary[]> {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${BASE_URL}/applications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch applications: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Fetches the full details of a specific application by person ID.
   * Requires authentication via Bearer token stored in localStorage.
   *
   * @param id - The person ID of the application to retrieve.
   * @returns A promise that resolves to the application detail.
   * @throws {Error} If the request fails or returns a non-OK status.
   */
  async getApplicationById(id: number): Promise<ApplicationDetail> {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${BASE_URL}/applications/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch application: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Updates the status of a specific application.
   * Requires authentication via Bearer token stored in localStorage.
   *
   * @param id - The person ID of the application to update.
   * @param status - The new status (UNHANDLED, ACCEPTED, or REJECTED).
   * @returns A promise that resolves when the status is successfully updated.
   * @throws {Error} If the request fails or returns a non-OK status.
   */
  async updateApplicationStatus(id: number, status: string): Promise<void> {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${BASE_URL}/applications/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update application status');
    }
  },
};
