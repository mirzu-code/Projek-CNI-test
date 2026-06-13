import { Link } from 'react-router-dom';
import { useCuisineMenuItems } from '../hooks/useCuisineMenuItems';
import './MalayCuisine.css';

const MalayCuisine = () => {
  const { items: cuisineItems, loading: cuisineLoading, error: cuisineError } = useCuisineMenuItems(1);

  const fallbackDishes = [
    {
      value: 'masak-lemak',
      name: 'Daging Salai Masak Lemak Cili Api',
      price: 'RM 38.00',
      description: 'Slow-smoked premium beef brisket simmered in a fiery, rich gravy of fresh coconut milk, turmeric, bird\'s eye chilies (cili api), and sliced local starfruit.',
      tags: ['Spicy', 'Chef Special', 'Sustainably Sourced'],
      ingredients: ['Smoked Beef Brisket', 'Fresh Turmeric', 'Bird\'s Eye Chilies', 'Coconut Cream', 'Belimbing Buluh'],
      image: 'https://source.unsplash.com/featured/600x600/?beef%20rendang'
    },
    {
      value: 'ayam-rendang',
      name: 'Ayam Rendang Lembayung',
      price: 'RM 26.00',
      description: 'Tender chicken slow-braised in a luxurious spice paste with toasted coconut, lemongrass, and galangal.',
      tags: ['Traditional Recipe', 'Gluten Free'],
      ingredients: ['Kampung Chicken', 'Toasted Coconut', 'Lemongrass', 'Galangal', 'Kaffir Lime Leaves'],
      image: 'https://source.unsplash.com/featured/600x600/?chicken%20rendang'
    },
    {
      value: 'ikan-bakar',
      name: 'Ikan Bakar Petai',
      price: 'RM 30.00',
      description: 'Fresh red snapper grilled with spicy sambal and petai in banana leaf.',
      tags: ['Spicy', 'Seafood Delight'],
      ingredients: ['Fresh Red Snapper', 'Stink Beans', 'Chili Sambal', 'Tamarind', 'Banana Leaf'],
      image: 'https://source.unsplash.com/featured/600x600/?grilled%20fish%20sambal'
    },
    {
      value: 'nasi-lemak',
      name: 'Nasi Lemak Pandan Heritage',
      price: 'RM 22.00',
      description: 'Basmati rice steamed with fresh pandan juice and coconut milk. Served with aromatic sweet-spicy anchovy sambal, spiced fried chicken, boiled eggs, and roasted peanuts.',
      tags: ['Signature Dish', 'All-Time Favorite'],
      ingredients: ['Pandan-infused Basmati Rice', 'Heritage Sambal Tumis', 'Crispy Rempah Fried Chicken', 'Roasted Peanuts', 'Hardboiled Egg'],
      image: 'https://source.unsplash.com/featured/600x600/?nasi%20lemak'
    },
    {
      value: 'nasi-kerabu-kampung',
      name: 'Nasi Kerabu Kampung',
      price: 'RM 25.00',
      description: 'Blue herb rice with tender grilled spiced chicken, crispy anchovies, salted egg, and aromatic sambal tempoyak.',
      tags: ['Traditional', 'Garden Fresh'],
      ingredients: ['Blue Rice', 'Crispy Anchovies', 'Salted Egg', 'Herb Salad', 'Sambal Tempoyak'],
      image: 'https://source.unsplash.com/featured/600x600/?nasi%20kerabu'
    },
    {
      value: 'udang-masak-lemak',
      name: 'Udang Masak Lemak Cili Api',
      price: 'RM 30.00',
      description: 'Succulent prawns cooked in spicy coconut gravy with aromatic herbs and house chillies.',
      tags: ['Spicy', 'Seafood'],
      ingredients: ['Fresh Prawns', 'Coconut Milk', 'Turmeric', 'Lemongrass', 'Chilli Padi'],
      image: 'https://source.unsplash.com/featured/600x600/?prawn%20curry'
    },
    {
      value: 'ayam-percik',
      name: 'Ayam Percik Panggang',
      price: 'RM 28.00',
      description: 'Grilled chicken basted in a fragrant, spicy coconut sauce, finished with smoky char marks.',
      tags: ['Grilled', 'House Special'],
      ingredients: ['Ayam Kampung', 'Coconut Milk', 'Turmeric', 'Honey', 'Pandan Leaves'],
      image: 'https://source.unsplash.com/featured/600x600/?ayam%20percik'
    }
  ];

  const dishesInfo = cuisineItems.length > 0 ? cuisineItems : fallbackDishes;

  return (
    <div className="cuisine-menu-page malay-theme animate-fade-in">
      {/* Back to Menu Hub */}
      <div className="cuisine-container">
        <Link to="/menu" className="back-link">← Back to Gastronomy Hub</Link>
      </div>

      {/* Hero Section */}
      <section className="cuisine-hero">
        <div className="cuisine-hero-overlay"></div>
        <div className="cuisine-hero-content text-center">
          <span className="cuisine-origin">Authentic Malaysian Heritage</span>
          <h1>Malay Culinary Treasures</h1>
          <p>Reinventing ancestral recipes with modern sustainable innovation in our glasshouse.</p>
        </div>
      </section>

      {/* Grid of Dishes */}
      <section className="cuisine-dishes-section">
        <div className="cuisine-container">
          <div className="dishes-grid">
            {dishesInfo.map((dish, index) => (
              <div key={index} className="dish-detail-card">
                <div className="dish-image-wrapper">
                  <img src={dish.image} alt={dish.name} className="dish-serve-image" />
                </div>
                <div className="dish-card-body-content">
                  <div className="dish-card-header">
                    <div className="dish-title-price">
                      <h3>{dish.name}</h3>
                      <span className="dish-detail-price">{dish.price}</span>
                    </div>
                    <div className="dish-badge-row">
                      {dish.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="dish-detail-badge">{tag}</span>
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
                      state={{ preselectCuisine: 'malay', preselectDish: dish.value }}
                      className="btn-primary dish-preorder-btn"
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

      {/* Culinary Philosophy */}
      <section className="culinary-philosophy-banner">
        <div className="cuisine-container">
          <div className="philosophy-box text-center">
            <h3>Zero Food Waste Initiative (SDG 9)</h3>
            <p>
              Traditional cooking involves precise, slow preparation. At Lembayung, our digital capacity planning 
              and table reservation pre-ordering system ensures that we purchase from our organic farmers exactly 
              what is ordered — reducing raw waste to 0%. Thank you for supporting sustainable innovation!
            </p>
            <Link to="/book" className="btn-outline light-border">Book Your Table Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MalayCuisine;
