import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './BookingFlow.css';

const cuisineOptions = [
  { id: 'malay', label: 'Malay Cuisine', description: 'Rich heritage recipes and sustainable local flavours.' },
  { id: 'chinese', label: 'Chinese Cuisine', description: 'Balanced wok hei, steamed dishes and premium seafood.' },
  { id: 'japanese', label: 'Japanese Cuisine', description: 'Minimalist plating, pristine seafood and slow-brewed broths.' },
  { id: 'western', label: 'Western Cuisine', description: 'Modern European cooking with premium steaks and sauces.' },
  { id: 'indian', label: 'Indian Cuisine', description: 'Clay oven roasts, spice-rich curries and aromatic rice dishes.' }
];

const cuisineMenuItems = {
  malay: [
    { value: 'masak-lemak', name: 'Daging Salai Masak Lemak', price: 'RM 45.00' },
    { value: 'ayam-rendang', name: 'Ayam Rendang Lembayung', price: 'RM 38.00' },
    { value: 'ikan-bakar', name: 'Ikan Bakar Petai', price: 'RM 55.00' }
  ],
  chinese: [
    { value: 'steamed-fish', name: 'Ginger Onion Steamed Sea Bass', price: 'RM 65.00' },
    { value: 'szechuan-tofu', name: 'Szechuan Chili Maple Tofu', price: 'RM 28.00' },
    { value: 'chicken-rice', name: 'Hainanese Chicken Rice Platter', price: 'RM 35.00' }
  ],
  japanese: [
    { value: 'wagyu-ramen', name: 'Wagyu Beef Black Garlic Ramen', price: 'RM 75.00' },
    { value: 'salmon-don', name: 'Truffle Salmon Sashimi Don', price: 'RM 58.00' },
    { value: 'premium-sushi', name: 'Premium Sushi Platter', price: 'RM 85.00' }
  ],
  western: [
    { value: 'angus-steak', name: 'Black Angus Ribeye Steak', price: 'RM 120.00' },
    { value: 'salmon', name: 'Pan-Seared Citrus Salmon', price: 'RM 68.00' },
    { value: 'truffle-pasta', name: 'Truffle Wild Mushroom Fettuccine', price: 'RM 45.00' }
  ],
  indian: [
    { value: 'lamb-biryani', name: 'Aromatic Lamb Shank Biryani', price: 'RM 78.00' },
    { value: 'butter-chicken', name: 'Tandoori Butter Chicken Masala', price: 'RM 42.00' },
    { value: 'naan-platter', name: 'Garlic Cheese Naan Platter', price: 'RM 25.00' }
  ]
};

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

  const handleDishToggle = (dishValue) => {
    setFormData((prev) => {
      const selectedDishes = prev.selectedDishes.includes(dishValue)
        ? prev.selectedDishes.filter((selected) => selected !== dishValue)
        : [...prev.selectedDishes, dishValue];
      return { ...prev, selectedDishes };
    });
  };

  const findDishName = (dishValue) => {
    for (const cuisineItems of Object.values(cuisineMenuItems)) {
      const match = cuisineItems.find((item) => item.value === dishValue);
      if (match) {
        return match.name;
      }
    }
    return dishValue;
  };

  const findCuisineLabel = (cuisineId) => {
    return cuisineOptions.find((option) => option.id === cuisineId)?.label || 'Unknown Cuisine';
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.selectedDishes.length) {
        setError('Sila pilih sekurang-kurangnya satu hidangan untuk pra-pesanan.');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.pax) {
        setError('Sila lengkapkan semua maklumat tempahan untuk meneruskan.');
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

    const bookingData = {
      ...formData,
      pax: Number(formData.pax),
      tableId: null,
      tableNumber: null
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
              <h3>Pilih makanan anda</h3>
              <p className="step-subtitle">Pilih hidangan daripada pelbagai cuisine untuk preorder.</p>
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

              {formData.selectedDishes.length > 0 && (
                <div className="selected-dish-summary">
                  Hidangan terpilih:
                  <div className="selected-dish-tags" style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {formData.selectedDishes.map((dishValue) => (
                      <span key={dishValue} className="dish-selected-tag">
                        {findDishName(dishValue)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="cuisine-card-wrap">
                {Object.entries(cuisineMenuItems).map(([cuisineId, dishes]) => (
                  <div key={cuisineId} className="cuisine-dish-group">
                    <h4 style={{ marginBottom: '0.75rem' }}>{findCuisineLabel(cuisineId)}</h4>
                    <div className="cuisine-dish-list">
                      {dishes.map((dish) => (
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h3>Lengkapkan Maklumat Tempahan</h3>
              <p className="step-subtitle">Sila isi maklumat seperti nama, telefon, tarikh dan waktu.</p>
              <div className="form-group">
                <label htmlFor="name">Nama</label>
                <input id="name" value={formData.name} onChange={handleChange('name')} placeholder="Nama penuh" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Telefon</label>
                <input id="phone" value={formData.phone} onChange={handleChange('phone')} placeholder="0123456789" />
              </div>
              <div className="form-group">
                <label htmlFor="date">Tarikh</label>
                <input id="date" type="date" value={formData.date} onChange={handleChange('date')} />
              </div>
              <div className="form-group">
                <label htmlFor="time">Masa</label>
                <input id="time" type="time" value={formData.time} onChange={handleChange('time')} />
              </div>
              <div className="form-group">
                <label htmlFor="pax">Jumlah Tetamu</label>
                <input id="pax" type="number" min="1" value={formData.pax} onChange={handleChange('pax')} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h3>Sahkan Tempahan Anda</h3>
              <p className="step-subtitle">Semak semula maklumat anda sebelum meneruskan ke pemilihan meja.</p>
              <div className="summary-card">
                <div className="summary-item">
                  <span>Nama</span>
                  <strong>{formData.name || 'Tidak diisi'}</strong>
                </div>
                <div className="summary-item">
                  <span>Telefon</span>
                  <strong>{formData.phone || 'Tidak diisi'}</strong>
                </div>
                <div className="summary-item">
                  <span>Tarikh & Masa</span>
                  <strong>{formData.date || '-'} {formData.time || ''}</strong>
                </div>
                <div className="summary-item">
                  <span>Jumlah Tetamu</span>
                  <strong>{formData.pax}</strong>
                </div>
                <div className="summary-item">
                  <span>Cuisine</span>
                  <strong>{formData.activeCuisine ? findCuisineLabel(formData.activeCuisine) : 'Pelbagai Cuisine'}</strong>
                </div>
                <div className="summary-item">
                  <span>Dish / Pra-Pesanan</span>
                  <strong>
                    {formData.selectedDishes.length
                      ? formData.selectedDishes.map(findDishName).join(', ')
                      : 'Tiada'}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {error && <p className="table-error-msg">{error}</p>}

          <div className="button-group">
            {step > 1 ? (
              <button type="button" className="btn-outline" onClick={handleBack}>
                Kembali
              </button>
            ) : (
              <Link to="/menu" className="btn-outline">
                Kembali ke Menu
              </Link>
            )}
            {step < 3 ? (
              <button type="button" className="btn-primary" onClick={handleNext}>
                Seterusnya
              </button>
            ) : (
              <button type="button" className="btn-primary full-width" onClick={submitBooking}>
                Pilih Meja dan Teruskan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
