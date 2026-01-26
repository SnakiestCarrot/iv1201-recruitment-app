import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthPresenter } from '../presenters/useAuthPresenter';

export const RegisterForm = () => {
  const { state, registerUser } = useAuthPresenter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
        setValidationError("Password must be at least 6 characters.");
        return;
    }

    registerUser({ username, password });
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            style={{ 
              borderColor: validationError ? 'red' : undefined 
            }}
          />
        </div>

        <button type="submit" disabled={state.status === 'loading'}>
          {state.status === 'loading' ? 'Creating...' : 'Register'}
        </button>
      </form>
      
      {validationError && (
        <p className="status-msg error">
          {validationError}
        </p>
      )}

      {state.message && !validationError && (
        <p className={`status-msg ${state.status}`}>
          {state.message}
        </p>
      )}

      <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <p>Already have an account?</p>
        <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};