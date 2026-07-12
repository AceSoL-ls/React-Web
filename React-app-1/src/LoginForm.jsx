// 📁 Αρχείο: React-app-1/src/LoginForm.jsx
import { useState } from 'react';

export default function LoginForm({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false); // 👈 State για να ξέρουμε ποιο view δείχνουμε
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Για μηνύματα επιτυχίας (π.χ. "Η εγγραφή πέτυχε!")
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Καθορίζουμε το URL και το τι περιμένουμε ανάλογα με το αν κάνουμε Login ή Register
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

    fetch(endpoint, {
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
        // Αν πετύχει το Register
        setMessage(data.message); // Δείξε το πράσινο μήνυμα επιτυχίας
        setIsRegistering(false);  // Γύρνα τον χρήστη αυτόματα στη φόρμα του Login
        setPassword('');          // Καθάρισε το password για ασφάλεια
      } else {
        // Αν πετύχει το Login
        localStorage.setItem('token', data.token); // 🎟️ Αποθήκευση του JWT
        onLoginSuccess(); // Ενημέρωση του App.jsx
      }
    })
    .catch(err => {
      setError(err.message);
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Δυναμικός Τίτλος ανάλογα με το State */}
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
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="auth-input"
            />
          </div>
          
          <button type="submit" className="btn-auth-submit">
            {isRegistering ? 'Εγγραφή' : 'Σύνδεση'}
          </button>
        </form>

        {/* Κουμπί εναλλαγής μεταξύ Login και Register */}
        <div className="auth-toggle-zone">
          <button 
            className="btn-auth-toggle" 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setMessage('');
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