import { Link } from 'react-router-dom';
import { useCuisineMenuItems } from '../hooks/useCuisineMenuItems';
import './Desserts.css';

const Desserts = () => {
  const { items: cuisineItems } = useCuisineMenuItems(6);
  const fallbackDishes = [
    {
      value: 'kuih-bingka-ubi',
      name: 'Kuih Bingka Ubi',
      price: 'RM 12.00',
      description: 'Traditional baked cassava cake with a caramelized top, served warm and fragrant.',
      tags: ['Traditional', 'Comfort'],
      ingredients: ['Cassava', 'Eggs', 'Coconut Milk', 'Pandan Essence', 'Palm Sugar'],
      image: 'https://source.unsplash.com/featured/600x600/?cassava%20cake'
    },
    {
      value: 'ondeh-ondeh',
      name: 'Ondeh-Ondeh',
      price: 'RM 14.00',
      description: 'Glutinous rice balls filled with melted gula Melaka and rolled in freshly grated coconut.',
      tags: ['Sweet', 'Bite-sized'],
      ingredients: ['Glutinous Rice', 'Gula Melaka', 'Grated Coconut', 'Pandan', 'Palm Sugar'],
      image: 'https://source.unsplash.com/featured/600x600/?ondeh%20ondeh'
    },
    {
      value: 'seri-muka',
      name: 'Seri Muka',
      price: 'RM 13.00',
      description: 'Layered pandan custard and glutinous rice with a creamy, fragrant finish.',
      tags: ['Pandan', 'Layered'],
      ingredients: ['Pandan Leaves', 'Coconut Milk', 'Glutinous Rice', 'Eggs', 'Rice Flour'],
      image: 'https://source.unsplash.com/featured/600x600/?seri%20muka'
    },
    {
      value: 'kuih-lapis',
      name: 'Kuih Lapis',
      price: 'RM 15.00',
      description: 'Multi-layered steamed cake featuring vibrant colours and silky pandan aroma.',
      tags: ['Festival', 'Textured'],
      ingredients: ['Rice Flour', 'Coconut Milk', 'Pandan Juice', 'Food Coloring', 'Sugar'],
      image: 'https://source.unsplash.com/featured/600x600/?kuih%20lapis'
    },
    {
      value: 'mango-sticky-rice',
      name: 'Mango Sticky Rice',
      price: 'RM 18.00',
      description: 'Sweet sticky rice topped with ripe mango slices and rich coconut cream.',
      tags: ['Thai Classic', 'Fruity'],
      ingredients: ['Sticky Rice', 'Mango', 'Coconut Cream', 'Sesame', 'Palm Sugar'],
      image: 'https://source.unsplash.com/featured/600x600/?mango%20sticky%20rice'
    },
    {
      value: 'hong-kong-egg-tart',
      name: 'Hong Kong Egg Tart',
      price: 'RM 14.00',
      description: 'Flaky pastry tart with silky smooth egg custard, a beloved Hong Kong bakery favourite.',
      tags: ['Bakery Classic', 'Light'],
      ingredients: ['Pastry Shell', 'Egg Custard', 'Milk', 'Sugar', 'Vanilla'],
      image: 'https://source.unsplash.com/featured/600x600/?egg%20tart'
    },
    {
      value: 'tiramisu-cup',
      name: 'Mini Tiramisu Cup',
      price: 'RM 16.00',
      description: 'Creamy coffee-soaked ladyfingers layered with mascarpone cream and dusted with cocoa.',
      tags: ['Italian', 'Creamy'],
      ingredients: ['Ladyfingers', 'Mascarpone', 'Coffee', 'Cocoa Powder', 'Sugar'],
      image: 'https://source.unsplash.com/featured/600x600/?tiramisu'
    },
    {
      value: 'cendol-gelato',
      name: 'Cendol Gelato',
      price: 'RM 16.00',
      description: 'Frozen pandan cendol ice cream with gula Melaka swirls and shaved coconut.',
      tags: ['Cold', 'Innovative'],
      ingredients: ['Pandan Gelato', 'Gula Melaka', 'Coconut Cream', 'Shaved Coconut', 'Rice Flour Cendol'],
      image: 'https://source.unsplash.com/featured/600x600/?cendol'
    },
    {
      value: 'kuih-ketayap',
      name: 'Kuih Ketayap',
      price: 'RM 14.00',
      description: 'Soft pandan pancake roll filled with sweet grated coconut and palm sugar.',
      tags: ['Sweet', 'Handroll'],
      ingredients: ['Pandan Batter', 'Grated Coconut', 'Palm Sugar', 'Salt', 'Rice Flour'],
      image: 'https://source.unsplash.com/featured/600x600/?kuih%20ketayap'
    },
    {
      value: 'tapai-pulut',
      name: 'Tapai Pulut',
      price: 'RM 13.00',
      description: 'Fermented glutinous rice with sweet-sour depth, a nostalgic kuih finish.',
      tags: ['Fermented', 'Nostalgic'],
      ingredients: ['Glutinous Rice', 'Ragi Yeast', 'Sugar', 'Coconut Milk', 'Salt'],
      image: 'https://source.unsplash.com/featured/600x600/?tapai%20pulut'
    }
  ];

  const dishesInfo = [...cuisineItems, ...fallbackDishes.slice(cuisineItems.length)];

  return (
    <div className="cuisine-menu-page desserts-theme animate-fade-in">
      <div className="cuisine-container">
        <Link to="/menu" className="back-link">← Back to Gastronomy Hub</Link>
      </div>

      <section className="cuisine-hero desserts-hero">
        <div className="cuisine-hero-overlay"></div>
        <div className="cuisine-hero-content text-center">
          <span className="cuisine-origin">Sweet Heritage & Global Dessert Delights</span>
          <h1>Local Kuih & International Desserts</h1>
          <p>End your meal with affordable, handcrafted sweet treats from Malaysia and beyond, all made fresh on pre-order.</p>
        </div>
      </section>

      <section className="cuisine-dishes-section">
        <div className="cuisine-container">
          <div className="dishes-grid">
            {dishesInfo.map((dish, index) => (
              <div key={index} className="dish-detail-card dessert-card">
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
                        <span key={tIdx} className="dish-detail-badge dessert-badge">{tag}</span>
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
                      state={{ preselectCuisine: 'dessert', preselectDish: dish.value }}
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

      <section className="culinary-philosophy-banner desserts-philosophy">
        <div className="cuisine-container">
          <div className="philosophy-box text-center">
            <h3>Letakkan Penutup Manis pada Tempahan Anda</h3>
            <p>
              Pilih kuih dan pencuci mulut yang dikendalikan secara lestari untuk menutup pengalaman makan anda.
              Pra-pesanan memastikan setiap bahagian dibuat segar dan hanya mengikut bilangan tetamu sebenar.
            </p>
            <Link to="/book" className="btn-outline light-border">Book Your Table Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Desserts;
