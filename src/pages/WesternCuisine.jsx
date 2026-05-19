import { Link } from 'react-router-dom';
import './WesternCuisine.css';

const WesternCuisine = () => {
  const dishesInfo = [
    {
      value: 'angus-steak',
      name: 'Black Angus Ribeye Steak',
      price: 'RM 120.00',
      description: '300g premium pasture-raised Black Angus ribeye, aged for 28 days, charcoal-broiled to your preferred temperature. Served with roasted vine tomatoes, truffle butter, and rich tellicherry peppercorn sauce.',
      tags: ['⭐ Prime Cut', '28-Day Dry Aged', 'Carnivore Choice'],
      ingredients: ['Premium Black Angus Ribeye', 'Tellicherry Black Pepper', 'French Truffle Butter', 'Roasted Vine Tomatoes', 'Flaky Maldon Salt']
    },
    {
      value: 'seared-salmon',
      name: 'Pan-Seared Citrus Salmon',
      price: 'RM 68.00',
      description: 'Crispy skin Tasmanian salmon fillet, pan-seared with herb oil. Served over a bed of buttery crushed baby potatoes, sautéed asparagus, and smothered in a silky citrus dill cream.',
      tags: ['Sustainably Harvested', 'Omega 3 rich'],
      ingredients: ['Tasmanian Salmon Fillet', 'Baby Potatoes', 'Organic Asparagus', 'Lemon-Dill Butter', 'Extra Virgin Olive Oil']
    },
    {
      value: 'truffle-pasta',
      name: 'Truffle Wild Mushroom Fettuccine',
      price: 'RM 45.00',
      description: 'Al dente house-crafted egg fettuccine tossed in a rich, velvety cream sauce loaded with sautéed wild porcini and chanterelle mushrooms, freshly grated Pecorino Romano, and organic white truffle oil.',
      tags: ['🌱 Vegetarian', 'Handcrafted Pasta'],
      ingredients: ['Housemade Fettuccine', 'Wild Porcini Mushrooms', 'Pecorino Romano Cheese', 'Organic White Truffle Oil', 'Fresh Chives']
    },
    {
      value: 'rembayung-burger',
      name: 'Signature Double Wagyu Burger',
      price: 'RM 55.00',
      description: 'Two 120g premium custom-ground Wagyu beef patties, flame-grilled and layered with melted aged sharp Cheddar, smoked truffle mayo, crispy onion rings, and housed inside toasted sweet brioche buns. Served with hand-cut gold fries.',
      tags: ['⭐ Chef Special', 'Gourmet Burger'],
      ingredients: ['Custom Wagyu Patties', 'Aged Cheddar Cheese', 'Brioche Buns', 'Smoked Truffle Mayonnaise', 'Gold Idaho Potatoes']
    }
  ];

  return (
    <div className="cuisine-menu-page western-theme animate-fade-in">
      <div className="cuisine-container">
        <Link to="/menu" className="back-link blue-hover">← Back to Gastronomy Hub</Link>
      </div>

      {/* Hero Section */}
      <section className="cuisine-hero western-hero">
        <div className="cuisine-hero-overlay western-overlay"></div>
        <div className="cuisine-hero-content text-center">
          <span className="cuisine-origin bronze-text">🥩 Premium Western Bistro & Grill</span>
          <h1>Classic Bistro Excellence</h1>
          <p>Progressive European cooking, prime cut charcoal dry-aged steaks, and comforting bistro staples.</p>
        </div>
      </section>

      {/* Grid of Dishes */}
      <section className="cuisine-dishes-section">
        <div className="cuisine-container">
          <div className="dishes-grid">
            {dishesInfo.map((dish, index) => (
              <div key={index} className="dish-detail-card western-card">
                <div className="dish-card-header">
                  <div className="dish-title-price">
                    <h3>{dish.name}</h3>
                    <span className="dish-detail-price blue-text">{dish.price}</span>
                  </div>
                  <div className="dish-badge-row">
                    {dish.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="dish-detail-badge western-badge">{tag}</span>
                    ))}
                  </div>
                </div>

                <p className="dish-card-desc">{dish.description}</p>

                <div className="dish-ingredients">
                  <strong>Key Ingredients:</strong>
                  <div className="ingredients-pills">
                    {dish.ingredients.map((ing, iIdx) => (
                      <span key={iIdx} className="ingredient-pill">{ing}</span>
                    ))}
                  </div>
                </div>

                <div className="dish-card-actions">
                  <Link 
                    to="/book" 
                    className="btn-primary dish-preorder-btn western-btn"
                  >
                    <span>Pre-order & Reserve</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="culinary-philosophy-banner western-philosophy">
        <div className="cuisine-container">
          <div className="philosophy-box text-center">
            <h3>Zero Food Waste Initiative (SDG 9)</h3>
            <p>
              Dry aging beef and harvesting fresh Tasmanian salmon requires deep logistical care. 
              By pre-ordering your Ribeye Steaks and Salmon Fillets digitally, you participate directly 
              in our SDG 9 green commitment—allowing our butchers to prepare only what is enjoyed.
            </p>
            <Link to="/book" className="btn-outline light-border">Book Your Table Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WesternCuisine;
