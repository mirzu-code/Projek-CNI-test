import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cuisineDishes } from './BookingFlow';
import './Checkout.css';
import { supabase } from '../supabaseClient';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingData = state?.bookingData;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Connecting to secure gateway...');
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    if (!bookingData) {
      const timer = setTimeout(() => { navigate('/book'); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); setShowOtpModal(true); }, 1200);
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

      console.log('Saving booking payload', bookingPayload);

      if (error) throw error;

      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => { navigate('/my-booking'); }, 2500);

    } catch (err) {
      console.error("Ralat:", err.message);
      setIsProcessing(false);
      alert("Gagal menyimpan: " + err.message);
    }
  };

  return (
    <div className="checkout-page">
      {/* UI Asal anda kekal di sini */}
      {isProcessing && <div className="gateway-overlay">{processingStatus}</div>}
      {showOtpModal && (
        <form onSubmit={handleOtpVerify}>
          <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} maxLength="6" />
          <button type="submit">Verify</button>
        </form>
      )}
      {paymentSuccess && <div>Payment Success!</div>}
      
      {/* Form Payment anda... */}
    </div>
  );
};

export default Checkout;