import '../styles/RegisterForm.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecruiterAuthPresenter } from '../presenters/useRecruiterAuthPresenter';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from '../../../components/LanguageDropdown';
import { RecruiterRegisterSchema } from '../../../utils/validation';
import '../styles/RegisterForm.css';

/**
 * Registration form component for new recruiter users.
 * Uses Zod to validate username, password, and the required secret code.
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (password !== confirmPassword) {
      setValidationErrors({ confirmPassword: t('auth.password-mismatch') });
      return;
    }

    const result = RecruiterRegisterSchema.safeParse({ username, password, secretCode });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }

    registerRecruiter({ username, password, secretCode });
  };

  return (
    <div className="auth-card">
      <LanguageDropdown />

      <h2>{t('auth.recruiter-register')}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="rec-username">{t('common.username')}</label>
          <input
            id="rec-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`register-input ${validationErrors.username ? 'register-input-error' : ''}`}
          />
          {validationErrors.username && (
            <p className="status-msg error">{validationErrors.username}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rec-password">{t('common.password')}</label>
          <input
            id="rec-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`register-input ${validationErrors.password ? 'register-input-error' : ''}`}
          />
          {validationErrors.password && (
            <p className="status-msg error">{validationErrors.password}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rec-confirm">{t('auth.confirm-password')}</label>
          <input
            id="rec-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`register-input ${validationErrors.confirmPassword ? 'register-input-error' : ''}`}
          />
          {validationErrors.confirmPassword && (
            <p className="status-msg error">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rec-secret">{t('auth.secret-code')}</label>
          <input
            id="rec-secret"
            type="password"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder={t('auth.secret-code-placeholder')}
            className={`register-input ${validationErrors.secretCode ? 'register-input-error' : ''}`}
          />
          {validationErrors.secretCode && (
            <p className="status-msg error">{validationErrors.secretCode}</p>
          )}
        </div>

        <button type="submit" disabled={state.status === 'loading'}>
          {state.status === 'loading' ? t('auth.creating') : t('auth.register')}
        </button>
      </form>

      {state.message && Object.keys(validationErrors).length === 0 && (
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