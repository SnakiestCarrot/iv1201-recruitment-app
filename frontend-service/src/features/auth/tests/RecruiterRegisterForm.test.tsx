import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecruiterRegisterForm } from '../views/RecruiterRegisterForm';
import { useRecruiterAuthPresenter } from '../presenters/useRecruiterAuthPresenter';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn(), language: 'en' },
  }),
}));

vi.mock('../presenters/useRecruiterAuthPresenter');

describe('RecruiterRegisterForm Component', () => {
  const mockRegisterRecruiter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRecruiterAuthPresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
      registerRecruiter: mockRegisterRecruiter,
    });
  });

  it('renders recruiter registration form correctly', () => {
    render(<RecruiterRegisterForm />);

    expect(screen.getByText('auth.recruiter-register')).toBeInTheDocument();
    expect(screen.getByLabelText('common.username')).toBeInTheDocument();
    expect(screen.getByLabelText('common.password')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.confirm-password')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.secret-code')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'auth.register' })
    ).toBeInTheDocument();
  });

  it('updates input fields when user types', () => {
    render(<RecruiterRegisterForm />);

    const usernameInput = screen.getByLabelText(
      'common.username'
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      'common.password'
    ) as HTMLInputElement;
    const confirmInput = screen.getByLabelText(
      'auth.confirm-password'
    ) as HTMLInputElement;
    const secretCodeInput = screen.getByLabelText(
      'auth.secret-code'
    ) as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: 'recruiter1' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.change(secretCodeInput, { target: { value: 'secret123' } });

    expect(usernameInput.value).toBe('recruiter1');
    expect(passwordInput.value).toBe('password123');
    expect(confirmInput.value).toBe('password123');
    expect(secretCodeInput.value).toBe('secret123');
  });

  it('shows error and does not call register if passwords mismatch', () => {
    render(<RecruiterRegisterForm />);

    fireEvent.change(screen.getByLabelText('common.username'), {
      target: { value: 'recruiter1' },
    });
    fireEvent.change(screen.getByLabelText('common.password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('auth.confirm-password'), {
      target: { value: 'different' },
    });
    fireEvent.change(screen.getByLabelText('auth.secret-code'), {
      target: { value: 'secret' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'auth.register' }));

    expect(screen.getByText('auth.password-mismatch')).toBeInTheDocument();
    expect(mockRegisterRecruiter).not.toHaveBeenCalled();
  });

  it('shows error if password is too short', () => {
    render(<RecruiterRegisterForm />);

    fireEvent.change(screen.getByLabelText('common.username'), {
      target: { value: 'recruiter1' },
    });
    fireEvent.change(screen.getByLabelText('common.password'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByLabelText('auth.confirm-password'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByLabelText('auth.secret-code'), {
      target: { value: 'secret' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'auth.register' }));

    expect(
      screen.getByText('auth.insufficient-password-length')
    ).toBeInTheDocument();
    expect(mockRegisterRecruiter).not.toHaveBeenCalled();
  });

  it('shows error if secret code is empty', () => {
    render(<RecruiterRegisterForm />);

    fireEvent.change(screen.getByLabelText('common.username'), {
      target: { value: 'recruiter1' },
    });
    fireEvent.change(screen.getByLabelText('common.password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('auth.confirm-password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('auth.secret-code'), {
      target: { value: '   ' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'auth.register' }));

    expect(screen.getByText('auth.secret-code-required')).toBeInTheDocument();
    expect(mockRegisterRecruiter).not.toHaveBeenCalled();
  });

  it('calls registerRecruiter when inputs are valid', () => {
    render(<RecruiterRegisterForm />);

    fireEvent.change(screen.getByLabelText('common.username'), {
      target: { value: 'recruiter1' },
    });
    fireEvent.change(screen.getByLabelText('common.password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('auth.confirm-password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('auth.secret-code'), {
      target: { value: 'secret123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'auth.register' }));

    expect(mockRegisterRecruiter).toHaveBeenCalledWith({
      username: 'recruiter1',
      password: 'password123',
      secretCode: 'secret123',
    });
  });

  it('disables submit button when loading', () => {
    (useRecruiterAuthPresenter as any).mockReturnValue({
      state: { status: 'loading', message: 'Creating account...' },
      registerRecruiter: mockRegisterRecruiter,
    });

    render(<RecruiterRegisterForm />);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('auth.creating');
  });

  it('displays backend error message', () => {
    (useRecruiterAuthPresenter as any).mockReturnValue({
      state: { status: 'error', message: 'Invalid secret code' },
      registerRecruiter: mockRegisterRecruiter,
    });

    render(<RecruiterRegisterForm />);

    expect(screen.getByText('Invalid secret code')).toBeInTheDocument();
  });

  it('displays success message', () => {
    (useRecruiterAuthPresenter as any).mockReturnValue({
      state: {
        status: 'success',
        message: 'Recruiter registered successfully',
      },
      registerRecruiter: mockRegisterRecruiter,
    });

    render(<RecruiterRegisterForm />);

    expect(
      screen.getByText('Recruiter registered successfully')
    ).toBeInTheDocument();
  });

  it('renders links to register as applicant and login', () => {
    render(<RecruiterRegisterForm />);

    expect(screen.getByText('auth.register-as-applicant')).toBeInTheDocument();
    expect(screen.getByText('auth.already-have-account')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    const registerLink = links.find((link) => link.getAttribute('href') === '/register');
    const loginLink = links.find((link) => link.getAttribute('href') === '/login');

    expect(registerLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });

  it('applies error class to confirm password input when validation error exists', () => {
    render(<RecruiterRegisterForm />);

    fireEvent.change(screen.getByLabelText('common.username'), {
      target: { value: 'recruiter1' },
    });
    fireEvent.change(screen.getByLabelText('common.password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('auth.confirm-password'), {
      target: { value: 'different' },
    });
    fireEvent.change(screen.getByLabelText('auth.secret-code'), {
      target: { value: 'secret' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'auth.register' }));

    const confirmInput = screen.getByLabelText('auth.confirm-password');

    expect(confirmInput).toHaveClass('register-input-error');
  });

  it('clears validation error when form is resubmitted', () => {
    render(<RecruiterRegisterForm />);

    fireEvent.change(screen.getByLabelText('common.username'), {
      target: { value: 'recruiter1' },
    });
    fireEvent.change(screen.getByLabelText('common.password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('auth.confirm-password'), {
      target: { value: 'different' },
    });
    fireEvent.change(screen.getByLabelText('auth.secret-code'), {
      target: { value: 'secret' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'auth.register' }));

    expect(screen.getByText('auth.password-mismatch')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('auth.confirm-password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'auth.register' }));

    expect(screen.queryByText('auth.password-mismatch')).not.toBeInTheDocument();
  });

  it('secret code field has password type', () => {
    render(<RecruiterRegisterForm />);

    const secretCodeInput = screen.getByLabelText('auth.secret-code');

    expect(secretCodeInput).toHaveAttribute('type', 'password');
  });
});
