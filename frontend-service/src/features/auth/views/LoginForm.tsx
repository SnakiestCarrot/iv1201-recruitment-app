import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthPresenter } from '../presenters/useAuthPresenter';
import { useTranslation } from 'react-i18next';

export const LoginForm = () => {
  const { state, loginUser } = useAuthPresenter();
  const navigate = useNavigate();
  // Initialize the hook once at the top level
  const { t, i18n } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (state.status === 'success') {
      navigate('/dashboard');
    }
  }, [state.status, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ username, password });
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    document.documentElement.lang = lng;
  };

  return (
    <div className="auth-card">
      {/* Language selector */}
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

      <h2>{t('auth.login')}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {/* Added htmlFor="username" */}
          <label htmlFor="username">{t('common.username')}</label>
          <input
            id="username" /* Added id="username" to match the label */
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          {/* Added htmlFor="password" */}
          <label htmlFor="password">{t('common.password')}</label>
          <input
            id="password" /* Added id="password" to match the label */
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={state.status === 'loading'}>
          {state.status === 'loading'
            ? t('auth.verification')
            : t('auth.login')}
        </button>
      </form>

      {state.message && (
        <p className={`status-msg ${state.status}`}>{state.message}</p>
      )}

      <div
        style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}
      >
        <p>{t('auth.dont-have-account')}</p>
        <Link to="/register">{t('auth.register')}</Link>
      </div>
    </div>
  );
};
