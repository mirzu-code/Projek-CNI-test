import { Link } from 'react-router-dom';
import './JapaneseCuisine.css';

const JapaneseCuisine = () => {
  const dishesInfo = [
    {
      value: 'wagyu-ramen',
      name: 'Wagyu Beef Black Garlic Ramen',
      price: 'RM 75.00',
      description: 'Slow-simmered 18-hour creamy tonkotsu broth, layered with organic black garlic aroma oil, house-made rye noodles, and topped with blowtorched melt-in-your-mouth A5 Wagyu beef slices.',
      tags: ['Γ¡É Masterpiece', '18-Hour Broth', 'Premium Selection'],
      ingredients: ['A5 Miyazaki Wagyu', 'Black Garlic Mayu Oil', '18-Hour Tonkotsu Essence', 'Organic Hen Egg', 'Bamboo Shoots'],
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'salmon-don',
      name: 'Truffle Salmon Sashimi Don',
      price: 'RM 58.00',
      description: 'Prismatic, thick slices of premium fresh Norwegian salmon sashimis, seasoned with a rich white truffle soy sauce, served over hand-seasoned warm sushi rice with ikura (salmon roe).',
      tags: ['Truffle Infused', 'Cold Delight'],
      ingredients: ['Norwegian Salmon Sashimi', 'White Truffle Essence', 'Ikura (Salmon Caviar)', 'Vinegared Sushi Rice', 'Shiso Leaf'],
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'premium-sushi',
      name: 'Chef\'s Choice Premium Sushi Platter',
      price: 'RM 85.00',
      description: 'A delicate curation of 8 hand-pressed nigiri and 6 signature maki rolls, featuring prime selection of salmon belly, fatty tuna (otoro), sweet shrimp, and dynamic unagi (grilled eel).',
      tags: ['Γ¡É Chef Special', 'Zen Curation'],
      ingredients: ['Bluefin Tuna belly', 'Salmon Belly', 'Hokkaido Sweet Shrimp', 'Grilled Fresh Water Eel', 'Wasabi Root'],
      image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'tempura-moriawase',
      name: 'Crispy Seafood & Veg Tempura',
      price: 'RM 48.00',
      description: 'A classic, feather-light crispy assortment of fresh jumbo tiger prawns, soft sweet potato, lotus root, and eggplant, fried in clean tea seed oil. Served with warm dashi dipping broth.',
      tags: ['Classic Japanese', 'Crispy & Light'],
      ingredients: ['Jumbo Tiger Prawns', 'Sweet Potato', 'Lotus Root', 'Sweet Dashi Broth', 'Grated Daikon Radish'],
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="cuisine-menu-page japanese-theme animate-fade-in">
      <div className="cuisine-container">
        <Link to="/menu" className="back-link black-hover">ΓåÉ Back to Gastronomy Hub</Link>
      </div>

      {/* Hero Section */}
      <section className="cuisine-hero japanese-hero">
        <div className="cuisine-hero-overlay japanese-overlay"></div>
        <div className="cuisine-hero-content text-center">
          <span className="cuisine-origin pink-text">≡ƒç»≡ƒç╡ Artisan Japanese Gastronomy</span>
          <h1>Zen Minimalist Curation</h1>
          <p>Meticulous precision, pristine premium ingredients, and absolute harmony on every plate.</p>
        </div>
      </section>

      {/* Grid of Dishes */}
      <section className="cuisine-dishes-section">
        <div className="cuisine-container">
          <div className="dishes-grid">
            {dishesInfo.map((dish, index) => (
              <div key={index} className="dish-detail-card jp-card">
                <div className="dish-image-wrapper">
                  <img src={dish.image} alt={dish.name} className="dish-serve-image" />
                </div>
                <div className="dish-card-body-content">
                  <div className="dish-card-header">
                    <div className="dish-title-price">
                      <h3>{dish.name}</h3>
                      <span className="dish-detail-price jp-price">{dish.price}</span>
                    </div>
                    <div className="dish-badge-row">
                      {dish.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="dish-detail-badge jp-badge">{tag}</span>
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
                      state={{ preselectCuisine: 'japanese', preselectDish: dish.value }}
                      className="btn-primary dish-preorder-btn jp-btn"
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
      <section className="culinary-philosophy-banner jp-philosophy">
        <div className="cuisine-container">
          <div className="philosophy-box text-center">
            <h3>Zero Food Waste Initiative (SDG 9)</h3>
            <p>
              Artisan sushi and ramen require absolute fresh sourcing. In alignment with SDG 9, our digital pre-ordering 
              system ensures that premium cuts like wagyu beef and Norwegian salmon belly are only procured upon active 
              bookingΓÇömaintaining raw ingredient waste at absolute zero.
            </p>
            <Link to="/book" className="btn-outline light-border">Book Your Table Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JapaneseCuisine;
