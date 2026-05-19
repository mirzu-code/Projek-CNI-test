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

const BookingFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    pax: '2',
    name: '',
    phone: '',
    preorder: false,
    cuisineCategory: '',
    dish: '',
    paymentMethod: 'fpx'
  });

  useEffect(() => {
    if (location.state?.preselectCuisine && location.state?.preselectDish) {
      setFormData(prev => ({
        ...prev,
        preorder: true,
        cuisineCategory: location.state.preselectCuisine,
        dish: location.state.preselectDish
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    // Reset dish if cuisine changes
    if (e.target.name === 'cuisineCategory') {
      setFormData({ ...formData, cuisineCategory: value, dish: '' });
    } else if (e.target.name === 'preorder' && !value) {
      setFormData({ ...formData, preorder: value, cuisineCategory: '', dish: '' });
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleProceedToPayment = () => {
    navigate('/checkout', { state: { bookingData: formData } });
  };

  return (
    <div className="booking-page animate-fade-in">
      <div className="booking-container">
        <div className="booking-header">
          <h2>Reserve Your Table</h2>
          <div className="step-indicator">
            <span className={step >= 1 ? 'active' : ''}>1. Time</span>
            <div className="line"></div>
            <span className={step >= 2 ? 'active' : ''}>2. Details</span>
            <div className="line"></div>
            <span className={step >= 3 ? 'active' : ''}>3. Review</span>
          </div>
        </div>

        <div className="booking-form-wrapper">
          {step === 1 && (
            <div className="form-step">
              <h3>Select Date, Time & Pax</h3>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="form-group">
                <label>Time</label>
                <select name="time" value={formData.time} onChange={handleChange} required>
                  <option value="">Select Time Slot</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
                <small className="help-text">Slots are strictly managed to avoid overcrowding (SDG 9).</small>
              </div>
              <div className="form-group">
                <label>Number of Guests (Pax)</label>
                <select name="pax" value={formData.pax} onChange={handleChange}>
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} Person(s)</option>
                  ))}
                </select>
              </div>
              <button className="btn-primary full-width" onClick={nextStep} disabled={!formData.date || !formData.time}>Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h3>Guest Details & SDG Pre-order</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+60123456789" required />
              </div>
              
              <div className="sdg-highlight">
                <h4>Support SDG 9: Reduce Food Waste</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.8rem' }}>
                  Pre-ordering your main dish helps our kitchen procure ingredients with 100% precision, preventing culinary scrap and conserving resources.
                </p>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input type="checkbox" name="preorder" checked={formData.preorder} onChange={handleChange} />
                  I want to pre-order my main dish
                </label>
                
                {formData.preorder && (
                  <div className="preorder-selections animate-fade-in" style={{ marginTop: '1rem', borderLeft: '3px solid var(--accent-color)', paddingLeft: '1rem' }}>
                    <div className="form-group">
                      <label>Cuisine Category</label>
                      <select name="cuisineCategory" value={formData.cuisineCategory} onChange={handleChange} required>
                        <option value="">Select a cuisine...</option>
                        <option value="malay">🇲🇾 Malay Cuisine</option>
                        <option value="chinese">🇨🇳 Chinese Cuisine</option>
                        <option value="japanese">🇯🇵 Japanese Cuisine</option>
                        <option value="western">🥩 Western Cuisine</option>
                        <option value="indian">🍛 Indian Cuisine</option>
                      </select>
                    </div>
                    
                    {formData.cuisineCategory && (
                      <div className="form-group mt-2">
                        <label>Select Main Dish</label>
                        <select name="dish" value={formData.dish} onChange={handleChange} required>
                          <option value="">Select a dish...</option>
                          {cuisineDishes[formData.cuisineCategory]?.map(dish => (
                            <option key={dish.value} value={dish.value}>{dish.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="button-group">
                <button className="btn-outline" onClick={prevStep}>Back</button>
                <button className="btn-primary" onClick={nextStep} disabled={!formData.name || !formData.phone || (formData.preorder && (!formData.cuisineCategory || !formData.dish))}>Review</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h3>Review Your Booking</h3>
              <div className="summary-card">
                <div className="summary-item">
                  <span>Date & Time:</span>
                  <strong>{formData.date} at {formData.time}</strong>
                </div>
                <div className="summary-item">
                  <span>Guests:</span>
                  <strong>{formData.pax} Person(s)</strong>
                </div>
                <div className="summary-item">
                  <span>Guest Name:</span>
                  <strong>{formData.name}</strong>
                </div>
                <div className="summary-item">
                  <span>Contact:</span>
                  <strong>{formData.phone}</strong>
                </div>
                {formData.preorder && (
                  <div className="summary-item highlight">
                    <span>Pre-order (SDG 9):</span>
                    <strong style={{ color: 'var(--accent-color)' }}>
                      {formData.cuisineCategory.charAt(0).toUpperCase() + formData.cuisineCategory.slice(1)} - {
                        cuisineDishes[formData.cuisineCategory]?.find(d => d.value === formData.dish)?.label.split(' (')[0] || formData.dish
                      }
                    </strong>
                  </div>
                )}
                <div className="summary-item total-fee">
                  <span>Booking Deposit:</span>
                  <strong>RM 50.00</strong>
                </div>
              </div>
              <div className="button-group">
                <button className="btn-outline" onClick={prevStep}>Back</button>
                <button className="btn-primary animate-pulse" onClick={handleProceedToPayment}>Proceed to Secure Payment</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
