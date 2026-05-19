import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingFlow.css';

export const cuisineDishes = {
  malay: [
    { value: 'masak-lemak', label: 'Daging Salai Masak Lemak Cili Api (RM 45)' },
    { value: 'ayam-rendang', label: 'Ayam Rendang Rembayung (RM 38)' },
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
    { value: 'premium-sushi', label: 'Chef Choice Premium Sushi Platter (RM 85)' },
    { value: 'tempura-moriawase', label: 'Crispy Seafood & Veg Tempura (RM 48)' }
  ],
  western: [
    { value: 'angus-steak', label: 'Black Angus Ribeye Steak (RM 120)' },
    { value: 'seared-salmon', label: 'Pan-Seared Citrus Salmon (RM 68)' },
    { value: 'truffle-pasta', label: 'Truffle Wild Mushroom Fettuccine (RM 45)' },
    { value: 'rembayung-burger', label: 'Signature Double Wagyu Burger (RM 55)' }
  ],
  indian: [
    { value: 'lamb-biryani', label: 'Aromatic Lamb Shank Biryani (RM 78)' },
    { value: 'butter-chicken', label: 'Tandoori Butter Chicken Masala (RM 42)' },
    { value: 'paneer-tikka', label: 'Paneer Tikka Butter Masala (RM 38)' },
    { value: 'naan-platter', label: 'Garlic Cheese Naan Platter (RM 25)' }
  ]
};

const cuisineMap = { malay: 1, chinese: 2, japanese: 3, western: 4, indian: 5 };

const BookingFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    date: '',
    time: '18:00',
    pax: '2',
    name: '',
    phone: '',
    preorder: false,
    cuisineCategory: '',
    dish: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedDraft = localStorage.getItem('bookingDraft');
    const savedData = savedDraft ? JSON.parse(savedDraft) : null;
    const preselectCuisine = location.state?.preselectCuisine || '';
    const preselectDish = location.state?.preselectDish || '';

    if (preselectCuisine || preselectDish) {
      setFormData((prev) => ({
        ...prev,
        ...savedData,
        preorder: true,
        cuisineCategory: preselectCuisine || savedData?.cuisineCategory || '',
        dish: preselectDish || savedData?.dish || ''
      }));
      return;
    }

    if (savedData) {
      setFormData((prev) => ({
        ...prev,
        ...savedData
      }));
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem('bookingDraft', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      preorder: formData.preorder,
      cuisineCategory: formData.cuisineCategory,
      dish: formData.dish,
      tableId: null,
      tableNumber: '',
      tableCapacity: null,
      cuisine_id: cuisineMap[formData.cuisineCategory] || null
    };

    navigate('/checkout', { state: { bookingData } });
  };

  return (
    <div className="booking-page animate-fade-in">
      <div className="booking-container">
        <div className="booking-header">
          <h2>Reserve Your Table</h2>
          <p>Isi maklumat anda dan teruskan ke pembayaran.</p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Time</label>
            <select name="time" value={formData.time} onChange={handleChange} required>
              <option value="18:00">6:00 PM</option>
              <option value="19:30">7:30 PM</option>
              <option value="21:00">9:00 PM</option>
            </select>
          </div>

          <div className="form-group">
            <label>Guests</label>
            <select name="pax" value={formData.pax} onChange={handleChange}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>{num} Person(s)</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0123456789" required />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="preorder" checked={formData.preorder} onChange={handleChange} />
              Pre-order a main dish
            </label>
          </div>

          {formData.preorder && (
            <>
              <div className="form-group">
                <label>Cuisine</label>
                <select name="cuisineCategory" value={formData.cuisineCategory} onChange={handleChange} required>
                  <option value="">Select cuisine</option>
                  <option value="malay">Malay</option>
                  <option value="chinese">Chinese</option>
                  <option value="japanese">Japanese</option>
                  <option value="western">Western</option>
                  <option value="indian">Indian</option>
                </select>
              </div>

              {formData.cuisineCategory && (
                <div className="form-group">
                  <label>Dish</label>
                  <select name="dish" value={formData.dish} onChange={handleChange} required>
                    <option value="">Select dish</option>
                    {cuisineDishes[formData.cuisineCategory].map((dish) => (
                      <option key={dish.value} value={dish.value}>{dish.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {errorMessage && <div className="error-text">{errorMessage}</div>}

          <button type="submit" className="btn-primary mt-3">Continue to Checkout</button>
        </form>
      </div>
    </div>
  );
};

export default BookingFlow;
