import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import for language switcher
import { LoginForm } from './features/auth/views/LoginForm';
import { RegisterForm } from './features/auth/views/RegisterForm';
import { Dashboard } from './features/dashboard/views/Dashboard';
import { ApplicationForm } from './features/application/views/ApplicationForm.tsx';
import './App.css';

function App() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <HashRouter>
      <div className="app-container">
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
          <div className="flex gap-4 items-center">
            <h1 className="text-xl font-bold">Recruitment App</h1>
            <nav className="flex gap-4 text-sm text-gray-300">
               <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
               <Link to="/application" className="hover:text-white">Apply</Link>
            </nav>
          </div>
          
          <div className="flex gap-2 text-sm">
            <button onClick={() => changeLanguage('en')} className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-600' : 'bg-gray-700'}`}>EN</button>
            <button onClick={() => changeLanguage('sv')} className={`px-2 py-1 rounded ${i18n.language === 'sv' ? 'bg-blue-600' : 'bg-gray-700'}`}>SV</button>
          </div>
        </header>

        <main className="page-container p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/application" element={<ApplicationForm />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;