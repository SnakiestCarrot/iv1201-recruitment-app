import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthPresenter } from '../presenters/useAuthPresenter';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from '../../../components/LanguageDropdown';
import { LoginSchema } from '../../../utils/validation';
import '../styles/LoginForm.css';

/**
 * Login form component.
 * Uses Zod to ensure fields are not empty before sending the request.
 */
export const LoginForm = () => {
  const { state, loginUser, requestOldUserReset } = useAuthPresenter();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showOldUser, setShowOldUser] = useState(false);
  const [oldUserEmail, setOldUserEmail] = useState('');

  useEffect(() => {
    if (state.status === 'success' && !showOldUser) {
      navigate('/dashboard');
    }
  }, [state.status, navigate, showOldUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const result = LoginSchema.safeParse({ username, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }

    loginUser({ username, password });
  };

  const handleOldUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestOldUserReset(oldUserEmail);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <LanguageDropdown />

        <h2>{t('auth.login')}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">{t('common.username')}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className={`login-input ${validationErrors.username ? 'input-error' : ''}`}
            />
            {validationErrors.username && (
              <span style={{ color: 'red', fontSize: '0.85em' }}>
                {t(validationErrors.username)}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('common.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={`login-input ${validationErrors.password ? 'input-error' : ''}`}
            />
            {validationErrors.password && (
              <span style={{ color: 'red', fontSize: '0.85em' }}>
                {t(validationErrors.password)}
              </span>
            )}
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
              {t('auth.old-user')}
            </p>
          ) : (
            <form onSubmit={handleOldUserSubmit} className="old-user-form">
              <div className="form-group">
                <label htmlFor="oldUserEmail">{t('auth.old-user-email')}</label>
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
                  ? t('auth.old-user-sending')
                  : t('auth.old-user-send')}
              </button>

              <p
                className="old-user-link"
                onClick={() => setShowOldUser(false)}
                style={{ cursor: 'pointer' }}
              >
                {t('auth.old-user-back')}
              </p>
            </form>
          )}
        </div>

        {state.message && Object.keys(validationErrors).length === 0 && (
          <p className={`status-msg ${state.status}`}>{state.message}</p>
        )}

        <div className="login-footer">
          <p>{t('auth.dont-have-account')}</p>
          <Link to="/register">{t('auth.register')}</Link>
        </div>
      </div>
    </div>
  );
};
