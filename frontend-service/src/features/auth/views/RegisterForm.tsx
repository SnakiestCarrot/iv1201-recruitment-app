import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthPresenter } from '../presenters/useAuthPresenter';
import { useTranslation } from 'react-i18next';

export const RegisterForm = () => {
  const { state, registerUser } = useAuthPresenter();

  // 1. Initialize the translation hook
  const { t, i18n } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // 2. Language switcher logic (consistent with LoginForm)
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
      // 3. Use 't' inside the function for validation messages
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
      {/* 4. Language Selector UI */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '0.75rem',
        }}
      >
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem' }}>Language</span>
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
          <label>{t('common.username')}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('common.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('auth.confirm-password')}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              borderColor: validationError ? 'red' : undefined,
            }}
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

      <div
        style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}
      >
        <p>{t('auth.already-have-account')}</p>
        <Link to="/login">{t('auth.login-here')}</Link>
      </div>
    </div>
  );
};
