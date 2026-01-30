import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthPresenter } from '../presenters/useAuthPresenter';
import { useTranslation } from 'react-i18next';
import '../styles/LoginForm.css';

export const LoginForm = () => {
  const { state, loginUser } = useAuthPresenter();
  const navigate = useNavigate();
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
      <div className="login-language-selector">
        <label className="login-language-label">
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
