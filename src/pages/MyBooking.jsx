import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyBooking.css';

const MyBooking = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const loadBooking = () => {
      const savedBooking = localStorage.getItem('activeBooking');
      if (savedBooking) {
        setBooking(JSON.parse(savedBooking));
      }
    };
    
    loadBooking();
    
    // Live Polling every 1.5 seconds to synchronize check-in state!
    const interval = setInterval(loadBooking, 1500);
    return () => clearInterval(interval);
  }, []);

  if (!booking) {
    return (
      <div className="my-booking-page animate-fade-in">
        <div className="no-booking">
          <div className="icon">📭</div>
          <h2>No Active Booking Found</h2>
          <p>It looks like you haven't made a reservation yet, or your past reservation has been completed.</p>
          <Link to="/book" className="btn-primary mt-3">Make a Reservation</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-booking-page animate-fade-in">
      <div className="booking-header-banner">
        <div className="container">
          <h2>Your Reservation</h2>
          <p>Present this digital ticket upon arrival.</p>
        </div>
      </div>
      
      <div className="container mt-4">
        <div className={`ticket-card ${booking.status === 'Checked In' ? 'is-checked-in' : ''}`}>
          {booking.status === 'Checked In' && (
            <div className="checked-in-seal-overlay animate-zoom-in">
              <div className="seal-inner">
                <span className="seal-text">VERIFIED</span>
                <span className="seal-status">ARRIVED</span>
                <span className="seal-date">{new Date().toLocaleDateString('en-MY', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
              </div>
            </div>
          )}
          
          <div className="ticket-header">
            <h3>{booking.id}</h3>
            <span className={`status-badge ${booking.status.toLowerCase().replace(' ', '-')}`}>{booking.status}</span>
          </div>
          
          <div className="ticket-body">
            <div className="qr-placeholder">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.id}`} alt="QR Code" />
              <small>Scan at Entrance</small>
            </div>
            
            <div className="ticket-details">
              <div className="detail-row">
                <span className="label">Date</span>
                <span className="value">{booking.date}</span>
              </div>
              <div className="detail-row">
                <span className="label">Time</span>
                <span className="value">{booking.time}</span>
              </div>
              <div className="detail-row">
                <span className="label">Guests</span>
                <span className="value">{booking.pax} Person(s)</span>
              </div>
              <div className="detail-row">
                <span className="label">Name</span>
                <span className="value">{booking.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Phone</span>
                <span className="value">{booking.phone}</span>
              </div>
              
              {booking.preorder && (
                <div className="detail-row highlight mt-2">
                  <span className="label">SDG 9 Pre-order</span>
                  <span className="value">{booking.dish.replace('-', ' ')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="ticket-footer">
            <p><strong>Note:</strong> Please arrive 10 minutes early. Late arrivals beyond 15 minutes may result in cancellation.</p>
            <button 
              className="btn-outline mt-3 full-width" 
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this booking?')) {
                  localStorage.removeItem('activeBooking');
                  navigate('/');
                  window.location.reload();
                }
              }}
            >
              Cancel Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBooking;
