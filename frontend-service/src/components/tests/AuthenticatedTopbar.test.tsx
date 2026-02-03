import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthenticatedTopbar } from '../AuthenticatedTopbar';
import { dashboardService } from '../../features/dashboard/services/dashboardService';
import { AUTH_CHANGED_EVENT } from '../../features/auth/hooks/useAuth';

const mockNavigate = vi.fn();

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

describe('AuthenticatedTopbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('renders topbar with title and navigation links', () => {
    render(<AuthenticatedTopbar />);

    expect(screen.getByText('Recruitment App')).toBeInTheDocument();
    expect(screen.getByText('dash.dashboard')).toBeInTheDocument();
    expect(screen.getByText('application.title')).toBeInTheDocument();
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
    const mockChangeLanguage = vi.fn();
    vi.doMock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
        i18n: { changeLanguage: mockChangeLanguage, language: 'en' },
      }),
    }));

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

    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(applicationLink).toHaveAttribute('href', '/application');
  });
});
