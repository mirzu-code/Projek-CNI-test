import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Checkout.css';
import './BookingFlow.css';

const Checkout = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stateBooking = location.state?.bookingData;
    const saved = localStorage.getItem('bookingData');

    if (!stateBooking && !saved) {
      setLoading(false);
      setError('Tiada data tempahan. Mengalihkan kembali ke borang tempahan...');
      setTimeout(() => navigate('/book'), 1500);
      return;
    }

    try {
      const parsed = stateBooking || JSON.parse(saved);
      setBooking(parsed);
      // persist to localStorage so refresh doesn't lose data
      if (stateBooking) localStorage.setItem('bookingData', JSON.stringify(stateBooking));
    } catch (err) {
      setError('Data tempahan tidak sah. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleConfirm = async () => {
    if (!booking) return;
    if (!booking.tableId) {
      setError('Sila pilih meja sebelum membuat pembayaran.');
      return;
    }

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
        status: 'Confirmed'
      };

      // Only include `table_capacity` if a value was selected/available.
      // This avoids sending a column that might not exist in the remote DB schema.
      if (booking.tableCapacity != null && booking.tableCapacity !== '') {
        payload.table_capacity = booking.tableCapacity;
      }

      const { data: bookingData, error: insertError } = await supabase.from('bookings').insert([payload]);
      if (insertError) {
        throw insertError;
      }

      // Lock the table for 1.5 hours (90 minutes) from the booking time
      if (booking.tableId) {
        const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
        const lockExpiresAt = new Date(bookingDateTime.getTime() + 90 * 60 * 1000).toISOString();

        const lockPayload = {
          table_id: booking.tableId,
          locked_by: booking.name,
          lock_token: `booking-${Date.now()}`,
          lock_expires_at: lockExpiresAt
        };

        const { error: lockError } = await supabase
          .from('table_locks')
          .upsert([lockPayload], { onConflict: 'table_id' });

        if (lockError) {
          console.warn('Table lock failed:', lockError);
        }
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
            <button
              type="button"
              className="btn-primary full-width"
              onClick={handleConfirm}
              disabled={loading || !booking.tableId}
            >
              {loading ? 'Mengesahkan...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
