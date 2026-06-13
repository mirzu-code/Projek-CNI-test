import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Checkout.css';
import './BookingFlow.css';

const Checkout = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stateBooking = location.state?.bookingData;
    const saved = localStorage.getItem('bookingData');

    if (!stateBooking && !saved) {
      setLoading(false);
      setError('No booking data found. Redirecting to booking form...');
      setTimeout(() => navigate('/book'), 1500);
      return;
    }

    try {
      const parsed = stateBooking || JSON.parse(saved);
      setBooking(parsed);
      if (stateBooking) localStorage.setItem('bookingData', JSON.stringify(stateBooking));
    } catch (err) {
      setError('Invalid booking data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!booking) return;
    if (!booking.tableId) {
      setError('Please select a table before making payment.');
      return;
    }

    setError('');
    setIsProcessingPayment(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        let dishesSelected = [];
        if (booking.selectedDishDetails && booking.selectedDishDetails.length > 0) {
          dishesSelected = booking.selectedDishDetails.map(d => d.name);
        } else if (booking.preselectDish) {
          dishesSelected = [booking.preselectDish];
        }

        let dishString = dishesSelected.join(', ');
        
        let sideDishString = booking.sideDish || '';
        if (sideDishString) {
          dishString = dishString ? `${dishString} (Side: ${sideDishString})` : `Side: ${sideDishString}`;
        }

        if (booking.addonDesserts && booking.addonDesserts.length > 0) {
          const dessertNames = booking.addonDesserts.map(d => d.name).join(', ');
          dishString = dishString ? `${dishString} | Desserts: ${dessertNames}` : `Desserts: ${dessertNames}`;
        }

        const payload = {
          customer_name: booking.name,
          customer_phone: booking.phone,
          booking_date: booking.date,
          booking_time: booking.time,
          total_guests: booking.pax,
          cuisine_id: booking.preselectCuisine === 'malay' ? 1 : booking.preselectCuisine === 'chinese' ? 2 : booking.preselectCuisine === 'japanese' ? 3 : booking.preselectCuisine === 'western' ? 4 : booking.preselectCuisine === 'indian' ? 5 : null,
          dish: dishString || null,
          table_id: booking.tableId || null,
          status: 'Confirmed'
        };

        if (booking.tableCapacity != null && booking.tableCapacity !== '') {
          payload.table_capacity = booking.tableCapacity;
        }

        const { data: bookingData, error: insertError } = await supabase.from('bookings').insert([payload]);
        if (insertError) throw insertError;

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

          if (lockError) console.warn('Table lock failed:', lockError);
        }

        localStorage.removeItem('bookingData');
        localStorage.setItem('activeBooking', JSON.stringify({
          ...booking,
          tableId: booking.tableId,
          tableNumber: booking.tableNumber,
          dish: dishString,
          status: 'Confirmed'
        }));
        navigate('/my-booking');
      } catch (err) {
        setError('Failed to confirm booking: ' + (err.message || 'Unknown error'));
        setIsProcessingPayment(false);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="booking-page animate-fade-in">
        <div className="booking-container" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-page animate-fade-in">
        <div className="booking-container" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>No Booking Found</h2>
          <p>{error || 'Please return to the booking form.'}</p>
        </div>
      </div>
    );
  }

  const reservationDeposit = 10.00;
  const dessertTotal = booking.dessertTotal || 0;
  const finalTotal = reservationDeposit + dessertTotal;

  return (
    <div className="booking-page animate-fade-in">
      <div className="booking-container checkout-container-wide">
        <div className="booking-header">
          <h2>Payment & Confirmation</h2>
          <div className="step-indicator">
            <span className="active">1. Details</span>
            <span className="line"></span>
            <span className="active">2. Add-ons</span>
            <span className="line"></span>
            <span className="active">3. Payment</span>
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-summary-col">
            <h3>Order Summary</h3>
            <div className="summary-card">
              <div className="summary-item">
                <span>Name</span>
                <strong>{booking.name}</strong>
              </div>
              <div className="summary-item">
                <span>Phone</span>
                <strong>{booking.phone}</strong>
              </div>
              <div className="summary-item">
                <span>Date & Time</span>
                <strong>{booking.date} {booking.time}</strong>
              </div>
              <div className="summary-item">
                <span>Guests</span>
                <strong>{booking.pax}</strong>
              </div>
              {booking.selectedDishDetails && booking.selectedDishDetails.length > 0 ? (
                <div className="summary-item" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.4rem' }}>Pre-ordered Dishes:</span>
                  {booking.selectedDishDetails.map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.95rem', paddingLeft: '0.5rem', margin: '0.15rem 0' }}>
                      <span>• {d.name}</span>
                      <strong>RM {d.price.toFixed(2)}</strong>
                    </div>
                  ))}
                  {booking.sideDish && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-light)', paddingLeft: '0.5rem', marginTop: '0.25rem' }}>
                      Includes side: <strong>{booking.sideDish}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div className="summary-item">
                  <span>Pre-order</span>
                  <strong>{booking.preselectDish || 'None'}</strong>
                </div>
              )}
              <div className="summary-item">
                <span>Table</span>
                <strong>{booking.tableNumber || 'Not selected'}</strong>
              </div>
              
              {booking.addonDesserts && booking.addonDesserts.length > 0 && (
                <>
                  <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
                  <div style={{ marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-color)' }}>Dessert Add-ons:</div>
                  {booking.addonDesserts.map(d => (
                    <div key={d.id} className="summary-item" style={{ paddingLeft: '1rem', fontSize: '0.9rem' }}>
                      <span>{d.name}</span>
                      <strong>RM {d.price.toFixed(2)}</strong>
                    </div>
                  ))}
                </>
              )}

              <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
              <div className="summary-item">
                <span>Reservation Deposit</span>
                <strong>RM {reservationDeposit.toFixed(2)}</strong>
              </div>
              {dessertTotal > 0 && (
                <div className="summary-item">
                  <span>Dessert Total</span>
                  <strong>RM {dessertTotal.toFixed(2)}</strong>
                </div>
              )}
              {booking.dishTotal > 0 && (
                <div className="summary-item">
                  <span>Pre-ordered Dishes</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>(Pay at Restaurant)</span>
                  <strong>RM {booking.dishTotal.toFixed(2)}</strong>
                </div>
              )}
              <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)', borderStyle: 'dashed' }} />
              <div className="summary-item total-row" style={{ marginTop: '0.5rem' }}>
                <span>Total Paid Now</span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--primary-color)' }}>RM {finalTotal.toFixed(2)}</strong>
              </div>
              <div className="summary-item total-row" style={{ marginTop: '0.25rem', paddingTop: '0.25rem', borderTop: '1px solid var(--border-color)' }}>
                <span>Total Order Value</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--accent-dark)' }}>RM {(finalTotal + (booking.dishTotal || 0)).toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="checkout-payment-col">
            <h3>Payment Method</h3>
            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <div className="payment-methods">
                <label className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ display: 'none' }} />
                  <span className="pm-icon">💳</span> Credit / Debit Card
                </label>
                <label className={`payment-method-card ${paymentMethod === 'fpx' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="fpx" checked={paymentMethod === 'fpx'} onChange={() => setPaymentMethod('fpx')} style={{ display: 'none' }} />
                  <span className="pm-icon">🏦</span> Online Banking (FPX)
                </label>
                <label className={`payment-method-card ${paymentMethod === 'ewallet' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="ewallet" checked={paymentMethod === 'ewallet'} onChange={() => setPaymentMethod('ewallet')} style={{ display: 'none' }} />
                  <span className="pm-icon">📱</span> E-Wallet
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-details-form animate-fade-in">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required />
                  </div>
                  <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" maxLength="5" required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>CVV</label>
                      <input type="password" placeholder="123" maxLength="3" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" placeholder="John Doe" required />
                  </div>
                </div>
              )}

              {paymentMethod === 'fpx' && (
                <div className="fpx-details-form animate-fade-in">
                  <div className="form-group">
                    <label>Select Bank</label>
                    <select required className="payment-select">
                      <option value="">Choose your bank...</option>
                      <option value="maybank">Maybank2U</option>
                      <option value="cimb">CIMB Clicks</option>
                      <option value="rhb">RHB Now</option>
                      <option value="public">Public Bank</option>
                    </select>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'ewallet' && (
                <div className="ewallet-details-form animate-fade-in">
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>You will be redirected to your e-wallet app to complete the payment.</p>
                  <div className="form-group">
                    <label>Select E-Wallet</label>
                    <select required className="payment-select">
                      <option value="">Choose E-Wallet...</option>
                      <option value="tng">Touch 'n Go eWallet</option>
                      <option value="grab">GrabPay</option>
                      <option value="boost">Boost</option>
                    </select>
                  </div>
                </div>
              )}

              {error && <p className="error-text mt-2">{error}</p>}

              <div className="payment-actions mt-4" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-outline" onClick={() => navigate('/add-on-dessert', { state: { bookingData: booking } })} disabled={isProcessingPayment} style={{ flex: 1 }}>
                  Back
                </button>
                <button type="submit" className="btn-primary" disabled={isProcessingPayment} style={{ flex: 2 }}>
                  {isProcessingPayment ? 'Processing...' : `Pay RM ${finalTotal.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
