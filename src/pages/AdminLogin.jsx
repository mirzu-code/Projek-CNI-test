import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ni betul
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [email, setEmail] = useState(''); // store email found by admin_id (for debug)
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Single-step: lookup admin_id/username then sign in with its email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmail('');

    const id = (adminId || '').trim();
    if (!id) return setError('Sila masukkan username atau Admin ID');
    if (!password) return setError('Sila masukkan kata laluan');

    setLoading(true);
    try {
      // Try exact admin_id match
      let res = await supabase.from('admin_user').select('email').eq('admin_id', id).limit(1);
      if (res.error) {
        setLoading(false);
        setError('DB lookup error: ' + res.error.message);
        return;
      }
      let emailFound = res.data && res.data.length ? res.data[0].email : null;

      // If not found, try case-insensitive match using ilike
      if (!emailFound) {
        const res2 = await supabase.from('admin_user').select('email').ilike('admin_id', id).limit(1);
        if (res2.error) {
          setLoading(false);
          setError('DB lookup error: ' + res2.error.message);
          return;
        }
        if (res2.data && res2.data.length) emailFound = res2.data[0].email;
      }

      // If still not found, try `username` column as fallback
      if (!emailFound) {
        const res3 = await supabase.from('admin_user').select('email').eq('username', id).limit(1);
        if (res3.error) {
          setLoading(false);
          setError('DB lookup error: ' + res3.error.message);
          return;
        }
        if (res3.data && res3.data.length) emailFound = res3.data[0].email;
      }

      if (!emailFound) {
        setError('Akaun admin tidak dijumpai. Sila semak username/Admin ID.');
        setLoading(false);
        return;
      }

      setEmail(emailFound);

      // attempt sign-in
      const { error: signErr } = await supabase.auth.signInWithPassword({ email: emailFound, password });
      setLoading(false);

      if (signErr) {
        setError('Gagal log masuk: ' + (signErr.message || 'unknown'));
        return;
      }

      navigate('/admin-dashboard');
    } catch (err) {
      setLoading(false);
      setError('Ralat pelayan: ' + (err.message || 'unknown'));
    }
  };

  return (
    <div className="admin-login-wrapper animate-fade-in">
      <div className="admin-login-card">
        <div className="login-icon">🔒</div>
        <form onSubmit={handleSubmit}>
          <h2>Log Masuk Admin</h2>
          <p className="text-muted">Masukkan username (atau Admin ID) dan kata laluan anda</p>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <input
              placeholder="Username / Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Kata Laluan"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* show resolved email for debugging (optional) */}
          {email && (
            <div style={{ marginBottom: '0.5rem' }}>
              <input value={email} readOnly style={{ width: '100%', background: '#f4f4f4', borderRadius: '6px', padding: '0.6rem' }} />
            </div>
          )}

          <button type="submit" className="btn-primary full-width mt-2" disabled={loading}>
            {loading ? 'Memproses...' : 'Log Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;