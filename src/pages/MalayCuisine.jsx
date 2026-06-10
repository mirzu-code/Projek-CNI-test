import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Pastikan path ini betul ikut projek anda
import { cuisineDishes } from './BookingFlow';
import './MalayCuisine.css';

const MalayCuisine = () => {
  // Sediakan state untuk simpan harga dari database
  const [dbPrices, setDbPrices] = useState({});

  useEffect(() => {
    async function fetchPrices() {
      // Tarik nama dan harga dari table menus untuk Malay Cuisine (cuisine_id: 1)
      const { data, error } = await supabase
        .from('menus')
        .select('name, price')
        .eq('cuisine_id', 1);

      if (!error && data) {
        // Tukar susunan data jadi bentuk: { "Nama Lauk": 45.00 } supaya senang diganti nanti
        const priceMap = {};
        data.forEach(item => {
          priceMap[item.name] = `RM ${parseFloat(item.price).toFixed(2)}`;
        });
        setDbPrices(priceMap);
      } else {
        console.error("Gagal sync harga dari Supabase:", error);
      }
    }

    fetchPrices();
  }, []);

  // DATA ASAL ANDA (100% TIADA PERUBAHAN)
  const dishesInfo = [
    {
      value: 'masak-lemak',
      name: 'Daging Salai Masak Lemak Cili Api',
      price: dbPrices['Daging Salai Masak Lemak Cili Api'] || 'RM 45.00', // <-- Ambil harga DB, kalau tak jumpa guna harga asal
      description: 'Slow-smoked premium beef brisket simmered in a fiery, rich gravy of fresh coconut milk, turmeric, bird\'s eye chilies (cili api), and sliced local starfruit.',
      tags: ['≡ƒöÑ Spicy', 'Γ¡É Chef Special', 'Sustainably Sourced'],
      ingredients: ['Smoked Beef Brisket', 'Fresh Turmeric', 'Bird\'s Eye Chilies', 'Coconut Cream', 'Belimbing Buluh'],
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'ayam-rendang',
      name: 'Ayam Rendang Lembayung',
      price: dbPrices['Ayam Rendang Lembayung'] || 'RM 38.00', // <-- Ambil harga DB
      description: 'Tender chicken slow-braised for 6 hours in a luxurious complex spice paste (kerisik), toasted coconut, lemongrass, galangal, and fresh kaffir lime leaves.',
      tags: ['Traditional Recipe', 'Gluten Free'],
      ingredients: ['Kampung Chicken', 'Toasted Coconut (Kerisik)', 'Lemongrass', 'Galangal', 'Kaffir Lime Leaves'],
      image: 'https://images.unsplash.com/photo-1626804475315-8664b48697b0?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'ikan-bakar',
      name: 'Ikan Bakar Petai',
      price: dbPrices['Ikan Bakar Petai'] || 'RM 55.00', // <-- Ambil harga DB
      description: 'Fresh red snapper wrapped in banana leaf, charcoal-grilled to perfection with a thick marinade of spicy red chili paste, toasted shrimp paste, and fresh petai beans.',
      tags: ['≡ƒöÑ Spicy', 'Seafood Delight'],
      ingredients: ['Fresh Red Snapper', 'Stink Beans (Petai)', 'Chili Sambal Paste', 'Tamarind Juice', 'Banana Leaf Wrap'],
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
    },
    {
      value: 'nasi-lemak',
      name: 'Nasi Lemak Pandan Heritage',
      price: dbPrices['Nasi Lemak Pandan Heritage'] || 'RM 32.00', // <-- Ambil harga DB
      description: 'Basmati rice steamed with fresh pandan juice and coconut milk. Served with aromatic sweet-spicy anchovy sambal, spiced fried chicken, boiled eggs, and roasted peanuts.',
      tags: ['Signature Dish', 'All-Time Favorite'],
      ingredients: ['Pandan-infused Basmati Rice', 'Heritage Sambal Tumis', 'Crispy Rempah Fried Chicken', 'Roasted Peanuts', 'Hardboiled Egg'],
      image: 'https://images.unsplash.com/photo-1632514800760-496a7b744d03?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="cuisine-menu-page malay-theme animate-fade-in">
      {/* Back to Menu Hub */}
      <div className="cuisine-container">
        <Link to="/menu" className="back-link">ΓåÉ Back to Gastronomy Hub</Link>
      </div>

      {/* Hero Section */}
      <section className="cuisine-hero">
        <div className="cuisine-hero-overlay"></div>
        <div className="cuisine-hero-content text-center">
          <span className="cuisine-origin">≡ƒç▓≡ƒç╛ Authentic Malaysian Heritage</span>
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
              what is orderedΓÇöreducing raw waste to 0%. Thank you for supporting sustainable innovation!
            </p>
            <Link to="/book" className="btn-outline light-border">Book Your Table Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MalayCuisine;
