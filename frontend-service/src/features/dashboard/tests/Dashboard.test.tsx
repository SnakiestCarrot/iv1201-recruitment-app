import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../views/Dashboard';
import { useDashboardPresenter } from '../presenters/useDashboardPresenter';

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className}>{children}</a>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../presenters/useDashboardPresenter');

describe('Dashboard Component', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useDashboardPresenter as any).mockReturnValue({
      username: 'testuser',
      roleId: 1,
      logout: mockLogout,
    });
  });

  it('renders dashboard with username and role', () => {
    render(<Dashboard />);

    expect(screen.getByText(/dash.title/)).toBeInTheDocument();
    expect(screen.getByText(/testuser/)).toBeInTheDocument();
    expect(screen.getByText(/dash.role-id-sentence/)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it('displays the correct username from presenter', () => {
    (useDashboardPresenter as any).mockReturnValue({
      username: 'johndoe',
      roleId: 2,
      logout: mockLogout,
    });

    render(<Dashboard />);

    expect(screen.getByText(/johndoe/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });

  it('renders application link for applicants', () => {
    (useDashboardPresenter as any).mockReturnValue({
      username: 'testuser',
      roleId: 2,
      logout: mockLogout,
    });

    render(<Dashboard />);

    const applicationLink = screen.getByText('dash.apply-now').closest('a');

    expect(applicationLink).toBeInTheDocument();
    expect(applicationLink).toHaveAttribute('href', '/application');
  });

  it('hides application link for recruiters', () => {
    render(<Dashboard />);

    expect(screen.queryByText('dash.apply-now')).not.toBeInTheDocument();
  });

  it('renders logged-in state box', () => {
    render(<Dashboard />);

    expect(screen.getByText('dash.logged-in-state')).toBeInTheDocument();
  });

  it('handles empty username gracefully', () => {
    (useDashboardPresenter as any).mockReturnValue({
      username: '',
      roleId: null,
      logout: mockLogout,
    });

    render(<Dashboard />);

    expect(screen.getByText(/dash.title/)).toBeInTheDocument();
    expect(screen.getByText(/dash.role-id-sentence/)).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    (useDashboardPresenter as any).mockReturnValue({
      username: 'testuser',
      roleId: 2,
      logout: mockLogout,
    });

    render(<Dashboard />);

    const container = screen.getByText(/dash.title/).closest('div');
    const link = screen.getByText('dash.apply-now').closest('a');
    const statusBox = screen.getByText('dash.logged-in-state').closest('div');

    expect(container).toHaveClass('dashboard-container');
    expect(link).toHaveClass('dashboard-link');
    expect(statusBox).toHaveClass('dashboard-status-box');
  });
});
