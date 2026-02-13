import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileView } from '../views/ProfileView';
import { useProfilePresenter } from '../presenters/useProfilePresenter';

vi.mock('../presenters/useProfilePresenter');
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ProfileView', () => {
  const mockUpdateProfile = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useProfilePresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
      validationErrors: {},
      clearError: mockClearError,
      updateProfile: mockUpdateProfile,
    });
  });

  it('renders form fields correctly', () => {
    render(<ProfileView />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Personal Number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Changes' }))
      .toBeInTheDocument();
  });

  it('calls updateProfile with trimmed values', () => {
    render(<ProfileView />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: ' test@mail.com ' },
    });

    fireEvent.change(screen.getByLabelText('Personal Number'), {
      target: { value: ' 199001011234 ' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(mockUpdateProfile).toHaveBeenCalledWith({
      email: 'test@mail.com',
      pnr: '199001011234',
    });
  });

  it('disables button when loading', () => {
    (useProfilePresenter as any).mockReturnValue({
      state: { status: 'loading', message: '' },
      validationErrors: {},
      clearError: mockClearError,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileView />);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Updating...');
  });

  it('displays success message', () => {
    (useProfilePresenter as any).mockReturnValue({
      state: { status: 'success', message: 'Updated!' },
      validationErrors: {},
      clearError: mockClearError,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileView />);

    expect(screen.getByText('Updated!')).toBeInTheDocument();
  });

  it('displays email validation error', () => {
    (useProfilePresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
      validationErrors: { email: 'validation.email-invalid' },
      clearError: mockClearError,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileView />);

    expect(screen.getByText('validation.email-invalid')).toBeInTheDocument();
  });

  it('displays pnr validation error', () => {
    (useProfilePresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
      validationErrors: { pnr: 'validation.pnr-format' },
      clearError: mockClearError,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileView />);

    expect(screen.getByText('validation.pnr-format')).toBeInTheDocument();
  });

  it('clears email error on input change', () => {
    (useProfilePresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
      validationErrors: { email: 'validation.email-invalid' },
      clearError: mockClearError,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileView />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'new@mail.com' },
    });

    expect(mockClearError).toHaveBeenCalledWith('email');
  });

  it('clears pnr error on input change', () => {
    (useProfilePresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
      validationErrors: { pnr: 'validation.pnr-format' },
      clearError: mockClearError,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileView />);

    fireEvent.change(screen.getByLabelText('Personal Number'), {
      target: { value: '19900101-1234' },
    });

    expect(mockClearError).toHaveBeenCalledWith('pnr');
  });
});
