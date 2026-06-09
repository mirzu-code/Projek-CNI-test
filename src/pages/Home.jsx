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
    <div className="home">
      {/* Active Booking Banner */}
      {activeBooking && (
        <div className="active-booking-banner animate-fade-in">
          <div className="container banner-content">
            <span className="banner-icon">🎟️</span>
            <div>
              <strong>You have an active reservation!</strong>
              <span> {activeBooking.date} at {activeBooking.time}</span>
            </div>
            <Link to="/my-booking" className="btn-outline btn-sm">View Ticket</Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content animate-fade-in">
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

      {/* SDG 9 Section */}
      <section className="sdg-section">
        <div className="container">
          <div className="sdg-content">
            <div className="sdg-text">
              <h2>Commitment to Sustainable Innovation</h2>
              <p>
                At Lembayung, we align with <strong>SDG 9: Industry, Innovation, and Infrastructure</strong>. 
                Our strict digital booking system is an innovative approach to restaurant management. 
                By utilizing smart capacity planning and offering meal pre-orders, we build resilient infrastructure that prevents overbooking, optimizes our supply chain, and significantly reduces food waste.
              </p>
            </div>
            <div className="sdg-features">
              <div className="feature-card">
                <div className="icon-wrapper">🌍</div>
                <h3>Digital Infrastructure</h3>
                <p>100% paperless reservation and ticketing system for a greener future.</p>
              </div>
              <div className="feature-card">
                <div className="icon-wrapper">💡</div>
                <h3>Smart Capacity</h3>
                <p>Advanced slot management ensures a comfortable, uncrowded dining experience.</p>
              </div>
              <div className="feature-card">
                <div className="icon-wrapper">♻️</div>
                <h3>Waste Reduction</h3>
                <p>Pre-ordering helps us source precisely what is needed, minimizing culinary waste.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
