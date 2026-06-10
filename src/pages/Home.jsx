import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-copy animate-fade-in">
          <span className="subtitle">Kampung Baru, Kuala Lumpur</span>
          <h1>Experience Authentic Malay Culinary Heritage</h1>
          <p>
            Strictly by reservation only. Join us in our modern glasshouse surrounded by traditional kampung ambiance.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn-primary" onClick={() => navigate('/book')}>
              Book a Table
            </button>
            <button type="button" className="btn-outline" onClick={() => navigate('/menu')}>
              View Menu
            </button>
          </div>
        </div>
      </section>

      <section className="home-highlights">
        <div className="home-intro">
          <h2>Welcome to Lembayung</h2>
          <p>
            At Lembayung, we blend modern hospitality with rich Malay culinary traditions. Every visit is curated for guests who seek a calm and elegant dining experience.
          </p>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Signature Flavors</h3>
            <p>Discover carefully prepared recipes inspired by local heritage and fresh seasonal ingredients.</p>
          </article>
          <article className="feature-card">
            <h3>Quiet Reservation</h3>
            <p>We keep the restaurant by reservation only to ensure attentive service and a relaxed dining atmosphere.</p>
          </article>
          <article className="feature-card">
            <h3>Curated Dining</h3>
            <p>From starter to dessert, the menu is designed to feel warm, authentic, and beautifully presented.</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Home;
