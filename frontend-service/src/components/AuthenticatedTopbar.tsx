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

  const handleLanguageChange = (lng: string) => {
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
          </nav>
        </div>

        <div className="topbar-right">
          <div className="topbar-language">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`topbar-lang-btn ${i18n.language === 'en' ? 'topbar-lang-btn-active' : ''}`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('sv')}
              className={`topbar-lang-btn ${i18n.language === 'sv' ? 'topbar-lang-btn-active' : ''}`}
            >
              SV
            </button>
          </div>
          <button onClick={handleLogout} className="topbar-logout-btn">
            {t('dash.logout')}
          </button>
        </div>
      </div>
    </header>
  );
};
