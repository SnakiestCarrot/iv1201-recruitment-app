import { useState } from 'react';
import { useProfilePresenter } from '../presenters/useProfilePresenter';
import '../styles/ProfileView.css';

/**
 * Profile view component allowing authenticated users
 * to update their email and personal number (pnr).
 */
export const ProfileView = () => {
  const { state, updateProfile } = useProfilePresenter();

  const [email, setEmail] = useState('');
  const [pnr, setPnr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      email: email.trim() || undefined,
      pnr: pnr.trim() || undefined,
    });
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Update Profile</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="profile-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pnr">Personal Number</label>
          <input
            id="pnr"
            type="text"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            className="profile-input"
            placeholder="YYYYMMDDXXXX"
          />
        </div>

        <button
          type="submit"
          disabled={state.status === 'loading'}
          className="profile-button"
        >
          {state.status === 'loading' ? 'Updating...' : 'Save Changes'}
        </button>
      </form>

      {state.message && (
        <p className={`profile-message ${state.status}`}>
          {state.message}
        </p>
      )}
    </div>
  );
};
