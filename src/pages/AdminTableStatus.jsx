import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Admin.css';

const TABLES = [
  { id: 1, name: 'Table 1', seats: 2 },
  { id: 2, name: 'Table 2', seats: 2 },
  { id: 3, name: 'Table 3', seats: 4 },
  { id: 4, name: 'Table 4', seats: 4 },
  { id: 5, name: 'Table 5', seats: 4 },
  { id: 6, name: 'Table 6', seats: 6 },
  { id: 7, name: 'Table 7', seats: 6 },
  { id: 8, name: 'Table 8', seats: 8 },
  { id: 9, name: 'Table 9', seats: 8 }
];

const AdminTableStatus = () => {
  const [bookings, setBookings] = useState([]);
  const [tableLocks, setTableLocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const now = new Date().toISOString();
      const [{ data: bookingsData, error: bookingsError }, { data: locksData, error: locksError }] = await Promise.all([
        supabase
          .from('bookings')
          .select('*')
          .neq('status', 'Cancelled')
          .order('id', { ascending: false }),
        supabase
          .from('table_locks')
          .select('*')
          .or(`lock_expires_at.is.null,lock_expires_at.gte.${now}`)
      ]);

      if (bookingsError) throw bookingsError;
      if (locksError) throw locksError;

      setBookings(bookingsData || []);
      setTableLocks(locksData || []);
    } catch (err) {
      setError(err.message || 'Failed to load table status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getBookingForTable = (tableId) => {
    return bookings.find((booking) => booking.table_id === tableId && booking.status !== 'Cancelled');
  };

  const getLockForTable = (tableId) => {
    const now = Date.now();
    return tableLocks.find((lock) => {
      if (lock.table_id !== tableId) return false;
      if (!lock.lock_expires_at) return true;
      return new Date(lock.lock_expires_at).getTime() > now;
    });
  };

  const holdTable = async (table) => {
    const reason = window.prompt('Enter a note for this hold (e.g. walk-in / WhatsApp order):', 'Admin hold');
    if (reason === null) return;

    try {
      const { data: existing, error: existingError } = await supabase
        .from('table_locks')
        .select('*')
        .eq('table_id', table.id)
        .maybeSingle();

      if (existingError) throw existingError;

      const payload = {
        table_id: table.id,
        locked_by: reason || 'Admin hold',
        lock_token: 'admin',
        lock_expires_at: null
      };

      if (existing) {
        const { error } = await supabase
          .from('table_locks')
          .update(payload)
          .eq('table_id', table.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('table_locks')
          .insert([payload]);
        if (error) throw error;
      }

      await loadData();
    } catch (err) {
      window.alert('Failed to hold table: ' + (err.message || err));
    }
  };

  const releaseTable = async (table) => {
    if (!window.confirm(`Release hold for ${table.name}?`)) return;
    try {
      const { error } = await supabase
        .from('table_locks')
        .delete()
        .eq('table_id', table.id);
      if (error) throw error;
      await loadData();
    } catch (err) {
      window.alert('Failed to release table: ' + (err.message || err));
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-header">
        <div className="admin-container">
          <h2>Admin Table Status</h2>
          <p>Live table availability and active holds for walk-in / phone / WhatsApp bookings.</p>
          <Link to="/admin-dashboard" className="btn-outline btn-logout">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="admin-container mt-4">
        {error && <div className="error-message">{error}</div>}

        <div className="table-availability-panel">
          <h3>Table Status</h3>
          <div className="table-availability-grid">
            {TABLES.map((table) => {
              const booking = getBookingForTable(table.id);
              const lock = getLockForTable(table.id);
              const booked = !!booking;
              const locked = !!lock;
              const status = booked
                ? `Booked by ${booking.customer_name}`
                : locked
                ? lock.locked_by || 'Held by admin'
                : 'Available';
              const statusClass = booked ? 'booked' : locked ? 'locked' : 'available';
              const expiryLabel = lock?.lock_expires_at
                ? new Date(lock.lock_expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'until released';

              return (
                <div key={table.id} className={`table-availability-card ${statusClass}`}>
                  <div className="table-availability-name">{table.name}</div>
                  <div className="table-availability-seats">{table.seats} seats</div>
                  <div className="table-availability-status">{status}</div>
                  {booked && (
                    <div className="table-availability-booking">
                      {booking.id ? `Booking ${booking.id}` : 'Booked'} • {booking.booking_date} {booking.booking_time}
                    </div>
                  )}
                  {locked && (
                    <div className="table-availability-expiry">
                      Hold until {expiryLabel}
                    </div>
                  )}
                  <div className="table-availability-actions">
                    {!booked && !locked && (
                      <button className="btn-sm btn-outline" type="button" onClick={() => holdTable(table)}>
                        Hold Table
                      </button>
                    )}
                    {locked && !booked && (
                      <button className="btn-sm btn-danger" type="button" onClick={() => releaseTable(table)}>
                        Release Hold
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {loading && <p>Loading table status...</p>}
      </div>
    </div>
  );
};

export default AdminTableStatus;
