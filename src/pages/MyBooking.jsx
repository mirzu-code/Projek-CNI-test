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
  const savedBookingRef = useRef(null);

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
          setNotification('Anda telah melakukan daftar masuk. Selamat datang!');
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
              setNotification('Anda telah melakukan daftar masuk. Selamat datang!');
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

  if (!booking) {
    return (
      <div className="my-booking-page animate-fade-in">
        <div className="no-booking">
          <div className="icon">📭</div>
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
          {booking.status === 'Checked In' && (
            <div className="checked-in-seal-overlay animate-zoom-in">
              <div className="seal-inner">
                <span className="seal-text">VERIFIED</span>
                <span className="seal-status">CHECKED IN</span>
                <span className="seal-date">{new Date().toLocaleDateString('en-MY', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
              </div>
            </div>
          )}
          
          <div className="ticket-header">
            <h3>{booking.id}</h3>
            <span className={`status-badge ${booking.status.toLowerCase().replace(' ', '-')}`}>{booking.status}</span>
          </div>
          
          <div className="ticket-body">
            <div className="qr-placeholder">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.id}`} alt="QR Code" />
              <small>Scan at Entrance</small>
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
              
              {booking.preorder && (
                <div className="detail-row highlight mt-2">
                  <span className="label">SDG 9 Pre-order</span>
                  <span className="value">{booking.dish.replace('-', ' ')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="ticket-footer">
            <p><strong>Note:</strong> Please arrive 10 minutes early. Late arrivals beyond 15 minutes may result in cancellation.</p>
            <button 
              className="btn-outline mt-3 full-width" 
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this booking?')) {
                  localStorage.removeItem('activeBooking');
                  navigate('/');
                  window.location.reload();
                }
              }}
            >
              Cancel Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBooking;
