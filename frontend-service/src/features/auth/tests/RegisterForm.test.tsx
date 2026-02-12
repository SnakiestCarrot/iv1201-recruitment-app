import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RegisterForm } from '../views/RegisterForm';
import { useAuthPresenter } from '../presenters/useAuthPresenter';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }: { children: React.ReactNode }) => (
    <a href="/login">{children}</a>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn(), language: 'en' },
  }),
}));

vi.mock('../presenters/useAuthPresenter');

describe('RegisterForm Component', () => {
  const mockRegisterUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthPresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
      validationErrors: {},
      registerUser: mockRegisterUser,
      clearError: vi.fn(),
    });
  });

  it('renders registration form correctly', () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText('common.username')).toBeInTheDocument();
    expect(screen.getByLabelText('common.password')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.confirm-password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'auth.register' })
    ).toBeInTheDocument();
  });

  it('updates input fields when user types', () => {
    render(<RegisterForm />);

    const userInput = screen.getByLabelText(
      'common.username'
    ) as HTMLInputElement;
    const passInput = screen.getByLabelText(
      'common.password'
    ) as HTMLInputElement;
    const confirmInput = screen.getByLabelText(
      'auth.confirm-password'
    ) as HTMLInputElement;

    fireEvent.change(userInput, { target: { value: 'newuser' } });
    fireEvent.change(passInput, { target: { value: 'pass123' } });
    fireEvent.change(confirmInput, { target: { value: 'pass123' } });

    expect(userInput.value).toBe('newuser');
    expect(passInput.value).toBe('pass123');
    expect(confirmInput.value).toBe('pass123');
  });

  it('displays password mismatch error from presenter', () => {
    (useAuthPresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
      validationErrors: { confirmPassword: 'auth.password-mismatch' },
      registerUser: mockRegisterUser,
      clearError: vi.fn(),
    });

    render(<RegisterForm />);

    expect(screen.getByText('auth.password-mismatch')).toBeInTheDocument();
  });

  it('displays password length error from presenter', () => {
    (useAuthPresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
      validationErrors: { password: 'auth.insufficient-password-length' },
      registerUser: mockRegisterUser,
      clearError: vi.fn(),
    });

    render(<RegisterForm />);

    expect(
      screen.getByText('auth.insufficient-password-length')
    ).toBeInTheDocument();
  });

  it('calls registerUser when inputs are valid', () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText('common.username'), {
      target: { value: 'validUser' },
    });
    fireEvent.change(screen.getByLabelText('common.password'), {
      target: { value: 'validPass123' },
    });
    fireEvent.change(screen.getByLabelText('auth.confirm-password'), {
      target: { value: 'validPass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'auth.register' }));

    expect(mockRegisterUser).toHaveBeenCalledWith({
      username: 'validUser',
      password: 'validPass123',
      confirmPassword: 'validPass123',
    });
  });

  it('displays backend error message', () => {
    (useAuthPresenter as any).mockReturnValue({
      state: { status: 'error', message: 'Username taken' },
      validationErrors: {},
      registerUser: mockRegisterUser,
      clearError: vi.fn(),
    });

    render(<RegisterForm />);
    expect(screen.getByText('Username taken')).toBeInTheDocument();
  });
});
