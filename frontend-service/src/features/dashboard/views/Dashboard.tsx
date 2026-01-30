import { Link } from 'react-router-dom';
import { useDashboardPresenter } from '../presenters/useDashboardPresenter';
import { useTranslation } from 'react-i18next';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const { username, roleId, logout } = useDashboardPresenter();
  const { t, i18n } = useTranslation();

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    document.documentElement.lang = lng;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-language-selector">
        <select
          value={i18n.language?.startsWith('sv') ? 'sv' : 'en'}
          onChange={handleLangChange}
        >
          <option value="en">English</option>
          <option value="sv">Svenska</option>
        </select>
      </div>

      <h1>
        {t('dash.title')}
        {username}!
      </h1>

      <p>
        {t('dash.role-id-sentence')}
        {roleId}
      </p>

      <div className="dashboard-link-section">
        <Link to="/application" className="dashboard-link">
          {t('dash.apply-now')}
        </Link>
      </div>

      <div className="dashboard-status-box">
        <h3 className="dashboard-status-title">{t('dash.logged-in-state')}</h3>
      </div>

      <div className="dashboard-actions">
        <button onClick={logout} className="dashboard-btn-logout">
          {t('dash.logout')}
        </button>
      </div>
    </div>
  );
};
