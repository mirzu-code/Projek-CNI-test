import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../supabaseClient';
import './Admin.css';

const ORDER_STATUS_OPTIONS = ['Pending', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled'];
const WHATSAPP_LOCK_DURATION_MINUTES = 90;

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState([]);
  const [selectedRes, setSelectedRes] = useState(null);
  const [newBookingAlert, setNewBookingAlert] = useState(null);
  const [tableLocks, setTableLocks] = useState([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [menus, setMenus] = useState([]);
  const [selectedCuisineId, setSelectedCuisineId] = useState('1');
  const [menuForm, setMenuForm] = useState({ id: '', name: '', price: '', cuisine_id: '1', description: '', image: '', is_active: true });
  const [menuError, setMenuError] = useState('');
  const [menuMode, setMenuMode] = useState('add');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const imageFileInputRef = useRef(null);
  const [manualScanId, setManualScanId] = useState('');
  const [scannerMessage, setScannerMessage] = useState('SCANNER ACTIVE - PRESENT CUSTOMER TICKET QR');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerSuccessRes, setScannerSuccessRes] = useState(null);
  const [scannerError, setScannerError] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedQrBooking, setSelectedQrBooking] = useState(null);
  const [lockActionMessage, setLockActionMessage] = useState('');
  const scannerRef = useRef(null);
  const reservationsRef = useRef(reservations);

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

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1025) {
        setIsSidePanelOpen(true);
      }
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isPortraitMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 980px) and (orientation: portrait)').matches;

  const handleNavClick = (section) => {
    setActiveSection(section);
    if (section === 'scanner') {
      setIsCameraActive(true);
    }
    if (isPortraitMobile()) setIsSidePanelOpen(false);
  };

  useEffect(() => {
    reservationsRef.current = reservations;
  }, [reservations]);

  useEffect(() => {
    if (activeSection === 'scanner') {
      setIsCameraActive(true);
    }
  }, [activeSection]);

  useEffect(() => {
    if (isCameraActive) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }

      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          handleScanVerify(decodedText);
          if (scannerRef.current) {
            scannerRef.current.pause(true);
            setTimeout(() => {
              if (scannerRef.current) {
                scannerRef.current.resume();
              }
            }, 3000);
          }
        },
        (error) => {
          // Ignore scan errors
        }
      );
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Failed to clear scanner", error));
        scannerRef.current = null;
      }
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Failed to clear scanner on unmount", error));
      }
    };
  }, [isCameraActive]);

  const playScanChime = (isSuccess = true) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (isSuccess) {
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime);
        gain1.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.08);
        
        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.frequency.setValueAtTime(783.99, audioCtx.currentTime);
          gain2.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
          osc2.start();
          osc2.stop(audioCtx.currentTime + 0.12);
        }, 80);
      } else {
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.25);
      }
    } catch (err) {
      console.warn("Web Audio API blocked or not supported: ", err);
    }
  };

  const playNewBookingChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.16, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (err) {
      console.warn("Web Audio API blocked or not supported: ", err);
    }
  };

  const handleScanVerify = async (scanId) => {
    if (!scanId) return;
    const normalizedScan = scanId.trim();
    setIsScanning(true);
    setScannerError(false);
    setScannerSuccessRes(null);
    setScannerMessage('SCANNING TICKET CODE IN REAL-TIME...');

    setTimeout(async () => {
      const lowerScan = normalizedScan.toLowerCase();
      let match = reservationsRef.current.find(res => res.id.toLowerCase() === lowerScan);

      if (match) {
        setScannerSuccessRes(match);
        if (match.status === 'Checked In') {
          playScanChime(false);
          setScannerError(false);
          setScannerMessage(`ALREADY CHECKED IN: ${match.id} - ${match.name}`);
        } else {
          playScanChime(true);
          setScannerMessage(`VERIFICATION SUCCESSFUL: Welcome ${match.name}!`);
          await handleUpdateStatus(match.id, 'Checked In');
          setReservations((prev) => prev.map((r) => r.recordId === match.recordId ? { ...r, status: 'Checked In' } : r));
        }
      } else {
        playScanChime(false);
        setScannerError(true);
        setScannerMessage(`INVALID TICKET CODE: "${normalizedScan.toUpperCase()}" NOT FOUND`);
      }
      setManualScanId('');
      setIsScanning(false);
    }, 1000);
  };

  const mapBookingRecord = (record) => ({
    recordId: record.id,
    id: record.id ? `RES-${record.id}` : `RES-${Math.floor(1000 + Math.random() * 9000)}`,
    name: record.customer_name || '',
    phone: record.customer_phone || '',
    date: record.booking_date || '',
    time: record.booking_time || '',
    pax: record.total_guests ? String(record.total_guests) : '0',
    preorder: !!record.dish,
    dish: record.dish || '',
    status: record.status || 'Pending',
    order_status: record.order_status || 'Pending',
    booking_source: record.booking_source || 'Online',
    tableId: record.table_id || null,
    tableNumber: record.table_number || (record.table_id ? `Table ${record.table_id}` : ''),
    tableCapacity: record.table_capacity || null,
  });

  const refreshReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('id', { ascending: false });

      if (error || !data) return;

      const mapped = data.map(mapBookingRecord);
      setReservations(mapped);
      localStorage.setItem('allBookings', JSON.stringify(mapped));
    } catch (err) {
      console.warn('Supabase bookings refresh failed:', err.message);
    }
  };

  const refreshTableLocks = async () => {
    const now = new Date().toISOString();
    try {
      const { data, error } = await supabase
        .from('table_locks')
        .select('*')
        .or(`lock_expires_at.is.null,lock_expires_at.gte.${now}`);

      if (!error) {
        setTableLocks(data || []);
      }
    } catch (err) {
      console.warn('Supabase table locks refresh failed:', err.message);
    }
  };

  const loadMenus = async () => {
    try {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('cuisine_id', { ascending: true })
        .order('id', { ascending: false });

      if (error) throw error;

      if (data) {
        setMenus(data.map((item) => ({ ...item, is_active: item.is_active !== false })));
      }
    } catch (err) {
      console.warn('Supabase menus load failed:', err.message);
      setMenus([]);
    }
  };

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map(mapBookingRecord);
          setReservations(mapped);
          localStorage.setItem('allBookings', JSON.stringify(mapped));
          return;
        }
      } catch (err) {
        console.warn('Supabase bookings load failed:', err.message);
      }

      const saved = localStorage.getItem('allBookings');
      if (saved) {
        setReservations(JSON.parse(saved));
      }
    };

    const loadTableLocks = async () => {
      const now = new Date().toISOString();
      try {
        const { data, error } = await supabase
          .from('table_locks')
          .select('*')
          .or(`lock_expires_at.is.null,lock_expires_at.gte.${now}`);

        if (!error) {
          setTableLocks(data || []);
        }
      } catch (err) {
        console.warn('Supabase table locks load failed:', err.message);
      }
    };

    loadReservations();
    loadMenus();
    loadTableLocks();

    const bookingChannel = supabase.channel('public:bookings');

    bookingChannel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload) => {
      const newBooking = mapBookingRecord(payload.new);
      setReservations((current) => [newBooking, ...current]);
      setNewBookingAlert(newBooking);
      playNewBookingChime();
    });

    bookingChannel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings' }, (payload) => {
      const updatedBooking = mapBookingRecord(payload.new);
      setReservations((current) => current.map(res => res.recordId === updatedBooking.recordId ? updatedBooking : res));
    });

    bookingChannel.subscribe();

    const refreshInterval = setInterval(() => {
      refreshReservations();
      refreshTableLocks();
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      bookingChannel.unsubscribe();
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleUpdateStatus = async (resId, newStatus) => {
    try {
      const res = reservations.find(r => r.id === resId);
      if (!res) return;
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', res.recordId);
      if (error) throw error;
      setReservations((prev) => prev.map((r) => r.recordId === res.recordId ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.warn('Status update failed:', err.message);
    }
  };

  const handleUpdateOrderStatus = async (resId, newOrderStatus) => {
    try {
      const res = reservations.find(r => r.id === resId);
      if (!res) return;
      const { error } = await supabase
        .from('bookings')
        .update({ order_status: newOrderStatus })
        .eq('id', res.recordId);
      if (error) throw error;
      setReservations((prev) => prev.map((r) => r.recordId === res.recordId ? { ...r, order_status: newOrderStatus } : r));
    } catch (err) {
      console.warn('Order status update failed:', err.message);
    }
  };

  const handleToggleBookingSource = async (resId) => {
    try {
      const res = reservations.find(r => r.id === resId);
      if (!res) return;
      const nextSource = res.booking_source === 'WhatsApp' ? 'Online' : 'WhatsApp';
      const { error } = await supabase
        .from('bookings')
        .update({ booking_source: nextSource })
        .eq('id', res.recordId);
      if (error) throw error;
      setReservations((prev) => prev.map((r) => r.recordId === res.recordId ? { ...r, booking_source: nextSource } : r));
    } catch (err) {
      console.warn('Booking source update failed:', err.message);
    }
  };

  const handleLockTable = async (tableId, reason = 'WhatsApp Booking') => {
    try {
      const lockExpiresAt = new Date(Date.now() + WHATSAPP_LOCK_DURATION_MINUTES * 60000).toISOString();
      const lockPayload = {
        table_id: tableId,
        locked_by: reason,
        lock_token: `admin-lock-${Date.now()}`,
        lock_expires_at: lockExpiresAt
      };
      const { error } = await supabase
        .from('table_locks')
        .upsert([lockPayload], { onConflict: 'table_id' });
      if (error) throw error;
      setLockActionMessage(`Table ${tableId} locked until ${new Date(lockExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      refreshTableLocks();
    } catch (err) {
      console.warn('Table lock failed:', err.message);
    }
  };

  const handleUnlockTable = async (tableId) => {
    try {
      const { error } = await supabase
        .from('table_locks')
        .delete()
        .eq('table_id', tableId);
      if (error) throw error;
      setLockActionMessage(`Table ${tableId} unlocked`);
      refreshTableLocks();
    } catch (err) {
      console.warn('Table unlock failed:', err.message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCuisineSelectionChange = (e) => {
    const nextCuisineId = e.target.value;
    setSelectedCuisineId(nextCuisineId);
    if (menuMode === 'add') {
      setMenuForm((prev) => ({ ...prev, cuisine_id: nextCuisineId }));
    }
  };

  const resetMenuForm = () => {
    if (imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setMenuForm({ id: '', name: '', price: '', cuisine_id: '1', description: '', image: '', is_active: true });
    setMenuMode('add');
    setMenuError('');
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
    }
  };

  const handleEditMenu = (menu) => {
    if (imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    const cuisineIdString = menu.cuisine_id != null ? String(menu.cuisine_id) : '1';
    setMenuForm({
      id: menu.id,
      name: menu.name || '',
      price: menu.price != null ? String(menu.price) : '',
      cuisine_id: cuisineIdString,
      description: menu.description || '',
      image: menu.image || '',
      is_active: menu.is_active !== false
    });
    setSelectedCuisineId(cuisineIdString);
    setSelectedImageFile(null);
    setImagePreviewUrl(menu.image || '');
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
    }
    setMenuMode('edit');
    setMenuError('');
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setSelectedImageFile(null);
      setImagePreviewUrl(menuForm.image || '');
      return;
    }

    if (imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setMenuError('');

    if (!menuForm.name || !menuForm.price || !menuForm.cuisine_id) {
      setMenuError('Sila lengkapkan nama, harga dan kategori menu.');
      return;
    }

    let imageUrl = menuForm.image || null;

    if (selectedImageFile) {
      try {
        const { data, error } = await supabase.storage
          .from('menu-images')
          .upload(`${Date.now()}_${selectedImageFile.name}`, selectedImageFile);

        if (error) throw error;
        imageUrl = `${supabase.storage.from('menu-images').getPublicUrl(data.path).data.publicUrl}`;
      } catch (err) {
        console.warn('Image upload failed, using provided URL');
      }
    }

    try {
      if (menuMode === 'add') {
        const { error } = await supabase.from('menus').insert([{
          name: menuForm.name,
          price: parseFloat(menuForm.price),
          cuisine_id: parseInt(menuForm.cuisine_id, 10),
          description: menuForm.description || null,
          image: imageUrl,
          is_active: !!menuForm.is_active
        }]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('menus').update({
          name: menuForm.name,
          price: parseFloat(menuForm.price),
          cuisine_id: parseInt(menuForm.cuisine_id, 10),
          description: menuForm.description || null,
          image: imageUrl,
          is_active: !!menuForm.is_active
        }).eq('id', menuForm.id);
        if (error) throw error;
      }
      resetMenuForm();
      loadMenus();
    } catch (err) {
      setMenuError(err.message || 'Menu save failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper animate-fade-in">
        <div className="admin-login-card">
          <div className="admin-logo">LEMBAYUNG</div>
          <h2>Admin Access</h2>
          <p>Please enter the administrator password</p>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="admin-error">{error}</div>}
            <button type="submit" className="btn-primary full-width">Login</button>
            <p className="hint">Hint: admin123</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-container">
        <div className="admin-header admin-container admin-header-row">
          <div className="admin-header-title">
            <button className="admin-menu-toggle" type="button" onClick={() => setIsSidePanelOpen(prev => !prev)}>☰</button>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="admin-header-actions">
            <button className="btn-outline" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="admin-container admin-main-grid">
          <aside className={`admin-sidepanel ${isSidePanelOpen ? 'open' : 'closed'}`}>
            <nav>
              <ul>
                <li><button onClick={() => handleNavClick('overview')}>Overview</button></li>
                <li><button onClick={() => handleNavClick('bookings')}>Bookings</button></li>
                <li><button onClick={() => handleNavClick('orders')}>Orders</button></li>
                <li><button onClick={() => handleNavClick('scanner')}>Scanner</button></li>
                <li><button onClick={() => handleNavClick('tables')}>Tables</button></li>
                <li><button onClick={() => handleNavClick('menus')}>Menus</button></li>
              </ul>
            </nav>
          </aside>

          <main className="admin-main">
            {activeSection === 'overview' && (
              <section className="admin-overview">
                <h2>Overview</h2>
                <div className="stats">
                  <div className="stat-card">
                    <h3>{reservations.length}</h3>
                    <p>Total Bookings</p>
                  </div>
                  <div className="stat-card">
                    <h3>{reservations.filter(r => r.status === 'Checked In').length}</h3>
                    <p>Checked In</p>
                  </div>
                  <div className="stat-card">
                    <h3>{tableLocks.length}</h3>
                    <p>Locked Tables</p>
                  </div>
                </div>
                {newBookingAlert && (
                  <div className="new-booking-alert">
                    <strong>New Booking!</strong> {newBookingAlert.name} - {newBookingAlert.pax} guests
                  </div>
                )}
              </section>
            )}

            {activeSection === 'bookings' && (
              <section className="admin-bookings">
                <h2>Reservations</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Date & Time</th>
                      <th>Guests</th>
                      <th>Table</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(r => (
                      <tr key={r.recordId}>
                        <td>{r.id}</td>
                        <td>{r.name}</td>
                        <td>{r.date} {r.time}</td>
                        <td>{r.pax}</td>
                        <td>{r.tableNumber}</td>
                        <td>
                          <span className={`source-pill ${r.booking_source === 'WhatsApp' ? 'whatsapp' : 'online'}`}>
                            {r.booking_source}
                          </span>
                        </td>
                        <td>{r.status}</td>
                        <td>
                          <div className="row-actions">
                            {r.status !== 'Checked In' && (
                              <button onClick={() => handleUpdateStatus(r.id, 'Checked In')} className="btn-small">Check In</button>
                            )}
                            <button onClick={() => handleToggleBookingSource(r.id)} className="btn-small btn-outline">
                              {r.booking_source === 'WhatsApp' ? 'Mark Online' : 'Mark WhatsApp'}
                            </button>
                            <button onClick={() => setSelectedQrBooking(r)} className="btn-small btn-outline">QR</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {selectedQrBooking && (
                  <div className="qr-panel">
                    <h3>Order Ticket: {selectedQrBooking.id}</h3>
                    <div className="qr-card">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedQrBooking.id)}`} alt="Booking QR Code" />
                      <div className="qr-info">
                        <p><strong>{selectedQrBooking.name}</strong></p>
                        <p>{selectedQrBooking.date} {selectedQrBooking.time}</p>
                        <p>Table: {selectedQrBooking.tableNumber}</p>
                        <p>Status: {selectedQrBooking.status}</p>
                        <p>Source: {selectedQrBooking.booking_source}</p>
                        <button className="btn-outline" onClick={() => setSelectedQrBooking(null)}>Close QR</button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeSection === 'orders' && (
              <section className="admin-orders">
                <h2>Order Management</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Dish</th>
                      <th>Date & Time</th>
                      <th>Table</th>
                      <th>Order Status</th>
                      <th>QR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(r => (
                      <tr key={r.recordId}>
                        <td>{r.id}</td>
                        <td>{r.name}</td>
                        <td>{r.preorder ? r.dish || 'Order not specified' : 'No dish selected'}</td>
                        <td>{r.date} {r.time}</td>
                        <td>{r.tableNumber}</td>
                        <td>
                          <select value={r.order_status || 'Pending'} onChange={(e) => handleUpdateOrderStatus(r.id, e.target.value)}>
                            {ORDER_STATUS_OPTIONS.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className="btn-small btn-outline" onClick={() => setSelectedQrBooking(r)}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {activeSection === 'scanner' && (
              <section className="admin-scanner">
                <h2>QR Scanner</h2>
                <div style={{ marginBottom: '1rem' }}>
                  <label>
                    <input type="checkbox" checked={isCameraActive} onChange={(e) => setIsCameraActive(e.target.checked)} />
                    {isCameraActive ? 'Camera Active' : 'Activate Camera'}
                  </label>
                </div>
                {isCameraActive && <div id="qr-reader" style={{ width: '100%', maxWidth: '500px' }}></div>}
                <div className="scanner-message">{scannerMessage}</div>
                <div className="manual-scan-panel">
                  <label htmlFor="manual-scan-input">Manual QR / Booking ID</label>
                  <div className="manual-scan-controls">
                    <input
                      id="manual-scan-input"
                      type="text"
                      value={manualScanId}
                      onChange={(e) => setManualScanId(e.target.value)}
                      placeholder="Enter ticket QR code or reservation ID"
                    />
                    <button type="button" className="btn-primary" onClick={() => handleScanVerify(manualScanId)}>
                      Verify Manually
                    </button>
                  </div>
                </div>
                {scannerSuccessRes && (
                  <div className={`scanner-result ${scannerError ? 'error' : 'success'}`}>
                    <div className="scanner-badge">
                      {scannerSuccessRes.status === 'Checked In' ? 'CHECKED IN' : 'VERIFIED'}
                    </div>
                    <strong>{scannerSuccessRes.name}</strong>
                    <p>Table: {scannerSuccessRes.tableNumber}</p>
                    <p>Guests: {scannerSuccessRes.pax}</p>
                    <p>Source: <span className={`source-pill ${scannerSuccessRes.booking_source === 'WhatsApp' ? 'whatsapp' : 'online'}`}>{scannerSuccessRes.booking_source}</span></p>
                  </div>
                )}
              </section>
            )}

            {activeSection === 'tables' && (
              <section className="admin-tables">
                <h2>Table Status</h2>
                {lockActionMessage && <div className="lock-action-message">{lockActionMessage}</div>}
                <div className="tables-grid">
                  {TABLES.map(table => {
                    const lock = tableLocks.find(lock => lock.table_id === table.id);
                    const isLocked = !!lock;
                    const booking = reservations.find(r => r.tableId === table.id);
                    const isWhatsappBooking = booking?.booking_source === 'WhatsApp';
                    return (
                      <div key={table.id} className={`table-card ${isLocked ? 'locked' : ''} ${booking ? 'booked' : ''}`}>
                        <h4>{table.name}</h4>
                        <p>Seats: {table.seats}</p>
                        {booking && <p className="booking-name">{booking.name}</p>}
                        {booking && <p className={`source-pill ${isWhatsappBooking ? 'whatsapp' : 'online'}`}>{booking.booking_source}</p>}
                        {isLocked && <p className="locked-label">LOCKED ({new Date(lock.lock_expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</p>}
                        <div className="table-actions">
                          {isLocked ? (
                            <button className="btn-small btn-outline" onClick={() => handleUnlockTable(table.id)}>Unlock</button>
                          ) : (
                            <button className="btn-small" onClick={() => handleLockTable(table.id, isWhatsappBooking ? 'WhatsApp Booking' : 'Admin lock')}>Lock</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {activeSection === 'menus' && (
              <section className="admin-menus">
                <div className="admin-menu-management">
                              <div className="menu-form-panel">
                    <h2>{menuMode === 'edit' ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                    <div className="form-row">
                      <label>Manage Cuisine</label>
                      <select value={selectedCuisineId} onChange={handleCuisineSelectionChange}>
                        <option value="1">Malay</option>
                        <option value="2">Chinese</option>
                        <option value="3">Japanese</option>
                        <option value="4">Western</option>
                        <option value="5">Indian</option>
                        <option value="6">Desserts</option>
                      </select>
                    </div>
                    <form onSubmit={handleMenuSubmit} className="menu-form">
                      <div className="form-row">
                        <label>Name</label>
                        <input name="name" value={menuForm.name} onChange={handleMenuChange} placeholder="Dish name" />
                      </div>
                      <div className="form-row">
                        <label>Price</label>
                        <input name="price" value={menuForm.price} onChange={handleMenuChange} placeholder="e.g. 29.90" />
                      </div>
                      <div className="form-row">
                        <label>Cuisine</label>
                        <select name="cuisine_id" value={menuForm.cuisine_id} onChange={handleMenuChange}>
                          <option value="1">Malay</option>
                          <option value="2">Chinese</option>
                          <option value="3">Japanese</option>
                          <option value="4">Western</option>
                          <option value="5">Indian</option>
                          <option value="6">Desserts</option>
                        </select>
                      </div>
                      <div className="form-row">
                        <label>Description</label>
                        <textarea name="description" value={menuForm.description} onChange={handleMenuChange} rows="3" placeholder="Menu description" />
                      </div>
                      <div className="form-row">
                        <label>Image URL / Upload</label>
                        <input name="image" value={menuForm.image} onChange={handleMenuChange} placeholder="Image URL or upload below" />
                      </div>
                      <div className="form-row">
                        <label>Upload Image File</label>
                        <input ref={imageFileInputRef} type="file" accept="image/*" onChange={handleImageFileChange} />
                      </div>
                      {imagePreviewUrl && (
                        <div className="image-preview-panel">
                          <img src={imagePreviewUrl} alt="Preview" />
                        </div>
                      )}
                      <div className="form-row form-actions">
                        <button type="submit" className="btn-primary">{menuMode === 'edit' ? 'Update Menu' : 'Add Menu'}</button>
                        {menuMode === 'edit' && (
                          <button type="button" className="btn-outline" onClick={resetMenuForm}>Cancel Edit</button>
                        )}
                      </div>
                      {menuError && <div className="form-error">{menuError}</div>}
                    </form>
                  </div>

                  <div className="menu-list-panel">
                    <h2>Current Menu Items</h2>
                    <p className="filter-note">Showing cuisine: <strong>{selectedCuisineId === '1' ? 'Malay' : selectedCuisineId === '2' ? 'Chinese' : selectedCuisineId === '3' ? 'Japanese' : selectedCuisineId === '4' ? 'Western' : selectedCuisineId === '5' ? 'Indian' : 'Desserts'}</strong></p>
                    <div className="menus-grid">
                      {menus.filter((item) => String(item.cuisine_id) === selectedCuisineId).length === 0 && <p>No menu items found for this cuisine.</p>}
                      {menus.filter((item) => String(item.cuisine_id) === selectedCuisineId).map(m => (
                        <div key={m.id} className="menu-card">
                          <img src={m.image || 'https://via.placeholder.com/150?text=No+Image'} alt={m.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                          <h3>{m.name}</h3>
                          <p>Price: RM{m.price}</p>
                          <p>Status: {m.is_active ? 'Active' : 'Inactive'}</p>
                          <button onClick={() => handleEditMenu(m)}>Edit</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;
