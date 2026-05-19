import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Checkout.css';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingData = state?.bookingData;

  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Connecting to secure gateway...');

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
    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpModal(true);
    }, 1200);
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (otpCode !== '123456') {
      setOtpError('Invalid OTP code.');
      return;
    }

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
      setIsProcessing(false);
      setOtpError('Gagal menyimpan: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="checkout-page animate-fade-in">
      <div className="checkout-container">
        <h2>Checkout</h2>
        <div className="checkout-summary">
          <p><strong>Name:</strong> {bookingData.name}</p>
          <p><strong>Phone:</strong> {bookingData.phone}</p>
          <p><strong>Date:</strong> {bookingData.date}</p>
          <p><strong>Time:</strong> {bookingData.time}</p>
          <p><strong>Guests:</strong> {bookingData.pax}</p>
          {bookingData.preorder && bookingData.dish && (
            <p><strong>Pre-order:</strong> {bookingData.dish.replace('-', ' ')}</p>
          )}
        </div>

        <form className="checkout-form" onSubmit={handlePaymentSubmit}>
          <div className="form-group">
            <label>Payment Deposit</label>
            <p>Deposit RM 50.00 akan dikenakan untuk menjamin meja anda.</p>
          </div>

          <button type="submit" className="btn-primary">Pay RM 50.00</button>
        </form>

        {isProcessing && <div className="gateway-overlay"><p>{processingStatus}</p></div>}

        {showOtpModal && (
          <div className="otp-modal-overlay">
            <div className="otp-modal">
              <h3>Enter OTP</h3>
              <p>Sila masukkan 6 digit kod OTP: 123456</p>
              <form onSubmit={handleOtpVerify}>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  maxLength="6"
                  placeholder="123456"
                  required
                />
                {otpError && <div className="error-text">{otpError}</div>}
                <button type="submit" className="btn-primary mt-2">Verify OTP</button>
              </form>
            </div>
          </div>
        )}

        {paymentSuccess && (
          <div className="success-message">
            <p>Payment success! Redirecting you to your booking...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
