import { useState } from 'react';

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Στέλνουμε τα στοιχεία στο backend
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (!res.ok) throw new Error('Λάθος username ή password');
      return res.json();
    })
    .then(data => {
      // 👑 ΕΔΩ ΓΙΝΕΤΑΙ Η ΜΑΓΕΙΑ: Αποθήκευση του JWT στο localStorage!
      localStorage.setItem('token', data.token);
      
      // Ενημερώνουμε το App component ότι πετύχαμε
      onLoginSuccess();
    })
    .catch(err => {
      setError(err.message);
    });
  };

  return (
   <div style={{ maxWidth: '350px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: '#222', color: '#fff' }}>
      <h2>Login 🔐</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
          />
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Είσοδος
        </button>
      </form>
    </div>
  );
}