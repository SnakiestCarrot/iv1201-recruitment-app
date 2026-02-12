import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApplicationPresenter } from '../presenters/useApplicationPresenter';
import '../styles/ApplicationForm.css';

/**
 * Job application form component.
 * Allows users to submit applications with personal information, competences, and availability periods.
 * Displays a success message upon successful submission.
 * Features include:
 * - Personal information fields (name, surname, email, personnummer)
 * - Dynamic addition/removal of competences with years of experience
 * - Dynamic addition/removal of availability periods
 * - Form validation and submission handling
 *
 * @returns The job application form component.
 */
export const ApplicationForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    availableCompetences,
    status,
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
  } = useApplicationPresenter();

  if (status === 'success') {
    return (
      <div className="application-success-container">
        <h2 className="application-success-title">
          {t('application.success-title')}
        </h2>
        <p className="application-success-text">
          {t('application.success-message')}
        </p>
      </div>
    );
  }

  return (
    <div className="application-container">
      <h2 className="application-title">{t('application.title')}</h2>

      <form onSubmit={submitApplication}>
        {/* Personal Information */}
        <section className="application-section">
          <h3 className="application-section-title">
            {t('application.personal-details')}
          </h3>
          <div className="application-grid">
            <input
              name="name"
              placeholder={t('application.name')}
              value={personalInfo.name}
              onChange={handleInfoChange}
              required
              className="application-input"
            />
            <input
              name="surname"
              placeholder={t('application.surname')}
              value={personalInfo.surname}
              onChange={handleInfoChange}
              required
              className="application-input"
            />
          </div>
        </section>

        {/* Competence Profile */}
        <section className="application-section">
          <h3 className="application-section-title">
            {t('application.competence-profile')}
          </h3>
          <div className="application-input-group">
            <select
              value={currentCompetenceId}
              onChange={(e) => setCurrentCompetenceId(e.target.value)}
              className="application-select"
            >
              <option value="">{t('application.select-competence')}</option>
              {availableCompetences.map((c) => (
                <option key={c.competenceId} value={c.competenceId}>
                  {t(`competence.${c.name}`)}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.1"
              placeholder={t('application.years-exp')}
              value={currentYoe}
              onChange={(e) => setCurrentYoe(e.target.value)}
              className="application-input application-input-small"
            />
            <button
              type="button"
              onClick={addCompetence}
              className="application-btn application-btn-add"
            >
              {t('application.add')}
            </button>
          </div>

          {addedCompetences.length > 0 ? (
            <ul className="application-list">
              {addedCompetences.map((item, idx) => (
                <li key={idx} className="application-list-item">
                  <span className="application-list-item-content">
                    <span className="application-list-item-label">
                      {t(`competence.${item.name}`)}
                    </span>
                    <span className="application-list-item-value">
                      {item.yearsOfExperience} {t('application.years-exp')}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCompetence(idx)}
                    className="application-btn-remove"
                  >
                    {t('application.remove')}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="application-empty-text">
              {t('application.no-competences')}
            </p>
          )}
        </section>

        {/* Availability */}
        <section className="application-section">
          <h3 className="application-section-title">
            {t('application.availability')}
          </h3>
          <div className="application-input-group">
            <div>
              <label className="application-label">
                {t('application.from')}
              </label>
              <input
                type="date"
                value={currentFromDate}
                onChange={(e) => setCurrentFromDate(e.target.value)}
                className="application-input"
              />
            </div>
            <div>
              <label className="application-label">{t('application.to')}</label>
              <input
                type="date"
                value={currentToDate}
                onChange={(e) => setCurrentToDate(e.target.value)}
                className="application-input"
              />
            </div>
            <button
              type="button"
              onClick={addAvailability}
              className="application-btn application-btn-add application-align-end"
            >
              {t('application.add')}
            </button>
          </div>

          {addedAvailabilities.length > 0 ? (
            <ul className="application-list">
              {addedAvailabilities.map((item, idx) => (
                <li key={idx} className="application-list-item">
                  <span>
                    {item.fromDate} → {item.toDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAvailability(idx)}
                    className="application-btn-remove"
                  >
                    {t('application.remove')}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="application-empty-text">
              {t('application.no-availability')}
            </p>
          )}
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="application-btn application-btn-submit"
        >
          {status === 'loading'
            ? t('application.submitting')
            : t('application.submit')}
        </button>

        {/* Error Message */}
        {status === 'error' && (
          <div className="application-error">
            {t('application.error-message')}
          </div>
        )}
      </form>
    </div>
  );
};
