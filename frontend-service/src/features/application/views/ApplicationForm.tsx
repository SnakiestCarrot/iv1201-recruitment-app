import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApplicationPresenter } from '../presenters/useApplicationPresenter';
import '../styles/ApplicationForm.css';

/**
 * Application form view for submitting job applications.
 * Allows applicants to enter personal info, competences, and availability periods.
 */
export const ApplicationForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    availableCompetences,
    status,
    errorMessage,
    initialLoadDone,
    personalInfo,
    addedCompetences,
    addedAvailabilities,
    currentCompetenceId,
    currentYoe,
    currentFromDate,
    currentToDate,
    errors,
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

  const unknownCompetenceLabel = 'Unknown competence';

  const getCompetenceNameById = (competenceId: number) =>
    availableCompetences.find((c) => c.competenceId === competenceId)?.name;

  const renderCompetenceLabel = (name?: string) =>
    name ? t(`competence.${name}`) : unknownCompetenceLabel;

  return (
    <div className="application-container">
      <h2 className="application-title">{t('application.title')}</h2>

      {!initialLoadDone && (
        <div className="application-loading">{t('application.loading')}</div>
      )}

      {initialLoadDone && status === 'success' && (
        <div className="application-success-container">
          <h3>{t('application.success-title')}</h3>
          <p>{t('application.success-message')}</p>
        </div>
      )}

      <form onSubmit={submitApplication} noValidate>
        {/* Personal Information */}
        <section className="application-section">
          <h3 className="application-section-title">
            {t('application.personal-details')}
          </h3>

          <div className="application-grid">
            {/* Name */}
            <div className="application-field-wrapper">
              <input
                name="name"
                placeholder={t('application.name')}
                value={personalInfo.name}
                onChange={handleInfoChange}
                className={`application-input ${
                  errors.name ? 'application-input-error' : ''
                }`}
              />
              {errors.name && (
                <span className="application-error-text">{t(errors.name)}</span>
              )}
            </div>

            {/* Surname */}
            <div className="application-field-wrapper">
              <input
                name="surname"
                placeholder={t('application.surname')}
                value={personalInfo.surname}
                onChange={handleInfoChange}
                className={`application-input ${
                  errors.surname ? 'application-input-error' : ''
                }`}
              />
              {errors.surname && (
                <span className="application-error-text">
                  {t(errors.surname)}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Competence Section */}
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
                  {renderCompetenceLabel(c.name)}
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

          {addedCompetences.length > 0 && (
            <ul className="application-list">
              {addedCompetences.map((item, idx) => {
                const nameFromLookup =
                  typeof item.competenceId === 'number'
                    ? getCompetenceNameById(item.competenceId)
                    : undefined;

                const label = nameFromLookup ?? item.name;

                return (
                  <li key={idx} className="application-list-item">
                    <span>
                      {renderCompetenceLabel(label)} - {item.yearsOfExperience}{' '}
                      {t('application.years-exp')}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCompetence(idx)}
                      className="application-btn-remove"
                    >
                      {t('application.remove')}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Availability Section */}
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

          {addedAvailabilities.length > 0 && (
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
          )}
        </section>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="application-btn application-btn-submit"
        >
          {status === 'loading'
            ? t('application.submitting')
            : t('application.submit')}
        </button>

        {status === 'error' && (
          <div className="application-error">
            {errorMessage ? t(errorMessage) : t('application.error-message')}
          </div>
        )}
      </form>
    </div>
  );
};
