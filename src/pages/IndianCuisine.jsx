import { Link } from 'react-router-dom';
import { useCuisineMenuItems } from '../hooks/useCuisineMenuItems';
import './IndianCuisine.css';

const IndianCuisine = () => {
  const { items: cuisineItems } = useCuisineMenuItems(5);
  const fallbackDishes = [
    {
      value: 'lamb-biryani',
      name: 'Aromatic Lamb Shank Biryani',
      price: 'RM 36.00',
      description: 'Ultra-tender lamb shank slow-cooked with basmati rice, saffron, rose water, and fragrant whole spices.',
      tags: ['Claypot Dum Cooking', 'Saffron Infused', 'Premium Meat'],
      ingredients: ['Lamb Shank', 'Basmati Rice', 'Kashmiri Saffron', 'Ghee', 'Fried Onions'],
      image: 'https://source.unsplash.com/featured/600x400/?lamb+biryani'
    },
    {
      value: 'butter-chicken',
      name: 'Tandoori Butter Chicken Masala',
      price: 'RM 32.00',
      description: 'Boneless chicken thighs marinated in spiced yogurt, roasted in the tandoor, and simmered in a rich velvety cashew tomato sauce.',
      tags: ['Tandoor Masterpiece', 'Mildly Spiced'],
      ingredients: ['Tandoori Chicken', 'Cashew Paste', 'Cream & Butter', 'Tomato Puree', 'Fenugreek Leaves'],
      image: 'https://source.unsplash.com/featured/600x400/?butter+chicken'
    },
    {
      value: 'paneer-tikka',
      name: 'Paneer Tikka Butter Masala',
      price: 'RM 28.00',
      description: 'Fresh paneer skewers with capsicum and onion, grilled in the tandoor and simmered in a silky tomato gravy.',
      tags: ['Vegetarian', 'Housemade Cheese'],
      ingredients: ['Paneer', 'Bell Peppers', 'Masala Gravy', 'Yogurt Marinade', 'Coriander'],
      image: 'https://source.unsplash.com/featured/600x400/?paneer+tikka+masala'
    },
    {
      value: 'naan-platter',
      name: 'Garlic Cheese Naan Platter',
      price: 'RM 25.00',
      description: 'A basket of three fluffy flatbreads stuffed with mozzarella, topped with garlic and ghee.',
      tags: ['Fresh from Tandoor', 'Perfect Accompaniment'],
      ingredients: ['Wheat Flour Dough', 'Garlic', 'Mozzarella Cheese', 'Ghee', 'Mint Chutney'],
      image: 'https://source.unsplash.com/featured/600x400/?garlic+naan'
    },
    {
      value: 'chicken-tikka-masala',
      name: 'Chicken Tikka Masala',
      price: 'RM 32.00',
      description: 'Tandoori chicken pieces simmered in a creamy tomato-cashew gravy with warm spice notes.',
      tags: ['Popular Choice', 'Creamy'],
      ingredients: ['Tandoori Chicken', 'Tomato Cream Gravy', 'Cashew Paste', 'Fenugreek', 'Coriander'],
      image: 'https://source.unsplash.com/featured/600x400/?chicken+tikka+masala'
    },
    {
      value: 'vegetable-biryani',
      name: 'Vegetable Biryani',
      price: 'RM 28.00',
      description: 'Aromatic vegetable biryani cooked with saffron, mixed vegetables, and fragrant whole spices.',
      tags: ['Vegetarian', 'Fragrant'],
      ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Saffron', 'Whole Spices', 'Coriander'],
      image: 'https://source.unsplash.com/featured/600x400/?vegetable+biryani'
    },
    {
      value: 'lamb-rogan-josh',
      name: 'Lamb Rogan Josh',
      price: 'RM 38.00',
      description: 'Melt-in-your-mouth lamb simmered in Kashmiri chilli, yogurt, and whole spices.',
      tags: ['Rich', 'Slow-Cooked'],
      ingredients: ['Lamb Shoulder', 'Kashmiri Chilli', 'Yogurt', 'Whole Spices', 'Fresh Coriander'],
      image: 'https://source.unsplash.com/featured/600x400/?rogan+josh'
    },
    {
      value: 'seekh-kebab',
      name: 'Mutton Seekh Kebab',
      price: 'RM 36.00',
      description: 'Spiced minced mutton skewers grilled over live charcoal and served with mint chutney.',
      tags: ['Charcoal Grill', 'Street Classic'],
      ingredients: ['Minced Mutton', 'Coriander', 'Green Chilli', 'Ginger', 'Mint'],
      image: 'https://source.unsplash.com/featured/600x400/?seekh+kebab'
    },
    {
      value: 'dal-makhani',
      name: 'Dal Makhani',
      price: 'RM 28.00',
      description: 'Slow-cooked black lentils enriched with cream, butter, and a fragrant spice blend.',
      tags: ['Vegetarian', 'Comfort'],
      ingredients: ['Black Lentils', 'Cream', 'Butter', 'Tomato Puree', 'Fenugreek'],
      image: 'https://source.unsplash.com/featured/600x400/?dal+makhani'
    }
  ];

  const dishesInfo = [...cuisineItems, ...fallbackDishes.slice(cuisineItems.length)];

  return (
    <div className="cuisine-menu-page indian-theme animate-fade-in">
      <div className="cuisine-container">
        <Link to="/menu" className="back-link orange-hover">← Back to Gastronomy Hub</Link>
      </div>

      {/* Hero Section */}
      <section className="cuisine-hero indian-hero">
        <div className="cuisine-hero-overlay indian-overlay"></div>
        <div className="cuisine-hero-content text-center">
          <span className="cuisine-origin saffron-text">Exotic Indian Spice Heritage</span>
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
