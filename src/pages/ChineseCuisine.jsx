import { Link } from 'react-router-dom';
import { useCuisineMenuItems } from '../hooks/useCuisineMenuItems';
import './ChineseCuisine.css';

const ChineseCuisine = () => {
  const { items: cuisineItems } = useCuisineMenuItems(2);
  const fallbackDishes = [
    {
      value: 'steamed-fish',
      name: 'Ginger Onion Steamed Sea Bass',
      price: 'RM 38.00',
      description: 'Pristine fresh sea bass steamed to flaky perfection, topped with julienned young ginger, spring onions, fresh coriander, and drizzled with a premium seasoned hot soy sauce.',
      tags: ['Signature', 'Healthy Option', 'Fresh Seafood'],
      ingredients: ['Fresh Sea Bass', 'Young Ginger', 'Spring Onion', 'Shao Hsing Culinary Essence', 'House Seasoned Soy'],
      image: 'https://source.unsplash.com/featured/600x400/?steamed+sea+bass'
    },
    {
      value: 'szechuan-tofu',
      name: 'Szechuan Chili Maple Tofu',
      price: 'RM 28.00',
      description: 'Silken tofu cubes saut├⌐ed with a fiery house-crafted Szechuan pepper oil, fermented broad beans paste (doubanjiang), garlic, and a hint of organic maple syrup for a sweet-spicy crunch.',
      tags: ['Spicy', 'Vegetarian'],
      ingredients: ['Silken Tofu', 'Szechuan Peppercorns', 'Broad Bean Paste', 'Organic Maple Syrup', 'Woodear Mushrooms'],
      image: 'https://source.unsplash.com/featured/600x400/?mapo+tofu'
    },
    {
      value: 'chicken-rice',
      name: 'Hainanese Chicken Rice Platter',
      price: 'RM 28.00',
      description: 'Traditional poached corn-fed chicken, served with aromatic ginger rice, crushed ginger dip, dark soy paste, and red chili lime sambal.',
      tags: ['Ancestral Recipe', 'All-Time Favorite'],
      ingredients: ['Corn-Fed Chicken', 'Fragrant Jasmine Rice', 'Fresh Garlic & Ginger', 'Red Chili & Calamansi', 'Pandan Leaves'],
      image: 'https://source.unsplash.com/featured/600x400/?hainanese+chicken+rice'
    },
    {
      value: 'cantonese-noodles',
      name: 'Cantonese Egg Gravy Noodles (Wat Tan Hor)',
      price: 'RM 26.00',
      description: 'Flat rice noodles wok-seared with silky egg gravy, wild mushrooms, pak choy, and premium shrimp.',
      tags: ['Wok Hei Masterclass', 'Comfort Food'],
      ingredients: ['Flat Rice Noodles (Hor Fun)', 'Fresh Chicken Egg', 'Pak Choy', 'Wild Shiitake Mushrooms', 'Fresh King Shrimps'],
      image: 'https://source.unsplash.com/featured/600x400/?wat+tan+hor'
    },
    {
      value: 'kung-pao-prawns',
      name: 'Kung Pao Prawns',
      price: 'RM 32.00',
      description: 'Juicy prawns wok-seared with dried chilli, peanuts, and house black bean soy glaze.',
      tags: ['Spicy', 'Peanut Crunch'],
      ingredients: ['Tiger Prawns', 'Sichuan Pepper', 'Dry Chilli', 'Cashews', 'Black Bean Sauce'],
      image: 'https://source.unsplash.com/featured/600x400/?kung+pao+shrimp'
    },
    {
      value: 'char-siew-bao',
      name: 'Char Siew Bao',
      price: 'RM 24.00',
      description: 'Steamed fluffy bao buns filled with sweet sticky char siew pork and a drizzle of hoisin.',
      tags: ['Dim Sum', 'Snack'],
      ingredients: ['Bao Dough', 'Char Siew Pork', 'Hoisin', 'Sesame Oil', 'Spring Onion'],
      image: 'https://source.unsplash.com/featured/600x400/?bao+bun'
    },
    {
      value: 'lotus-leaf-chicken',
      name: 'Lotus Leaf Chicken Rice Parcel',
      price: 'RM 28.00',
      description: 'Marinated rice and chicken wrapped in lotus leaf, steamed until fragrant for a warming, easy-to-share meal.',
      tags: ['Comfort Food', 'Aromatic'],
      ingredients: ['Lotus Leaf', 'Chicken Thigh', 'Glutinous Rice', 'Chinese Sausage', 'Mushrooms'],
      image: 'https://source.unsplash.com/featured/600x400/?lotus+leaf+rice'
    },
    {
      value: 'mala-beef-noodles',
      name: 'Mala Beef Noodles',
      price: 'RM 32.00',
      description: 'Tender slices of beef in a mala broth with noodles, bok choy, and pickled vegetables for a bold, satisfying bowl.',
      tags: ['Spicy', 'Noodle Soup'],
      ingredients: ['Beef Slices', 'Mala Spice', 'Wheat Noodles', 'Bok Choy', 'Pickled Vegetables'],
      image: 'https://source.unsplash.com/featured/600x400/?spicy+beef+noodles'
    },
    {
      value: 'black-bean-fish',
      name: 'Steamed Fish with Black Bean Sauce',
      price: 'RM 38.00',
      description: 'Fresh white fish steamed with garlic, fermented black beans, ginger, and scallion oil.',
      tags: ['Healthy', 'Classic'],
      ingredients: ['Fresh White Fish', 'Fermented Black Beans', 'Ginger', 'Scallion', 'Soy Dressing'],
      image: 'https://source.unsplash.com/featured/600x400/?steamed+fish+black+bean'
    }
  ];

  const dishesInfo = [...cuisineItems, ...fallbackDishes.slice(cuisineItems.length)];

  return (
    <div className="cuisine-menu-page chinese-theme animate-fade-in">
      <div className="cuisine-container">
        <Link to="/menu" className="back-link red-hover">← Back to Gastronomy Hub</Link>
      </div>

      {/* Hero Section */}
      <section className="cuisine-hero chinese-hero">
        <div className="cuisine-hero-overlay chinese-overlay"></div>
        <div className="cuisine-hero-content text-center">
          <span className="cuisine-origin gold-text">Traditional Chinese Heritage</span>
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
                <div className="dish-image-wrapper">
                  <img src={dish.image} alt={dish.name} className="dish-serve-image" />
                </div>
                <div className="dish-card-body-content">
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
                      state={{ preselectCuisine: 'chinese', preselectDish: dish.value }}
                      className="btn-primary dish-preorder-btn chinese-btn"
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
