import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/views/LoginForm';
import { RegisterForm } from './features/auth/views/RegisterForm';
import { Dashboard } from './features/dashboard/views/Dashboard'; // <--- Import this
import './App.css';

function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <header>
          <h1>Recruitment App</h1>
        </header>

        <main className="page-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
