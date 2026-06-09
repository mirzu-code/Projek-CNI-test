import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingFlow.css';

export const cuisineDishes = {
  malay: [
    { value: 'masak-lemak', label: 'Daging Salai Masak Lemak Cili Api (RM 45)' },
    { value: 'ayam-rendang', label: 'Ayam Rendang Lembayung (RM 38)' },
    { value: 'ikan-bakar', label: 'Ikan Bakar Petai (RM 55)' },
    { value: 'nasi-lemak', label: 'Nasi Lemak Pandan Heritage (RM 32)' }
  ],
  chinese: [
    { value: 'steamed-fish', label: 'Ginger Onion Steamed Sea Bass (RM 65)' },
    { value: 'szechuan-tofu', label: 'Szechuan Chili Maple Tofu (RM 28)' },
    { value: 'chicken-rice', label: 'Hainanese Chicken Rice Platter (RM 35)' },
    { value: 'cantonese-noodles', label: 'Cantonese Egg Gravy Noodles (RM 30)' }
  ],
  japanese: [
    { value: 'wagyu-ramen', label: 'Wagyu Beef Black Garlic Ramen (RM 75)' },
    { value: 'salmon-don', label: 'Truffle Salmon Sashimi Don (RM 58)' },
    { value: 'premium-sushi', label: 'Chef\'s Choice Premium Sushi Platter (RM 85)' },
    { value: 'tempura-moriawase', label: 'Crispy Seafood & Veg Tempura (RM 48)' }
  ],
  western: [
    { value: 'angus-steak', label: 'Black Angus Ribeye Steak (RM 120)' },
    { value: 'seared-salmon', label: 'Pan-Seared Citrus Salmon (RM 68)' },
    { value: 'truffle-pasta', label: 'Truffle Wild Mushroom Fettuccine (RM 45)' },
    { value: 'lembayung-burger', label: 'Signature Double Wagyu Burger (RM 55)' }
  ],
  indian: [
    { value: 'lamb-biryani', label: 'Aromatic Lamb Shank Biryani (RM 78)' },
    { value: 'butter-chicken', label: 'Tandoori Butter Chicken Masala (RM 42)' },
    { value: 'paneer-tikka', label: 'Paneer Tikka Butter Masala (RM 38)' },
    { value: 'naan-platter', label: 'Garlic Cheese Naan Platter (RM 25)' }
  ]
};

const cuisineThemes = [
  { value: 'malay', label: 'Malay Cuisine', subtitle: 'Turmeric, Pandan, & Grill', icon: '🇲🇾', color: '#1a472a' },
  { value: 'chinese', label: 'Chinese Cuisine', subtitle: 'Wok Hei & Steamed Delights', icon: '🇨🇳', color: '#b01e23' },
  { value: 'japanese', label: 'Japanese Cuisine', subtitle: 'Sashimi & Artisan Broths', icon: '🇯🇵', color: '#111111' },
  { value: 'western', label: 'Western Cuisine', subtitle: 'Bistro Grill & Dry-Aged Steak', icon: '🥩', color: '#2b3e50' },
  { value: 'indian', label: 'Indian Cuisine', subtitle: 'Claypot Dum & Tandoor Oven', icon: '🍛', color: '#a35d00' }
];

const cuisineMap = { malay: 1, chinese: 2, japanese: 3, western: 4, indian: 5 };

const BookingFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    pax: '2',
    name: '',
    phone: '',
    cuisineCategory: 'malay',
    dish: ''
  });
  const [expandedCuisine, setExpandedCuisine] = useState('malay');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const preselectCuisine = location.state?.preselectCuisine;
    const preselectDish = location.state?.preselectDish;
    if (preselectCuisine) {
      setFormData((prev) => ({
        ...prev,
        cuisineCategory: preselectCuisine,
        dish: preselectDish || prev.dish
      }));
      setExpandedCuisine(preselectCuisine);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCuisineClick = (value) => {
    setFormData((prev) => ({
      ...prev,
      cuisineCategory: value,
      dish: prev.cuisineCategory === value ? prev.dish : ''
    }));
    setExpandedCuisine((prev) => (prev === value ? '' : value));
  };

  const handleDishClick = (dishValue, cuisineValue) => {
    setFormData((prev) => ({
      ...prev,
      cuisineCategory: cuisineValue,
      dish: dishValue
    }));
    setExpandedCuisine(cuisineValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time || !formData.name || !formData.phone) {
      setErrorMessage('Sila lengkapkan tarikh, masa, nama dan telefon.');
      return;
    }

    const bookingData = {
      name: formData.name,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      pax: formData.pax,
      cuisineCategory: formData.cuisineCategory,
      dish: formData.dish || null,
      tableId: null,
      tableNumber: '',
      tableCapacity: null,
      cuisine_id: cuisineMap[formData.cuisineCategory] || null
    };

    navigate('/select-table', { state: { bookingData } });
  };

  return (
    <div className="booking-page animate-fade-in">
      <div className="booking-container">
        <div className="booking-header">
          <h2>Select Date, Time & Guests</h2>
          <p>Choose your ideal slot and preferred cuisine theme for a sustainable dining experience.</p>
        </div>

        <div className="booking-form-wrapper">
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Time</label>
              <select name="time" value={formData.time} onChange={handleChange} required>
                <option value="">Select Time Slot</option>
                <option value="18:00">6:00 PM</option>
                <option value="19:30">7:30 PM</option>
                <option value="21:00">9:00 PM</option>
              </select>
              <span className="help-text">Slots are strictly managed to avoid overcrowding (SDG 9).</span>
            </div>

            <div className="form-group">
              <label>Number of Guests (Pax)</label>
              <select name="pax" value={formData.pax} onChange={handleChange}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>{num} Person(s)</option>
                ))}
              </select>
              <span className="help-text">Table for {formData.pax} will be assigned ({formData.pax}-seat table).</span>
            </div>

            <div className="form-group">
              <label>Choose Cuisine Theme (Preferred)</label>
              <div className="cuisine-select-grid">
                {cuisineThemes.map((theme) => (
                  <div key={theme.value} className={`cuisine-card-wrap ${expandedCuisine === theme.value ? 'expanded' : ''}`}>
                    <button
                      type="button"
                      className={`cuisine-select-card ${formData.cuisineCategory === theme.value ? 'selected' : ''}`}
                      style={{ '--cuisine-theme-color': theme.color }}
                      onClick={() => handleCuisineClick(theme.value)}
                    >
                      <span className="cuisine-flag">{theme.icon}</span>
                      <div className="cuisine-info">
                        <strong>{theme.label}</strong>
                        <span>{theme.subtitle}</span>
                      </div>
                      <div className="cuisine-actions">
                        <span className="cuisine-toggle">{expandedCuisine === theme.value ? '−' : '+'}</span>
                        <div className="select-check">✓</div>
                      </div>
                    </button>

                    {expandedCuisine === theme.value && (
                      <div className="cuisine-dish-list">
                        {cuisineDishes[theme.value]?.map((dish) => (
                          <button
                            key={dish.value}
                            type="button"
                            className={`cuisine-dish-item ${formData.dish === dish.value ? 'selected-dish' : ''}`}
                            onClick={() => handleDishClick(dish.value, theme.value)}
                          >
                            <span>{dish.label}</span>
                            {formData.dish === dish.value && <span className="dish-selected-tag">Selected</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {formData.dish && (
              <div className="selected-dish-summary">
                Selected dish: {cuisineDishes[formData.cuisineCategory]?.find((d) => d.value === formData.dish)?.label || formData.dish}
              </div>
            )}

            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0123456789" required />
            </div>

            {errorMessage && <div className="error-text">{errorMessage}</div>}

            <button type="submit" className="btn-primary full-width mt-3">Continue — Choose Table</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
