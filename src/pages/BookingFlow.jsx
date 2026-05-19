import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './BookingFlow.css';

export const cuisineDishes = {
  malay: [
    { value: 'masak-lemak', label: 'Daging Salai Masak Lemak Cili Api (RM 45)' },
    { value: 'ayam-rendang', label: 'Ayam Rendang Rembayung (RM 38)' },
    { value: 'ikan-bakar', label: 'Ikan Bakar Petai (RM 55)' },
    { value: 'nasi-lemak', label: 'Nasi Lemak Pandan Heritage (RM 32)' }
  ],
  chinese: [
    { value: 'steamed-fish', label: 'Ginger Onion Steamed Sea Bass (RM 65)' },
    { value: 'szechuan-tofu', label: 'Szechuan Chili Maple Tofu (RM 28)' },
    { value: 'chicken-rice', label: 'Hainanese Chicken Rice Platter (RM 35)' },
    { value: 'cantonese-noodles', label: 'Cantonese Egg Gravy Noodles (RM 30)' }
  ],
  japanese: [
    { value: 'wagyu-ramen', label: 'Wagyu Beef Black Garlic Ramen (RM 75)' },
    { value: 'salmon-don', label: 'Truffle Salmon Sashimi Don (RM 58)' },
    { value: 'premium-sushi', label: "Chef Choice Premium Sushi Platter (RM 85)" },
    { value: 'tempura-moriawase', label: 'Crispy Seafood & Veg Tempura (RM 48)' }
  ],
  western: [
    { value: 'angus-steak', label: 'Black Angus Ribeye Steak (RM 120)' },
    { value: 'seared-salmon', label: 'Pan-Seared Citrus Salmon (RM 68)' },
    { value: 'truffle-pasta', label: 'Truffle Wild Mushroom Fettuccine (RM 45)' },
    { value: 'rembayung-burger', label: 'Signature Double Wagyu Burger (RM 55)' }
  ],
  indian: [
    { value: 'lamb-biryani', label: 'Aromatic Lamb Shank Biryani (RM 78)' },
    { value: 'butter-chicken', label: 'Tandoori Butter Chicken Masala (RM 42)' },
    { value: 'paneer-tikka', label: 'Paneer Tikka Butter Masala (RM 38)' },
    { value: 'naan-platter', label: 'Garlic Cheese Naan Platter (RM 25)' }
  ]
};

// Auto-assign required table capacity based on number of guests
const getRequiredCapacity = (pax) => {
  const p = parseInt(pax, 10);
  if (p <= 2) return 2;
  if (p <= 4) return 4;
  if (p <= 6) return 6;
  return 8;
};

// Table icon based on capacity
const tableIcon = (cap) => {
  if (cap === 2) return '🪑🪑';
  if (cap === 4) return '🪑🪑🪑🪑';
  if (cap === 6) return '👥 6 Seats';
  return '👥 8 Seats';
};

const BookingFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Steps: 1=DateTime, 2=TablePick, 3=Details, 4=Review
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    pax: '2',
    name: '',
    phone: '',
    preorder: false,
    cuisineCategory: '',
    dish: '',
    paymentMethod: 'fpx',
    preferredCuisine: '',
    tableId: null,
    tableNumber: '',
    tableCapacity: null
  });

  // Table availability state
  const [allTables, setAllTables] = useState([]);
  const [bookedTableIds, setBookedTableIds] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [tableError, setTableError] = useState('');

  useEffect(() => {
    if (location.state?.preselectCuisine && location.state?.preselectDish) {
      setFormData(prev => ({
        ...prev,
        preorder: true,
        cuisineCategory: location.state.preselectCuisine,
        dish: location.state.preselectDish,
        preferredCuisine: location.state.preselectCuisine
      }));
    }
  }, [location.state]);

  // Fetch tables from Supabase whenever we land on step 2
  useEffect(() => {
    if (step === 2) {
      fetchTableAvailability();
    }
  }, [step]);

  const fetchTableAvailability = async () => {
    setLoadingTables(true);
    setTableError('');
    try {
      // 1. Get all tables
      const { data: tables, error: tErr } = await supabase
        .from('Tables')
        .select('*')
        .order('capacity', { ascending: true });

      if (tErr) throw tErr;
      setAllTables(tables || []);

      // 2. Get bookings for the selected date + time to see which tables are taken
      const { data: bookings, error: bErr } = await supabase
        .from('bookings')
        .select('table_id')
        .eq('booking_date', formData.date)
        .eq('booking_time', formData.time)
        .neq('status', 'Cancelled');

      if (bErr) throw bErr;
      const takenIds = (bookings || []).map(b => b.table_id).filter(Boolean);
      setBookedTableIds(takenIds);
    } catch (err) {
      setTableError('Gagal memuatkan maklumat meja: ' + err.message);
    } finally {
      setLoadingTables(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (e.target.name === 'cuisineCategory') {
      setFormData({ ...formData, cuisineCategory: value, preferredCuisine: value, dish: '' });
    } else if (e.target.name === 'preorder' && !value) {
      setFormData({ ...formData, preorder: value, cuisineCategory: '', preferredCuisine: '', dish: '' });
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSelectTable = (table) => {
    setFormData(prev => ({
      ...prev,
      tableId: table.id,
      tableNumber: table.table_number,
      tableCapacity: table.capacity
    }));
  };

  const handleProceedToPayment = () => {
    navigate('/checkout', { state: { bookingData: formData } });
  };

  const requiredCapacity = getRequiredCapacity(formData.pax);

  // Split tables into zones for visual layout
  const tablesByCapacity = {
    2: allTables.filter(t => t.capacity === 2),
    4: allTables.filter(t => t.capacity === 4),
    6: allTables.filter(t => t.capacity === 6),
    8: allTables.filter(t => t.capacity === 8),
  };

  return (
    <div className="booking-page animate-fade-in">
      <div className="booking-container">
        <div className="booking-header">
          <h2>Reserve Your Table</h2>
          <div className="step-indicator">
            <span className={step >= 1 ? 'active' : ''}>1. Time</span>
            <div className="line"></div>
            <span className={step >= 2 ? 'active' : ''}>2. Table</span>
            <div className="line"></div>
            <span className={step >= 3 ? 'active' : ''}>3. Details</span>
            <div className="line"></div>
            <span className={step >= 4 ? 'active' : ''}>4. Review</span>
          </div>
        </div>

        <div className="booking-form-wrapper">

          {/* ──────────── STEP 1: Date / Time / Pax / Cuisine ──────────── */}
          {step === 1 && (
            <div className="form-step">
              <h3>Select Date, Time &amp; Guests</h3>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="form-group">
                <label>Time</label>
                <select name="time" value={formData.time} onChange={handleChange} required>
                  <option value="">Select Time Slot</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
                <small className="help-text">Slots are strictly managed to avoid overcrowding (SDG 9).</small>
              </div>
              <div className="form-group">
                <label>Number of Guests (Pax)</label>
                <select name="pax" value={formData.pax} onChange={handleChange}>
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} Person(s)</option>
                  ))}
                </select>
                <small className="help-text">
                  Table for {requiredCapacity} will be assigned&nbsp;
                  {parseInt(formData.pax) <= 2 ? '(2-seat table)' :
                   parseInt(formData.pax) <= 4 ? '(4-seat table)' :
                   parseInt(formData.pax) <= 6 ? '(6-seat table)' : '(8-seat table)'}
                </small>
              </div>

              <div className="form-group mt-3">
                <label>Choose Cuisine Theme (Preferred)</label>
                <div className="cuisine-select-grid">
                  {[
                    { id: 'malay', name: 'Malay Cuisine', flag: '🇲🇾', color: '#1a472a', desc: 'Turmeric, Pandan, & Grill' },
                    { id: 'chinese', name: 'Chinese Cuisine', flag: '🇨🇳', color: '#8b0000', desc: 'Wok Hei & Steamed Delights' },
                    { id: 'japanese', name: 'Japanese Cuisine', flag: '🇯🇵', color: '#111111', desc: 'Sashimi & Artisan Broths' },
                    { id: 'western', name: 'Western Cuisine', flag: '🥩', color: '#2c3e50', desc: 'Bistro Grill & Dry-Aged Steak' },
                    { id: 'indian', name: 'Indian Cuisine', flag: '🍛', color: '#e67e22', desc: 'Claypot Dum & Tandoor Oven' }
                  ].map(c => (
                    <div
                      key={c.id}
                      className={`cuisine-select-card ${formData.preferredCuisine === c.id ? 'selected' : ''}`}
                      style={{ '--cuisine-theme-color': c.color }}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          preferredCuisine: c.id,
                          cuisineCategory: c.id,
                          dish: prev.cuisineCategory === c.id ? prev.dish : ''
                        }));
                      }}
                    >
                      <div className="cuisine-flag">{c.flag}</div>
                      <div className="cuisine-info">
                        <strong>{c.name}</strong>
                        <span>{c.desc}</span>
                      </div>
                      <div className="select-check">✓</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn-primary full-width mt-3"
                onClick={nextStep}
                disabled={!formData.date || !formData.time || !formData.preferredCuisine}
              >
                Continue — Pick Your Table
              </button>
            </div>
          )}

          {/* ──────────── STEP 2: Visual Table Selection ──────────── */}
          {step === 2 && (
            <div className="form-step">
              <h3>Choose Your Table</h3>
              <p className="step-subtitle">
                For <strong>{formData.pax} guest(s)</strong> we've highlighted tables for <strong>{requiredCapacity} seats</strong>.
                Tables in grey are already booked for this slot.
              </p>

              {loadingTables && (
                <div className="table-loading">
                  <div className="loading-spinner"></div>
                  <span>Checking table availability...</span>
                </div>
              )}

              {tableError && (
                <div className="table-error-msg">⚠️ {tableError}</div>
              )}

              {!loadingTables && !tableError && (
                <div className="floor-plan">
                  {/* Legend */}
                  <div className="floor-legend">
                    <span className="legend-dot available"></span><span>Available for you</span>
                    <span className="legend-dot other-capacity"></span><span>Wrong capacity</span>
                    <span className="legend-dot booked"></span><span>Booked</span>
                  </div>

                  {/* Zones */}
                  {[2, 4, 6, 8].map(cap => (
                    tablesByCapacity[cap].length > 0 && (
                      <div key={cap} className="table-zone">
                        <div className="zone-label">
                          {cap === 2 ? '🪑 Couple Tables (2 Seats)' :
                           cap === 4 ? '🍽️ Small Group Tables (4 Seats)' :
                           cap === 6 ? '👥 Medium Group Tables (6 Seats)' :
                           '🎉 Large Group Tables (8 Seats)'}
                        </div>
                        <div className="table-grid">
                          {tablesByCapacity[cap].map(table => {
                            const isBooked = bookedTableIds.includes(table.id);
                            const isRightCapacity = cap === requiredCapacity;
                            const isSelected = formData.tableId === table.id;

                            return (
                              <button
                                key={table.id}
                                className={`table-card
                                  ${isBooked ? 'table-booked' : ''}
                                  ${!isBooked && isRightCapacity ? 'table-available' : ''}
                                  ${!isBooked && !isRightCapacity ? 'table-other-cap' : ''}
                                  ${isSelected ? 'table-selected' : ''}
                                `}
                                onClick={() => !isBooked && isRightCapacity && handleSelectTable(table)}
                                disabled={isBooked || !isRightCapacity}
                                title={
                                  isBooked ? 'Table already booked for this slot' :
                                  !isRightCapacity ? `This table seats ${cap} — for ${formData.pax} guest(s) you need a ${requiredCapacity}-seat table` :
                                  `Select ${table.table_number}`
                                }
                              >
                                <div className="table-icon">
                                  {cap === 2 ? '⬜' : cap === 4 ? '⬛' : cap === 6 ? '🟦' : '🟪'}
                                </div>
                                <div className="table-name">{table.table_number}</div>
                                <div className="table-seats">{cap} seats</div>
                                <div className="table-status-badge">
                                  {isBooked ? '🔴 Booked' : isSelected ? '✅ Selected' : isRightCapacity ? '🟢 Available' : '⚫ N/A'}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )
                  ))}

                  {formData.tableId && (
                    <div className="selected-table-banner animate-fade-in">
                      ✅ You selected <strong>{formData.tableNumber}</strong> &nbsp;({formData.tableCapacity} seats)
                    </div>
                  )}
                </div>
              )}

              <div className="button-group mt-3">
                <button className="btn-outline" onClick={prevStep}>Back</button>
                <button
                  className="btn-primary"
                  onClick={nextStep}
                  disabled={!formData.tableId}
                >
                  Continue — Guest Details
                </button>
              </div>
            </div>
          )}

          {/* ──────────── STEP 3: Guest Details ──────────── */}
          {step === 3 && (
            <div className="form-step">
              <h3>Guest Details &amp; SDG Pre-order</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+60123456789" required />
              </div>

              <div className="sdg-highlight">
                <h4>Support SDG 9: Reduce Food Waste</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.8rem' }}>
                  Pre-ordering your main dish helps our kitchen procure ingredients with 100% precision, preventing culinary scrap and conserving resources.
                </p>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input type="checkbox" name="preorder" checked={formData.preorder} onChange={handleChange} />
                  I want to pre-order my main dish
                </label>

                {formData.preorder && (
                  <div className="preorder-selections animate-fade-in" style={{ marginTop: '1rem', borderLeft: '3px solid var(--accent-color)', paddingLeft: '1rem' }}>
                    <div className="form-group">
                      <label>Cuisine Category</label>
                      <select name="cuisineCategory" value={formData.cuisineCategory} onChange={handleChange} required>
                        <option value="">Select a cuisine...</option>
                        <option value="malay">🇲🇾 Malay Cuisine</option>
                        <option value="chinese">🇨🇳 Chinese Cuisine</option>
                        <option value="japanese">🇯🇵 Japanese Cuisine</option>
                        <option value="western">🥩 Western Cuisine</option>
                        <option value="indian">🍛 Indian Cuisine</option>
                      </select>
                    </div>

                    {formData.cuisineCategory && (
                      <div className="form-group mt-2">
                        <label>Select Main Dish</label>
                        <select name="dish" value={formData.dish} onChange={handleChange} required>
                          <option value="">Select a dish...</option>
                          {cuisineDishes[formData.cuisineCategory]?.map(dish => (
                            <option key={dish.value} value={dish.value}>{dish.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="button-group">
                <button className="btn-outline" onClick={prevStep}>Back</button>
                <button
                  className="btn-primary"
                  onClick={nextStep}
                  disabled={!formData.name || !formData.phone || (formData.preorder && (!formData.cuisineCategory || !formData.dish))}
                >
                  Review
                </button>
              </div>
            </div>
          )}

          {/* ──────────── STEP 4: Review ──────────── */}
          {step === 4 && (
            <div className="form-step">
              <h3>Review Your Booking</h3>
              <div className="summary-card">
                <div className="summary-item">
                  <span>Date &amp; Time:</span>
                  <strong>{formData.date} at {formData.time === '18:00' ? '6:00 PM' : formData.time === '19:30' ? '7:30 PM' : '9:00 PM'}</strong>
                </div>
                <div className="summary-item">
                  <span>Guests:</span>
                  <strong>{formData.pax} Person(s)</strong>
                </div>
                <div className="summary-item">
                  <span>Assigned Table:</span>
                  <strong style={{ color: 'var(--accent-color)' }}>
                    {formData.tableNumber} ({formData.tableCapacity} seats)
                  </strong>
                </div>
                <div className="summary-item">
                  <span>Guest Name:</span>
                  <strong>{formData.name}</strong>
                </div>
                <div className="summary-item">
                  <span>Contact:</span>
                  <strong>{formData.phone}</strong>
                </div>
                {formData.preorder && (
                  <div className="summary-item highlight">
                    <span>Pre-order (SDG 9):</span>
                    <strong style={{ color: 'var(--accent-color)' }}>
                      {formData.cuisineCategory.charAt(0).toUpperCase() + formData.cuisineCategory.slice(1)} -{' '}
                      {cuisineDishes[formData.cuisineCategory]?.find(d => d.value === formData.dish)?.label.split(' (')[0] || formData.dish}
                    </strong>
                  </div>
                )}
                <div className="summary-item total-fee">
                  <span>Booking Deposit:</span>
                  <strong>RM 50.00</strong>
                </div>
              </div>
              <div className="button-group">
                <button className="btn-outline" onClick={prevStep}>Back</button>
                <button className="btn-primary animate-pulse" onClick={handleProceedToPayment}>
                  Proceed to Secure Payment
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
