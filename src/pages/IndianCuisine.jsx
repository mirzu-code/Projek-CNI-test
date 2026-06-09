import { Link } from 'react-router-dom';
import './IndianCuisine.css';

const IndianCuisine = () => {
  const dishesInfo = [
    {
      value: 'lamb-biryani',
      name: 'Aromatic Lamb Shank Biryani',
      price: 'RM 78.00',
      description: 'Ultra-tender Australian lamb shank, slow-cooked in a sealed clay pot (Dum cooking) with long-grain aged Basmati rice, premium saffron strands, rose water, and a complex bouquet of freshly ground whole spices.',
      tags: ['⭐ Claypot Dum Cooking', 'Saffron Infused', 'Premium Meat'],
      ingredients: ['Australian Lamb Shank', 'Aged Basmati Rice', 'Kashmiri Saffron', 'Clarified Butter (Ghee)', 'Fried Onions'],
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'butter-chicken',
      name: 'Tandoori Butter Chicken Masala',
      price: 'RM 42.00',
      description: 'Boneless chicken thighs marinated in spiced Greek yogurt, roasted inside a 400°C clay tandoor oven, and then smothered in a rich, buttery, velvety cashew-tomato sauce finished with dried fenugreek leaves (kasuri methi).',
      tags: ['Tandoor Masterpiece', 'Mildly Spiced'],
      ingredients: ['Clay Oven Grilled Chicken', 'Cashew Paste', 'Fresh Cream & Butter', 'Tomato Puree', 'Fenugreek Leaves'],
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'paneer-tikka',
      name: 'Paneer Tikka Butter Masala',
      price: 'RM 38.00',
      description: 'House-made fresh cottage cheese blocks (Paneer) skewered with capsicums and onions, charcoal-grilled in our tandoor, and simmered in a mildly sweet, velvety tomato gravy.',
      tags: ['🌱 Vegetarian', 'Housemade Cheese'],
      ingredients: ['Housemade Cottage Cheese', 'Bell Peppers', 'Spiced Masala Gravy', 'Greek Yogurt Marinade', 'Fresh Coriander'],
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'naan-platter',
      name: 'Garlic Cheese Naan Platter',
      price: 'RM 25.00',
      description: 'A basket of three premium, fluffy flatbreads hand-kneaded, slapped against the walls of our clay tandoor oven, and stuffed with fresh mozzarella cheese, topped with raw minced garlic and fresh melted ghee.',
      tags: ['Fresh from Tandoor', 'Perfect Accompaniment'],
      ingredients: ['Wheat Flour Dough', 'Fresh Minced Garlic', 'Mozzarella Cheese', 'Ghee Glaze', 'Fresh Mint Chutney Side'],
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="cuisine-menu-page indian-theme animate-fade-in">
      <div className="cuisine-container">
        <Link to="/menu" className="back-link orange-hover">← Back to Gastronomy Hub</Link>
      </div>

      {/* Hero Section */}
      <section className="cuisine-hero indian-hero">
        <div className="cuisine-hero-overlay indian-overlay"></div>
        <div className="cuisine-hero-content text-center">
          <span className="cuisine-origin saffron-text">🍛 Exotic Indian Spice Heritage</span>
          <h1>Clay Oven & Curry Treasures</h1>
          <p>Complex hand-blended spices, clay tandoor roasts, and rich slow-dum cookings refined for gourmet dining.</p>
        </div>
      </section>

      {/* Grid of Dishes */}
      <section className="cuisine-dishes-section">
        <div className="cuisine-container">
          <div className="dishes-grid">
            {dishesInfo.map((dish, index) => (
              <div key={index} className="dish-detail-card indian-card">
                <div className="dish-image-wrapper">
                  <img src={dish.image} alt={dish.name} className="dish-serve-image" />
                </div>
                <div className="dish-card-body-content">
                  <div className="dish-card-header">
                    <div className="dish-title-price">
                      <h3>{dish.name}</h3>
                      <span className="dish-detail-price orange-text">{dish.price}</span>
                    </div>
                    <div className="dish-badge-row">
                      {dish.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="dish-detail-badge indian-badge">{tag}</span>
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
                      state={{ preselectCuisine: 'indian', preselectDish: dish.value }}
                      className="btn-primary dish-preorder-btn indian-btn"
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
      <section className="culinary-philosophy-banner indian-philosophy">
        <div className="cuisine-container">
          <div className="philosophy-box text-center">
            <h3>Zero Food Waste Initiative (SDG 9)</h3>
            <p>
              Tandoor firing and lamb shank Dum preparation are complex processes that require careful resource utilization. 
              By booking and pre-ordering, you assist us in managing clay oven capacity and spices with absolute mathematical 
              precision, achieving a zero-waste kitchen in our glasshouse.
            </p>
            <Link to="/book" className="btn-outline light-border">Book Your Table Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndianCuisine;
