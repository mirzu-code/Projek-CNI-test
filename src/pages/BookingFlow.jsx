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
    { value: 'daging-salai-masak-lemak', name: 'Daging Salai Masak Lemak', price: 'RM 32.00' },
    { value: 'ayam-rendang-lembayung', name: 'Ayam Rendang Lembayung', price: 'RM 28.00' },
    { value: 'ikan-bakar-petai', name: 'Ikan Bakar Petai', price: 'RM 36.00' },
    { value: 'sotong-masak-hitam', name: 'Sotong Masak Hitam', price: 'RM 26.00' },
    { value: 'udang-tempoyak', name: 'Udang Masak Tempoyak', price: 'RM 30.00' },
    { value: 'nasi-kerabu-kampung', name: 'Nasi Kerabu Kampung', price: 'RM 24.00' },
    { value: 'tauhu-telor-gulung', name: 'Tauhu Telur Gulung', price: 'RM 18.00' }
  ],
  chinese: [
    { value: 'steamed-sea-bass', name: 'Ginger Onion Steamed Sea Bass', price: 'RM 42.00' },
    { value: 'szechuan-chili-tofu', name: 'Szechuan Chili Maple Tofu', price: 'RM 22.00' },
    { value: 'hainanese-chicken-rice', name: 'Hainanese Chicken Rice Platter', price: 'RM 26.00' },
    { value: 'char-siew-noodles', name: 'Char Siew Noodles', price: 'RM 24.00' },
    { value: 'sesame-crispy-chicken', name: 'Sesame Crispy Chicken', price: 'RM 21.00' },
    { value: 'lotus-leaf-fried-rice', name: 'Lotus Leaf Fried Rice', price: 'RM 25.00' },
    { value: 'braised-eggplant-claypot', name: 'Braised Eggplant Claypot', price: 'RM 18.00' },
    { value: 'kung-pao-prawns', name: 'Kung Pao Prawns', price: 'RM 35.00' }
  ],
  japanese: [
    { value: 'wagyu-black-garlic-ramen', name: 'Wagyu Beef Black Garlic Ramen', price: 'RM 48.00' },
    { value: 'truffle-salmon-don', name: 'Truffle Salmon Sashimi Don', price: 'RM 36.00' },
    { value: 'premium-sushi-platter', name: 'Premium Sushi Platter', price: 'RM 38.00' },
    { value: 'miso-black-cod', name: 'Miso Black Cod', price: 'RM 40.00' },
    { value: 'tempura-udon', name: 'Tempura Udon', price: 'RM 25.00' },
    { value: 'yakitori-skewers', name: 'Yakitori Skewer Set', price: 'RM 22.00' },
    { value: 'chirashi-bowl', name: 'Chirashi Sushi Bowl', price: 'RM 30.00' },
    { value: 'matcha-anmitsu', name: 'Matcha Anmitsu Dessert Bowl', price: 'RM 18.00' }
  ],
  western: [
    { value: 'black-angus-ribeye', name: 'Black Angus Ribeye Steak', price: 'RM 58.00' },
    { value: 'pan-seared-salmon', name: 'Pan-Seared Citrus Salmon', price: 'RM 32.00' },
    { value: 'truffle-fettuccine', name: 'Truffle Wild Mushroom Fettuccine', price: 'RM 28.00' },
    { value: 'herb-crusted-lamb-chop', name: 'Herb-Crusted Lamb Chop', price: 'RM 34.00' },
    { value: 'seafood-risotto', name: 'Seafood Risotto', price: 'RM 26.00' },
    { value: 'chicken-cordon-bleu', name: 'Chicken Cordon Bleu', price: 'RM 24.00' },
    { value: 'beef-wellington-bites', name: 'Beef Wellington Bites', price: 'RM 30.00' }
  ],
  indian: [
    { value: 'aromatic-lamb-biryani', name: 'Aromatic Lamb Shank Biryani', price: 'RM 42.00' },
    { value: 'butter-chicken-masala', name: 'Tandoori Butter Chicken Masala', price: 'RM 29.00' },
    { value: 'paneer-tikka-masala', name: 'Paneer Tikka Masala', price: 'RM 28.00' },
    { value: 'lamb-rogan-josh', name: 'Lamb Rogan Josh', price: 'RM 34.00' },
    { value: 'mutton-seekh-kebab', name: 'Mutton Seekh Kebab', price: 'RM 25.00' },
    { value: 'dal-makhani', name: 'Dal Makhani', price: 'RM 22.00' },
    { value: 'garlic-cheese-naan', name: 'Garlic Cheese Naan Platter', price: 'RM 18.00' }
  ],
  dessert: [
    { value: 'kuih-bingka-ubi', name: 'Kuih Bingka Ubi', price: 'RM 12.00' },
    { value: 'ondeh-ondeh', name: 'Ondeh-Ondeh', price: 'RM 14.00' },
    { value: 'seri-muka', name: 'Seri Muka', price: 'RM 13.00' },
    { value: 'kuih-lapis', name: 'Kuih Lapis', price: 'RM 15.00' },
    { value: 'cendol-gelato', name: 'Cendol Gelato', price: 'RM 16.00' },
    { value: 'kuih-ketayap', name: 'Kuih Ketayap', price: 'RM 14.00' },
    { value: 'tapai-pulut', name: 'Tapai Pulut', price: 'RM 13.00' }
  ]
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
        setMenuError('Gagal memuatkan menu admin. Menyebabkan menu lalai digunakan.');
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
    if (adminDishes.length > 0) {
      return adminDishes.map((item) => ({
        value: String(item.id),
        name: item.name || 'Menu tidak bernama',
        price: typeof item.price === 'number' ? `RM ${item.price.toFixed(2)}` : item.price || 'RM 0.00',
        description: item.description || '',
        weight: item.weight ?? 250
      }));
    }
    return cuisineMenuItems[cuisineKey] || [];
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
    return cuisineOptions.find((option) => option.id === cuisineId)?.label || 'Pelbagai Cuisine';
  };

  const getCuisineMenuLink = (cuisineKey) => {
    if (!cuisineKey) return '/menu';
    return cuisineKey === 'dessert' ? '/menu/desserts' : `/menu/${cuisineKey}`;
  };

  const getIncludedSide = () => {
    const sideMap = {
      malay: 'Nasi Putih',
      chinese: 'Steamed Jasmine Rice',
      japanese: 'Gohan Rice',
      western: 'Garlic Mash Potatoes',
      indian: 'Basmati Rice & Naan',
      dessert: 'Assorted Kuih selections'
    };
    return sideMap[formData.activeCuisine] || '';
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
        setError('Sila pilih satu jenis cuisine dahulu.');
        return false;
      }
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
      if (!timeSlots.includes(formData.time)) {
        setError('Sila pilih slot masa antara 15:00 hingga 23:30.');
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
              <h3>Pilih jenis cuisine</h3>
              <p className="step-subtitle">Pilih cuisine, kemudian lihat menu apa yang ada untuk tempahan dan preorder.</p>
              <p className="step-subtitle" style={{ marginTop: '0.4rem', fontWeight: 600 }}>
                Mengikut SDG 9: Industri, inovasi dan infrastruktur lestari.
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
                    <span>Menu untuk <strong>{findCuisineLabel(formData.activeCuisine)}</strong></span>
                    <Link to={getCuisineMenuLink(formData.activeCuisine)} className="btn-outline" style={{ fontSize: '0.95rem', padding: '0.5rem 0.85rem' }}>
                      Lihat penuh menu
                    </Link>
                  </div>
                  {menuLoading ? (
                    <div className="selected-dish-summary" style={{ marginTop: '1rem' }}>
                      Memuatkan menu dari admin...
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
                    Anggaran Berat Pesanan: <strong>{calculateTotalWeight()}g</strong>
                  </div>
                  <div className="selected-dish-summary" style={{ marginTop: '0.75rem' }}>
                    Had Berat Disyorkan: <strong>{Math.max(1, formData.pax) * 200}g</strong>
                  </div>
                  {getIncludedSide() && (
                    <div className="selected-dish-summary" style={{ marginTop: '0.75rem', color: '#2f855a' }}>
                      Termasuk sekali dengan pilihan sampingan: <strong>{getIncludedSide()}</strong>
                    </div>
                  )}
                  {calculateWasteSurcharge() > 0 ? (
                    <div className="selected-dish-summary" style={{ marginTop: '0.75rem', color: '#c53030' }}>
                      Amaran SDG 9: Pesanan mencecah pembaziran.
                      Caj RM10 setiap 100g akan dikenakan jika pembaziran berlaku.
                    </div>
                  ) : (
                    <div className="selected-dish-summary" style={{ marginTop: '0.75rem', color: '#2f855a' }}>
                      Baik: Pesanan anda sejajar dengan keperluan SDG 9.
                    </div>
                  )}
                  <div className="selected-dish-summary" style={{ marginTop: '0.75rem', fontWeight: 700 }}>
                    Jumlah Harga: <strong>RM {calculateTotal().toFixed(2)}</strong>
                  </div>
                  {formData.selectedDishes.length > 0 && (
                    <div className="selected-dish-summary" style={{ marginTop: '1rem' }}>
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
                  <p className="step-subtitle">Tukar cuisine bila-bila masa untuk lihat menu baru.</p>
                </div>
              ) : (
                <p className="step-subtitle" style={{ marginTop: '1.8rem' }}>
                  Sila pilih satu jenis cuisine terlebih dahulu untuk melihat menu yang ada.
                </p>
              )}
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
                <span className="help-text">Slot tempahan dibuka dari 3:00 petang hingga 11:30 malam.</span>
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
              <p className="step-subtitle" style={{ marginTop: '0.5rem', color: '#2f855a' }}>
                Setelah disahkan, pelanggan akan terus memilih meja di langkah seterusnya.
              </p>
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
                <div className="summary-item">
                  <span>Berat Pesanan</span>
                  <strong>{calculateTotalWeight()}g</strong>
                </div>
                <div className="summary-item">
                  <span>Amaran SDG 9</span>
                  <strong>
                    {calculateWasteSurcharge() > 0
                      ? 'Potensi caj RM10/100g jika pembaziran berlaku'
                      : 'Pesanan sejajar dengan SDG 9'}
                  </strong>
                </div>
                <div className="summary-item total-fee">
                  <span>Jumlah Harga</span>
                  <strong>RM {calculateTotal().toFixed(2)}</strong>
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
