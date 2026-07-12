// 📁 Αρχείο: React-app-1/src/LoginForm.jsx
import { useState } from 'react';

export default function LoginForm({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 State για την εμφάνιση του κωδικού
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const baseUrl = "https://react-web-aoqq.onrender.com";
    const endpoint = isRegistering 
    ? `${baseUrl}/api/auth/register` 
    : `${baseUrl}/api/auth/login`;

    fetch( endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      return res.json().then(data => {
        if (!res.ok) throw new Error(data.message || 'Κάτι πήγε στραβά');
        return data;
      });
    })
    .then(data => {
      if (isRegistering) {
        setMessage(data.message);
        setIsRegistering(false);
        setPassword('');
        setShowPassword(false); // Reset το ματάκι μετά την εγγραφή
      } else {
        localStorage.setItem('token', data.token);
        onLoginSuccess();
      }
    })
    .catch(err => {
      setError(err.message);
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegistering ? 'Δημιουργία Λογαριασμού 📝' : 'Είσοδος 🔐'}</h2>
        
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="auth-input"
            />
          </div>
          
          <div className="auth-form-group">
            <label>Password:</label>
            {/* 🔽 ΕΔΩ: Ένα container που κρατάει το input και το κουμπί μαζί */}
            <div className="password-input-wrapper">
              <input 
                // 🔽 Αλλάζει δυναμικά από password σε text
                type={isRegistering && showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="auth-input password-field"
              />
              
              {/* 👁️ Το κουμπί-ματάκι εμφανίζεται ΜΟΝΟ στο Register */}
              {isRegistering && (
                <button 
                  type="button" 
                  className="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              )}
            </div>
          </div>
          
          <button type="submit" className="btn-auth-submit">
            {isRegistering ? 'Εγγραφή' : 'Σύνδεση'}
          </button>
        </form>

        <div className="auth-toggle-zone">
          <button 
            className="btn-auth-toggle" 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setMessage('');
              setShowPassword(false); // Reset όταν αλλάζεις οθόνες
            }}
          >
            {isRegistering 
              ? 'Έχετε ήδη λογαριασμό; Σύνδεση εδώ' 
              : 'Δεν έχετε λογαριασμό; Εγγραφή εδώ'}
          </button>
        </div>
      </div>
    </div>
  );
}