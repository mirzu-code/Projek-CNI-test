import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Checkout.css';
import './BookingFlow.css';

const Checkout = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('bookingData');
    if (!saved) {
      setLoading(false);
      setError('Tiada data tempahan. Mengalihkan kembali ke borang tempahan...');
      setTimeout(() => navigate('/book'), 1500);
      return;
    }

    try {
      setBooking(JSON.parse(saved));
    } catch (err) {
      setError('Data tempahan tidak sah. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleConfirm = async () => {
    if (!booking) return;
    setLoading(true);
    setError('');

    try {
      const payload = {
        customer_name: booking.name,
        customer_phone: booking.phone,
        booking_date: booking.date,
        booking_time: booking.time,
        total_guests: booking.pax,
        cuisine_id: booking.preselectCuisine === 'malay' ? 1 : booking.preselectCuisine === 'chinese' ? 2 : booking.preselectCuisine === 'japanese' ? 3 : booking.preselectCuisine === 'western' ? 4 : booking.preselectCuisine === 'indian' ? 5 : null,
        dish: booking.preselectDish || null,
        table_id: booking.tableId || null,
        table_capacity: booking.tableCapacity || null,
        status: 'Confirmed'
      };

      const { error: insertError } = await supabase.from('bookings').insert([payload]);
      if (insertError) {
        throw insertError;
      }

      localStorage.removeItem('bookingData');
      localStorage.setItem('activeBooking', JSON.stringify({
        ...booking,
        tableId: booking.tableId,
        tableNumber: booking.tableNumber,
        status: 'Confirmed'
      }));
      navigate('/my-booking');
    } catch (err) {
      setError('Gagal mengesahkan tempahan: ' + (err.message || 'Ralat tidak diketahui'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page animate-fade-in">
        <div className="booking-container" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Memproses tempahan anda...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-page animate-fade-in">
        <div className="booking-container" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>Tiada tempahan ditemui</h2>
          <p>{error || 'Sila kembali ke borang tempahan.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page animate-fade-in">
      <div className="booking-container">
        <div className="booking-header">
          <h2>Checkout</h2>
          <div className="step-indicator">
            <span className="active">1. Semak</span>
            <span className="line"></span>
            <span className="active">2. Sahkan</span>
          </div>
        </div>
        <div className="booking-form-wrapper">
          <div className="summary-card">
            <div className="summary-item">
              <span>Nama</span>
              <strong>{booking.name}</strong>
            </div>
            <div className="summary-item">
              <span>Telefon</span>
              <strong>{booking.phone}</strong>
            </div>
            <div className="summary-item">
              <span>Tarikh & Masa</span>
              <strong>{booking.date} {booking.time}</strong>
            </div>
            <div className="summary-item">
              <span>Jumlah Tetamu</span>
              <strong>{booking.pax}</strong>
            </div>
            <div className="summary-item">
              <span>Cuisine</span>
              <strong>{booking.preselectCuisine || 'Biasa'}</strong>
            </div>
            <div className="summary-item">
              <span>Pra-pesanan</span>
              <strong>{booking.preselectDish || 'Tiada'}</strong>
            </div>
            <div className="summary-item">
              <span>Meja</span>
              <strong>{booking.tableNumber || 'Belum dipilih'}</strong>
            </div>
          </div>

          {error && <p className="table-error-msg">{error}</p>}

          <div className="button-group">
            <button type="button" className="btn-outline" onClick={() => navigate('/select-table')}>
              Pilih Meja Semula
            </button>
            <button type="button" className="btn-primary full-width" onClick={handleConfirm} disabled={loading}>
              {loading ? 'Mengesahkan...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
