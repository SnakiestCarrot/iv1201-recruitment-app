import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthPresenter } from '../presenters/useAuthPresenter';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from '../../../components/LanguageDropdown';
import '../styles/LoginForm.css';

/**
 * Login form component for user authentication.
 * Provides username and password input fields and handles login submission.
 * Redirects to dashboard upon successful authentication.
 * Includes language selection and links to registration pages.
 *
 * @returns The login form component.
 */
export const LoginForm = () => {
  const { state, loginUser, requestOldUserReset } = useAuthPresenter();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showOldUser, setShowOldUser] = useState(false);
  const [oldUserEmail, setOldUserEmail] = useState('');

  useEffect(() => {
    if (state.status === 'success' && !showOldUser) {
      navigate('/dashboard');
    }
  }, [state.status, navigate, showOldUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ username, password });
  };

  const handleOldUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestOldUserReset(oldUserEmail);
  };

  return (
    <div className="auth-card">
      <LanguageDropdown />

      <h2>{t('auth.login')}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">{t('common.username')}</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="login-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('common.password')}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="login-input"
          />
        </div>

        <button type="submit" disabled={state.status === 'loading'}>
          {state.status === 'loading'
            ? t('auth.verification')
            : t('auth.login')}
        </button>
      </form>

      <div className="old-user-section">
        {!showOldUser ? (
          <p
            className="old-user-link"
            onClick={() => setShowOldUser(true)}
            style={{ cursor: 'pointer' }}
          >
            Old user?
          </p>
        ) : (
          <form onSubmit={handleOldUserSubmit} className="old-user-form">
            <div className="form-group">
              <label htmlFor="oldUserEmail">Email</label>
              <input
                id="oldUserEmail"
                type="email"
                value={oldUserEmail}
                onChange={(e) => setOldUserEmail(e.target.value)}
                required
                className="login-input"
              />
            </div>

            <button type="submit" disabled={state.status === 'loading'}>
              {state.status === 'loading'
                ? 'Sending...'
                : 'Send Instructions'}
            </button>

            <p
              className="old-user-link"
              onClick={() => setShowOldUser(false)}
              style={{ cursor: 'pointer' }}
            >
              Back to login
            </p>
          </form>
        )}
      </div>

      {state.message && (
        <p className={`status-msg ${state.status}`}>{state.message}</p>
      )}

      <div className="login-footer">
        <p>{t('auth.dont-have-account')}</p>
        <Link to="/register">{t('auth.register')}</Link>
      </div>
    </div>
  );
};
