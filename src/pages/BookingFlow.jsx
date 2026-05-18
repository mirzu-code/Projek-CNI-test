import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingFlow.css';

const BookingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    pax: '2',
    name: '',
    phone: '',
    preorder: false,
    dish: '',
    paymentMethod: 'fpx'
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      
      const newBooking = {
        ...formData,
        id: 'RES-' + Math.floor(1000 + Math.random() * 9000),
        status: 'Pending'
      };
      
      // 1. Save single active booking for customer portal
      localStorage.setItem('activeBooking', JSON.stringify(newBooking));
      
      // 2. Append to all reservations for the Admin panel
      const savedBookings = localStorage.getItem('allBookings');
      const all = savedBookings ? JSON.parse(savedBookings) : [];
      all.push(newBooking);
      localStorage.setItem('allBookings', JSON.stringify(all));
      
      setStep(5);
    }, 2000);
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
            <div className="line"></div>
            <span className={step >= 4 ? 'active' : ''}>4. Pay</span>
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
                <label className="checkbox-label">
                  <input type="checkbox" name="preorder" checked={formData.preorder} onChange={handleChange} />
                  I want to pre-order my main dish to help optimize kitchen resources.
                </label>
                
                {formData.preorder && (
                  <div className="form-group mt-2 animate-fade-in">
                    <label>Select Main Dish</label>
                    <select name="dish" value={formData.dish} onChange={handleChange}>
                      <option value="">Select a dish...</option>
                      <option value="masak-lemak">Masak Lemak Cili Api Daging Salai (RM 45)</option>
                      <option value="ayam-rendang">Ayam Rendang Rembayung (RM 38)</option>
                      <option value="ikan-bakar">Ikan Bakar Petai (RM 55)</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="button-group">
                <button className="btn-outline" onClick={prevStep}>Back</button>
                <button className="btn-primary" onClick={nextStep} disabled={!formData.name || !formData.phone || (formData.preorder && !formData.dish)}>Review</button>
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
                    <strong>{formData.dish.replace('-', ' ')}</strong>
                  </div>
                )}
                <div className="summary-item total-fee">
                  <span>Booking Deposit:</span>
                  <strong>RM 50.00</strong>
                </div>
              </div>
              <div className="button-group">
                <button className="btn-outline" onClick={prevStep}>Back</button>
                <button className="btn-primary" onClick={nextStep}>Proceed to Payment</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step">
              <h3>Payment Method</h3>
              <p className="payment-desc">Please secure your reservation with a RM 50.00 deposit.</p>
              
              <div className="payment-options">
                <label className={`payment-card ${formData.paymentMethod === 'fpx' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="fpx" checked={formData.paymentMethod === 'fpx'} onChange={handleChange} />
                  <div className="payment-info">
                    <span className="payment-icon">🏦</span>
                    <strong>FPX Online Banking</strong>
                  </div>
                </label>
                
                <label className={`payment-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} />
                  <div className="payment-info">
                    <span className="payment-icon">💳</span>
                    <strong>Credit / Debit Card</strong>
                  </div>
                </label>
                
                <label className={`payment-card ${formData.paymentMethod === 'ewallet' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="ewallet" checked={formData.paymentMethod === 'ewallet'} onChange={handleChange} />
                  <div className="payment-info">
                    <span className="payment-icon">📱</span>
                    <strong>E-Wallet (TNG, GrabPay)</strong>
                  </div>
                </label>
              </div>

              <div className="button-group">
                <button className="btn-outline" onClick={prevStep} disabled={isProcessing}>Back</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Pay RM 50.00'}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="form-step text-center success-step">
              <div className="success-icon" style={{ backgroundColor: '#b06000' }}>⏳</div>
              <h3>Booking Submitted!</h3>
              <p>Thank you, {formData.name}. Your reservation for {formData.date} at {formData.time} is now **Pending Approval** from our team.</p>
              <p className="sdg-thanks">By booking digitally{formData.preorder ? ' and pre-ordering' : ''}, you have contributed to our SDG 9 sustainable infrastructure initiative.</p>
              <button className="btn-primary mt-3 full-width" onClick={() => navigate('/my-booking')}>View My Booking</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
