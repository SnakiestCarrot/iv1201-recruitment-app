import { useState } from 'react';
import { Link } from 'react-router-dom'; // <--- Import Link
import { useAuthPresenter } from '../presenters/useAuthPresenter';

export const LoginForm = () => {
  const { state, loginUser } = useAuthPresenter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ username, password });
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
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
        <button type="submit" disabled={state.status === 'loading'}>
          {state.status === 'loading' ? 'Verifying...' : 'Login'}
        </button>
      </form>
      
      {state.message && (
        <p className={`status-msg ${state.status}`}>
          {state.message}
        </p>
      )}

      <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <p>Don't have an account?</p>
        <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};