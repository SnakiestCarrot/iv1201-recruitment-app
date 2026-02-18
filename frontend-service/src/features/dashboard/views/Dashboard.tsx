import { Link } from 'react-router-dom';
import { useDashboardPresenter } from '../presenters/useDashboardPresenter';
import { useTranslation } from 'react-i18next';
import '../styles/Dashboard.css';

/**
 * Dashboard component for authenticated users.
 * Displays user information including username and role ID.
 * Provides navigation to the job application form.
 * Automatically redirects to login if the user is not authenticated.
 *
 * @returns The dashboard component.
 */
export const Dashboard = () => {
  const { username, roleId } = useDashboardPresenter();
  const { t } = useTranslation();

  return (
    <div className="dashboard-container">
      <h1>
        {t('dash.title')}
        {username}!
      </h1>

      <p>
        {t('dash.role-id-sentence')}
        {roleId == 1 ? t('dash.recruiter') : t('dash.applicant')}
      </p>

      {roleId !== 1 && (
        <div className="dashboard-link-section">
          <Link to="/application" className="dashboard-link">
            {t('dash.apply-now')}
          </Link>
        </div>
      )}

      <div className="dashboard-status-box">
        <h3 className="dashboard-status-title">{t('dash.logged-in-state')}</h3>
      </div>
    </div>
  );
};
