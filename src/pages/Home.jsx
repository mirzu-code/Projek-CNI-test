import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    const savedBooking = localStorage.getItem('activeBooking');
    if (savedBooking) {
      setActiveBooking(JSON.parse(savedBooking));
    }
  }, []);

  return (
    <div className="home-page animate-fade-in">
      {activeBooking && (
        <div className="active-booking-banner">
          <div className="home-intro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <strong>You have an active booking!</strong>
              <div>{activeBooking.date} at {activeBooking.time}</div>
            </div>
            <Link to="/my-booking" className="btn-outline">View Ticket</Link>
          </div>
        </div>
      )}

      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-copy animate-fade-in">
          <span className="subtitle">Kampung Baru, Kuala Lumpur</span>
          <h1>Experience Authentic Malay Culinary Heritage</h1>
          <p>Strictly by reservation only. Join us in our modern glasshouse surrounded by traditional kampung ambiance.</p>
          <div className="hero-actions">
            {!activeBooking ? (
              <Link to="/book" className="btn-primary">Book a Table</Link>
            ) : (
              <Link to="/my-booking" className="btn-primary">View My Booking</Link>
            )}
          </div>
        </div>
      </section>

      <section className="home-highlights">
        <div className="home-intro">
          <h2>Commitment to Sustainable Innovation</h2>
          <p>
            At Lembayung, we align with <strong>SDG 9: Industry, Innovation, and Infrastructure</strong>.
            Our digital booking system is an innovative approach to restaurant management.
            By using smart capacity planning and meal pre-orders, we prevent overbooking, optimize our supply chain,
            and reduce food waste.
          </p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Digital Infrastructure</h3>
            <p>100% paperless reservation and ticketing system for a greener future.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Capacity</h3>
            <p>Advanced slot management ensures a comfortable, uncrowded dining experience.</p>
          </div>
          <div className="feature-card">
            <h3>Waste Reduction</h3>
            <p>Pre-ordering helps us source precisely what is needed, minimizing culinary waste.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
