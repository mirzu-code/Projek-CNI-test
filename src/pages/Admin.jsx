import { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState([]);
  const [selectedRes, setSelectedRes] = useState(null); // for managing a specific booking

  // Initial mock data
  const defaultReservations = [
    { id: 'RES-3921', name: 'Ahmad Faiz', date: '2026-05-20', time: '18:00', pax: 4, preorder: true, dish: 'ayam-rendang', status: 'Confirmed' },
    { id: 'RES-8821', name: 'Sarah Lee', date: '2026-05-20', time: '19:30', pax: 2, preorder: false, dish: '', status: 'Confirmed' },
    { id: 'RES-1049', name: 'Mohd Amir', date: '2026-05-21', time: '21:00', pax: 6, preorder: true, dish: 'masak-lemak', status: 'Pending' },
  ];

  useEffect(() => {
    // Load bookings from localStorage
    const saved = localStorage.getItem('allBookings');
    if (saved) {
      setReservations(JSON.parse(saved));
    } else {
      // Initialize with default mock data
      localStorage.setItem('allBookings', JSON.stringify(defaultReservations));
      setReservations(defaultReservations);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = reservations.map(res => 
      res.id === id ? { ...res, status: newStatus } : res
    );
    setReservations(updated);
    localStorage.setItem('allBookings', JSON.stringify(updated));
    setSelectedRes(null);

    // If the updated booking matches the user's active booking in localStorage, update that too
    const active = localStorage.getItem('activeBooking');
    if (active) {
      const activeObj = JSON.parse(active);
      if (activeObj.id === id) {
        activeObj.status = newStatus;
        localStorage.setItem('activeBooking', JSON.stringify(activeObj));
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      const updated = reservations.filter(res => res.id !== id);
      setReservations(updated);
      localStorage.setItem('allBookings', JSON.stringify(updated));
      setSelectedRes(null);

      const active = localStorage.getItem('activeBooking');
      if (active) {
        const activeObj = JSON.parse(active);
        if (activeObj.id === id) {
          localStorage.removeItem('activeBooking');
        }
      }
    }
  };

  // Calculate dynamic stats
  const totalBookings = reservations.length;
  const totalPax = reservations.reduce((sum, res) => sum + parseInt(res.pax || 0), 0);
  const totalPreorders = reservations.filter(res => res.preorder).length;

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
            <h3>Total Bookings</h3>
            <div className="stat-value">{totalBookings}</div>
          </div>
          <div className="stat-card">
            <h3>Total Pax</h3>
            <div className="stat-value">{totalPax}</div>
          </div>
          <div className="stat-card highlight">
            <h3>Pre-orders (Waste Saved)</h3>
            <div className="stat-value">{totalPreorders}</div>
          </div>
        </div>

        {/* Action Panel for selected booking */}
        {selectedRes && (
          <div className="action-panel animate-fade-in">
            <h3>Manage Booking: {selectedRes.id}</h3>
            <p>Guest: <strong>{selectedRes.name}</strong> ({selectedRes.pax} pax)</p>
            <div className="action-buttons">
              <button className="btn-primary btn-sm btn-success" onClick={() => handleUpdateStatus(selectedRes.id, 'Confirmed')}>
                Confirm / Approve
              </button>
              <button className="btn-outline btn-sm btn-warn" onClick={() => handleUpdateStatus(selectedRes.id, 'Pending')}>
                Set to Pending
              </button>
              <button className="btn-outline btn-sm btn-danger" onClick={() => handleUpdateStatus(selectedRes.id, 'Cancelled')}>
                Cancel Reservation
              </button>
              <button className="btn-danger btn-sm" onClick={() => handleDelete(selectedRes.id)}>
                Delete Completely
              </button>
              <button className="btn-outline btn-sm" onClick={() => setSelectedRes(null)}>
                Close
              </button>
            </div>
          </div>
        )}

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
                <tr key={res.id} className={selectedRes?.id === res.id ? 'active-row' : ''}>
                  <td><strong>{res.id}</strong></td>
                  <td>{res.name}</td>
                  <td>{res.date} <br/> <span className="time-badge">{res.time}</span></td>
                  <td>{res.pax}</td>
                  <td>
                    {res.preorder && res.dish ? (
                      <span className="preorder-badge">{res.dish.replace('-', ' ')}</span>
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
                    <button className="btn-outline btn-sm" onClick={() => setSelectedRes(res)}>
                      Manage
                    </button>
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
