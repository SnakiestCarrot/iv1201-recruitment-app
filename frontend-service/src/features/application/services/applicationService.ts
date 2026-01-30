import type {
  Competence,
  ApplicationCreateDTO,
} from '../types/applicationTypes';

// Define base URL. If VITE_API_URL is set (e.g., http://localhost:8080), we use it.
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/recruitment`
  : 'http://localhost:8080/api/recruitment';

export const applicationService = {
  /**
   * Fetches the list of available competences (skills).
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
   * Submits the full application form.
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
