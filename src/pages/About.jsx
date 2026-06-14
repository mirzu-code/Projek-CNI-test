import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const metrics = [
    { label: 'Food Waste Reduction', value: 94, desc: 'Digital pre-ordering enables precise ingredients sourcing, avoiding waste.' },
    { label: 'Direct Sourcing Efficiency', value: 98, desc: 'Direct-from-farm partnerships within Kuala Lumpur and Selangor rural areas.' },
    { label: 'Digital Capacity Optimization', value: 100, desc: '100% paperless scheduling, prevents overcrowding and kitchen overload.' },
    { label: 'Clean Energy & Water Recirculation', value: 82, desc: 'Rainwater harvesting and low-impact LED glasshouse microclimate ventilation.' }
  ];

  const chefs = [
    {
      name: 'Chef Kamaruddin Ibrahim',
      role: 'Head Chef & Culinary Director',
      bio: 'Holding prestigious international culinary certificates and fully recognized as a Master Chef. Exceptionally skilled and powerful in the kitchen, he is a true master of all cuisines. From traditional Asian classics to modern Western gastronomy, he flawlessly executes every culinary style with his 25 years of fine dining expertise.',
      image: '/man pastry cheff.jpg'
    },
    {
      name: 'Chef Mei Ling Chen',
      role: 'Master Pastry Chef',
      bio: 'A certified Master Chef with international qualifications specializing entirely in delicate pastries and desserts. Bringing absolute power and finesse to the bakery, she utilizes her professional training from Paris to create the perfect balance of sweet flavors and stunning dessert artistry.',
      image: '/woman pastry cheff.jpg'
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
                Lembayung was founded in the heart of Kuala Lumpur's historic Kampung Baru enclave.
                Our architectural blueprint is a visual representation of progress: a futuristic glasshouse surrounded by
                traditional wooden Malay stilt houses. This marriage of old and new defines our culinary mission.
              </p>
              <p>
                We serve culinary treasures from across Malaysia and Asia—from rich Malay <strong>Masak Lemak</strong> and delicate Chinese <strong>Steamed Bass</strong>
                to precise Japanese <strong> Wagyu Ramen</strong>. Each dish represents structural history, cooked with cutting-edge tools and sustainable precision.
              </p>
              <p>
                We take our craft very seriously, but the only thing more serious than our recipes is our ability to laugh when the sambal gets extra spicy.
              </p>
            </div>
            <div className="about-story-media">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" alt="Lembayung Glasshouse Interior" className="about-img animate-scale-in" />
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
                  <p className="chef-fun-line">{c.role.includes('Pastry') ? 'She can make your dessert smile before you do.' : 'He believes every fire should be treated like a fine work of art.'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="about-location-section" style={{ padding: '4rem 0', backgroundColor: 'var(--bg-card)', marginTop: '2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div className="location-text" style={{ textAlign: 'left' }}>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Visit Us</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-light)' }}>
                <strong>Lembayung Restaurant</strong><br />
                Kampung Baru, 50300 Kuala Lumpur,<br />
                Wilayah Persekutuan Kuala Lumpur, Malaysia
              </p>
              <div style={{ marginTop: '2rem' }}>
                <a href="https://maps.google.com/?q=Kampung+Baru+Kuala+Lumpur" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  Get Directions
                </a>
              </div>
            </div>
            <div className="location-map" style={{ width: '100%', height: '350px', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '2px solid var(--border-color)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15935.044158913988!2d101.693175!3d3.1633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d37b19a169%3A0xc6fb0e4eb0883f3e!2sKampung%20Baru%2C%20Kuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kampung Baru Location"
              ></iframe>
            </div>
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
