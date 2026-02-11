import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApplicationDetailPresenter } from '../presenters/useApplicationDetailPresenter';
import '../styles/ApplicationDetail.css';

const STATUSES = ['UNHANDLED', 'ACCEPTED', 'REJECTED'] as const;

/**
 * Component that displays the full details of a recruitment application.
 * Allows recruiters to view applicant info and change the application status.
 *
 * @returns The application detail component.
 */
export const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    application,
    loading,
    error,
    updating,
    updateError,
    updateSuccess,
    isConflict,
    updateStatus,
  } = useApplicationDetailPresenter(Number(id));

  if (loading) {
    return <div className="recruiter-loading">{t('recruiter.loading')}</div>;
  }

  if (error || !application) {
    return <div className="recruiter-error">{t('recruiter.detail-error')}</div>;
  }

  return (
    <div className="recruiter-detail-container">
      <button
        className="recruiter-back-btn"
        onClick={() => navigate('/applications')}
      >
        {t('recruiter.back-to-list')}
      </button>

      <h1 className="recruiter-detail-title">{t('recruiter.detail-title')}</h1>

      <section className="recruiter-detail-section">
        <h2>{t('recruiter.personal-info')}</h2>
        <div className="recruiter-detail-grid">
          <div className="recruiter-detail-field">
            <span className="recruiter-detail-label">
              {t('application.name')}
            </span>
            <span className="recruiter-detail-value">{application.name}</span>
          </div>
          <div className="recruiter-detail-field">
            <span className="recruiter-detail-label">
              {t('application.surname')}
            </span>
            <span className="recruiter-detail-value">
              {application.surname}
            </span>
          </div>
          <div className="recruiter-detail-field">
            <span className="recruiter-detail-label">
              {t('application.email')}
            </span>
            <span className="recruiter-detail-value">{application.email}</span>
          </div>
          <div className="recruiter-detail-field">
            <span className="recruiter-detail-label">
              {t('application.pnr')}
            </span>
            <span className="recruiter-detail-value">{application.pnr}</span>
          </div>
        </div>
      </section>

      <section className="recruiter-detail-section">
        <h2>{t('recruiter.competences')}</h2>
        {application.competences.length === 0 ? (
          <p className="recruiter-empty">{t('application.no-competences')}</p>
        ) : (
          <ul className="recruiter-detail-list">
            {application.competences.map((comp) => (
              <li
                key={comp.competenceId}
                className="recruiter-detail-list-item"
              >
                <span className="recruiter-detail-comp-name">
                  {t(`competence.${comp.name}`)}
                </span>
                <span className="recruiter-detail-comp-years">
                  {comp.yearsOfExperience} {t('recruiter.years-exp')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="recruiter-detail-section">
        <h2>{t('recruiter.availability')}</h2>
        {application.availabilities.length === 0 ? (
          <p className="recruiter-empty">{t('application.no-availability')}</p>
        ) : (
          <ul className="recruiter-detail-list">
            {application.availabilities.map((avail, index) => (
              <li key={index} className="recruiter-detail-list-item">
                <span>{avail.fromDate}</span>
                <span className="recruiter-detail-separator"> — </span>
                <span>{avail.toDate}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="recruiter-detail-section">
        <h2>{t('recruiter.update-status')}</h2>
        <div className="recruiter-status-buttons">
          {STATUSES.map((status) => (
            <button
              key={status}
              className={`recruiter-status-btn recruiter-status-btn-${status.toLowerCase()} ${
                application.status === status
                  ? 'recruiter-status-btn-active'
                  : ''
              }`}
              onClick={() => updateStatus(status)}
              disabled={updating || application.status === status}
            >
              {t(`recruiter.${status.toLowerCase()}`)}
            </button>
          ))}
        </div>
        {isConflict && (
          <p className="recruiter-error-msg">
            {t('recruiter.status-conflict')}
          </p>
        )}
        {updateSuccess && (
          <p className="recruiter-success-msg">
            {t('recruiter.status-updated')}
          </p>
        )}
        {updateError && !isConflict && (
          <p className="recruiter-error-msg">
            {t('recruiter.status-update-error')}
          </p>
        )}
      </section>
    </div>
  );
};
