import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthPresenter } from '../presenters/useAuthPresenter';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from '../../../components/LanguageDropdown';
import '../styles/RegisterForm.css';

export const RegisterForm = () => {
  const { state, registerUser, validationErrors, clearError } =
    useAuthPresenter();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser({ username, password, confirmPassword });
  };

  // Helper to update state and notify presenter to clear error
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    fieldName: string,
    value: string
  ) => {
    setter(value);
    if (validationErrors[fieldName]) {
      clearError(fieldName);
    }
  };

  return (
    <div className="auth-card">
      <LanguageDropdown />
      <h2>{t('auth.register')}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="reg-username">{t('common.username')}</label>
          <input
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) =>
              handleInputChange(setUsername, 'username', e.target.value)
            }
            className={`register-input ${validationErrors.username ? 'register-input-error' : ''}`}
          />
          {validationErrors.username && (
            <p className="status-msg error">{t(validationErrors.username)}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">{t('common.password')}</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) =>
              handleInputChange(setPassword, 'password', e.target.value)
            }
            className={`register-input ${validationErrors.password ? 'register-input-error' : ''}`}
          />
          {validationErrors.password && (
            <p className="status-msg error">{t(validationErrors.password)}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm">{t('auth.confirm-password')}</label>
          <input
            id="reg-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              handleInputChange(
                setConfirmPassword,
                'confirmPassword',
                e.target.value
              )
            }
            className={`register-input ${validationErrors.confirmPassword ? 'register-input-error' : ''}`}
          />
          {validationErrors.confirmPassword && (
            <p className="status-msg error">
              {t(validationErrors.confirmPassword)}
            </p>
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
        <p>{t('auth.already-have-account')}</p>
        <Link to="/login">{t('auth.login-here')}</Link>
      </div>
      <div className="register-footer">
        <p>{t('auth.register-as-recruiter')}</p>
        <Link to="/register/recruiter">{t('auth.recruiter-register')}</Link>
      </div>
    </div>
  );
};
