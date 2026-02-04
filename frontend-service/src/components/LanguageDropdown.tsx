import { useTranslation } from 'react-i18next';
import './LanguageDropdown.css';

/**
 * Language selector dropdown component.
 * Allows users to switch between English and Swedish languages.
 * Persists the selected language in localStorage and updates the document language attribute.
 *
 * @returns A dropdown select element for language selection.
 */
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
