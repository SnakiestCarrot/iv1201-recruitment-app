import { useState } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState<string>('Idle');

  const pingGateway = async () => {
    setStatus('Sending request...');
    try {
      // we use '/auth/test' so the Gateway route matches it
      await fetch('http://localhost:8080/auth/test');
      setStatus('Request sent! Check Docker logs.');
    } catch (error) {
      console.error(error);
      setStatus('Error connecting to Gateway');
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Integration Test</h1>
      <div style={{ marginBottom: '20px' }}>
        Current Status: <strong>{status}</strong>
      </div>
      <button onClick={pingGateway} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Ping API Gateway
      </button>
    </div>
  );
}

export default App;