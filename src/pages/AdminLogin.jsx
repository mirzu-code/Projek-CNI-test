import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ni betul
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [step, setStep] = useState(1);
  const [adminId, setAdminId] = useState('');
  const [email, setEmail] = useState(''); // store email found by admin_id
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: lookup admin_id and get associated email
  const handleCheckAdminId = async () => {
    setError('');
    if (!adminId) return setError('Sila masukkan Admin ID');

    setLoading(true);
    const { data, error } = await supabase
      .from('admin_user')
      .select('email')
      .eq('admin_id', adminId)
      .single();

    setLoading(false);
    if (error || !data) {
      setError('Admin ID tidak dijumpai.');
      return;
    }

    setEmail(data.email);
    setStep(2);
  };

  // Langkah 2: Login
  const handleLogin = async () => {
    setError('');
    if (!password) return setError('Sila masukkan kata laluan');

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false);

    if (error) {
      setError('Gagal log masuk: ' + (error.message || 'Unknown error'));
    } else {
      navigate('/admin-dashboard');
    }
  };

  return (
    <div className="admin-login-wrapper animate-fade-in">
      <div className="admin-login-card">
        <div className="login-icon">🔒</div>
        {step === 1 ? (
          <form onSubmit={(e) => { e.preventDefault(); handleCheckAdminId(); }}>
            <h2>Log Masuk Admin</h2>
            <p className="text-muted">Masukkan Admin ID anda untuk meneruskan</p>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <input
                placeholder="Masukkan Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary full-width mt-2" disabled={loading}>
              {loading ? 'Memeriksa...' : 'Seterusnya'}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <h2>Masukkan Kata Laluan</h2>
            <p className="text-muted">Masuk sebagai: {adminId}</p>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn-outline" onClick={() => { setStep(1); setPassword(''); setError(''); }}>
                Kembali
              </button>
              <button type="submit" className="btn-primary full-width mt-2" disabled={loading}>
                {loading ? 'Log masuk...' : 'Log Masuk'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;