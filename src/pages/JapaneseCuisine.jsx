import { Link } from 'react-router-dom';
import { useCuisineMenuItems } from '../hooks/useCuisineMenuItems';

const JapaneseCuisine = () => {
  const { items: cuisineItems } = useCuisineMenuItems(3);
  const dishesInfo = cuisineItems.length > 0 ? cuisineItems : [
    {
      value: 'wagyu-ramen',
      name: 'Wagyu Beef Black Garlic Ramen',
      price: 'RM 38.00',
      description: 'Creamy tonkotsu broth with black garlic aroma oil, house noodles, and premium melt-in-your-mouth wagyu beef slices.',
      tags: ['⭐ Masterpiece', '18-Hour Broth', 'Premium Selection'],
      ingredients: ['A5 Miyazaki Wagyu', 'Black Garlic Mayu Oil', '18-Hour Tonkotsu Essence', 'Organic Hen Egg', 'Bamboo Shoots'],
      image: 'https://source.unsplash.com/featured/600x400/?wagyu+ramen'
    },
    {
      value: 'salmon-don',
      name: 'Truffle Salmon Sashimi Don',
      price: 'RM 30.00',
      description: 'Thick Norwegian salmon sashimi seasoned with truffle soy sauce, served over warm sushi rice with ikura.',
      tags: ['Truffle Infused', 'Cold Delight'],
      ingredients: ['Norwegian Salmon Sashimi', 'White Truffle Essence', 'Ikura (Salmon Caviar)', 'Vinegared Sushi Rice', 'Shiso Leaf'],
      image: 'https://source.unsplash.com/featured/600x400/?salmon+sashimi+don'
    },
    {
      value: 'premium-sushi',
      name: 'Chef\'s Choice Premium Sushi Platter',
      price: 'RM 35.00',
      description: 'A delicate curation of 8 hand-pressed nigiri and 6 signature maki rolls, featuring salmon belly, fatty tuna, sweet shrimp, and unagi.',
      tags: ['⭐ Chef Special', 'Zen Curation'],
      ingredients: ['Bluefin Tuna belly', 'Salmon Belly', 'Hokkaido Sweet Shrimp', 'Grilled Fresh Water Eel', 'Wasabi Root'],
      image: 'https://source.unsplash.com/featured/600x400/?sushi+platter'
    },
    {
      value: 'tempura-moriawase',
      name: 'Crispy Seafood & Veg Tempura',
      price: 'RM 35.00',
      description: 'A classic crispy assortment of fresh tiger prawns, sweet potato, lotus root, and eggplant served with warm dashi broth.',
      tags: ['Classic Japanese', 'Crispy & Light'],
      ingredients: ['Jumbo Tiger Prawns', 'Sweet Potato', 'Lotus Root', 'Sweet Dashi Broth', 'Grated Daikon Radish'],
      image: 'https://source.unsplash.com/featured/600x400/?tempura'
    },
    {
      value: 'udon-sukiyaki',
      name: 'Sukiyaki Udon Hotpot',
      price: 'RM 39.00',
      description: 'Comforting sukiyaki broth with udon noodles, thin beef slices, mushroom medley, and silky tofu.',
      tags: ['Hotpot Comfort', 'Balanced'],
      ingredients: ['Udon Noodles', 'Thin Beef Slices', 'Shiitake Mushrooms', 'Silken Tofu', 'Spring Onion'],
      image: 'https://source.unsplash.com/featured/600x400/?sukiyaki+udon'
    },
    {
      value: 'salmon-mentaiko-bowl',
      name: 'Salmon Mentaiko Don',
      price: 'RM 32.00',
      description: 'Grilled salmon with creamy mentaiko sauce on warm rice, sprinkled with nori and spring onion.',
      tags: ['Comfort Food', 'Savory'],
      ingredients: ['Grilled Salmon', 'Mentaiko Sauce', 'Sushi Rice', 'Nori Flakes', 'Spring Onion'],
      image: 'https://source.unsplash.com/featured/600x400/?salmon+mentaiko+don'
    },
    {
      value: 'chirashi-bowl',
      name: 'Chirashi Sushi Bowl',
      price: 'RM 34.00',
      description: 'Assorted sashimi and marinated seafood over warm vinegared sushi rice, garnished with ikura and shiso leaf.',
      tags: ['Signature', 'Fresh'],
      ingredients: ['Sushi Rice', 'Salmon', 'Tuna', 'Ikura', 'Shiso Leaf'],
      image: 'https://source.unsplash.com/featured/600x400/?chirashi+bowl'
    },
    {
      value: 'yaki-onigiri',
      name: 'Grilled Yaki Onigiri',
      price: 'RM 22.00',
      description: 'Crispy grilled rice balls brushed with sweet soy glaze and toasted sesame.',
      tags: ['Comfort', 'Snack'],
      ingredients: ['Rice Balls', 'Soy Glaze', 'Sesame', 'Nori', 'Butter'],
      image: 'https://source.unsplash.com/featured/600x400/?yaki+onigiri'
    },
    {
      value: 'matcha-anmitsu',
      name: 'Matcha Anmitsu',
      price: 'RM 22.00',
      description: 'A deconstructed traditional dessert bowl with matcha jelly, red bean, mochi, and black sugar syrup.',
      tags: ['Dessert', 'Refreshing'],
      ingredients: ['Matcha Jelly', 'Sweet Red Bean', 'Mochi', 'Black Sugar Syrup', 'Fruit Garnish'],
      image: 'https://source.unsplash.com/featured/600x400/?matcha+anmitsu'
    }
  ];

  return (
    <div className="cuisine-menu-page japanese-theme animate-fade-in">
      <div className="cuisine-container">
        <Link to="/menu" className="back-link black-hover">← Back to Gastronomy Hub</Link>
      </div>

      {/* Hero Section */}
      <section className="cuisine-hero japanese-hero">
        <div className="cuisine-hero-overlay japanese-overlay"></div>
        <div className="cuisine-hero-content text-center">
          <span className="cuisine-origin pink-text">🇯🇵 Artisan Japanese Gastronomy</span>
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
              booking—maintaining raw ingredient waste at absolute zero.
            </p>
            <Link to="/book" className="btn-outline light-border">Book Your Table Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JapaneseCuisine;
