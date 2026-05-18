import { useState } from 'react';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  // Mock data for reservations
  const reservations = [
    { id: 'RES-001', name: 'Ahmad Faiz', date: '2023-11-20', time: '18:00', pax: 4, preorder: 'Ayam Rendang Rembayung', status: 'Confirmed' },
    { id: 'RES-002', name: 'Sarah Lee', date: '2023-11-20', time: '19:30', pax: 2, preorder: 'None', status: 'Confirmed' },
    { id: 'RES-003', name: 'Mohd Amir', date: '2023-11-21', time: '21:00', pax: 6, preorder: 'Masak Lemak Cili Api Daging Salai', status: 'Pending' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper animate-fade-in">
        <div className="admin-login-card">
          <div className="login-icon">🔒</div>
          <h2>Admin Access</h2>
          <p>Please enter the administrator password</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn-primary full-width mt-2">Login</button>
          </form>
          <p className="hint">Hint: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-header">
        <div className="admin-container">
          <h2>Restaurant Management Dashboard</h2>
          <p>SDG 9 Initiative: Digital Capacity & Resource Planning</p>
          <button className="btn-outline btn-logout" onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      </div>
      
      <div className="admin-container mt-4">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Today's Bookings</h3>
            <div className="stat-value">12</div>
          </div>
          <div className="stat-card">
            <h3>Total Pax</h3>
            <div className="stat-value">45</div>
          </div>
          <div className="stat-card highlight">
            <h3>Pre-orders (Waste Saved)</h3>
            <div className="stat-value">8</div>
          </div>
        </div>

        <div className="reservations-table-container">
          <h3>Upcoming Reservations</h3>
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Date & Time</th>
                <th>Pax</th>
                <th>Pre-order (SDG 9)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id}>
                  <td><strong>{res.id}</strong></td>
                  <td>{res.name}</td>
                  <td>{res.date} <br/> <span className="time-badge">{res.time}</span></td>
                  <td>{res.pax}</td>
                  <td>
                    {res.preorder !== 'None' ? (
                      <span className="preorder-badge">{res.preorder}</span>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${res.status.toLowerCase()}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-outline btn-sm">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
