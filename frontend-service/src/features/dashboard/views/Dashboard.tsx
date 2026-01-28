import { useDashboardPresenter } from '../presenters/useDashboardPresenter';
import { useTranslation } from 'react-i18next';

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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* Language Selector (Top Right) */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <select
          value={i18n.language?.startsWith('sv') ? 'sv' : 'en'}
          onChange={handleLangChange}
          style={{ padding: '5px' }}
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

      <div
        style={{
          padding: '20px',
          border: '1px solid #4CAF50',
          display: 'inline-block',
          borderRadius: '8px',
          backgroundColor: '#f0fff4',
        }}
      >
        <h3 style={{ color: '#2e7d32', margin: 0 }}>
          {t('dash.logged-in-state')}
        </h3>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button
          onClick={logout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#b8120cff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {t('dash.logout')}
        </button>
      </div>
    </div>
  );
};
