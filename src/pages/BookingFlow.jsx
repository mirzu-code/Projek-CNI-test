import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './BookingFlow.css';

const cuisineIdMap = {
  malay: 1,
  chinese: 2,
  japanese: 3,
  western: 4,
  indian: 5,
  dessert: 6
};

const cuisineOptions = [
  { id: 'malay', label: 'Malay Cuisine', description: 'Rich heritage recipes and sustainable local flavours.' },
  { id: 'chinese', label: 'Chinese Cuisine', description: 'Balanced wok hei, steamed dishes and premium seafood.' },
  { id: 'japanese', label: 'Japanese Cuisine', description: 'Minimalist plating, pristine seafood and slow-brewed broths.' },
  { id: 'western', label: 'Western Cuisine', description: 'Modern European cooking with premium steaks and sauces.' },
  { id: 'indian', label: 'Indian Cuisine', description: 'Clay oven roasts, spice-rich curries and aromatic rice dishes.' },
  { id: 'dessert', label: 'Dessert / Kuih', description: 'Traditional kuih and sweet endings with local flavour and comfort.' }
];

const cuisineMenuItems = {
  malay: [
    { value: 'daging-salai-masak-lemak', name: 'Daging Salai Masak Lemak', price: 'RM 29.00', weight: 320 },
    { value: 'ayam-rendang-lembayung', name: 'Ayam Rendang Lembayung', price: 'RM 26.00', weight: 300 },
    { value: 'ikan-bakar-petai', name: 'Ikan Bakar Petai', price: 'RM 30.00', weight: 320 },
    { value: 'sotong-masak-hitam', name: 'Sotong Masak Hitam', price: 'RM 24.00', weight: 300 },
    { value: 'udang-tempoyak', name: 'Udang Masak Tempoyak', price: 'RM 28.00', weight: 310 },
    { value: 'nasi-lemak', name: 'Nasi Lemak Lembayung', price: 'RM 22.00', weight: 320 },
    { value: 'nasi-kerabu-kampung', name: 'Nasi Kerabu Kampung', price: 'RM 25.00', weight: 300 },
    { value: 'tauhu-telor-gulung', name: 'Tauhu Telur Gulung', price: 'RM 16.00', weight: 220 }
  ],
  chinese: [
    { value: 'steamed-sea-bass', name: 'Ginger Onion Steamed Sea Bass', price: 'RM 42.00', weight: 320 },
    { value: 'szechuan-chili-tofu', name: 'Szechuan Chili Maple Tofu', price: 'RM 22.00', weight: 220 },
    { value: 'hainanese-chicken-rice', name: 'Hainanese Chicken Rice Platter', price: 'RM 26.00', weight: 300 },
    { value: 'char-siew-noodles', name: 'Char Siew Noodles', price: 'RM 24.00', weight: 260 },
    { value: 'sesame-crispy-chicken', name: 'Sesame Crispy Chicken', price: 'RM 21.00', weight: 240 },
    { value: 'lotus-leaf-fried-rice', name: 'Lotus Leaf Fried Rice', price: 'RM 25.00', weight: 300 },
    { value: 'braised-eggplant-claypot', name: 'Braised Eggplant Claypot', price: 'RM 18.00', weight: 220 },
    { value: 'kung-pao-prawns', name: 'Kung Pao Prawns', price: 'RM 35.00', weight: 300 }
  ],
  japanese: [
    { value: 'wagyu-black-garlic-ramen', name: 'Wagyu Beef Black Garlic Ramen', price: 'RM 48.00', weight: 380 },
    { value: 'truffle-salmon-don', name: 'Truffle Salmon Sashimi Don', price: 'RM 36.00', weight: 320 },
    { value: 'premium-sushi-platter', name: 'Premium Sushi Platter', price: 'RM 38.00', weight: 280 },
    { value: 'miso-black-cod', name: 'Miso Black Cod', price: 'RM 40.00', weight: 320 },
    { value: 'tempura-udon', name: 'Tempura Udon', price: 'RM 25.00', weight: 280 },
    { value: 'yakitori-skewers', name: 'Yakitori Skewer Set', price: 'RM 22.00', weight: 220 },
    { value: 'chirashi-bowl', name: 'Chirashi Sushi Bowl', price: 'RM 30.00', weight: 320 },
    { value: 'matcha-anmitsu', name: 'Matcha Anmitsu Dessert Bowl', price: 'RM 18.00', weight: 180 }
  ],
  western: [
    { value: 'black-angus-ribeye', name: 'Black Angus Ribeye Steak', price: 'RM 58.00', weight: 420 },
    { value: 'pan-seared-salmon', name: 'Pan-Seared Citrus Salmon', price: 'RM 32.00', weight: 320 },
    { value: 'truffle-fettuccine', name: 'Truffle Wild Mushroom Fettuccine', price: 'RM 28.00', weight: 300 },
    { value: 'herb-crusted-lamb-chop', name: 'Herb-Crusted Lamb Chop', price: 'RM 34.00', weight: 320 },
    { value: 'seafood-risotto', name: 'Seafood Risotto', price: 'RM 26.00', weight: 300 },
    { value: 'chicken-cordon-bleu', name: 'Chicken Cordon Bleu', price: 'RM 24.00', weight: 260 },
    { value: 'beef-wellington-bites', name: 'Beef Wellington Bites', price: 'RM 30.00', weight: 300 }
  ],
  indian: [
    { value: 'aromatic-lamb-biryani', name: 'Aromatic Lamb Shank Biryani', price: 'RM 42.00', weight: 380 },
    { value: 'butter-chicken-masala', name: 'Tandoori Butter Chicken Masala', price: 'RM 29.00', weight: 280 },
    { value: 'paneer-tikka-masala', name: 'Paneer Tikka Masala', price: 'RM 28.00', weight: 260 },
    { value: 'lamb-rogan-josh', name: 'Lamb Rogan Josh', price: 'RM 34.00', weight: 300 },
    { value: 'mutton-seekh-kebab', name: 'Mutton Seekh Kebab', price: 'RM 25.00', weight: 240 },
    { value: 'dal-makhani', name: 'Dal Makhani', price: 'RM 22.00', weight: 220 },
    { value: 'garlic-cheese-naan', name: 'Garlic Cheese Naan Platter', price: 'RM 18.00', weight: 180 }
  ],
  dessert: [
    { value: 'kuih-bingka-ubi', name: 'Kuih Bingka Ubi', price: 'RM 12.00', weight: 140 },
    { value: 'ondeh-ondeh', name: 'Ondeh-Ondeh', price: 'RM 14.00', weight: 120 },
    { value: 'seri-muka', name: 'Seri Muka', price: 'RM 13.00', weight: 140 },
    { value: 'kuih-lapis', name: 'Kuih Lapis', price: 'RM 15.00', weight: 140 },
    { value: 'cendol-gelato', name: 'Cendol Gelato', price: 'RM 16.00', weight: 160 },
    { value: 'kuih-ketayap', name: 'Kuih Ketayap', price: 'RM 14.00', weight: 140 },
    { value: 'tapai-pulut', name: 'Tapai Pulut', price: 'RM 13.00', weight: 130 }
  ]
};

