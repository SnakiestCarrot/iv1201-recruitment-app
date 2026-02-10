import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/views/LoginForm';
import { RegisterForm } from './features/auth/views/RegisterForm';
import { RecruiterRegisterForm } from './features/auth/views/RecruiterRegisterForm';
import { Dashboard } from './features/dashboard/views/Dashboard';
import { ApplicationForm } from './features/application/views/ApplicationForm.tsx';
import { ApplicationList } from './features/recruiter/views/ApplicationList';
import { ApplicationDetail } from './features/recruiter/views/ApplicationDetail';
import { AuthenticatedTopbar } from './components/AuthenticatedTopbar';
import { useAuth } from './features/auth/hooks/useAuth';
import './App.css';

/**
 * Main application component that sets up routing and authentication.
 * Conditionally displays the authenticated topbar based on authentication status.
 * Defines all application routes including login, registration, dashboard, and application forms.
 *
 * @returns The root application component with routing configuration.
 */
function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <HashRouter>
      <div className="app-container">
        {isAuthenticated && <AuthenticatedTopbar />}

        <main className="page-container p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/register/recruiter"
              element={<RecruiterRegisterForm />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/application"
              element={
                user?.roleId === 1 ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <ApplicationForm />
                )
              }
            />
            <Route
              path="/applications"
              element={
                user?.roleId !== 1 ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <ApplicationList />
                )
              }
            />
            <Route
              path="/applications/:id"
              element={
                user?.roleId !== 1 ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <ApplicationDetail />
                )
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
