import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './BookingFlow.css';

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

const SelectTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const [selectedTable, setSelectedTable] = useState(
    bookingData?.tableId ? TABLES.find((table) => table.id === bookingData.tableId) : null
  );
  const [bookedTables, setBookedTables] = useState([]);
  const [tableLocks, setTableLocks] = useState([]);
  const [lockToken] = useState(() => {
    const existing = localStorage.getItem('tableLockToken');
    if (existing) return existing;
    const nextToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('tableLockToken', nextToken);
    return nextToken;
  });
  const [lockMessage, setLockMessage] = useState('');
  const [lockCountdown, setLockCountdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!bookingData) return;

    const loadBookedTables = async () => {
      setIsLoading(true);
      const now = new Date().toISOString();

      const [{ data: bookingsData, error: bookingsError }, { data: locksData, error: locksError }] = await Promise.all([
        supabase
          .from('bookings')
          .select('table_id,status')
          .eq('booking_date', bookingData.date)
          .eq('booking_time', bookingData.time)
          .neq('status', 'Cancelled'),
        supabase
          .from('table_locks')
          .select('*')
          .or(`lock_expires_at.is.null,lock_expires_at.gte.${now}`)
      ]);

      if (bookingsError) {
        setErrorMessage('Failed to load tables. Please try again.');
      } else {
        setBookedTables(
          (bookingsData || [])
            .map((record) => record.table_id)
            .filter((id) => id != null)
        );
      }

      if (!locksError) {
        setTableLocks(locksData || []);
      }
      setIsLoading(false);
    };

    loadBookedTables();
  }, [bookingData]);

  useEffect(() => {
    if (!bookingData) {
      const timer = setTimeout(() => navigate('/book'), 1800);
      return () => clearTimeout(timer);
    }
  }, [bookingData, navigate]);

  useEffect(() => {
    if (!bookingData) return;

    const interval = setInterval(async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('table_locks')
        .select('*')
        .or(`lock_expires_at.is.null,lock_expires_at.gte.${now}`);

      if (!error) {
        setTableLocks(data || []);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [bookingData]);

  useEffect(() => {
    if (!selectedTable) {
      setLockCountdown('');
      return;
    }

    const updateCountdown = () => {
      const lock = tableLocks.find((lockRow) => lockRow.table_id === selectedTable.id);
      if (!lock) {
        setLockCountdown('Expired');
        return;
      }
      const expiresAt = new Date(lock.lock_expires_at).getTime();
      const delta = expiresAt - Date.now();
      if (delta <= 0) {
        setLockCountdown('Expired');
        return;
      }
      const minutes = Math.floor(delta / 60000);
      const seconds = Math.floor((delta % 60000) / 1000);
      setLockCountdown(`${minutes}:${seconds.toString().padStart(2, '0')} remaining`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [selectedTable, tableLocks]);

  if (!bookingData) {
    return (
      <div className="booking-page animate-fade-in">
        <div className="booking-container">
          <div className="booking-header">
            <h2>Booking not found</h2>
            <p>No booking found. You will be redirected to the booking page.</p>
          </div>
        </div>
      </div>
    );
  }

  const guests = parseInt(bookingData.pax, 10) || 1;
  const lockDurationMs = 2 * 60 * 1000;

  const getLockForTable = (tableId) => {
    const now = Date.now();
    return tableLocks.find((lock) => {
      if (lock.table_id !== tableId) return false;
      if (!lock.lock_expires_at) return true;
      return new Date(lock.lock_expires_at).getTime() > now;
    });
  };

  const isTableLockedByOther = (table) => {
    const lock = getLockForTable(table.id);
    if (!lock) return false;
    if (!lock.lock_expires_at) return lock.lock_token !== lockToken;
    return new Date(lock.lock_expires_at).getTime() > Date.now() && lock.lock_token !== lockToken;
  };

  const reserveTableLock = async (table) => {
    if (!bookingData) return false;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + lockDurationMs).toISOString();

    try {
      const { data: existingLock, error: existingError } = await supabase
        .from('table_locks')
        .select('*')
        .eq('table_id', table.id)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (
        existingLock &&
        new Date(existingLock.lock_expires_at).getTime() > now.getTime() &&
        existingLock.lock_token !== lockToken
      ) {
        setErrorMessage('This table is currently locked by another customer. Please choose a different table.');
        return false;
      }

      const payload = {
        table_id: table.id,
        locked_by: `${bookingData.name} (${bookingData.phone})`,
        lock_token: lockToken,
        lock_expires_at: expiresAt
      };

      if (existingLock) {
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

      setLockMessage(`Table ${table.name} is locked until ${new Date(expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`);
      return true;
    } catch (err) {
      setErrorMessage('Failed to lock table: ' + (err.message || 'Unknown error'));
      return false;
    }
  };

  const releasePreviousLock = async (tableId) => {
    if (!tableId) return;
    try {
      const { data: existingLock, error: existingError } = await supabase
        .from('table_locks')
        .select('*')
        .eq('table_id', tableId)
        .maybeSingle();

      if (existingError || !existingLock) return;
      if (existingLock.lock_token !== lockToken) return;

      const cooldownUntil = new Date(Date.now() + lockDurationMs).toISOString();
      await supabase
        .from('table_locks')
        .update({ lock_token: null, locked_by: null, lock_expires_at: cooldownUntil })
        .eq('table_id', tableId);
    } catch (err) {
      console.warn('Failed to release previous table lock:', err.message);
    }
  };

  const handleTableSelect = async (table) => {
    if (isProcessing) return;
    if (selectedTable?.id === table.id && getLockForTable(table.id)?.lock_token === lockToken) return;
    if (table.seats < guests || bookedTables.includes(table.id)) return;
    if (isTableLockedByOther(table)) {
      setErrorMessage('This table is currently locked. Please choose another table.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);
    try {
      if (selectedTable && selectedTable.id !== table.id) {
        await releasePreviousLock(selectedTable.id);
      }

      const locked = await reserveTableLock(table);
      if (locked) {
        setSelectedTable(table);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = async () => {
    if (isProcessing) return;
    if (!selectedTable) {
      setErrorMessage('Please select a table first.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);
    try {
      const lock = getLockForTable(selectedTable.id);
      if (!lock || lock.lock_token !== lockToken || new Date(lock.lock_expires_at).getTime() <= Date.now()) {
        setErrorMessage('Table lock has expired. Please re-select a table.');
        return;
      }

      const refreshExpiry = new Date(Date.now() + lockDurationMs).toISOString();
      await supabase
        .from('table_locks')
        .update({ lock_expires_at: refreshExpiry })
        .eq('table_id', selectedTable.id)
        .eq('lock_token', lockToken);

      const nextBooking = {
        ...bookingData,
        tableId: selectedTable.id,
        tableNumber: selectedTable.name,
        tableCapacity: selectedTable.seats
      };

      navigate('/checkout', { state: { bookingData: nextBooking } });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="booking-page animate-fade-in">
      <div className="booking-container">
        <div className="booking-header">
          <h2>Choose Your Table</h2>
          <p>Select the best seating for your group before proceeding to payment.</p>
        </div>

        <div className="booking-form-wrapper">
          <div className="floor-plan">
            <div className="selected-table-banner">
              {selectedTable ? (
                <>
                  Selected: <strong>{selectedTable.name}</strong> for {selectedTable.seats} seats.
                </>
              ) : (
                <>Choose a table for {guests} person(s).</>
              )}
            </div>

            {lockMessage && (
              <div className="table-lock-message">
                <strong>{lockMessage}</strong>
                {lockCountdown && selectedTable && <div>{lockCountdown}</div>}
              </div>
            )}

            <div className="floor-legend">
              <span><span className="legend-dot available" /> Available</span>
              <span><span className="legend-dot other-capacity" /> Not suitable</span>
              <span><span className="legend-dot booked" /> Booked</span>
            </div>

            <div className="table-zone">
              <div className="zone-label">Dining Area</div>
              <div className="table-grid">
                {TABLES.map((table) => {
                  const isBooked = bookedTables.includes(table.id);
                  const tooSmall = table.seats < guests;
                  const lock = getLockForTable(table.id);
                  const isLocked = !!lock;
                  const isSelected = selectedTable?.id === table.id;
                  const isLockedByOther = isLocked && lock.lock_token !== lockToken;
                  const cardClasses = [
                    'table-card',
                    isSelected && 'table-selected',
                    isBooked ? 'table-booked' : isLockedByOther ? 'table-booked' : tooSmall ? 'table-other-cap' : 'table-available'
                  ]
                    .filter(Boolean)
                    .join(' ');

                  const lockLabel = lock?.lock_expires_at
                    ? new Date(lock.lock_expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'until released';

                  const statusLabel = isBooked
                    ? 'Booked'
                    : isLockedByOther
                    ? `Locked (${lockLabel})`
                    : tooSmall
                    ? 'Too small'
                    : isSelected
                    ? 'Selected'
                    : 'Available';

                  return (
                    <button
                      key={table.id}
                      type="button"
                      className={cardClasses}
                      onClick={() => handleTableSelect(table)}
                      disabled={isBooked || tooSmall || isLockedByOther || isProcessing}
                    >
                      <div className="table-icon">🪑</div>
                      <div className="table-name">{table.name}</div>
                      <div className="table-seats">{table.seats} seats</div>
                      <div className="table-status-badge">
                        {statusLabel}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {isLoading && <div className="table-loading"><div className="loading-spinner" /></div>}
            {errorMessage && <div className="error-text">{errorMessage}</div>}

            <div className="table-footer">
              <button type="button" className="btn-primary full-width" onClick={handleContinue} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTable;