const riceDishesByCuisine = {
  malay: ['nasi-kerabu-kampung', 'nasi-lemak'],
  chinese: ['hainanese-chicken-rice', 'lotus-leaf-fried-rice', 'char-siew-noodles', 'mala-beef-noodles'],
  japanese: ['truffle-salmon-don', 'chirashi-bowl', 'salmon-mentaiko-bowl', 'yaki-onigiri'],
  indian: ['aromatic-lamb-biryani', 'garlic-cheese-naan'],
  western: ['seafood-risotto', 'truffle-fettuccine'],
  dessert: []
};

const timeSlots = (() => {
  const slots = [];
  const start = 15 * 60;
  const end = 23 * 60 + 30;
  for (let minutes = start; minutes <= end; minutes += 30) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  }
  return slots;
})();

const BookingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    pax: 2,
    activeCuisine: location.state?.preselectCuisine || '',
    selectedDishes: location.state?.preselectDish ? [location.state.preselectDish] : []
  });

  useEffect(() => {
    if (location.state?.preselectCuisine || location.state?.preselectDish) {
      setFormData((prev) => ({
        ...prev,
        activeCuisine: location.state.preselectCuisine || prev.activeCuisine,
        selectedDishes: location.state.preselectDish
          ? [location.state.preselectDish]
          : prev.selectedDishes
      }));
    }
  }, [location.state]);

  const handleChange = (field) => (event) => {
    const value = field === 'pax' ? Number(event.target.value) : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCuisineSelect = (id) => {
    setFormData((prev) => ({ ...prev, activeCuisine: id }));
  };

  const handleTimeSelect = (value) => {
    setFormData((prev) => ({ ...prev, time: value }));
  };

  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');

  useEffect(() => {
    const loadAdminMenus = async () => {
      setMenuLoading(true);
      try {
        const { data, error } = await supabase
          .from('menus')
          .select('*')
          .eq('is_active', true)
          .order('cuisine_id', { ascending: true })
          .order('id', { ascending: true });

        if (error) {
          throw error;
        }

        setMenuItems(data || []);
        setMenuError('');
      } catch (err) {
        console.warn('Supabase menu load failed:', err.message);
        setMenuItems([]);
        setMenuError('Failed to load admin menu. Falling back to default menu.');
      } finally {
        setMenuLoading(false);
      }
    };

    loadAdminMenus();
  }, []);

  const handleDishToggle = (dishValue) => {
    setFormData((prev) => {
      const selectedDishes = prev.selectedDishes.includes(dishValue)
        ? prev.selectedDishes.filter((selected) => selected !== dishValue)
        : [...prev.selectedDishes, dishValue];
      return { ...prev, selectedDishes };
    });
  };

  const getDishesForCuisine = (cuisineKey) => {
    const cuisineId = cuisineIdMap[cuisineKey];
    const adminDishes = menuItems.filter((item) => Number(item.cuisine_id) === cuisineId && item.is_active !== false);
    const defaultDishes = cuisineMenuItems[cuisineKey] || [];

    const formattedAdminDishes = adminDishes.map((item) => ({
      value: String(item.id),
      name: item.name || 'Unnamed Menu',
      price: typeof item.price === 'number' ? `RM ${item.price.toFixed(2)}` : item.price || 'RM 0.00',
      description: item.description || '',
      weight: item.weight ?? 250
    }));

    if (formattedAdminDishes.length > 0) {
      const merged = new Map();
      defaultDishes.forEach((dish) => merged.set(dish.name, dish));
      formattedAdminDishes.forEach((dish) => merged.set(dish.name, dish));
      return Array.from(merged.values());
    }

    return defaultDishes;
  };

  const findDishName = (dishValue) => {
    const dishId = String(dishValue);
    const adminMatch = menuItems.find((item) => String(item.id) === dishId);
    if (adminMatch) {
      return adminMatch.name;
    }
    for (const cuisineItems of Object.values(cuisineMenuItems)) {
      const match = cuisineItems.find((item) => item.value === dishValue);
      if (match) {
        return match.name;
      }
    }
    return dishValue;
  };

  const findCuisineLabel = (cuisineId) => {
    return cuisineOptions.find((option) => option.id === cuisineId)?.label || 'Various Cuisines';
  };

  const getCuisineMenuLink = (cuisineKey) => {
    if (!cuisineKey) return '/menu';
    return cuisineKey === 'dessert' ? '/menu/desserts' : `/menu/${cuisineKey}`;
  };

  const getIncludedSide = () => {
    const selectedValues = formData.selectedDishes.map(String);
    const hasRiceOrStapleDish = selectedValues.some((dishValue) =>
      riceDishesByCuisine[formData.activeCuisine]?.includes(dishValue)
    );

    switch (formData.activeCuisine) {
      case 'malay':
        return hasRiceOrStapleDish ? '' : 'Steamed White Rice';
      case 'chinese':
        return hasRiceOrStapleDish ? '' : 'Steamed Jasmine Rice';
      case 'japanese':
        return hasRiceOrStapleDish ? '' : '';
      case 'western':
        return 'Garlic Mash Potatoes';
      case 'indian':
        return hasRiceOrStapleDish ? '' : 'Basmati Rice & Naan';
      case 'dessert':
        return '';
      default:
        return '';
    }
  };

  const getDishWeight = (dish) => dish.weight ?? 250;

  const parsePrice = (price) => {
    if (typeof price === 'number') {
      return price;
    }
    return Number(String(price).replace(/[^0-9.-]+/g, '')) || 0;
  };

  const getDishRecord = (dishValue) => {
    const dishId = String(dishValue);
    const adminMatch = menuItems.find((item) => String(item.id) === dishId);
    if (adminMatch) {
      return {
        ...adminMatch,
        price: typeof adminMatch.price === 'number' ? adminMatch.price : adminMatch.price,
        weight: adminMatch.weight ?? 250
      };
    }
    return Object.values(cuisineMenuItems).flat().find((item) => item.value === dishValue) || null;
  };

  const calculateTotalWeight = () => {
    return formData.selectedDishes.reduce((sum, dishValue) => {
      const dish = getDishRecord(dishValue);
      return sum + (dish ? getDishWeight(dish) : 0);
    }, 0);
  };

  const calculateWasteSurcharge = () => {
    const totalWeight = calculateTotalWeight();
    const recommendedWeight = Math.max(1, formData.pax) * 200;
    const wasteWeight = Math.max(0, totalWeight - recommendedWeight);
    return Math.ceil(wasteWeight / 100) * 10;
  };

  const calculateTotal = () => {
    return formData.selectedDishes.reduce((sum, dishValue) => {
      const dish = getDishRecord(dishValue);
      return sum + (dish ? parsePrice(dish.price) : 0);
    }, 0);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.activeCuisine) {
        setError('Please select a cuisine type first.');
        return false;
      }
      if (!formData.selectedDishes.length) {
        setError('Please select at least one dish to pre-order.');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.pax) {
        setError('Please complete all booking details to continue.');
        return false;
      }
      if (!timeSlots.includes(formData.time)) {
        setError('Please select a time slot between 15:00 and 23:30.');
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const submitBooking = () => {
    if (!validateStep()) return;

    const resolvedDishes = formData.selectedDishes.map((dishValue) => {
      const dish = getDishRecord(dishValue);
      return {
        value: dishValue,
        name: dish ? dish.name : dishValue,
        price: dish ? parsePrice(dish.price) : 0
      };
    });

    const bookingData = {
      ...formData,
      pax: Number(formData.pax),
      tableId: null,
      tableNumber: null,
      selectedDishDetails: resolvedDishes,
      sideDish: getIncludedSide(),
      dishTotal: calculateTotal()
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/select-table', { state: { bookingData } });
  };

  return (
    <div className="booking-page animate-fade-in">
      <div className="booking-container">
        <div className="booking-header">
          <h2>Lembayung Booking</h2>
          <div className="step-indicator">
            <span className={step >= 1 ? 'active' : ''}>1. Choose Cuisine</span>
            <span className="line"></span>
            <span className={step >= 2 ? 'active' : ''}>2. Details</span>
            <span className="line"></span>
            <span className={step >= 3 ? 'active' : ''}>3. Confirm</span>
          </div>
        </div>

        <div className="booking-form-wrapper">
          {step === 1 && (
            <div className="form-step">
              <h3>Choose your cuisine</h3>
              <p className="step-subtitle">Select a cuisine to view the available menu for your reservation and pre-order.</p>
              <p className="step-subtitle" style={{ marginTop: '0.4rem', fontWeight: 600 }}>
                Select your preferred dishes for your reservation.
              </p>
              <div className="cuisine-select-grid">
                {cuisineOptions.map((cuisine) => (
                  <div
                    key={cuisine.id}
                    className={`cuisine-select-card ${formData.activeCuisine === cuisine.id ? 'selected' : ''}`}
                    onClick={() => handleCuisineSelect(cuisine.id)}
                    style={{ '--cuisine-theme-color': 'var(--primary-color)' }}
                  >
                    <div className="cuisine-info">
                      <strong>{cuisine.label}</strong>
                      <span>{cuisine.description}</span>
                    </div>
                    <div className="select-check">✓</div>
                  </div>
                ))}
              </div>

              {formData.activeCuisine ? (
                <div style={{ marginTop: '1.8rem' }}>
                  <div className="selected-dish-summary" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <span>Menu for <strong>{findCuisineLabel(formData.activeCuisine)}</strong></span>
                    <Link to={getCuisineMenuLink(formData.activeCuisine)} className="btn-outline" style={{ fontSize: '0.95rem', padding: '0.5rem 0.85rem' }}>
                      View full menu
                    </Link>
                  </div>
                  {menuLoading ? (
                    <div className="selected-dish-summary" style={{ marginTop: '1rem' }}>
                      Loading menu from admin...
                    </div>
                  ) : (
                    <>
                      {menuError && (
                        <div className="table-error-msg" style={{ marginTop: '1rem' }}>
                          {menuError}
                        </div>
                      )}
                      <div className="cuisine-dish-list">
                        {getDishesForCuisine(formData.activeCuisine).map((dish) => (
                          <button
                            type="button"
                            key={dish.value}
                            className={`cuisine-dish-item ${formData.selectedDishes.includes(dish.value) ? 'selected-dish' : ''}`}
                            onClick={() => handleDishToggle(dish.value)}
                          >
                            <span>{dish.name}</span>
                            <strong>{dish.price}</strong>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="selected-dish-summary" style={{ marginTop: '0.75rem' }}>
                    Estimated Order Weight: <strong>{calculateTotalWeight()}g</strong>
                  </div>
                  <div className="selected-dish-summary" style={{ marginTop: '0.75rem' }}>
                    Recommended Weight Limit: <strong>{Math.max(1, formData.pax) * 200}g</strong>
                  </div>
                  {getIncludedSide() && (
                    <div className="selected-dish-summary" style={{ marginTop: '0.75rem', color: '#2f855a' }}>
                      Includes complimentary side dish: <strong>{getIncludedSide()}</strong>
                    </div>
                  )}
                  <div className="selected-dish-summary" style={{ marginTop: '0.75rem', color: '#2f855a' }}>
                    Your dish selection has been recorded. Continue to select your table.
                  </div>
                  <div className="selected-dish-summary" style={{ marginTop: '0.75rem', fontWeight: 700 }}>
                    Total Price: <strong>RM {calculateTotal().toFixed(2)}</strong>
                  </div>
                  {formData.selectedDishes.length > 0 && (
                    <div className="selected-dish-summary" style={{ marginTop: '1rem' }}>
                      Selected dishes:
                      <div className="selected-dish-tags" style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {formData.selectedDishes.map((dishValue) => (
                          <span key={dishValue} className="dish-selected-tag">
                            {findDishName(dishValue)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="step-subtitle">Change your cuisine anytime to view different menus.</p>
                </div>
              ) : (
                <p className="step-subtitle" style={{ marginTop: '1.8rem' }}>
                  Please select a cuisine type first to view the available menu.
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h3>Complete Reservation Details</h3>
              <p className="step-subtitle">Please fill in your name, phone, date, and time.</p>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input id="name" value={formData.name} onChange={handleChange('name')} placeholder="Full name" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" value={formData.phone} onChange={handleChange('phone')} placeholder="0123456789" />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input id="date" type="date" value={formData.date} onChange={handleChange('date')} />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <div className="time-slot-grid">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      className={`time-slot-button ${formData.time === slot ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <span className="help-text">Booking slots are open from 3:00 PM to 11:30 PM.</span>
              </div>
              <div className="form-group">
                <label htmlFor="pax">Number of Guests</label>
                <input id="pax" type="number" min="1" value={formData.pax} onChange={handleChange('pax')} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h3>Confirm Your Reservation</h3>
              <p className="step-subtitle">Review your details before proceeding to table selection.</p>
              <p className="step-subtitle" style={{ marginTop: '0.5rem', color: '#2f855a' }}>
                Once confirmed, you will proceed to select your table in the next step.
              </p>
              <div className="summary-card">
                <div className="summary-item">
                  <span>Name</span>
                  <strong>{formData.name || 'Not provided'}</strong>
                </div>
                <div className="summary-item">
                  <span>Phone</span>
                  <strong>{formData.phone || 'Not provided'}</strong>
                </div>
                <div className="summary-item">
                  <span>Date & Time</span>
                  <strong>{formData.date || '-'} {formData.time || ''}</strong>
                </div>
                <div className="summary-item">
                  <span>Number of Guests</span>
                  <strong>{formData.pax}</strong>
                </div>
                <div className="summary-item">
                  <span>Cuisine</span>
                  <strong>{formData.activeCuisine ? findCuisineLabel(formData.activeCuisine) : 'Various Cuisines'}</strong>
                </div>
                <div className="summary-item">
                  <span>Dish / Pre-order</span>
                  <strong>
                    {formData.selectedDishes.length
                      ? formData.selectedDishes.map(findDishName).join(', ')
                      : 'None'}
                  </strong>
                </div>
                <div className="summary-item">
                  <span>Order Weight</span>
                  <strong>{calculateTotalWeight()}g</strong>
                </div>
                <div className="summary-item">
                  <span>Booking Status</span>
                  <strong>Processing</strong>
                </div>
                <div className="summary-item total-fee">
                  <span>Total Price</span>
                  <strong>RM {calculateTotal().toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}

          {error && <p className="table-error-msg">{error}</p>}

          <div className="button-group">
            {step > 1 ? (
              <button type="button" className="btn-outline" onClick={handleBack}>
                Back
              </button>
            ) : (
              <Link to="/menu" className="btn-outline">
                Back to Menu
              </Link>
            )}
            {step < 3 ? (
              <button type="button" className="btn-primary" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="button" className="btn-primary full-width" onClick={submitBooking}>
                Select Table and Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
