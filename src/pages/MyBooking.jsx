import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './MyBooking.css';

const MyBooking = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchError, setSearchError] = useState('');
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [notification, setNotification] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const savedBookingRef = useRef(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const { data } = await supabase.from('menus').select('*');
        if (data) setMenuItems(data);
      } catch (err) {
        console.warn('Failed to load menus in MyBooking:', err);
      }
    };
    loadMenus();
  }, []);

  useEffect(() => {
    let bookingChannel = null;

    const loadBookingFromStorage = () => {
      const savedBooking = localStorage.getItem('activeBooking');
      if (savedBooking) {
        const parsed = JSON.parse(savedBooking);
        setBooking(parsed);
        savedBookingRef.current = parsed;
      }
    };

    const refreshBookingFromServer = async () => {
      const current = savedBookingRef.current;
      if (!current || !current.id) return;
      const recordId = parseInt(current.id.replace(/^RES-/i, ''), 10);
      if (!recordId) return;

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', recordId)
          .single();

        if (error || !data) {
          return;
        }

        const updatedBooking = {
          id: data.id ? `RES-${data.id}` : current.id,
          date: data.booking_date,
          time: data.booking_time,
          pax: data.total_guests ? String(data.total_guests) : '',
          name: data.customer_name,
          phone: data.customer_phone,
          status: data.status || 'Pending',
          preorder: !!data.dish,
          cuisineCategory: current.cuisineCategory || '',
          dish: data.dish || '',
          tableId: data.table_id,
          tableNumber: data.table_number || (data.table_id ? `Table ${data.table_id}` : ''),
          tableCapacity: data.table_capacity || null
        };

        if (current.status !== 'Checked In' && updatedBooking.status === 'Checked In') {
          setNotification('You have successfully checked in. Welcome!');
        }

        if (JSON.stringify(updatedBooking) !== JSON.stringify(current)) {
          setBooking(updatedBooking);
          savedBookingRef.current = updatedBooking;
          localStorage.setItem('activeBooking', JSON.stringify(updatedBooking));
        }
      } catch (err) {
        // ignore polling failures silently
      }
    };

    const setupRealtime = () => {
      const current = savedBookingRef.current;
      if (!current || !current.id) return;
      const recordId = parseInt(current.id.replace(/^RES-/i, ''), 10);
      if (!recordId) return;

      if (bookingChannel) return;
      bookingChannel = supabase
        .channel(`booking-status-${recordId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${recordId}` },
          (payload) => {
            if (!payload?.new) return;
            const updatedBooking = {
              id: payload.new.id ? `RES-${payload.new.id}` : current.id,
              date: payload.new.booking_date,
              time: payload.new.booking_time,
              pax: payload.new.total_guests ? String(payload.new.total_guests) : '',
              name: payload.new.customer_name,
              phone: payload.new.customer_phone,
              status: payload.new.status || 'Pending',
              preorder: !!payload.new.dish,
              cuisineCategory: current.cuisineCategory || '',
              dish: payload.new.dish || '',
              tableId: payload.new.table_id,
              tableNumber: payload.new.table_number || (payload.new.table_id ? `Table ${payload.new.table_id}` : ''),
              tableCapacity: payload.new.table_capacity || null
            };

            if (current.status !== 'Checked In' && updatedBooking.status === 'Checked In') {
              setNotification('You have successfully checked in. Welcome!');
            }

            setBooking(updatedBooking);
            savedBookingRef.current = updatedBooking;
            localStorage.setItem('activeBooking', JSON.stringify(updatedBooking));
          }
        )
        .subscribe();
    };

    loadBookingFromStorage();
    setupRealtime();
    const interval = setInterval(refreshBookingFromServer, 1000);

    return () => {
      clearInterval(interval);
      if (bookingChannel) {
        bookingChannel.unsubscribe();
      }
    };
  }, []);

  const handleSearchBooking = async (e) => {
    e.preventDefault();
    setSearchError('');
    setNotification('');

    const normalizedPhone = searchPhone.trim();
    if (!normalizedPhone) {
      setSearchError('Please enter your phone number to search for the booking.');
      return;
    }

    setLoadingBooking(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_phone', normalizedPhone)
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        setSearchError('No booking found for that phone number.');
        setBooking(null);
        return;
      }

      const record = data[0];
      const cuisineMap = {
        1: 'malay',
        2: 'chinese',
        3: 'japanese',
        4: 'western',
        5: 'indian'
      };
      const foundBooking = {
        id: record.id ? `RES-${record.id}` : null,
        date: record.booking_date,
        time: record.booking_time,
        pax: record.total_guests ? String(record.total_guests) : '',
        name: record.customer_name,
        phone: record.customer_phone,
        status: record.status || 'Pending',
        preorder: !!record.dish,
        cuisineCategory: cuisineMap[record.cuisine_id] || '',
        dish: record.dish || '',
        tableId: record.table_id,
        tableNumber: record.table_number || (record.table_id ? `Table ${record.table_id}` : ''),
        tableCapacity: record.table_capacity || null
      };

      localStorage.setItem('activeBooking', JSON.stringify(foundBooking));
      setBooking(foundBooking);
      savedBookingRef.current = foundBooking;
    } catch (err) {
      setSearchError('Search failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingBooking(false);
    }
  };

  const getParsedOrder = () => {
    if (!booking) return { preorders: [], sideDish: '', desserts: [], preorderTotal: 0, dessertTotal: 0 };

    if (booking.selectedDishDetails && booking.selectedDishDetails.length > 0) {
      const dessertTotal = booking.addonDesserts ? booking.addonDesserts.reduce((sum, d) => sum + d.price, 0) : 0;
      return {
        preorders: booking.selectedDishDetails,
        sideDish: booking.sideDish || '',
        desserts: booking.addonDesserts || [],
        preorderTotal: booking.selectedDishDetails.reduce((sum, d) => sum + d.price, 0),
        dessertTotal: dessertTotal
      };
    }

    const dishStr = booking.dish || '';
    let preordersPart = dishStr;
    let dessertsPart = '';
    let sideDish = '';

    if (dishStr.includes(' | Desserts: ')) {
      const parts = dishStr.split(' | Desserts: ');
      preordersPart = parts[0];
      dessertsPart = parts[1];
    } else if (dishStr.startsWith('Desserts: ')) {
      preordersPart = '';
      dessertsPart = dishStr.replace('Desserts: ', '');
    }

    if (preordersPart.includes(' (Side: ')) {
      const parts = preordersPart.split(' (Side: ');
      preordersPart = parts[0];
      sideDish = parts[1].replace(')', '');
    } else if (preordersPart.startsWith('Side: ')) {
      sideDish = preordersPart.replace('Side: ', '');
      preordersPart = '';
    }

    const preorderNames = preordersPart ? preordersPart.split(', ') : [];
    const preorderItems = preorderNames.map(name => {
      const match = menuItems.find(item => item.name.toLowerCase() === name.toLowerCase());
      return {
        name,
        price: match ? match.price : 0
      };
    });

    const dessertNames = dessertsPart ? dessertsPart.split(', ') : [];
    const dessertItems = dessertNames.map(name => {
      const match = menuItems.find(item => item.name.toLowerCase() === name.toLowerCase());
      const fallbackPrices = {
        'Pandan Gula Melaka Cheesecake': 18.00,
        'Matcha Lava Cake': 22.00,
        'Classic Italian Tiramisu': 24.00
      };
      return {
        name,
        price: match ? match.price : (fallbackPrices[name] || 0)
      };
    });

    const preorderTotal = preorderItems.reduce((sum, item) => sum + item.price, 0);
    const dessertTotal = dessertItems.reduce((sum, item) => sum + item.price, 0);

    return {
      preorders: preorderItems,
      sideDish,
      desserts: dessertItems,
      preorderTotal,
      dessertTotal
    };
  };

  if (!booking) {
    return (
      <div className="my-booking-page animate-fade-in">
        <div className="no-booking">
          <div className="icon">🎫</div>
          <h2>No Active Booking Found</h2>
          <p>Either your booking is not stored locally, or you're using a different device/browser.</p>
          <p>Search by your phone number to load the reservation from the cloud database.</p>

          <form className="booking-search-form" onSubmit={handleSearchBooking}>
            <div className="form-group">
              <label htmlFor="searchPhone">Phone Number</label>
              <input
                id="searchPhone"
                type="text"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="e.g. 0123456789"
              />
            </div>
            <button className="btn-primary mt-2" type="submit" disabled={loadingBooking}>
              {loadingBooking ? 'Searching...' : 'Search Booking'}
            </button>
          </form>

          {searchError && <p className="error-text">{searchError}</p>}

          <Link to="/book" className="btn-outline mt-3">Make a Reservation</Link>
        </div>
      </div>
    );
  }

  const orderDetails = getParsedOrder();

  return (
    <div className="my-booking-page animate-fade-in">
      <div className="booking-header-banner">
        <div className="container">
          <h2>Your Reservation</h2>
          <p>Present this digital ticket upon arrival.</p>
        </div>
      </div>
      
      <div className="container mt-4">
        {(notification || booking.status === 'Checked In') && (
          <div className="booking-notice">
            <strong>{notification || 'You have already checked in. Welcome!'}</strong>
          </div>
        )}

        <div className={`ticket-card ${booking.status === 'Checked In' ? 'is-checked-in' : ''}`}>
          <div className="ticket-header">
            <h3>{booking.id}</h3>
            <span className={`status-badge ${booking.status.toLowerCase().replace(' ', '-')}`}>{booking.status}</span>
          </div>
          
          <div className="ticket-body">
            <div className="qr-placeholder">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(booking.id)}`} alt="QR Code" />
                {booking.status === 'Checked In' && (
                  <div className="checked-in-seal-overlay animate-zoom-in">
                    <div className="seal-inner">
                      <span className="seal-text">VERIFIED</span>
                      <span className="seal-status">CHECKED IN</span>
                      <span className="seal-date">{new Date().toLocaleDateString('en-MY', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
                    </div>
                  </div>
                )}
              </div>
              <small>Show this QR to the admin for check-in</small>
            </div>
            
            <div className="ticket-details">
              <div className="detail-row">
                <span className="label">Date</span>
                <span className="value">{booking.date}</span>
              </div>
              <div className="detail-row">
                <span className="label">Time</span>
                <span className="value">{booking.time}</span>
              </div>
              <div className="detail-row">
                <span className="label">Guests</span>
                <span className="value">{booking.pax} Person(s)</span>
              </div>
              <div className="detail-row">
                <span className="label">Name</span>
                <span className="value">{booking.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Phone</span>
                <span className="value">{booking.phone}</span>
              </div>
              {booking.tableNumber && (
                <div className="detail-row">
                  <span className="label">Table</span>
                  <span className="value">{booking.tableNumber}</span>
                </div>
              )}
              
              {booking.preorder && (
                <div className="detail-row highlight mt-2">
                  <span className="label">Pre-order</span>
                  <span className="value">{booking.dish ? booking.dish.replace('-', ' ') : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Receipt Section */}
          <div className="receipt-section">
            <h4 className="receipt-title">Payment Receipt</h4>
            <div className="receipt-items">
              {/* Pre-ordered Dishes */}
              {orderDetails.preorders && orderDetails.preorders.length > 0 && (
                <>
                  <div className="receipt-label">Pre-ordered Dishes (Pay at Restaurant)</div>
                  {orderDetails.preorders.map((d, idx) => (
                    <div key={idx} className="receipt-row receipt-preorder" style={{ paddingLeft: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      <span>{d.name}</span>
                      <span>RM {d.price > 0 ? d.price.toFixed(2) : '0.00'}</span>
                    </div>
                  ))}
                  {orderDetails.sideDish && (
                    <div className="receipt-row receipt-side-dish" style={{ paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--primary-light)', fontStyle: 'italic' }}>
                      <span>• Complimentary Side: {orderDetails.sideDish}</span>
                      <span>Free</span>
                    </div>
                  )}
                  <div className="receipt-row" style={{ paddingLeft: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>Pre-order Subtotal</span>
                    <span>RM {orderDetails.preorderTotal.toFixed(2)}</span>
                  </div>
                  <div className="receipt-divider"></div>
                </>
              )}

              {/* Paid Now Section */}
              <div className="receipt-label">Reservation & Add-ons (Paid Now)</div>
              <div className="receipt-row">
                <span>Reservation Deposit</span>
                <span>RM 10.00</span>
              </div>

              {orderDetails.desserts && orderDetails.desserts.length > 0 && (
                <>
                  {orderDetails.desserts.map((d, idx) => (
                    <div key={idx} className="receipt-row receipt-dessert" style={{ paddingLeft: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      <span>{d.name}</span>
                      <span>RM {d.price > 0 ? d.price.toFixed(2) : '0.00'}</span>
                    </div>
                  ))}
                </>
              )}

              <div className="receipt-row" style={{ fontWeight: '600', borderTop: '1px dashed var(--border-color)', paddingTop: '0.25rem', marginTop: '0.25rem' }}>
                <span>Total Paid Now</span>
                <span>RM {(10 + orderDetails.dessertTotal).toFixed(2)}</span>
              </div>

              <div className="receipt-divider thick"></div>
              
              {/* Total Order Value */}
              <div className="receipt-row receipt-total">
                <span>Total Order Value</span>
                <span>RM {(10 + orderDetails.dessertTotal + orderDetails.preorderTotal).toFixed(2)}</span>
              </div>
            </div>
            <p className="receipt-note">Pre-ordered dishes and complimentary side dishes will be served and billed at the restaurant.</p>
          </div>
          
          <div className="ticket-footer">
            <p><strong>Note:</strong> Please arrive 10 minutes early. Late arrivals beyond 15 minutes may result in cancellation.</p>
            <button
              className="btn-outline mt-3 full-width"
              onClick={async () => {
                if (!window.confirm('Are you sure you want to cancel this booking?')) return;
                if (!booking || !booking.id) {
                  localStorage.removeItem('activeBooking');
                  navigate('/');
                  return;
                }

                const recordId = parseInt(booking.id.replace(/^RES-/i, ''), 10);
                if (!recordId) {
                  localStorage.removeItem('activeBooking');
                  navigate('/');
                  return;
                }

                try {
                  setIsCancelling(true);
                  const { data, error } = await supabase
                    .from('bookings')
                    .update({ status: 'Cancelled' })
                    .eq('id', recordId)
                    .select();

                  if (error) throw error;

                  // remove local active booking and notify user
                  localStorage.removeItem('activeBooking');
                  setNotification('Booking cancelled. We have notified the restaurant.');
                  // navigate back to home after short delay so realtime update can propagate
                  setTimeout(() => {
                    navigate('/');
                  }, 800);
                } catch (err) {
                  setNotification('Failed to cancel booking: ' + (err.message || err));
                } finally {
                  setIsCancelling(false);
                }
              }}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Reservation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBooking;
