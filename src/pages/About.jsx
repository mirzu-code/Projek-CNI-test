import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const metrics = [
    { label: 'Food Waste Reduction', value: 94, desc: 'Digital pre-ordering enables precise ingredients sourcing, avoiding waste.' },
    { label: 'Sourcing Sourcing Efficiency', value: 98, desc: 'Direct-from-farm partnerships within Kuala Lumpur and Selangor rural areas.' },
    { label: 'Digital Capacity Optimization', value: 100, desc: '100% paperless scheduling, prevents overcrowding and kitchen overload.' },
    { label: 'Clean Energy & Water Recirculation', value: 82, desc: 'Rainwater harvesting and low-impact LED glasshouse microclimate ventilation.' }
  ];

  const chefs = [
    {
      name: 'Chef Kamaruddin Ibrahim',
      role: 'Head Chef & Culinary Director',
      bio: 'Over 25 years of fine dining expertise. Dedicated to preserving ancient Malay techniques while integrating modern presentation.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Chef Mei Ling Chen',
      role: 'Pastry & Chinese Cuisine Artisan',
      bio: 'Trained in Shanghai and Paris. A master at creating harmonious pastries and delicate traditional Chinese steamed specialities.',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="about-page animate-fade-in">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content text-center">
          <span className="subtitle">Our Architecture & Story</span>
          <h1>A Modern Glasshouse with Kampung Heritage</h1>
          <p>Strictly by reservation. Dine inside a sleek glass structure surrounded by rustic traditional Kampung Baru vibes.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story-section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-text">
              <h2>Preserving Heritage, Embracing Innovation</h2>
              <p>
                Lembayung was founded in the heart of Kuala Lumpur\'s historic Kampung Baru enclave. 
                Our architectural blueprint is a visual representation of progress: a futuristic glasshouse surrounded by 
                traditional wooden Malay stilt houses. This marriage of old and new defines our culinary mission.
              </p>
              <p>
                We serve culinary treasures from across Malaysia and Asia—from rich Malay *Masak Lemak* and delicate Chinese *Steamed Bass* 
                to precise Japanese *Wagyu Ramen*. Each dish represents structural history, cooked with cutting-edge tools and sustainable precision.
              </p>
            </div>
            <div className="about-story-media">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" alt="Lembayung Glasshouse Interior" className="about-img animate-zoom-in" />
            </div>
          </div>
        </div>
      </section>

      {/* SDG 9 Commitments - Interactive Metric Bars */}
      <section className="about-sdg-metrics-section">
        <div className="container">
          <div className="metrics-header text-center">
            <span className="sdg-badge">SDG 9 Alignment</span>
            <h2>Resilient Industry & Sustainable Infrastructure</h2>
            <p>
              How digital innovation drives our sustainable kitchen management. 
              By requiring reservations and pre-orders, we operate a highly efficient, resilient ecosystem.
            </p>
          </div>

          <div className="metrics-progress-container">
            {metrics.map((m, idx) => (
              <div key={idx} className="metric-progress-item">
                <div className="metric-progress-labels">
                  <strong>{m.label}</strong>
                  <span className="metric-percentage">{m.value}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${m.value}%` }}></div>
                </div>
                <p className="metric-desc-text">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisans Section */}
      <section className="about-chefs-section">
        <div className="container">
          <h2 className="section-title text-center">Our Culinary Artisans</h2>
          <div className="chefs-grid">
            {chefs.map((c, idx) => (
              <div key={idx} className="chef-profile-card">
                <div className="chef-image-container">
                  <img src={c.image} alt={c.name} />
                </div>
                <div className="chef-info-box">
                  <h3>{c.name}</h3>
                  <span className="chef-role-badge">{c.role}</span>
                  <p>{c.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="about-cta-footer">
        <div className="container text-center">
          <h2>Experience the Harmony in Person</h2>
          <p>Secure your slot. Immerse yourself in authentic tastes, stunning aesthetics, and sustainable dining.</p>
          <Link to="/book" className="btn-primary">Reserve My Glasshouse Table</Link>
        </div>
      </section>
    </div>
  );
};

export default About;
