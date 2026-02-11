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

const baseMock = {
  loading: false,
  error: '',
  statusFilter: 'ALL',
  setStatusFilter: vi.fn(),
  nameSearch: '',
  setNameSearch: vi.fn(),
  refetch: vi.fn(),
};

describe('ApplicationList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [],
      totalCount: 0,
      loading: true,
    });

    render(<ApplicationList />);

    expect(screen.getByText('recruiter.loading')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [],
      totalCount: 0,
      error: 'Something went wrong',
    });

    render(<ApplicationList />);

    expect(screen.getByText('recruiter.error')).toBeInTheDocument();
  });

  it('shows empty state when no applications', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [],
      totalCount: 0,
    });

    render(<ApplicationList />);

    expect(screen.getByText('recruiter.no-applications')).toBeInTheDocument();
  });

  it('shows no-results state when filters match nothing', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [],
      totalCount: 3,
    });

    render(<ApplicationList />);

    expect(screen.getByText('recruiter.no-results')).toBeInTheDocument();
  });

  it('renders applications in a table', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [
        { personID: 1, fullName: 'John Doe', status: 'UNHANDLED' },
        { personID: 2, fullName: 'Jane Smith', status: 'ACCEPTED' },
      ],
      totalCount: 2,
    });

    render(<ApplicationList />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    const statusBadges = screen.getAllByText('recruiter.unhandled');
    expect(statusBadges.length).toBeGreaterThanOrEqual(1);
    const acceptedBadges = screen.getAllByText('recruiter.accepted');
    expect(acceptedBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to detail page when a row is clicked', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [
        { personID: 1, fullName: 'John Doe', status: 'UNHANDLED' },
      ],
      totalCount: 1,
    });

    render(<ApplicationList />);

    fireEvent.click(screen.getByText('John Doe'));

    expect(mockNavigate).toHaveBeenCalledWith('/applications/1');
  });

  it('displays the page title', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [],
      totalCount: 0,
    });

    render(<ApplicationList />);

    expect(screen.getByText('recruiter.applications-title')).toBeInTheDocument();
  });

  it('applies correct status CSS classes', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [
        { personID: 1, fullName: 'John Doe', status: 'REJECTED' },
      ],
      totalCount: 1,
    });

    render(<ApplicationList />);

    const statusBadges = screen.getAllByText('recruiter.rejected');
    const tableBadge = statusBadges.find((el) =>
      el.classList.contains('recruiter-status')
    );
    expect(tableBadge).toBeDefined();
    expect(tableBadge).toHaveClass('recruiter-status-rejected');
  });

  it('renders search input and status filter', () => {
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [],
      totalCount: 0,
    });

    render(<ApplicationList />);

    expect(screen.getByPlaceholderText('recruiter.search-name')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls setNameSearch when typing in search input', () => {
    const setNameSearch = vi.fn();
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [],
      totalCount: 0,
      setNameSearch,
    });

    render(<ApplicationList />);

    fireEvent.change(screen.getByPlaceholderText('recruiter.search-name'), {
      target: { value: 'John' },
    });

    expect(setNameSearch).toHaveBeenCalledWith('John');
  });

  it('calls setStatusFilter when changing status dropdown', () => {
    const setStatusFilter = vi.fn();
    (useApplicationListPresenter as any).mockReturnValue({
      ...baseMock,
      applications: [],
      totalCount: 0,
      setStatusFilter,
    });

    render(<ApplicationList />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'ACCEPTED' },
    });

    expect(setStatusFilter).toHaveBeenCalledWith('ACCEPTED');
  });
});
