import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApplicationList } from '../views/ApplicationList';
import { useApplicationListPresenter } from '../presenters/useApplicationListPresenter';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../presenters/useApplicationListPresenter');

describe('ApplicationList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      applications: [],
      loading: true,
      error: '',
      refetch: vi.fn(),
    });

    render(<ApplicationList />);

    expect(screen.getByText('recruiter.loading')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      applications: [],
      loading: false,
      error: 'Something went wrong',
      refetch: vi.fn(),
    });

    render(<ApplicationList />);

    expect(screen.getByText('recruiter.error')).toBeInTheDocument();
  });

  it('shows empty state when no applications', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      applications: [],
      loading: false,
      error: '',
      refetch: vi.fn(),
    });

    render(<ApplicationList />);

    expect(screen.getByText('recruiter.no-applications')).toBeInTheDocument();
  });

  it('renders applications in a table', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      applications: [
        { personID: 1, fullName: 'John Doe', status: 'UNHANDLED' },
        { personID: 2, fullName: 'Jane Smith', status: 'ACCEPTED' },
      ],
      loading: false,
      error: '',
      refetch: vi.fn(),
    });

    render(<ApplicationList />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('recruiter.unhandled')).toBeInTheDocument();
    expect(screen.getByText('recruiter.accepted')).toBeInTheDocument();
  });

  it('navigates to detail page when a row is clicked', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      applications: [
        { personID: 1, fullName: 'John Doe', status: 'UNHANDLED' },
      ],
      loading: false,
      error: '',
      refetch: vi.fn(),
    });

    render(<ApplicationList />);

    fireEvent.click(screen.getByText('John Doe'));

    expect(mockNavigate).toHaveBeenCalledWith('/applications/1');
  });

  it('displays the page title', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      applications: [],
      loading: false,
      error: '',
      refetch: vi.fn(),
    });

    render(<ApplicationList />);

    expect(screen.getByText('recruiter.applications-title')).toBeInTheDocument();
  });

  it('applies correct status CSS classes', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      applications: [
        { personID: 1, fullName: 'John Doe', status: 'REJECTED' },
      ],
      loading: false,
      error: '',
      refetch: vi.fn(),
    });

    render(<ApplicationList />);

    const statusBadge = screen.getByText('recruiter.rejected');
    expect(statusBadge).toHaveClass('recruiter-status');
    expect(statusBadge).toHaveClass('recruiter-status-rejected');
  });
});
