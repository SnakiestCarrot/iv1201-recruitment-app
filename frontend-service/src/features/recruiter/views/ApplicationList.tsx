import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApplicationListPresenter } from '../presenters/useApplicationListPresenter';
import '../styles/ApplicationList.css';

/**
 * Component that displays all recruitment applications in a table.
 * Allows recruiters to click on an application to view its details.
 *
 * @returns The application list component.
 */
export const ApplicationList = () => {
  const { applications, loading, error } = useApplicationListPresenter();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (loading) {
    return <div className="recruiter-loading">{t('recruiter.loading')}</div>;
  }

  if (error) {
    return <div className="recruiter-error">{t('recruiter.error')}</div>;
  }

  return (
    <div className="recruiter-list-container">
      <h1 className="recruiter-list-title">{t('recruiter.applications-title')}</h1>

      {applications.length === 0 ? (
        <p className="recruiter-empty">{t('recruiter.no-applications')}</p>
      ) : (
        <table className="recruiter-table">
          <thead>
            <tr>
              <th>{t('recruiter.name')}</th>
              <th>{t('recruiter.status')}</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.personID}
                className="recruiter-table-row"
                onClick={() => navigate(`/applications/${app.personID}`)}
              >
                <td>{app.fullName}</td>
                <td>
                  <span className={`recruiter-status recruiter-status-${app.status.toLowerCase()}`}>
                    {t(`recruiter.${app.status.toLowerCase()}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
