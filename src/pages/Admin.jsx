import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../supabaseClient';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState([]);
  const [selectedRes, setSelectedRes] = useState(null); // for managing a specific booking
  const [newBookingAlert, setNewBookingAlert] = useState(null);
  const [tableLocks, setTableLocks] = useState([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  // Close drawer on large screens (>=1025px)
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
    if (isPortraitMobile()) setIsSidePanelOpen(false);
  };

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

  const [menus, setMenus] = useState([]);
  const [menuForm, setMenuForm] = useState({ id: '', name: '', price: '', cuisine_id: '1', description: '', image: '', is_active: true });
  const [menuError, setMenuError] = useState('');
  const [menuMode, setMenuMode] = useState('add');
  const [expandedCuisine, setExpandedCuisine] = useState('1');

  const cuisineOptions = [
    { value: '1', label: 'Malay' },
    { value: '2', label: 'Chinese' },
    { value: '3', label: 'Japanese' },
    { value: '4', label: 'Western' },
    { value: '5', label: 'Indian' }
  ];

  // Entrance Scanner Simulator States
  const [manualScanId, setManualScanId] = useState('');
  const [scannerMessage, setScannerMessage] = useState('SCANNER ACTIVE - PRESENT CUSTOMER TICKET QR');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerSuccessRes, setScannerSuccessRes] = useState(null);
  const [scannerError, setScannerError] = useState(false);

  // Live Camera Scanner States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef(null);
  const reservationsRef = useRef(reservations);

  useEffect(() => {
    reservationsRef.current = reservations;
  }, [reservations]);

  useEffect(() => {
    if (isCameraActive) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }

      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        /* verbose= */ false
      );

      scannerRef.current.render(
        (decodedText) => {
          // Use our robust check-in handler for live scanned QR!
          handleScanVerify(decodedText);
          
          if (scannerRef.current) {
            scannerRef.current.pause(true);
            setTimeout(() => {
              if (scannerRef.current) {
                scannerRef.current.resume();
              }
            }, 3000); // Resume scanning after 3 seconds for next guest
          }
        },
        (error) => {
          // Ignore general scan failures
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
        // Success high double-beep
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        gain1.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.08);
        
        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.frequency.setValueAtTime(783.99, audioCtx.currentTime); // G5
          gain2.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
          osc2.start();
          osc2.stop(audioCtx.currentTime + 0.12);
        }, 80);
      } else {
        // Error low double buzz
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
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
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
      let lockMatch = null;

      if (!match && /^lock-\d+$/i.test(normalizedScan)) {
        const lockId = parseInt(normalizedScan.split('-')[1], 10);
        lockMatch = tableLocks.find(lock => lock.table_id === lockId);
      }

      if (!match && !lockMatch && /booking:/i.test(normalizedScan)) {
        const lines = normalizedScan.split(/\r?\n/).map(line => line.trim());
        const bookingLine = lines.find(line => line.toLowerCase().startsWith('booking:'));
        if (bookingLine) {
          const bookingId = bookingLine.split(':')[1]?.trim();
          if (bookingId) {
            const normalizedId = bookingId.toLowerCase();
            const parsedMatch = reservationsRef.current.find(res => res.id.toLowerCase() === normalizedId);
            if (parsedMatch) {
              lockMatch = null;
              match = parsedMatch;
            }
          }
        }
      }

      setIsScanning(false);

      if (match) {
        if (match.status === 'Checked In') {
          playScanChime(false);
          setScannerError(true);
          setScannerMessage(`ALREADY CHECKED IN: ${match.id} - ${match.name}`);
        } else {
          playScanChime(true);
          setScannerSuccessRes(match);
          setScannerMessage(`VERIFICATION SUCCESSFUL: Welcome ${match.name}!`);
          await handleUpdateStatus(match.id, 'Checked In');
        }
      } else if (lockMatch) {
        playScanChime(true);
        const lockInfo = {
          id: `LOCK-${lockMatch.table_id}`,
          name: lockMatch.locked_by || 'Table Hold',
          tableNumber: TABLES.find(t => t.id === lockMatch.table_id)?.name || `Table ${lockMatch.table_id}`,
          pax: '-',
          dish: lockMatch.locked_by || 'Admin hold',
          status: 'Locked',
          isLockEntry: true
        };
        setScannerSuccessRes(lockInfo);
        setScannerMessage(`LOCK VERIFIED: ${lockInfo.name} (${lockInfo.tableNumber})`);
      } else {
        playScanChime(false);
        setScannerError(true);
        setScannerMessage(`INVALID TICKET CODE: "${normalizedScan.toUpperCase()}" NOT FOUND`);
      }
      setManualScanId('');
    }, 1000);
  };

  // Initial mock data
  const defaultReservations = [
    { id: 'RES-3921', name: 'Ahmad Faiz', date: '2026-05-20', time: '18:00', pax: 4, preorder: true, dish: 'ayam-rendang', status: 'Confirmed' },
    { id: 'RES-8821', name: 'Sarah Lee', date: '2026-05-20', time: '19:30', pax: 2, preorder: false, dish: '', status: 'Confirmed' },
    { id: 'RES-1049', name: 'Mohd Amir', date: '2026-05-21', time: '21:00', pax: 6, preorder: true, dish: 'masak-lemak', status: 'Pending' },
  ];

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
    tableId: record.table_id || null,
    tableNumber: record.table_number || (record.table_id ? `Table ${record.table_id}` : ''),
    tableCapacity: record.table_capacity || null,
  });

  const [selectedTableDetails, setSelectedTableDetails] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [lockNote, setLockNote] = useState('Admin hold');

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

      if (error) {
        throw error;
      }

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

        if (error) {
          throw error;
        }

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
      } else {
        localStorage.setItem('allBookings', JSON.stringify(defaultReservations));
        setReservations(defaultReservations);
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

  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetMenuForm = () => {
    setMenuForm({ id: '', name: '', price: '', cuisine_id: '1', description: '', image: '', is_active: true });
    setMenuMode('add');
    setMenuError('');
  };

  const handleEditMenu = (menu) => {
    setMenuForm({
      id: menu.id,
      name: menu.name || '',
      price: menu.price != null ? String(menu.price) : '',
      cuisine_id: menu.cuisine_id != null ? String(menu.cuisine_id) : '1',
      description: menu.description || '',
      image: menu.image || '',
      is_active: menu.is_active !== false
    });
    setMenuMode('edit');
    setMenuError('');
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setMenuError('');

    if (!menuForm.name || !menuForm.price || !menuForm.cuisine_id) {
      setMenuError('Sila lengkapkan nama, harga dan kategori menu.');
      return;
    }

    const payload = {
      name: menuForm.name,
      price: parseFloat(menuForm.price) || 0,
      cuisine_id: parseInt(menuForm.cuisine_id, 10),
      description: menuForm.description || null,
      image: menuForm.image || null,
      is_active: menuForm.is_active
    };

    try {
      if (menuMode === 'edit' && menuForm.id) {
        const { error } = await supabase
          .from('menus')
          .update(payload)
          .eq('id', parseInt(menuForm.id, 10));

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('menus')
          .insert([payload]);

        if (error) {
          throw error;
        }
      }

      await loadMenus();
      resetMenuForm();
    } catch (err) {
      console.warn('Supabase menu save failed:', err.message);
      setMenuError('Gagal menyimpan item menu: ' + (err.message || 'Unknown error'));
    }
  };

  const handleToggleMenuActive = async (menu) => {
    const updatedStatus = !(menu.is_active !== false);
    try {
      const { error } = await supabase
        .from('menus')
        .update({ is_active: updatedStatus })
        .eq('id', menu.id);

      if (error) {
        throw error;
      }

      setMenus((current) => current.map((item) => item.id === menu.id ? { ...item, is_active: updatedStatus } : item));
    } catch (err) {
      console.warn('Supabase menu toggle failed:', err.message);
    }
  };

  const handleDeleteMenu = async (menu) => {
    if (!window.confirm('Delete this menu item permanently?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', menu.id);

      if (error) {
        throw error;
      }

      setMenus((current) => current.filter((item) => item.id !== menu.id));
      if (menuForm.id === menu.id) {
        resetMenuForm();
      }
    } catch (err) {
      console.warn('Supabase menu delete failed:', err.message);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const reservation = reservations.find(res => res.id === id);
    const recordId = reservation?.recordId || parseInt(id.replace('RES-', ''), 10);

    const updated = reservations.map(res => 
      res.id === id ? { ...res, status: newStatus } : res
    );
    setReservations(updated);
    localStorage.setItem('allBookings', JSON.stringify(updated));
    setSelectedRes(null);

    try {
      if (recordId) {
        const { error } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', recordId);

        if (error) {
          throw error;
        }
      }
    } catch (err) {
      console.warn('Failed to update booking status in Supabase:', err.message);
    }

    const active = localStorage.getItem('activeBooking');
    if (active) {
      const activeObj = JSON.parse(active);
      if (activeObj.id === id) {
        activeObj.status = newStatus;
        localStorage.setItem('activeBooking', JSON.stringify(activeObj));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      const reservation = reservations.find(res => res.id === id);
      const recordId = reservation?.recordId || parseInt(id.replace('RES-', ''), 10);
      const updated = reservations.filter(res => res.id !== id);
      setReservations(updated);
      localStorage.setItem('allBookings', JSON.stringify(updated));
      setSelectedRes(null);

      try {
        if (recordId) {
          const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', recordId);

          if (error) {
            throw error;
          }
        }
      } catch (err) {
        console.warn('Failed to delete booking from Supabase:', err.message);
      }

      const active = localStorage.getItem('activeBooking');
      if (active) {
        const activeObj = JSON.parse(active);
        if (activeObj.id === id) {
          localStorage.removeItem('activeBooking');
        }
      }
    }
  };

  const getTableLock = (tableId) => {
    const now = Date.now();
    return tableLocks.find((lock) => {
      if (lock.table_id !== tableId) return false;
      if (!lock.lock_expires_at) return true;
      return new Date(lock.lock_expires_at).getTime() > now;
    });
  };

  const getTableBooking = (tableId) => {
    return reservations.find((res) => res.tableId === tableId && res.status !== 'Cancelled');
  };

  const getBookingQrUrl = (res) => {
    if (!res) return null;

    if (res.isLockEntry) {
      return `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(res.id)}`;
    }

    const payload = `Booking:${res.id}\nName:${res.name}\nTable:${res.tableNumber || 'Unassigned'}\nDate:${res.date}\nTime:${res.time}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(payload)}`;
  };

  const reservationLocks = tableLocks
    .filter((lock) => !getTableBooking(lock.table_id))
    .map((lock) => {
      const table = TABLES.find((item) => item.id === lock.table_id);
      return {
        id: `LOCK-${lock.table_id}`,
        recordId: lock.id,
        name: lock.locked_by || 'Table Hold',
        date: 'Locked',
        time: '—',
        tableNumber: table?.name || `Table ${lock.table_id}`,
        pax: '-',
        dish: lock.locked_by || 'Admin hold',
        status: 'Locked',
        tableId: lock.table_id,
        isLockEntry: true
      };
    });

  const reservationRows = [
    ...reservations.filter((res) => res.status !== 'Cancelled'),
    ...reservationLocks
  ];

  const handleShowTableDetails = (table) => {
    setSelectedTableDetails({
      table,
      booking: getTableBooking(table.id),
      lock: getTableLock(table.id)
    });
  };

  const handleAssignTableToBooking = async (table) => {
    if (!selectedRes) {
      window.alert('Please select a booking from the reservations list first.');
      return;
    }

    if (table.seats < parseInt(selectedRes.pax || '0', 10)) {
      window.alert('Selected table cannot fit this booking. Choose a larger table.');
      return;
    }

    const bookedTable = getTableBooking(table.id);
    if (bookedTable && bookedTable.id !== selectedRes.id) {
      window.alert('This table is already booked by another reservation.');
      return;
    }

    const recordId = selectedRes.recordId || parseInt(selectedRes.id.replace(/^RES-/, ''), 10);
    if (!recordId) {
      window.alert('Unable to update booking record: invalid booking ID.');
      return;
    }

    try {
      const payload = {
        table_id: table.id,
        table_number: table.name,
        table_capacity: table.seats
      };

      const { error } = await supabase
        .from('bookings')
        .update(payload)
        .eq('id', recordId);

      if (error) throw error;

      const updatedReservations = reservations.map((res) =>
        res.id === selectedRes.id
          ? { ...res, ...payload, tableId: table.id, tableNumber: table.name, tableCapacity: table.seats }
          : res
      );
      setReservations(updatedReservations);
      localStorage.setItem('allBookings', JSON.stringify(updatedReservations));

      const updatedSelectedRes = { ...selectedRes, ...payload, tableId: table.id, tableNumber: table.name, tableCapacity: table.seats };
      setSelectedRes(updatedSelectedRes);
      setSelectedTableDetails((prev) => prev ? { ...prev, booking: updatedSelectedRes } : prev);

      await refreshReservations();
      await refreshTableLocks();
    } catch (err) {
      const message = err?.message || err || 'Unknown error while assigning table';
      console.warn('Failed to assign table to booking:', message);
      window.alert('Failed to assign table: ' + message);
    }
  };

  const holdTable = async (table) => {
    const reason = lockNote?.trim() || window.prompt('Enter a note for this hold (e.g. walk-in / WhatsApp order):', 'Admin hold');
    if (reason === null || reason.trim() === '') return;

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

      await refreshTableLocks();
    } catch (err) {
      const message = err?.message || err || 'Unknown error while holding table';
      console.warn('Failed to hold table:', message);
      window.alert('Failed to hold table: ' + message);
    }
  };

  const releaseTable = async (table) => {
    try {
      const { error } = await supabase
        .from('table_locks')
        .delete()
        .eq('table_id', table.id);
      if (error) throw error;
      await refreshTableLocks();
    } catch (err) {
      console.warn('Failed to release table:', err.message);
    }
  };

  // Calculate dynamic stats
  const totalBookings = reservations.length;
  const totalPax = reservations.reduce((sum, res) => sum + parseInt(res.pax || 0), 0);
  const totalPreorders = reservations.filter(res => res.preorder).length;

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper animate-fade-in">
        <div className="admin-login-card">
          <div className="login-icon">🔒</div>
          <h2>Admin Access</h2>
          <p>Please enter the administrator password</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn-primary full-width mt-2">Login</button>
          </form>
          <p className="hint">Hint: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-header">
        <div className="admin-container admin-header-row">
          <div className="admin-header-title">
            <button className="admin-menu-toggle" type="button" onClick={() => setIsSidePanelOpen(prev => !prev)}>
              <span />
              <span />
              <span />
            </button>
            <div>
              <h2>Restaurant Management Dashboard</h2>
              <p>SDG 9 Initiative: Digital Capacity & Resource Planning</p>
            </div>
          </div>
          <div className="admin-header-actions">
            <Link to="/admin-table-status" className="btn-outline btn-sm" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
              Table Status
            </Link>
            <button className="btn-outline btn-logout" onClick={() => setIsAuthenticated(false)}>Logout</button>
          </div>
        </div>
      </div>

      {newBookingAlert && (
        <div className="admin-alert new-booking-alert animate-fade-in">
          <strong>New booking received:</strong> {newBookingAlert.name} — {newBookingAlert.date} {newBookingAlert.time}
          <button className="btn-sm btn-outline" onClick={() => setNewBookingAlert(null)} style={{ marginLeft: '1rem' }}>
            Dismiss
          </button>
        </div>
      )}
      
      <div className="admin-container mt-4">
        <div className="admin-dashboard-layout">
          <aside className={`admin-side-panel ${isSidePanelOpen ? 'open' : 'closed'}`}>
            <div className="admin-side-panel-header">
              <h3>Admin Sections</h3>
              <p>Navigate between tasks.</p>
            </div>
            <nav className="admin-side-nav">
              <button className={`side-nav-button ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => handleNavClick('overview')}>
                Overview
              </button>
              <button className={`side-nav-button ${activeSection === 'table' ? 'active' : ''}`} onClick={() => handleNavClick('table')}>
                Table Availability
              </button>
              <button className={`side-nav-button ${activeSection === 'menu' ? 'active' : ''}`} onClick={() => handleNavClick('menu')}>
                Adjust Menu
              </button>
              <button className={`side-nav-button ${activeSection === 'reservations' ? 'active' : ''}`} onClick={() => handleNavClick('reservations')}>
                Upcoming Reservations
              </button>
              <button className={`side-nav-button ${activeSection === 'scanner' ? 'active' : ''}`} onClick={() => handleNavClick('scanner')}>
                QR Scanner
              </button>
            </nav>
          </aside>
          <div className={`side-panel-backdrop ${isSidePanelOpen ? 'open' : ''}`} onClick={() => setIsSidePanelOpen(false)} />
          <main className="admin-main-panel">
            <div className="admin-container mt-4" style={{ display: ['overview', 'table', 'scanner'].includes(activeSection) ? 'block' : 'none' }}>
              <div className="dashboard-stats" style={{ display: activeSection === 'overview' ? 'grid' : 'none' }}>
                <div className="stat-card">
                  <h3>Total Bookings</h3>
                  <div className="stat-value">{totalBookings}</div>
                </div>
          <div className="stat-card">
            <h3>Total Pax</h3>
            <div className="stat-value">{totalPax}</div>
          </div>
          <div className="stat-card highlight">
            <h3>Pre-orders (Waste Saved)</h3>
            <div className="stat-value">{totalPreorders}</div>
          </div>
        </div>

        <div className="table-availability-panel" style={{ display: activeSection === 'table' ? 'block' : 'none' }}>
          <h3>Table Availability / Locks</h3>
          <div className="table-lock-input-panel">
            <label>Admin hold note</label>
            <div className="split-input-row">
              <input
                type="text"
                value={lockNote}
                onChange={(e) => setLockNote(e.target.value)}
                placeholder="Enter lock reason (e.g. VIP, walk-in, reserved for event)"
              />
              <span className="help-text">This note will be saved when you hold a table.</span>
            </div>
          </div>
          <div className="table-panel-layout">
            <div className="table-availability-grid">
              {TABLES.map((table) => {
                const booking = getTableBooking(table.id);
                const lock = getTableLock(table.id);
                const booked = !!booking;
                const isLocked = !!lock;
                const status = booked
                  ? `Booked by ${booking.name}`
                  : isLocked
                  ? lock.locked_by || 'Reserved'
                  : 'Available';
                const statusClass = booked ? 'booked' : isLocked ? 'locked' : 'available';

                return (
                  <div key={table.id} className={`table-availability-card ${statusClass}`}>
                    <div className="table-availability-name">{table.name}</div>
                    <div className="table-availability-seats">{table.seats} seats</div>
                    <div className="table-availability-status">{status}</div>
                    {booked && booking && (
                      <div className="table-availability-booking">
                        <strong>{booking.id}</strong> • {booking.date} {booking.time}
                      </div>
                    )}
                    {isLocked && lock.locked_by && (
                      <div className="table-availability-expiry">
                        {lock.lock_token === 'admin' ? 'Admin hold' : 'Held until'}{' '}
                        {lock.lock_expires_at ? new Date(lock.lock_expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'until released'}
                      </div>
                    )}
                    <div className="table-availability-actions">
                      {!booked && !isLocked && (
                        <button type="button" className="btn-sm btn-outline" onClick={() => holdTable(table)}>
                          Hold Table
                        </button>
                      )}
                      {isLocked && !booked && (
                        <button type="button" className="btn-sm btn-danger" onClick={() => releaseTable(table)}>
                          Release Hold
                        </button>
                      )}
                      <button type="button" className="btn-sm btn-outline" onClick={() => handleShowTableDetails(table)}>
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="table-detail-panel">
              {!selectedTableDetails ? (
                <div className="table-detail-placeholder">
                  <h4>Select a table to see details</h4>
                  <p>Click "View Details" on any table card. You can also assign a selected booking to this table.</p>
                </div>
              ) : (
                <>
                  <div className="table-detail-header">
                    <h3>{selectedTableDetails.table.name} Details</h3>
                    <button className="btn-sm btn-outline" type="button" onClick={() => setSelectedTableDetails(null)}>
                      Close
                    </button>
                  </div>
                  {selectedTableDetails.booking ? (
                    <div className="table-detail-content">
                      <p><strong>Booking ID:</strong> {selectedTableDetails.booking.id}</p>
                      <p><strong>Guest:</strong> {selectedTableDetails.booking.name}</p>
                      <p><strong>Phone:</strong> {selectedTableDetails.booking.phone || 'Not provided'}</p>
                      <p><strong>Date & Time:</strong> {selectedTableDetails.booking.date} {selectedTableDetails.booking.time}</p>
                      <p><strong>Pax:</strong> {selectedTableDetails.booking.pax}</p>
                      <p><strong>Status:</strong> {selectedTableDetails.booking.status}</p>
                      <p><strong>Pre-order:</strong> {selectedTableDetails.booking.preorder ? selectedTableDetails.booking.dish.replace('-', ' ') : 'None'}</p>
                      <div className="qr-ticket-card">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`Booking:${selectedTableDetails.booking.id}\nName:${selectedTableDetails.booking.name}\nTable:${selectedTableDetails.booking.tableNumber}\nDate:${selectedTableDetails.booking.date}\nTime:${selectedTableDetails.booking.time}`)}`}
                          alt="Booking QR Code"
                        />
                        <div className="qr-ticket-info">
                          <p><strong>Ticket QR</strong></p>
                          <p>Send this ticket to the customer via WhatsApp.</p>
                          {selectedTableDetails.booking.phone ? (
                            <a
                              className="btn-sm btn-success"
                              href={`https://api.whatsapp.com/send?phone=${selectedTableDetails.booking.phone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hello ${selectedTableDetails.booking.name}, your booking ${selectedTableDetails.booking.id} for ${selectedTableDetails.booking.tableNumber} on ${selectedTableDetails.booking.date} at ${selectedTableDetails.booking.time} is confirmed.`)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Send WhatsApp
                            </a>
                          ) : (
                            <p className="text-muted">No phone number available for WhatsApp.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : selectedTableDetails.lock ? (
                    <div className="table-detail-content">
                      <p><strong>Locked by:</strong> {selectedTableDetails.lock.locked_by}</p>
                      <p><strong>Lock type:</strong> {selectedTableDetails.lock.lock_token === 'admin' ? 'Admin hold' : 'Reserved'}</p>
                      <p><strong>Expires:</strong> {selectedTableDetails.lock.lock_expires_at ? new Date(selectedTableDetails.lock.lock_expires_at).toLocaleString() : 'Until released'}</p>
                      <div className="qr-ticket-card">
                        <img
                          src={getBookingQrUrl({
                            isLockEntry: true,
                            dish: selectedTableDetails.lock.locked_by,
                            name: selectedTableDetails.lock.locked_by,
                            tableNumber: selectedTableDetails.table?.name,
                            status: 'Locked'
                          })}
                          alt="Hold QR Code"
                        />
                        <div className="qr-ticket-info">
                          <p><strong>Hold QR</strong></p>
                          <p>This QR represents the locked table entry for VIP/admin hold.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="table-detail-content">
                      <p>This table is currently available.</p>
                      {selectedRes ? (
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => handleAssignTableToBooking(selectedTableDetails.table)}
                        >
                          Assign selected booking to this table
                        </button>
                      ) : (
                        <p className="text-muted">To assign a booking to this table, select a reservation from the list first.</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Entrance Gate QR Scanner Panel */}
        <div className="scanner-section-container animate-fade-in" style={{ display: activeSection === 'scanner' ? 'block' : 'none' }}>
          <div className="scanner-card">
            <div className="scanner-header-row">
              <h3>🚪 Traditional Malay Glasshouse Entrance QR Scanner</h3>
              <div className="scanner-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  className={`btn-sm ${isCameraActive ? 'btn-danger' : 'btn-success'}`}
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {isCameraActive ? '🛑 Stop Camera' : '🎥 Start Live Camera'}
                </button>
                <span className="scanner-tag">SDG 9 DIGITAL CHECK-IN</span>
              </div>
            </div>
            
            {/* The Live QR Reader Div */}
            <div id="qr-reader" style={{ display: isCameraActive ? 'block' : 'none', marginBottom: '2rem', borderRadius: '8px', overflow: 'hidden' }}></div>
            
            <div className="scanner-grid">
              {/* Left Column: neon CRT scan viewbox */}
              <div className="scanner-monitor-panel">
                <div className={`crt-scan-viewport ${isScanning ? 'is-scanning' : ''} ${scannerError ? 'has-error' : ''} ${scannerSuccessRes ? 'has-success' : ''}`}>
                  <div className="crt-glow-overlay"></div>
                  <div className="scan-corner top-left"></div>
                  <div className="scan-corner top-right"></div>
                  <div className="scan-corner bottom-left"></div>
                  <div className="scan-corner bottom-right"></div>
                  
                  {/* Laser Sweeper */}
                  <div className="scanner-laser-line"></div>
                  
                  <div className="viewport-info text-center">
                    <div className="gate-icon">{isScanning ? '🔄' : scannerError ? '❌' : scannerSuccessRes ? '✅' : '📷'}</div>
                    <div className="flashing-scanner-status">
                      {isScanning ? 'VERIFYING CODE...' : scannerError ? 'ACCESS DENIED' : scannerSuccessRes ? 'ACCESS GRANTED' : 'SCANNER ACTIVE'}
                    </div>
                    <p className="scanner-feed-sub">{scannerMessage}</p>
                    
                    {scannerSuccessRes && (
                      <div className="viewport-result-card animate-zoom-in">
                        <strong>{scannerSuccessRes.name}</strong>
                        <span>{scannerSuccessRes.pax} pax • {scannerSuccessRes.dish ? scannerSuccessRes.dish.replace('-', ' ') : 'Table Only'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Column: controls */}
              <div className="scanner-controls-panel">
                <h4>Entrance Gate Controls</h4>
                <p>Simulate a physical ticket scan at the glasshouse gate or type a code manually to verify.</p>
                
                <div className="control-group">
                  <label>Type / Paste Ticket ID</label>
                  <div className="scan-input-row">
                    <input 
                      type="text" 
                      placeholder="e.g. RES-3921" 
                      value={manualScanId}
                      onChange={(e) => setManualScanId(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleScanVerify(manualScanId)}
                      disabled={isScanning}
                    />
                    <button 
                      className="btn-primary" 
                      onClick={() => handleScanVerify(manualScanId)}
                      disabled={isScanning || !manualScanId}
                    >
                      Scan manual
                    </button>
                  </div>
                </div>

                <div className="control-group mt-3">
                  <label>Simulate QR Scan from Active Tickets</label>
                  <select 
                    onChange={(e) => handleScanVerify(e.target.value)}
                    value=""
                    disabled={isScanning}
                  >
                    <option value="">-- Choose a customer ticket to scan --</option>
                    {reservations.filter(res => res.status !== 'Checked In').map(res => (
                      <option key={res.id} value={res.id}>
                        [QR CODE] {res.id} - {res.name} ({res.pax} pax)
                      </option>
                    ))}
                  </select>
                  <small className="help-text">Select any pending/confirmed booking to simulate the customer presenting their QR code at the entrance reader.</small>
                </div>
                
                {scannerSuccessRes && (
                  <div className="scanner-success-feedback animate-fade-in mt-3">
                    🔊 <strong>Check-in Registered:</strong> A welcome chime was played. Guest table for {scannerSuccessRes.name} is ready for seating.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: activeSection === 'menu' ? 'block' : 'none' }}>
        <div className="menu-management-panel" style={{ display: activeSection === 'menu' ? 'block' : 'none' }}>
          <div className="menu-management-header">
            <h3>Admin Menu Management</h3>
            <p>Tambah, edit, close atau padam item menu yang dikendalikan dari Supabase.</p>
          </div>

          <div className="menu-management-grid">
            <div className="menu-form-card">
              <h4>{menuMode === 'edit' ? 'Edit Menu Item' : 'Tambah Menu Item Baru'}</h4>
              <form className="admin-menu-form" onSubmit={handleMenuSubmit}>
                <div className="form-group">
                  <label>Menu item name</label>
                  <input name="name" value={menuForm.name} onChange={handleMenuChange} placeholder="Dish name" required />
                </div>
                <div className="form-group">
                  <label>Price (RM)</label>
                  <input name="price" type="number" step="0.01" value={menuForm.price} onChange={handleMenuChange} placeholder="45.00" required />
                </div>
                <div className="form-group">
                  <label>Cuisine category</label>
                  <select name="cuisine_id" value={menuForm.cuisine_id} onChange={handleMenuChange} required>
                    {cuisineOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={menuForm.description} onChange={handleMenuChange} placeholder="Optional dish description" />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input name="image" value={menuForm.image} onChange={handleMenuChange} placeholder="Optional image URL" />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="is_active" checked={menuForm.is_active} onChange={handleMenuChange} />
                    Keep menu item active
                  </label>
                </div>
                {menuError && <div className="error-message">{menuError}</div>}
                <div className="form-actions">
                  <button type="submit" className="btn-primary">{menuMode === 'edit' ? 'Save Changes' : 'Add Menu Item'}</button>
                  {menuMode === 'edit' && (
                    <button type="button" className="btn-outline" onClick={resetMenuForm}>Cancel</button>
                  )}
                </div>
              </form>
            </div>

            <div className="menu-list-card">
              <h4>Existing Menu Items</h4>
              {menus.length === 0 ? (
                <p className="text-muted">No menu items loaded yet. Create one to populate Supabase.</p>
              ) : (
                <div className="cuisine-groups">
                  {cuisineOptions.map((option) => {
                    const cuisineMenus = menus.filter((menu) => String(menu.cuisine_id) === option.value);
                    const isExpanded = expandedCuisine === option.value;

                    return (
                      <div key={option.value} className="cuisine-group-card">
                        <button
                          type="button"
                          className={`cuisine-group-toggle ${isExpanded ? 'expanded' : ''}`}
                          onClick={() => setExpandedCuisine((prev) => (prev === option.value ? '' : option.value))}
                        >
                          <div>
                            <strong>{option.label}</strong>
                            <span className="cuisine-group-count">{cuisineMenus.length} item(s)</span>
                          </div>
                          <span className="toggle-symbol">{isExpanded ? '−' : '+'}</span>
                        </button>

                        {isExpanded && (
                          <div className="cuisine-menu-list">
                            {cuisineMenus.length === 0 ? (
                              <div className="empty-cuisine-state">Tiada item untuk {option.label} lagi.</div>
                            ) : (
                              cuisineMenus.map((menu) => (
                                <div key={menu.id} className="cuisine-menu-item">
                                  <div className="menu-item-info">
                                    <div>
                                      <h5>{menu.name}</h5>
                                      <p>{menu.description || 'No description provided.'}</p>
                                    </div>
                                    <div className="menu-item-meta">
                                      <span>RM {parseFloat(menu.price || 0).toFixed(2)}</span>
                                      <span className={`status-badge ${menu.is_active ? 'open' : 'closed'}`}>
                                        {menu.is_active ? 'Open' : 'Closed'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="menu-action-buttons">
                                    <button type="button" className="btn-sm btn-outline" onClick={() => handleEditMenu(menu)}>Edit</button>
                                    <button type="button" className="btn-sm btn-success" onClick={() => handleToggleMenuActive(menu)}>
                                      {menu.is_active ? 'Close' : 'Open'}
                                    </button>
                                    <button type="button" className="btn-sm btn-danger" onClick={() => handleDeleteMenu(menu)}>Delete</button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: activeSection === 'reservations' ? 'block' : 'none' }}>
          {/* Action Panel for selected booking */}
          {selectedRes && (
            <div className="action-panel animate-fade-in">
              <h3>Manage Booking: {selectedRes.id}</h3>
              <p>Guest: <strong>{selectedRes.name}</strong> ({selectedRes.pax} pax)</p>
              <p>Table: <strong>{selectedRes.tableNumber || 'Not assigned'}</strong></p>
              <div className="action-buttons">
                <button className="btn-primary btn-sm btn-success" onClick={() => handleUpdateStatus(selectedRes.id, 'Confirmed')}>
                  Confirm / Approve
                </button>
                <button className="btn-outline btn-sm btn-warn" onClick={() => handleUpdateStatus(selectedRes.id, 'Pending')}>
                  Set to Pending
                </button>
                <button className="btn-outline btn-sm btn-danger" onClick={() => handleUpdateStatus(selectedRes.id, 'Cancelled')}>
                  Cancel Reservation
                </button>
                <button className="btn-danger btn-sm" onClick={() => handleDelete(selectedRes.id)}>
                  Delete Completely
                </button>
                <button className="btn-outline btn-sm" onClick={() => setSelectedRes(null)}>
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="reservations-table-container">
          <h3>Upcoming Reservations + Held Tables</h3>
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Date & Time</th>
                <th>Table</th>
                <th>Pax</th>
                <th>Pre-order (SDG 9)</th>
                <th>QR</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservationRows.map(res => {
                const qrUrl = getBookingQrUrl(res);
                return (
                <tr key={res.id} className={selectedRes?.id === res.id ? 'active-row' : ''}>
                  <td><strong>{res.id}</strong></td>
                  <td>{res.name}</td>
                  <td>{res.date} <br/> <span className="time-badge">{res.time}</span></td>
                  <td>{res.tableNumber || <span className="text-muted">—</span>}</td>
                  <td>{res.pax}</td>
                  <td className="reservation-qr-cell">
                    {qrUrl ? (
                      <img src={qrUrl} alt={`QR code for ${res.id}`} />
                    ) : (
                      <span className="lock-badge">Hold</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${res.status.toLowerCase()}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>
                    {res.isLockEntry ? (
                      <button className="btn-danger btn-sm" onClick={() => releaseTable({ id: res.tableId })}>
                        Release Lock
                      </button>
                    ) : (
                      <button className="btn-outline btn-sm" onClick={() => setSelectedRes(res)}>
                        Manage
                      </button>
                    )}
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
    </div>
  </div>
  </div>
  );
};

export default Admin;
