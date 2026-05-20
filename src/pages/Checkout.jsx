import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Checkout.css';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingData = state?.bookingData;
  const [activeTab, setActiveTab] = useState('fpx');
  const [selectedBank, setSelectedBank] = useState('maybank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Connecting to secure gateway...');

  const fpxBanks = [
    { id: 'maybank', label: 'Maybank', icon: 'M' },
    { id: 'cimb', label: 'CIMB', icon: 'C' },
    { id: 'ambank', label: 'Ambank', icon: 'A' },
    { id: 'rhb', label: 'RHB', icon: 'R' },
    { id: 'hongleong', label: 'Hong Leong', icon: 'H' }
  ];

  useEffect(() => {
    if (!bookingData) {
      const timer = setTimeout(() => { navigate('/book'); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return (
      <div className="checkout-page animate-fade-in">
        <div className="checkout-container">
          <h2>Booking not found</h2>
          <p>Tiada tempahan ditemui. Anda akan dialihkan ke halaman tempahan.</p>
        </div>
      </div>
    );
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStatus('Connecting to secure gateway...');
    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpModal(true);
    }, 1200);
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (otpSubmitting || isProcessing) return;

    if (otpCode !== '123456') {
      setOtpError('Invalid OTP code.');
      return;
    }

    setOtpSubmitting(true);
    setIsProcessing(true);
    setProcessingStatus('Saving to database...');

    try {
      const bookingPayload = {
        customer_name: bookingData.name,
        customer_phone: bookingData.phone,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        total_guests: parseInt(bookingData.pax, 10),
        status: 'Pending',
        table_id: bookingData.tableId ? parseInt(bookingData.tableId, 10) : null,
        cuisine_id: bookingData.cuisine_id || null,
        dish: bookingData.dish || null
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select();

      if (error) {
        throw error;
      }

      const savedBooking = data?.[0];

      if (bookingData.tableId) {
        try {
          await supabase
            .from('table_locks')
            .delete()
            .eq('table_id', bookingData.tableId);
        } catch (lockError) {
          console.warn('Could not clear table lock:', lockError.message || lockError);
        }
      }

      const localBooking = {
        ...bookingData,
        id: savedBooking?.id ? `RES-${savedBooking.id}` : `RES-${Math.floor(1000 + Math.random() * 9000)}`,
        status: savedBooking?.status || 'Pending'
      };

      localStorage.setItem('activeBooking', JSON.stringify(localBooking));
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => { navigate('/my-booking'); }, 2500);
    } catch (err) {
      console.error('Ralat:', err.message || err);
      setOtpError('Gagal menyimpan: ' + (err.message || 'Unknown error'));
    }
    finally {
      setIsProcessing(false);
      setOtpSubmitting(false);
    }
  };

  const totalDeposit = 50;

  return (
    <div className="checkout-page animate-fade-in">
      <div className="checkout-grid">
        <div className="checkout-box">
          <h2>Checkout</h2>
          <p className="checkout-subtitle">Complete your booking with FPX payment and confirm your table reservation.</p>

          <div className="checkout-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'fpx' ? 'active' : ''}`}
              onClick={() => setActiveTab('fpx')}
            >
              FPX Bank
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'ewallet' ? 'active' : ''}`}
              onClick={() => setActiveTab('ewallet')}
            >
              E-Wallet
            </button>
          </div>

          {activeTab === 'fpx' ? (
            <div>
              <p className="tab-desc">Pilih bank FPX anda untuk membayar deposit RM 50.00 secara selamat.</p>
              <div className="bank-grid">
                {fpxBanks.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    className={`bank-card ${selectedBank === bank.id ? 'selected' : ''}`}
                    onClick={() => setSelectedBank(bank.id)}
                  >
                    <div className="bank-icon">{bank.icon}</div>
                    <strong>{bank.label}</strong>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="qr-container">
              <div className="qr-box">
                <div className="qr-scan-line" />
                <div className="qr-squares">
                  <div className="qr-square top-left" />
                  <div className="qr-square top-right" />
                  <div className="qr-square bottom-left" />
                  <div className="qr-dot-matrix" />
                </div>
              </div>
              <div className="qr-brand-row">
                <span>Scan & Pay</span>
                <span className="divider">•</span>
                <span>Secure via E-Wallet</span>
              </div>
            </div>
          )}

          <div className="payment-security-assurance">
            <div className="shield-icon">🔒</div>
            <div>
              <strong>Secure checkout</strong>
              <p>Semua transaksi dihantar melalui pintu masuk FPX yang selamat dan dilindungi.</p>
            </div>
          </div>

          <form className="payment-form" onSubmit={handlePaymentSubmit}>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Deposit Amount</label>
                <input type="text" value={`RM ${totalDeposit}.00`} readOnly />
              </div>
              <div className="form-group flex-1">
                <label>Selected Bank</label>
                <input type="text" value={fpxBanks.find((bank) => bank.id === selectedBank)?.label || 'FPX'} readOnly />
              </div>
            </div>
            <div className="form-group">
              <label>Payment Reference</label>
              <input type="text" value={`REF-${bookingData.phone}-${bookingData.date}`} readOnly />
            </div>
            <button type="submit" className="btn-primary full-width mt-3" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay RM ${totalDeposit}.00`}
            </button>
          </form>

          {isProcessing && (
            <div className="gateway-overlay">
              <div className="gateway-card">
                <div className="lock-spinner">
                  <div className="spinner-ring" />
                  <div className="lock-icon">🔒</div>
                </div>
                <h3>Processing Payment</h3>
                <p className="status-text">{processingStatus}</p>
                <div className="compliance-badges">
                  <span className="dot">●</span>
                  FPX Secure
                  <span className="dot">●</span>
                  3D Secure
                </div>
              </div>
            </div>
          )}

          {showOtpModal && (
            <div className="otp-modal-overlay">
              <div className="otp-modal">
                <div className="otp-header">
                  <span className="bank-brand">FPX Authorization</span>
                  <h3>Enter OTP</h3>
                </div>
                <div className="otp-body">
                  <p>Sila masukkan 6 digit kod OTP yang dihantar ke telefon anda.</p>
                  <p className="otp-desc">Gunakan kod 123456 untuk ujian.</p>
                        <form onSubmit={handleOtpVerify}>
                          <input
                            className="otp-input"
                            type="text"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            maxLength="6"
                            placeholder="123456"
                            required
                          />
                          {otpError && <div className="error-text">{otpError}</div>}
                          <button type="submit" className="btn-primary mt-3 full-width" disabled={isProcessing || otpSubmitting}>
                            {otpSubmitting ? 'Processing...' : 'Verify OTP'}
                          </button>
                        </form>
                </div>
              </div>
            </div>
          )}

          {paymentSuccess && (
            <div className="success-message">
              <p>Payment success! Redirecting you to your booking...</p>
            </div>
          )}
        </div>

        <div className="invoice-box">
          <h3>Booking Summary</h3>
          <span className="invoice-tag">Deposit</span>
          <div className="invoice-divider" />
          <div className="invoice-details">
            <div className="detail-item"><span>Name</span><strong>{bookingData.name}</strong></div>
            <div className="detail-item"><span>Phone</span><strong>{bookingData.phone}</strong></div>
            <div className="detail-item"><span>Date</span><strong>{bookingData.date}</strong></div>
            <div className="detail-item"><span>Time</span><strong>{bookingData.time}</strong></div>
            <div className="detail-item"><span>Guests</span><strong>{bookingData.pax} Person(s)</strong></div>
            {bookingData.tableNumber && (
              <div className="detail-item"><span>Table</span><strong>{bookingData.tableNumber}</strong></div>
            )}
            {bookingData.dish && (
              <div className="detail-item"><span>Pre-order</span><strong>{bookingData.dish.replace('-', ' ')}</strong></div>
            )}
          </div>

          <div className="invoice-divider" />
          <div className="invoice-pricing">
            <div className="price-item"><span>Deposit</span><strong>RM {totalDeposit}.00</strong></div>
            <div className="price-total"><span>Total</span><span className="amount-total">RM {totalDeposit}.00</span></div>
          </div>

          <div className="payment-security-assurance mt-4">
            <div className="shield-icon">✅</div>
            <div>
              <strong>Secure & Verified</strong>
              <p>Bayaran anda akan disahkan oleh sistem bank FPX dan direkod dengan selamat.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
