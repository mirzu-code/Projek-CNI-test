import { Link } from 'react-router-dom';

const WesternCuisine = () => {
  const dishesInfo = [
    {
      value: 'angus-steak',
      name: 'Black Angus Ribeye Steak',
      price: 'RM 58.00',
      description: '300g pasture-raised Angus ribeye, charcoal-broiled and served with roasted tomatoes, truffle butter, and peppercorn sauce.',
      tags: ['⭐ Prime Cut', 'Bistro Value', 'Carnivore Choice'],
      ingredients: ['Angus Ribeye', 'Black Pepper', 'Truffle Butter', 'Roasted Tomatoes', 'Flaky Salt'],
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'seared-salmon',
      name: 'Pan-Seared Citrus Salmon',
      price: 'RM 32.00',
      description: 'Crispy-skin salmon fillet with herb oil, served on buttery baby potatoes, asparagus, and citrus cream.',
      tags: ['Sustainably Harvested', 'Omega 3 Rich'],
      ingredients: ['Salmon Fillet', 'Baby Potatoes', 'Asparagus', 'Lemon-Dill Butter', 'Olive Oil'],
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'truffle-pasta',
      name: 'Truffle Wild Mushroom Fettuccine',
      price: 'RM 45.00',
      description: 'Al dente house-crafted egg fettuccine tossed in a rich, velvety cream sauce loaded with sautéed wild porcini and chanterelle mushrooms, freshly grated Pecorino Romano, and organic white truffle oil.',
      tags: ['🌱 Vegetarian', 'Handcrafted Pasta'],
      ingredients: ['Housemade Fettuccine', 'Wild Porcini Mushrooms', 'Pecorino Romano Cheese', 'Organic White Truffle Oil', 'Fresh Chives'],
      image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'lembayung-burger',
      name: 'Signature Double Wagyu Burger',
      price: 'RM 55.00',
      description: 'Two 120g premium custom-ground Wagyu beef patties, flame-grilled and layered with melted aged sharp Cheddar, smoked truffle mayo, crispy onion rings, and housed inside toasted sweet brioche buns. Served with hand-cut gold fries.',
      tags: ['⭐ Chef Special', 'Gourmet Burger'],
      ingredients: ['Custom Wagyu Patties', 'Aged Cheddar Cheese', 'Brioche Buns', 'Smoked Truffle Mayonnaise', 'Gold Idaho Potatoes'],
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'beef-wellington',
      name: 'Classic Beef Wellington',
      price: 'RM 45.00',
      description: 'Tender beef fillet wrapped in mushroom duxelles and golden pastry, served with Madeira jus.',
      tags: ['Fine Dining', 'Signature'],
      ingredients: ['Beef Fillet', 'Puff Pastry', 'Duxelles', 'Madeira Jus', 'Truffle Mash'],
      image: 'https://images.unsplash.com/photo-1532634726-8b9fb99825a0?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'lamb-rack',
      name: 'Herb-Crusted Lamb Rack',
      price: 'RM 48.00',
      description: 'Juicy lamb rack with rosemary-parsley crust, served with confit carrots and minted pea purée.',
      tags: ['Premium', 'Roasted'],
      ingredients: ['Lamb Rack', 'Rosemary', 'Minted Peas', 'Confit Carrots', 'Herb Crust'],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'mushroom-risotto',
      name: 'Wild Mushroom Risotto',
      price: 'RM 28.00',
      description: 'Creamy arborio risotto with sautéed wild mushrooms, Parmesan, and a splash of white wine.',
      tags: ['Vegetarian', 'Comfort'],
      ingredients: ['Arborio Rice', 'Wild Mushrooms', 'Parmesan', 'White Wine', 'Fresh Thyme'],
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'chicken-piccata',
      name: 'Lemon Chicken Piccata',
      price: 'RM 38.00',
      description: 'Pan-fried chicken breast in a light lemon caper sauce, served with mashed potato and seasonal greens.',
      tags: ['Light', 'Classic'],
      ingredients: ['Chicken Breast', 'Capers', 'Lemon', 'Butter', 'Mashed Potato'],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'mini-pies',
      name: 'Steak & Ale Mini Pies',
      price: 'RM 28.00',
      description: 'Individual golden pastry pies filled with slow-braised beef and rich ale gravy.',
      tags: ['Comfort', 'Shareable'],
      ingredients: ['Beef Brisket', 'Mushroom', 'Ale Gravy', 'Flaky Pastry', 'Thyme'],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
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
                <div className="dish-image-wrapper">
                  <img src={dish.image} alt={dish.name} className="dish-serve-image" />
                </div>
                <div className="dish-card-body-content">
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
                      state={{ preselectCuisine: 'western', preselectDish: dish.value }}
                      className="btn-primary dish-preorder-btn western-btn"
                    >
                      <span>Pre-order & Reserve</span>
                    </Link>
                  </div>
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
