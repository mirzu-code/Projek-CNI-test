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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!bookingData) return;

    const loadBookedTables = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('table_id,status')
        .eq('booking_date', bookingData.date)
        .eq('booking_time', bookingData.time)
        .neq('status', 'Cancelled');

      if (error) {
        setErrorMessage('Gagal memuatkan meja. Sila cuba lagi.');
      } else {
        setBookedTables(
          (data || [])
            .map((record) => record.table_id)
            .filter((id) => id != null)
        );
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

  if (!bookingData) {
    return (
      <div className="booking-page animate-fade-in">
        <div className="booking-container">
          <div className="booking-header">
            <h2>Booking not found</h2>
            <p>Tiada tempahan ditemui. Anda akan dialihkan ke halaman tempahan.</p>
          </div>
        </div>
      </div>
    );
  }

  const guests = parseInt(bookingData.pax, 10) || 1;

  const handleTableSelect = (table) => {
    if (table.seats < guests || bookedTables.includes(table.id)) return;
    setSelectedTable(table);
    setErrorMessage('');
  };

  const handleContinue = () => {
    if (!selectedTable) {
      setErrorMessage('Sila pilih meja terlebih dahulu.');
      return;
    }

    const nextBooking = {
      ...bookingData,
      tableId: selectedTable.id,
      tableNumber: selectedTable.name,
      tableCapacity: selectedTable.seats
    };

    navigate('/checkout', { state: { bookingData: nextBooking } });
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
                  const isSelected = selectedTable?.id === table.id;
                  const cardClasses = [
                    'table-card',
                    isSelected && 'table-selected',
                    isBooked ? 'table-booked' : tooSmall ? 'table-other-cap' : 'table-available'
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      key={table.id}
                      type="button"
                      className={cardClasses}
                      onClick={() => handleTableSelect(table)}
                      disabled={isBooked || tooSmall}
                    >
                      <div className="table-icon">🍽</div>
                      <div className="table-name">{table.name}</div>
                      <div className="table-seats">{table.seats} seats</div>
                      <div className="table-status-badge">
                        {isBooked ? 'Booked' : tooSmall ? 'Too small' : isSelected ? 'Selected' : 'Available'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {isLoading && <div className="table-loading"><div className="loading-spinner" /></div>}
            {errorMessage && <div className="error-text">{errorMessage}</div>}

            <div className="table-footer">
              <button type="button" className="btn-primary full-width" onClick={handleContinue}>
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTable;
