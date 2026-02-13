import { useState } from 'react';
import { useProfilePresenter } from '../presenters/useProfilePresenter';
import { useTranslation } from 'react-i18next';
import '../styles/ProfileView.css';

/**
 * Profile view component allowing authenticated users
 * to update their email and personal number (pnr).
 */
export const ProfileView = () => {
  const { state, validationErrors, clearError, updateProfile } =
    useProfilePresenter();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [pnr, setPnr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      email: email.trim() || undefined,
      pnr: pnr.trim() || undefined,
    });
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">{t('profile.title')}</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="email">{t('profile.email')}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationErrors.email) clearError('email');
            }}
            className={`profile-input ${validationErrors.email ? 'register-input-error' : ''}`}
            placeholder={t('profile.email-placeholder')}
          />
          {validationErrors.email && (
            <p className="status-msg error">{t(validationErrors.email)}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="pnr">{t('profile.pnr')}</label>
          <input
            id="pnr"
            type="text"
            value={pnr}
            onChange={(e) => {
              setPnr(e.target.value);
              if (validationErrors.pnr) clearError('pnr');
            }}
            className={`profile-input ${validationErrors.pnr ? 'register-input-error' : ''}`}
            placeholder={t('profile.pnr-placeholder')}
          />
          {validationErrors.pnr && (
            <p className="status-msg error">{t(validationErrors.pnr)}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={state.status === 'loading'}
          className="profile-button"
        >
          {state.status === 'loading' ? t('profile.saving') : t('profile.save')}
        </button>
      </form>

      {state.message && Object.keys(validationErrors).length === 0 && (
        <p className={`profile-message ${state.status}`}>{state.message}</p>
      )}
    </div>
  );
};
