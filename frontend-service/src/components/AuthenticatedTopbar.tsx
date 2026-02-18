import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dashboardService } from '../features/dashboard/services/dashboardService';
import { AUTH_CHANGED_EVENT, useAuth } from '../features/auth/hooks/useAuth';
import './AuthenticatedTopbar.css';

/**
 * Top navigation bar component for authenticated users.
 * Displays the application title, navigation links (Dashboard, Application),
 * language switcher (EN/SV), and logout button.
 * Handles language changes and logout functionality.
 * Dispatches auth state change events on logout.
 *
 * @returns The authenticated top navigation bar component.
 */
export const AuthenticatedTopbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    document.documentElement.lang = lng;
  };

  const handleLogout = () => {
    dashboardService.logout();
    // Dispatch custom event to notify auth state changed
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-container">
        <div className="topbar-left">
          <h1 className="topbar-title">Recruitment App</h1>
          <nav className="topbar-nav">
            <Link to="/dashboard" className="topbar-link">
              {t('dash.dashboard')}
            </Link>
            {user?.roleId !== 1 && (
              <Link to="/application" className="topbar-link">
                {t('application.title')}
              </Link>
            )}
            {user?.roleId === 1 && (
              <Link to="/applications" className="topbar-link">
                {t('recruiter.applications')}
              </Link>
            )}
            <Link to="/profile" className="topbar-link">
              {t('profile.settings')}
            </Link>
          </nav>
        </div>

        <div className="topbar-right">
          <select
            value={i18n.language?.startsWith('sv') ? 'sv' : 'en'}
            onChange={handleLanguageChange}
            className="topbar-lang-select"
          >
            <option value="en">English</option>
            <option value="sv">Svenska</option>
          </select>
          <button onClick={handleLogout} className="topbar-logout-btn">
            {t('dash.logout')}
          </button>
        </div>
      </div>
    </header>
  );
};
