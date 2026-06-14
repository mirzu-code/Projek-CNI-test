import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Menu.css';

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');

  useEffect(() => {
    const loadMenus = async () => {
      setMenuLoading(true);
      try {
        const { data, error } = await supabase
          .from('menus')
          .select('*')
          .eq('is_active', true)
          .order('cuisine_id', { ascending: true })
          .order('id', { ascending: true });

        if (error) throw error;
        setMenus(data || []);
        setMenuError('');
      } catch (err) {
        console.warn('Failed to load menu data:', err.message || err);
        setMenus([]);
        setMenuError('Unable to load menu from admin backend. Using default menu preview.');
      } finally {
        setMenuLoading(false);
      }
    };

    loadMenus();
  }, []);

  const cuisineIdMap = {
    malay: 1,
    chinese: 2,
    japanese: 3,
    western: 4,
    indian: 5,
    desserts: 6,
    dessert: 6
  };

  const menuItemsByCategory = menus.reduce((acc, item) => {
    const cuisineKey = Object.keys(cuisineIdMap).find(key => cuisineIdMap[key] === Number(item.cuisine_id));
    if (!cuisineKey) return acc;
    const category = cuisineKey === 'dessert' ? 'desserts' : cuisineKey;
    acc[category] = acc[category] || [];
    acc[category].push(item);
    return acc;
  }, {});

  const categories = [
    {
      id: 'malay',
      title: 'Authentic Malay Cuisine',
      description: 'Journey through centuries of heritage. Experience rich coconut gravy, aromatic forest herbs, and slow-roasted meats prepared using age-old ancestral techniques.',
      defaultDishes: ['Daging Salai Masak Lemak', 'Ayam Rendang Lembayung', 'Ikan Bakar Petai', 'Sotong Masak Hitam', 'Udang Tempoyak', 'Nasi Kerabu Kampung', 'Tauhu Telur Gulung'],
      icon: '🇲🇾',
      bannerImage: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
      bgColor: '#1a472a',
      accentColor: '#d4af37'
    },
    {
      id: 'chinese',
      title: 'Traditional Chinese Cuisine',
      description: 'A balance of yin and yang. Experience delicate wok hei, premium steamed fish, and sweet-savoury claypots embodying generations of culinary mastery.',
      defaultDishes: ['Ginger Onion Steamed Sea Bass', 'Szechuan Chili Maple Tofu', 'Hainanese Chicken Rice Platter', 'Char Siew Noodles', 'Sesame Crispy Chicken', 'Lotus Leaf Fried Rice', 'Braised Eggplant Claypot'],
      icon: '🇨🇳',
      bannerImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      bgColor: '#b01e23',
      accentColor: '#ffd700'
    },
    {
      id: 'japanese',
      title: 'Artisan Japanese Cuisine',
      description: 'Zengarden of visual and culinary peace. Minimalist execution celebrating pristine ingredients, fresh sashimi cuts, and thick slow-simmered broths.',
      defaultDishes: ['Wagyu Beef Black Garlic Ramen', 'Truffle Salmon Sashimi Don', 'Premium Sushi Platter', 'Miso Black Cod', 'Tempura Udon', 'Yakitori Skewer Set', 'Chirashi Sushi Bowl'],
      icon: '🇯🇵',
      bannerImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      bgColor: '#111111',
      accentColor: '#e83e8c'
    },
    {
      id: 'western',
      title: 'Modern Western Cuisine',
      description: 'A culinary bridge of continents. Enjoy high-grade Black Angus steaks, house-crafted pastas, and perfectly seared salmon using progressive French techniques.',
      defaultDishes: ['Black Angus Ribeye Steak', 'Truffle Wild Mushroom Fettuccine', 'Pan-Seared Citrus Salmon', 'Herb-Crusted Lamb Chop', 'Seafood Risotto', 'Chicken Cordon Bleu', 'Beef Wellington Bites'],
      icon: '🥩',
      bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      bgColor: '#2b3e50',
      accentColor: '#3498db'
    },
    {
      id: 'indian',
      title: 'Flavorful Indian Cuisine',
      description: 'A rich tapestry of spices. Delight in slow-roasted tandoori specialties, hand-kneaded naan platters, and legendary lamb shanks cooked in rich clay ovens.',
      defaultDishes: ['Aromatic Lamb Shank Biryani', 'Tandoori Butter Chicken Masala', 'Garlic Cheese Naan Platter', 'Paneer Tikka Masala', 'Lamb Rogan Josh', 'Mutton Seekh Kebab', 'Dal Makhani'],
      icon: '🍛',
      bannerImage: '/Flavorful Indian Cuisine.jpg',
      bgColor: '#a35d00',
      accentColor: '#e67e22'
    },
    {
      id: 'desserts',
      title: 'Sweet Kuih & Desserts',
      description: 'Finish your meal with traditional kuih, modern plated desserts, and comforting sweet endings handcrafted for every reservation.',
      defaultDishes: ['Kuih Bingka Ubi', 'Ondeh-Ondeh', 'Seri Muka', 'Kuih Lapis', 'Cendol Gelato', 'Kuih Ketayap', 'Tapai Pulut'],
      icon: '🍮',
      bannerImage: '/Sweet Kuih & Desserts.jpg',
      bgColor: '#7d4f97',
      accentColor: '#f9c74f'
    }
  ];

  const categoriesWithMenuData = categories.map((category) => {
    const categoryMenus = menuItemsByCategory[category.id] || [];
    const dishNames = categoryMenus.length > 0
      ? categoryMenus.map((item) => item.name || 'Untitled Dish').slice(0, 6)
      : category.defaultDishes;

    return {
      ...category,
      dishCount: categoryMenus.length,
      dishes: dishNames
    };
  });

  return (
    <div className="menu-hub-page animate-fade-in">
      {/* Hero Header Section */}
      <section className="menu-hub-header text-center">
        <span className="menu-subtitle">Lembayung Culinary Vault</span>
        <h1>A Symphony of Global Gastronomy</h1>
        <p className="menu-header-desc">
          Prepared by culinary artisans using sustainably sourced premium local ingredients.
          By planning digital reservations and pre-ordering, we align with <strong>SDG 9: Industry, Innovation & Sustainable Infrastructure</strong>,
          reducing waste to absolute zero.
        </p>
      </section>

      {/* Grid of Cuisine Categories */}
      <section className="categories-grid-container">
        {menuLoading ? (
          <div className="menu-loading-state">Loading menu data...</div>
        ) : (
          <div
            className="categories-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 360px)',
              gap: '2rem',
              justifyContent: 'center',
              justifyItems: 'center',
              margin: '3.5rem auto 4rem',
              width: 'auto',
              maxWidth: 'calc(3 * 360px + 2 * 2rem)',
              position: 'relative',
              left: 'calc(50% + 40px)',
              transform: 'translateX(-50%)'
            }}
          >
            {categoriesWithMenuData.map((category) => (
              <div key={category.id} className="category-hub-card animate-zoom-in" style={{ '--card-accent': category.accentColor }}>
                <div className="card-image-wrapper">
                  <img src={category.bannerImage} alt={category.title} className="category-bg-image" />
                  <div className="image-overlay" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, ${category.bgColor}dd 100%)` }}></div>
                  <span className="category-icon-badge">{category.icon}</span>
                </div>

                <div className="category-info-wrapper" style={{ backgroundColor: category.bgColor }}>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>

                  <div className="signature-preview">
                    <span className="preview-label">Featured Specialties:</span>
                    <div className="preview-tags">
                      {category.dishes.map((dish, i) => (
                        <span key={i} className="preview-tag">{dish}</span>
                      ))}
                    </div>
                  </div>

                  <div className="card-actions-wrapper">
                    <Link to={`/menu/${category.id === 'desserts' ? 'desserts' : category.id}`} className="explore-menu-btn">
                      <span>Explore Menu</span>
                      <span className="arrow-icon">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {menuError && <div className="menu-error-state">{menuError}</div>}
      </section>

      {/* Pre-order Callout Banner */}
      <section className="preorder-callout-banner">
        <div className="callout-content text-center">
          <h2>Contribute to Sustainable Sourcing</h2>
          <p>
            Choose your dishes and pre-order during reservation to ensure our kitchen sources and cooks with 100% precision.
            Enjoy a highly customized, relaxed, and green dining experience.
          </p>
          <Link to="/book" className="btn-primary callout-cta-btn">Book Table & Pre-order</Link>
        </div>
      </section>
    </div>
  );
};

export default Menu;
