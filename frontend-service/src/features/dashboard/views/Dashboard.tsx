import { useDashboardPresenter } from '../presenters/useDashboardPresenter';

export const Dashboard = () => {
  const { username, roleId, logout } = useDashboardPresenter();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome, {username}!</h1>
      <p>You have role ID: {roleId}</p>
      <div style={{ padding: '20px', border: '1px solid #4CAF50', display: 'inline-block', borderRadius: '8px', backgroundColor: '#f0fff4' }}>
        <h3 style={{ color: '#2e7d32', margin: 0 }}>
          You are successfully logged in.
        </h3>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={logout}
          style={{ padding: '10px 20px', backgroundColor: '#b8120cff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};