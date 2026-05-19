import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cuisineDishes } from './BookingFlow';
import './Checkout.css';
import { supabase } from '../supabaseClient';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Retrieve reservation details passed from BookingFlow
  const bookingData = state?.bookingData;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Connecting to secure gateway...');

  // Card details state
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Selected FPX bank
  const [selectedBank, setSelectedBank] = useState('');

  // Handle redirect if no booking data is found
  useEffect(() => {
    if (!bookingData) {
      const timer = setTimeout(() => {
        navigate('/book');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return (
      <div className="checkout-page error-page animate-fade-in">
        <div className="checkout-container text-center">
          <div className="error-icon">⚠️</div>
          <h2>No Booking Session Found</h2>
          <p>We could not find an active reservation session. Redirecting you back to the booking page...</p>
          <button className="btn-primary mt-3" onClick={() => navigate('/book')}>Book Now</button>
        </div>
      </div>
    );
  }

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    setCardData({ ...cardData, number: formattedValue });
  };

  // Format Card Expiry (adds slash MM/YY)
  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardData({ ...cardData, expiry: value });
  };

  // Format CVV
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCardData({ ...cardData, cvv: value });
  };

  const handleCardDataChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  // Submit payment form - triggers gate transition
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStatus('Securing session with PCI-DSS 256-bit encryption...');

    // Simulate gateway handshakes
    setTimeout(() => {
      setProcessingStatus('Authorizing transaction amount of RM 50.00...');
      setTimeout(() => {
        setProcessingStatus('Verifying 3D-Secure details with issuing bank...');
        setTimeout(() => {
          setIsProcessing(false);
          setShowOtpModal(true); // Pop simulated 3DS modal
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // Verify OTP simulation
  // Verify OTP simulation & Save to Supabase
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (otpCode !== '123456') {
      setOtpError('Invalid OTP code. For test, please enter "123456" or click the autofill button.');
      return;
    }

    setOtpError('');
    setShowOtpModal(false);
    setIsProcessing(true);
    setProcessingStatus('Capturing deposit and generating booking ticket...');

    try {
      // 1. Sediakan data padan dengan struktur table `bookings` di Supabase
      const bookingPayload = {
        customer_name: bookingData.name,
        customer_phone: bookingData.phone,
        booking_date: bookingData.date, // Format mesti YYYY-MM-DD
        booking_time: bookingData.time, // Format mesti HH:MM:SS atau HH:MM
        total_guests: parseInt(bookingData.pax, 10),
        status: 'Pending',
        table_id: bookingData.tableId ? parseInt(bookingData.tableId, 10) : null
        // Nota: Pastikan key di atas (cth: tableId atau table_id) sepadan dengan data dari BookingFlow
      };

      // 2. Hantar data terus masuk ke pangkalan data Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select(); // Ambil balik data yang berjaya di-insert termasuk ID automatik

      if (error) {
        throw error;
      }

      // Data yang berjaya disimpan dari database
      const savedDataFromSupabase = data[0];

      // 3. Simpan sesi aktif ke localStorage untuk kegunaan UI / Customer Portal jika perlu
      const newBooking = {
        ...bookingData,
        id: 'RES-' + savedDataFromSupabase.id, // Gunakan ID sebenar dari Supabase
        status: savedDataFromSupabase.status,
        paymentRef: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        depositPaid: true
      };

      localStorage.setItem('activeBooking', JSON.stringify(newBooking));

      // (Opsional) Kekalkan backup local untuk Admin panel lama jika masih mahu
      const savedBookings = localStorage.getItem('allBookings');
      const all = savedBookings ? JSON.parse(savedBookings) : [];
      all.push(newBooking);
      localStorage.setItem('allBookings', JSON.stringify(all));

      // Tukar skrin kepada status kejayaan animasi
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Alihkan pengguna ke page tiket/booking mereka selepas 2.5 saat
      setTimeout(() => {
        navigate('/my-booking');
      }, 2500);

    } catch (err) {
      console.error("Ralat ketika menyimpan tempahan:", err.message);
      setIsProcessing(false);
      alert("Gagal menyimpan tempahan ke database: " + err.message);
    }
  };

  return (
    <div className="checkout-page animate-fade-in">
      {/* Loading Overlay for Secure Gateway */}
      {isProcessing && (
        <div className="gateway-overlay">
          <div className="gateway-card text-center animate-zoom-in">
            <div className="lock-spinner">
              <div className="spinner-ring"></div>
              <div className="lock-icon">🔒</div>
            </div>
            <h3>Secure Gateway</h3>
            <p className="status-text">{processingStatus}</p>
            <div className="compliance-badges">
              <span>PCI-DSS Compliant</span>
              <span className="dot">•</span>
              <span>SSL Secured</span>
            </div>
          </div>
        </div>
      )}

      {/* 3D-Secure OTP Modal */}
      {showOtpModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal animate-zoom-in">
            <div className="otp-header">
              <div className="bank-brand">🏦 Rembayung Secure Bank</div>
              <h3>3D-Secure Verification</h3>
            </div>
            <div className="otp-body">
              <p>An authentication code has been simulated and sent to your registered phone number: <strong>{bookingData.phone}</strong>.</p>
              <p className="otp-desc">Please enter the 6-digit One-Time PIN (OTP) below to authorize the transaction of <strong>RM 50.00</strong> to <strong>REMBAYUNG HERITAGE STORE</strong>.</p>

              <form onSubmit={handleOtpVerify}>
                <div className="form-group text-center">
                  <input
                    type="text"
                    maxLength="6"
                    className="otp-input"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="0 0 0 0 0 0"
                    required
                  />
                  {otpError && <p className="otp-error">{otpError}</p>}
                </div>

                <div className="otp-autofill" onClick={() => setOtpCode('123456')}>
                  💡 Autofill Demo OTP (123456)
                </div>

                <div className="otp-actions">
                  <button type="button" className="btn-outline" onClick={() => setShowOtpModal(false)}>Cancel Payment</button>
                  <button type="submit" className="btn-primary" disabled={otpCode.length !== 6}>Verify & Pay RM 50.00</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Successful Authorization Screen */}
      {paymentSuccess && (
        <div className="gateway-overlay success-overlay animate-fade-in">
          <div className="success-gateway-card text-center animate-zoom-in">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>
            <h2>Payment Authorized!</h2>
            <p className="payment-receipt-text">Deposit of <strong>RM 50.00</strong> has been successfully captured.</p>
            <p>Your reservation is registered and waiting for approval.</p>
            <div className="redirect-loader">
              <div className="loader-fill"></div>
            </div>
            <small>Redirecting to your digital receipt & ticket...</small>
          </div>
        </div>
      )}

      <div className="checkout-grid">
        {/* Left Column: Payment Form */}
        <div className="payment-column">
          <div className="checkout-box">
            <h2>Payment Details</h2>
            <p className="checkout-subtitle">Secure transaction encrypted with 256-bit SSL infrastructure.</p>

            {/* Payment Options */}
            <div className="checkout-tabs">
              <button
                className={`tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Credit/Debit Card
              </button>
              <button
                className={`tab-btn ${paymentMethod === 'fpx' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('fpx')}
              >
                🏦 FPX Banking
              </button>
              <button
                className={`tab-btn ${paymentMethod === 'ewallet' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('ewallet')}
              >
                📱 E-Wallet
              </button>
            </div>

            {/* TAB 1: CREDIT / DEBIT CARD */}
            {paymentMethod === 'card' && (
              <form onSubmit={handlePaymentSubmit} className="payment-form animate-fade-in">
                {/* Interactive Credit Card Graphic */}
                <div className="credit-card-wrapper">
                  <div className="interactive-card">
                    <div className="card-bg-mesh"></div>
                    <div className="card-top">
                      <div className="chip"></div>
                      <div className="card-logo">VISA</div>
                    </div>
                    <div className="card-number-display">
                      {cardData.number || '•••• •••• •••• ••••'}
                    </div>
                    <div className="card-bottom">
                      <div className="card-holder">
                        <span>Card Holder</span>
                        <strong>{cardData.name.toUpperCase() || 'YOUR FULL NAME'}</strong>
                      </div>
                      <div className="card-expiry">
                        <span>Expires</span>
                        <strong>{cardData.expiry || 'MM/YY'}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    value={cardData.name}
                    onChange={handleCardDataChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={handleCardNumberChange}
                    placeholder="4111 2222 3333 4444"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={handleCardExpiryChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>CVV / CVC</label>
                    <input
                      type="password"
                      maxLength="3"
                      value={cardData.cvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary full-width mt-3">
                  Pay RM 50.00 Securely
                </button>
              </form>
            )}

            {/* TAB 2: FPX BANKING */}
            {paymentMethod === 'fpx' && (
              <div className="fpx-payment animate-fade-in">
                <p className="tab-desc">Select your preferred banking portal. You will be redirected to the secure portal upon submission.</p>
                <div className="bank-grid">
                  {[
                    { id: 'mbb', name: 'Maybank2u', icon: '🟡' },
                    { id: 'cimb', name: 'CIMB Clicks', icon: '🔴' },
                    { id: 'pbb', name: 'Public Bank', icon: '🔵' },
                    { id: 'rhb', name: 'RHB Now', icon: '🔵' },
                    { id: 'hlb', name: 'Hong Leong', icon: '🟢' },
                    { id: 'bi', name: 'Bank Islam', icon: '🟢' }
                  ].map((bank) => (
                    <button
                      key={bank.id}
                      className={`bank-card ${selectedBank === bank.id ? 'selected' : ''}`}
                      onClick={() => setSelectedBank(bank.id)}
                    >
                      <span className="bank-icon">{bank.icon}</span>
                      <strong>{bank.name}</strong>
                    </button>
                  ))}
                </div>
                <button
                  className="btn-primary full-width mt-4"
                  onClick={handlePaymentSubmit}
                  disabled={!selectedBank}
                >
                  Pay via FPX Secure Portal
                </button>
              </div>
            )}

            {/* TAB 3: E-WALLET */}
            {paymentMethod === 'ewallet' && (
              <div className="ewallet-payment text-center animate-fade-in">
                <p className="tab-desc">Scan the secure dynamic QR code using your e-wallet app to pay instant deposit fee.</p>

                <div className="qr-container">
                  <div className="qr-box">
                    <div className="qr-scan-line"></div>
                    <div className="qr-squares">
                      {/* Premium simulated QR mesh */}
                      <div className="qr-square corner top-left"></div>
                      <div className="qr-square corner top-right"></div>
                      <div className="qr-square corner bottom-left"></div>
                      <div className="qr-dot-matrix"></div>
                    </div>
                  </div>
                  <div className="qr-brand-row">
                    <span>Touch 'n Go</span>
                    <span className="divider">|</span>
                    <span>GrabPay</span>
                    <span className="divider">|</span>
                    <span>Boost</span>
                  </div>
                </div>

                <button className="btn-primary full-width mt-4" onClick={handlePaymentSubmit}>
                  I Have Scanned & Paid
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Invoice Summary */}
        <div className="summary-column">
          <div className="invoice-box">
            <h3>Reservation Invoice</h3>
            <span className="invoice-tag">PRE-AUTHORIZED DEPOSIT</span>

            <div className="invoice-divider"></div>

            <div className="invoice-details">
              <div className="detail-item">
                <span>Guest Name:</span>
                <strong>{bookingData.name}</strong>
              </div>
              <div className="detail-item">
                <span>Phone Contact:</span>
                <strong>{bookingData.phone}</strong>
              </div>
              <div className="detail-item">
                <span>Date of Booking:</span>
                <strong>{bookingData.date}</strong>
              </div>
              <div className="detail-item">
                <span>Time Slot Selected:</span>
                <strong>{bookingData.time === '18:00' ? '6:00 PM' : bookingData.time === '19:30' ? '7:30 PM' : '9:00 PM'}</strong>
              </div>
              <div className="detail-item">
                <span>Guests Count:</span>
                <strong>{bookingData.pax} Person(s)</strong>
              </div>
              {bookingData.tableNumber && (
                <div className="detail-item" style={{ color: 'var(--primary-color)' }}>
                  <span>Assigned Table:</span>
                  <strong>{bookingData.tableNumber} ({bookingData.tableCapacity} seats)</strong>
                </div>
              )}
            </div>

            <div className="invoice-divider"></div>

            {bookingData.preorder && (
              <div className="invoice-preorder-section">
                <span className="section-label">SDG 9 Waste-Free Pre-orders:</span>
                <div className="preorder-dish-invoice">
                  <div className="dish-desc">
                    <span className="cuisine-badge">{bookingData.cuisineCategory.toUpperCase()}</span>
                    <strong>{
                      cuisineDishes[bookingData.cuisineCategory]?.find(d => d.value === bookingData.dish)?.label.split(' (')[0] || bookingData.dish
                    }</strong>
                  </div>
                  <span className="dish-price">
                    {cuisineDishes[bookingData.cuisineCategory]?.find(d => d.value === bookingData.dish)?.label.match(/RM \d+/)?.[0] || 'RM 0'}
                  </span>
                </div>
                <small className="preorder-info-label">
                  Note: Pre-orders are charged directly at the store during dining, net of deposit.
                </small>
              </div>
            )}

            <div className="invoice-divider"></div>

            <div className="invoice-pricing">
              <div className="price-item">
                <span>Table Deposit Fee</span>
                <span>RM 50.00</span>
              </div>
              <div className="price-item">
                <span>Secure Gateway Fee</span>
                <span>RM 0.00</span>
              </div>
              <div className="price-total">
                <span>Total Charge Now</span>
                <span className="amount-total">RM 50.00</span>
              </div>
            </div>

            <div className="payment-security-assurance">
              <span className="shield-icon">🛡️</span>
              <div>
                <strong>Secure Payment Assured</strong>
                <p>This deposit is fully refundable up to 24 hours prior to the slot time. Aligns with SDG 9 capacity infrastructure planning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
