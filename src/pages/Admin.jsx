import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState([]);
  const [selectedRes, setSelectedRes] = useState(null); // for managing a specific booking

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

  const handleScanVerify = (scanId) => {
    if (!scanId) return;
    setIsScanning(true);
    setScannerError(false);
    setScannerSuccessRes(null);
    setScannerMessage('SCANNING TICKET CODE IN REAL-TIME...');

    setTimeout(() => {
      // Use the ref so the closure always has the latest reservations
      const match = reservationsRef.current.find(res => res.id.toLowerCase() === scanId.trim().toLowerCase());
      setIsScanning(false);
      
      if (match) {
        if (match.status === 'Checked In') {
          playScanChime(false);
          setScannerError(true);
          setScannerMessage(`ALREADY CHECKED IN: ${match.id} - ${match.name}`);
        } else {
          // Success! Check-in!
          playScanChime(true);
          setScannerSuccessRes(match);
          setScannerMessage(`VERIFICATION SUCCESSFUL: Welcome ${match.name}!`);
          
          // Update status in bookings array
          const updated = reservationsRef.current.map(res => 
            res.id === match.id ? { ...res, status: 'Checked In' } : res
          );
          setReservations(updated);
          localStorage.setItem('allBookings', JSON.stringify(updated));

          // Sync with active customer booking
          const active = localStorage.getItem('activeBooking');
          if (active) {
            const activeObj = JSON.parse(active);
            if (activeObj.id === match.id) {
              activeObj.status = 'Checked In';
              localStorage.setItem('activeBooking', JSON.stringify(activeObj));
            }
          }
        }
      } else {
        // Not found
        playScanChime(false);
        setScannerError(true);
        setScannerMessage(`INVALID TICKET CODE: "${scanId.toUpperCase()}" NOT FOUND`);
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

  useEffect(() => {
    // Load bookings from localStorage
    const saved = localStorage.getItem('allBookings');
    if (saved) {
      setReservations(JSON.parse(saved));
    } else {
      // Initialize with default mock data
      localStorage.setItem('allBookings', JSON.stringify(defaultReservations));
      setReservations(defaultReservations);
    }
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

  const handleUpdateStatus = (id, newStatus) => {
    const updated = reservations.map(res => 
      res.id === id ? { ...res, status: newStatus } : res
    );
    setReservations(updated);
    localStorage.setItem('allBookings', JSON.stringify(updated));
    setSelectedRes(null);

    // If the updated booking matches the user's active booking in localStorage, update that too
    const active = localStorage.getItem('activeBooking');
    if (active) {
      const activeObj = JSON.parse(active);
      if (activeObj.id === id) {
        activeObj.status = newStatus;
        localStorage.setItem('activeBooking', JSON.stringify(activeObj));
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      const updated = reservations.filter(res => res.id !== id);
      setReservations(updated);
      localStorage.setItem('allBookings', JSON.stringify(updated));
      setSelectedRes(null);

      const active = localStorage.getItem('activeBooking');
      if (active) {
        const activeObj = JSON.parse(active);
        if (activeObj.id === id) {
          localStorage.removeItem('activeBooking');
        }
      }
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
        <div className="admin-container">
          <h2>Restaurant Management Dashboard</h2>
          <p>SDG 9 Initiative: Digital Capacity & Resource Planning</p>
          <button className="btn-outline btn-logout" onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      </div>
      
      <div className="admin-container mt-4">
        <div className="dashboard-stats">
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

        {/* Entrance Gate QR Scanner Panel */}
        <div className="scanner-section-container animate-fade-in">
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

        {/* Action Panel for selected booking */}
        {selectedRes && (
          <div className="action-panel animate-fade-in">
            <h3>Manage Booking: {selectedRes.id}</h3>
            <p>Guest: <strong>{selectedRes.name}</strong> ({selectedRes.pax} pax)</p>
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
          <h3>Upcoming Reservations</h3>
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Date & Time</th>
                <th>Pax</th>
                <th>Pre-order (SDG 9)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id} className={selectedRes?.id === res.id ? 'active-row' : ''}>
                  <td><strong>{res.id}</strong></td>
                  <td>{res.name}</td>
                  <td>{res.date} <br/> <span className="time-badge">{res.time}</span></td>
                  <td>{res.pax}</td>
                  <td>
                    {res.preorder && res.dish ? (
                      <span className="preorder-badge">{res.dish.replace('-', ' ')}</span>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${res.status.toLowerCase()}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-outline btn-sm" onClick={() => setSelectedRes(res)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
