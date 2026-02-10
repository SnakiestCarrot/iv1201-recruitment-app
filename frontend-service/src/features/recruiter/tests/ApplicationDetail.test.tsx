import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApplicationDetail } from '../views/ApplicationDetail';
import { useApplicationDetailPresenter } from '../presenters/useApplicationDetailPresenter';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../presenters/useApplicationDetailPresenter');

const mockApplication = {
  personID: 1,
  name: 'John',
  surname: 'Doe',
  email: 'john@example.com',
  pnr: '19900101-1234',
  status: 'UNHANDLED',
  competences: [{ competenceId: 1, name: 'Java', yearsOfExperience: 3 }],
  availabilities: [{ fromDate: '2026-06-01', toDate: '2026-08-31' }],
};

describe('ApplicationDetail Component', () => {
  const mockUpdateStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: null,
      loading: true,
      error: '',
      updating: false,
      updateError: '',
      updateSuccess: false,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    expect(screen.getByText('recruiter.loading')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: null,
      loading: false,
      error: 'Not found',
      updating: false,
      updateError: '',
      updateSuccess: false,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    expect(screen.getByText('recruiter.detail-error')).toBeInTheDocument();
  });

  it('renders application details', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: mockApplication,
      loading: false,
      error: '',
      updating: false,
      updateError: '',
      updateSuccess: false,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('19900101-1234')).toBeInTheDocument();
  });

  it('renders competences', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: mockApplication,
      loading: false,
      error: '',
      updating: false,
      updateError: '',
      updateSuccess: false,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('3 recruiter.years-exp')).toBeInTheDocument();
  });

  it('renders availability periods', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: mockApplication,
      loading: false,
      error: '',
      updating: false,
      updateError: '',
      updateSuccess: false,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    expect(screen.getByText('2026-06-01')).toBeInTheDocument();
    expect(screen.getByText('2026-08-31')).toBeInTheDocument();
  });

  it('renders status buttons', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: mockApplication,
      loading: false,
      error: '',
      updating: false,
      updateError: '',
      updateSuccess: false,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    expect(screen.getByText('recruiter.unhandled')).toBeInTheDocument();
    expect(screen.getByText('recruiter.accepted')).toBeInTheDocument();
    expect(screen.getByText('recruiter.rejected')).toBeInTheDocument();
  });

  it('calls updateStatus when a status button is clicked', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: mockApplication,
      loading: false,
      error: '',
      updating: false,
      updateError: '',
      updateSuccess: false,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    fireEvent.click(screen.getByText('recruiter.accepted'));

    expect(mockUpdateStatus).toHaveBeenCalledWith('ACCEPTED');
  });

  it('disables current status button', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: mockApplication,
      loading: false,
      error: '',
      updating: false,
      updateError: '',
      updateSuccess: false,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    const unhandledBtn = screen.getByText('recruiter.unhandled');
    expect(unhandledBtn).toBeDisabled();
  });

  it('shows success message after status update', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: mockApplication,
      loading: false,
      error: '',
      updating: false,
      updateError: '',
      updateSuccess: true,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    expect(screen.getByText('recruiter.status-updated')).toBeInTheDocument();
  });

  it('shows error message when status update fails', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: mockApplication,
      loading: false,
      error: '',
      updating: false,
      updateError: 'Failed',
      updateSuccess: false,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    expect(screen.getByText('recruiter.status-update-error')).toBeInTheDocument();
  });

  it('navigates back to list when back button is clicked', () => {
    (useApplicationDetailPresenter as any).mockReturnValue({
      application: mockApplication,
      loading: false,
      error: '',
      updating: false,
      updateError: '',
      updateSuccess: false,
      updateStatus: mockUpdateStatus,
    });

    render(<ApplicationDetail />);

    fireEvent.click(screen.getByText('recruiter.back-to-list'));

    expect(mockNavigate).toHaveBeenCalledWith('/applications');
  });
});
