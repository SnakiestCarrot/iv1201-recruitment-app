import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecruiterAuthPresenter } from '../presenters/useRecruiterAuthPresenter';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from '../../../components/LanguageDropdown';
import '../styles/RegisterForm.css';

/**
 * Registration form component for new recruiter users.
 * Requires a secret registration code in addition to standard credentials.
 * Provides input fields for username, password, password confirmation, and secret code.
 * Validates password length (minimum 6 characters) and matching passwords.
 * Redirects to login page after successful registration.
 * Includes language selection and links to other registration/login pages.
 *
 * @returns The recruiter registration form component.
 */
export const RecruiterRegisterForm = () => {
  const { state, registerRecruiter } = useRecruiterAuthPresenter();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pnr, setPnr] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError(t('auth.password-mismatch'));
      return;
    }

    if (password.length < 6) {
      setValidationError(t('auth.insufficient-password-length'));
      return;
    }

    if (!secretCode.trim()) {
      setValidationError(t('auth.secret-code-required'));
      return;
    }

    registerRecruiter({ username, password, email, pnr, secretCode });
  };

  return (
    <div className="auth-card">
      <LanguageDropdown />

      <h2>{t('auth.recruiter-register')}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rec-username">{t('common.username')}</label>
          <input
            id="rec-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="register-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rec-email">{t('common.email')}</label>
          <input
            id="rec-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rec-pnr">{t('common.pnr')}</label>
          <input
            id="rec-pnr"
            type="text"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            required
            className="register-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rec-password">{t('common.password')}</label>
          <input
            id="rec-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rec-confirm">{t('auth.confirm-password')}</label>
          <input
            id="rec-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`register-input ${validationError ? 'register-input-error' : ''}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rec-secret">{t('auth.secret-code')}</label>
          <input
            id="rec-secret"
            type="password"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder={t('auth.secret-code-placeholder')}
            required
            className="register-input"
          />
        </div>

        <button type="submit" disabled={state.status === 'loading'}>
          {state.status === 'loading' ? t('auth.creating') : t('auth.register')}
        </button>
      </form>

      {validationError && <p className="status-msg error">{validationError}</p>}

      {state.message && !validationError && (
        <p className={`status-msg ${state.status}`}>{state.message}</p>
      )}

      <div className="register-footer">
        <p>{t('auth.register-as-applicant')}</p>
        <Link to="/register">{t('auth.register')}</Link>
      </div>

      <div className="register-footer">
        <p>{t('auth.already-have-account')}</p>
        <Link to="/login">{t('auth.login-here')}</Link>
      </div>
    </div>
  );
};
