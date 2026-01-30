import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthPresenter } from '../presenters/useAuthPresenter';
import { useTranslation } from 'react-i18next';
import '../styles/RegisterForm.css';

export const RegisterForm = () => {
  const { state, registerUser } = useAuthPresenter();
  const { t, i18n } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    document.documentElement.lang = lng;
  };

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

    registerUser({ username, password });
  };

  return (
    <div className="auth-card">
      <div className="register-language-selector">
        <label className="register-language-label">
          <span>Language</span>
          <select
            value={i18n.language?.startsWith('sv') ? 'sv' : 'en'}
            onChange={handleLangChange}
          >
            <option value="en">English</option>
            <option value="sv">Svenska</option>
          </select>
        </label>
      </div>

      <h2>{t('auth.register')}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-username">{t('common.username')}</label>
          <input
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="register-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">{t('common.password')}</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm">{t('auth.confirm-password')}</label>
          <input
            id="reg-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`register-input ${validationError ? 'register-input-error' : ''}`}
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
        <p>{t('auth.already-have-account')}</p>
        <Link to="/login">{t('auth.login-here')}</Link>
      </div>
    </div>
  );
};
