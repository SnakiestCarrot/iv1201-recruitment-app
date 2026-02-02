import { useTranslation } from 'react-i18next';
import './LanguageDropdown.css';

export const LanguageDropdown = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    document.documentElement.lang = lng;
  };

  return (
    <div className="language-dropdown">
      <label className="language-dropdown-label">
        <span>Language</span>
        <select
          value={i18n.language?.startsWith('sv') ? 'sv' : 'en'}
          onChange={handleLanguageChange}
          className="language-dropdown-select"
        >
          <option value="en">English</option>
          <option value="sv">Svenska</option>
        </select>
      </label>
    </div>
  );
};
