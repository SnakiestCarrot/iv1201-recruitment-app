import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../views/LoginForm';
import { useAuthPresenter } from '../presenters/useAuthPresenter';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }: { children: React.ReactNode }) => (
    <a href="/register">{children}</a>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn(), language: 'en' },
  }),
}));

vi.mock('../presenters/useAuthPresenter');

describe('LoginForm Component', () => {
  const mockLoginUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthPresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
      loginUser: mockLoginUser,
    });
  });

  it('renders login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('common.username')).toBeInTheDocument();
    expect(screen.getByLabelText('common.password')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'auth.login' })
    ).toBeInTheDocument();
  });

  it('updates input fields when user types', () => {
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(
      'common.username'
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      'common.password'
    ) as HTMLInputElement;

    // Simulate typing
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls loginUser with credentials when form is submitted', () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('common.username'), {
      target: { value: 'myUser' },
    });
    fireEvent.change(screen.getByLabelText('common.password'), {
      target: { value: 'myPass' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'auth.login' }));

    expect(mockLoginUser).toHaveBeenCalledTimes(1);
    expect(mockLoginUser).toHaveBeenCalledWith({
      username: 'myUser',
      password: 'myPass',
    });
  });

  it('disables the submit button when loading', () => {
    (useAuthPresenter as any).mockReturnValue({
      state: { status: 'loading', message: 'Logging in...' },
      loginUser: mockLoginUser,
    });

    render(<LoginForm />);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();

    expect(button).toHaveTextContent('auth.verification');
  });

  it('displays error message when state is error', () => {
    (useAuthPresenter as any).mockReturnValue({
      state: { status: 'error', message: 'Invalid credentials' },
      loginUser: mockLoginUser,
    });

    render(<LoginForm />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
