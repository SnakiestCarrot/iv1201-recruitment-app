import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileView } from '../views/ProfileView';
import { useProfilePresenter } from '../presenters/useProfilePresenter';

vi.mock('../presenters/useProfilePresenter');

describe('ProfileView', () => {
  const mockUpdateProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useProfilePresenter as any).mockReturnValue({
      state: { status: 'idle', message: '' },
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
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileView />);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Updating...');
  });

  it('displays success message', () => {
    (useProfilePresenter as any).mockReturnValue({
      state: { status: 'success', message: 'Updated!' },
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileView />);

    expect(screen.getByText('Updated!')).toBeInTheDocument();
  });
});
