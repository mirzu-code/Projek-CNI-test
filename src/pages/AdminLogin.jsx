import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Simple client-side check for demo purposes
    if (!username || !password) {
      setError('Please complete both fields.');
      return;
    }

    // Accept password 'admin123' for demo; any username/email allowed
    if (password === 'admin123') {
      navigate('/admin-dashboard');
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="admin-login-wrapper animate-fade-in">
      <div className="admin-login-card">
        <div className="admin-logo">LEMBAYUNG</div>
        <h2>Admin Access</h2>
        <p>Please enter your admin credentials</p>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            type="text"
            name="username"
            placeholder="Username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="admin-error">{error}</div>}
          <button type="submit" className="btn-primary full-width">Login</button>
          <p className="hint">Hint: admin123</p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
