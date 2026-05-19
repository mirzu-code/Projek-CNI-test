import { Link } from 'react-router-dom';
import './ChineseCuisine.css';

const ChineseCuisine = () => {
  const dishesInfo = [
    {
      value: 'steamed-fish',
      name: 'Ginger Onion Steamed Sea Bass',
      price: 'RM 65.00',
      description: 'Pristine fresh sea bass steamed to flaky perfection, topped with julienned young ginger, spring onions, fresh coriander, and drizzled with a premium seasoned hot soy sauce.',
      tags: ['⭐ Signature', 'Healthy Option', 'Fresh Seafood'],
      ingredients: ['Fresh Sea Bass', 'Young Ginger', 'Spring Onion', 'Shao Hsing Culinary Essence', 'House Seasoned Soy']
    },
    {
      value: 'szechuan-tofu',
      name: 'Szechuan Chili Maple Tofu',
      price: 'RM 28.00',
      description: 'Silken tofu cubes sautéed with a fiery house-crafted Szechuan pepper oil, fermented broad beans paste (doubanjiang), garlic, and a hint of organic maple syrup for a sweet-spicy crunch.',
      tags: ['🔥 Spicy', '🌱 Vegetarian'],
      ingredients: ['Silken Tofu', 'Szechuan Peppercorns', 'Broad Bean Paste', 'Organic Maple Syrup', 'Woodear Mushrooms']
    },
    {
      value: 'chicken-rice',
      name: 'Hainanese Chicken Rice Platter',
      price: 'RM 35.00',
      description: 'Traditional poached corn-fed chicken, served with highly aromatic chicken-fat ginger rice, homemade crushed ginger dip, thick dark soy paste, and a fiery red chili lime sambal.',
      tags: ['Ancestral Recipe', 'All-Time Favorite'],
      ingredients: ['Corn-Fed Chicken', 'Fragrant Jasmine Rice', 'Fresh Garlic & Ginger', 'Red Chili & Calamansi', 'Pandan Leaves']
    },
    {
      value: 'cantonese-noodles',
      name: 'Cantonese Egg Gravy Noodles (Wat Tan Hor)',
      price: 'RM 30.00',
      description: 'Flat rice noodles charcoal-seared to achieve ultimate wok hei (breath of the wok), drowned in a rich, silky egg gravy loaded with wild mushrooms, pak choy, and premium shrimp.',
      tags: ['Wok Hei Masterclass', 'Comfort Food'],
      ingredients: ['Flat Rice Noodles (Hor Fun)', 'Fresh Chicken Egg', 'Pak Choy', 'Wild Shiitake Mushrooms', 'Fresh King Shrimps']
    }
  ];

  return (
    <div className="cuisine-menu-page chinese-theme animate-fade-in">
      <div className="cuisine-container">
        <Link to="/menu" className="back-link red-hover">← Back to Gastronomy Hub</Link>
      </div>

      {/* Hero Section */}
      <section className="cuisine-hero chinese-hero">
        <div className="cuisine-hero-overlay chinese-overlay"></div>
        <div className="cuisine-hero-content text-center">
          <span className="cuisine-origin gold-text">🇨🇳 Traditional Chinese Heritage</span>
          <h1>Yin & Yang Culinary Art</h1>
          <p>Delicate wok breath, steamed freshness, and ancestral spice balances refined for modern diners.</p>
        </div>
      </section>

      {/* Grid of Dishes */}
      <section className="cuisine-dishes-section">
        <div className="cuisine-container">
          <div className="dishes-grid">
            {dishesInfo.map((dish, index) => (
              <div key={index} className="dish-detail-card chinese-card">
                <div className="dish-card-header">
                  <div className="dish-title-price">
                    <h3>{dish.name}</h3>
                    <span className="dish-detail-price red-text">{dish.price}</span>
                  </div>
                  <div className="dish-badge-row">
                    {dish.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="dish-detail-badge chinese-badge">{tag}</span>
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
                    className="btn-primary dish-preorder-btn chinese-btn"
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
      <section className="culinary-philosophy-banner chinese-philosophy">
        <div className="cuisine-container">
          <div className="philosophy-box text-center">
            <h3>Zero Food Waste Initiative (SDG 9)</h3>
            <p>
              By utilizing precision-built smart capacity planning, our kitchen minimizes waste. 
              Pre-ordering your Cantonese and Szechuan dishes allows us to procure the exact cuts of fresh seafood 
              and vegetables from local sustainable suppliers.
            </p>
            <Link to="/book" className="btn-outline light-border">Book Your Table Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChineseCuisine;
