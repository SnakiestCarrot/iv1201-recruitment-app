import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthenticatedTopbar } from '../AuthenticatedTopbar';
import { dashboardService } from '../../features/dashboard/services/dashboardService';
import { AUTH_CHANGED_EVENT } from '../../features/auth/hooks/useAuth';

const mockNavigate = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => mockNavigate,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn(), language: 'en' },
  }),
}));

vi.mock('../../features/dashboard/services/dashboardService', () => ({
  dashboardService: {
    logout: vi.fn(),
  },
}));

vi.mock('../../features/auth/hooks/useAuth', async () => {
  const actual = await vi.importActual('../../features/auth/hooks/useAuth');
  return {
    ...actual as object,
    useAuth: (...args: any[]) => mockUseAuth(...args),
  };
});

describe('AuthenticatedTopbar Component (applicant)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: { username: 'testuser', roleId: 2 },
      isAuthenticated: true,
    });
  });

  it('renders topbar with title and navigation links', () => {
    render(<AuthenticatedTopbar />);

    expect(screen.getByText('Recruitment App')).toBeInTheDocument();
    expect(screen.getByText('dash.dashboard')).toBeInTheDocument();
    expect(screen.getByText('application.title')).toBeInTheDocument();
    expect(screen.getByText('profile.settings')).toBeInTheDocument();
  });

  it('renders language buttons', () => {
    render(<AuthenticatedTopbar />);

    const enButton = screen.getByRole('button', { name: 'EN' });
    const svButton = screen.getByRole('button', { name: 'SV' });

    expect(enButton).toBeInTheDocument();
    expect(svButton).toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(<AuthenticatedTopbar />);

    const logoutButton = screen.getByRole('button', { name: 'dash.logout' });

    expect(logoutButton).toBeInTheDocument();
  });

  it('changes language when language button is clicked', () => {
    render(<AuthenticatedTopbar />);

    const svButton = screen.getByRole('button', { name: 'SV' });
    fireEvent.click(svButton);

    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'sv');
  });

  it('calls logout and navigates to login when logout button is clicked', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    render(<AuthenticatedTopbar />);

    const logoutButton = screen.getByRole('button', { name: 'dash.logout' });
    fireEvent.click(logoutButton);

    expect(dashboardService.logout).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: AUTH_CHANGED_EVENT })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('applies active class to current language button', () => {
    render(<AuthenticatedTopbar />);

    const enButton = screen.getByRole('button', { name: 'EN' });

    // EN should be active since the mock returns language: 'en'
    expect(enButton).toHaveClass('topbar-lang-btn-active');
  });

  it('navigation links have correct href attributes', () => {
    render(<AuthenticatedTopbar />);

    const dashboardLink = screen.getByText('dash.dashboard').closest('a');
    const applicationLink = screen.getByText('application.title').closest('a');
    const settingsLink = screen.getByText('profile.settings').closest('a');

    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(applicationLink).toHaveAttribute('href', '/application');
    expect(settingsLink).toHaveAttribute('href', '/profile');
  });

  it('hides recruiter applications link for applicants', () => {
    render(<AuthenticatedTopbar />);

    expect(screen.queryByText('recruiter.applications')).not.toBeInTheDocument();
  });
});

describe('AuthenticatedTopbar Component (recruiter)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: { username: 'recruiter', roleId: 1 },
      isAuthenticated: true,
    });
  });

  it('shows applications link for recruiters', () => {
    render(<AuthenticatedTopbar />);

    const appsLink = screen.getByText('recruiter.applications').closest('a');
    expect(appsLink).toBeInTheDocument();
    expect(appsLink).toHaveAttribute('href', '/applications');
  });

  it('hides application form link for recruiters', () => {
    render(<AuthenticatedTopbar />);

    expect(screen.queryByText('application.title')).not.toBeInTheDocument();
  });
});
