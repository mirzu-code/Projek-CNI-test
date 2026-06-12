import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../supabaseClient';
import './Admin.css';

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
    if (isPortraitMobile()) setIsSidePanelOpen(false);
  };

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
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [expandedCuisine, setExpandedCuisine] = useState('1');
  const imageFileInputRef = useRef(null);

  const cuisineOptions = [
    { value: '1', label: 'Malay' },
    { value: '2', label: 'Chinese' },
    { value: '3', label: 'Japanese' },
    { value: '4', label: 'Western' },
    { value: '5', label: 'Indian' },
    { value: '6', label: 'Dessert / Kuih' }
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

  const handleUpdateStatus = async (resId, newStatus) => {
    try {
      const res = reservations.find(r => r.id === resId);
      if (!res) return;
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', res.recordId);
      if (error) throw error;
    } catch (err) {
      console.warn('Status update failed:', err.message);
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
    setMenuForm({
      id: menu.id,
      name: menu.name || '',
      price: menu.price != null ? String(menu.price) : '',
      cuisine_id: menu.cuisine_id != null ? String(menu.cuisine_id) : '1',
      description: menu.description || '',
      image: menu.image || '',
      is_active: menu.is_active !== false
    });
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

  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'image' && !selectedImageFile) {
      setImagePreviewUrl(value);
    }
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    setMenuForm({
      id: menu.id,
      name: menu.name || '',
      price: menu.price != null ? String(menu.price) : '',
      cuisine_id: menu.cuisine_id != null ? String(menu.cuisine_id) : '1',
      description: menu.description || '',
      image: menu.image || '',
      is_active: menu.is_active !== false
    });
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
                        <td>{r.status}</td>
                        <td>
                          {r.status !== 'Checked In' && (
                            <button onClick={() => handleUpdateStatus(r.id, 'Checked In')} className="btn-small">Check In</button>
                          )}
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
                {scannerSuccessRes && (
                  <div className={`scanner-result ${scannerError ? 'error' : 'success'}`}>
                    <strong>{scannerSuccessRes.name}</strong>
                    <p>Table: {scannerSuccessRes.tableNumber}</p>
                    <p>Guests: {scannerSuccessRes.pax}</p>
                  </div>
                )}
              </section>
            )}

            {activeSection === 'tables' && (
              <section className="admin-tables">
                <h2>Table Status</h2>
                <div className="tables-grid">
                  {TABLES.map(table => {
                    const isLocked = tableLocks.some(lock => lock.table_id === table.id);
                    const booking = reservations.find(r => r.tableId === table.id);
                    return (
                      <div key={table.id} className={`table-card ${isLocked ? 'locked' : ''} ${booking ? 'booked' : ''}`}>
                        <h4>{table.name}</h4>
                        <p>Seats: {table.seats}</p>
                        {booking && <p className="booking-name">{booking.name}</p>}
                        {isLocked && <p className="locked-label">LOCKED (1.5h)</p>}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {activeSection === 'menus' && (
              <section className="admin-menus">
                <h2>Menus</h2>
                <div className="menus-grid">
                  {menus.map(m => (
                    <div key={m.id} className="menu-card">
                      <img src={m.image || 'https://via.placeholder.com/150?text=No+Image'} alt={m.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      <h3>{m.name}</h3>
                      <p>Price: RM{m.price}</p>
                      <button onClick={() => handleEditMenu(m)}>Edit</button>
                    </div>
                  ))}
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
