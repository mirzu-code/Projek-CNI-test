import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ni betul
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [step, setStep] = useState(1);
  const [adminId, setAdminId] = useState('');
  const [email, setEmail] = useState(''); // store email found by admin_id
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Step 1: lookup admin_id and get associated email
  const handleCheckAdminId = async () => {
    if (!adminId) return alert('Sila masukkan Admin ID');

    const { data, error } = await supabase
      .from('admin_user')
      .select('email')
      .eq('admin_id', adminId)
      .single();

    if (error || !data) {
      alert('Admin ID tidak dijumpai.');
      return;
    }

    setEmail(data.email);
    setStep(2);
  };

  // Langkah 2: Login
  const handleLogin = async () => {
    if (!password) return alert('Sila masukkan kata laluan');

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert('Gagal log masuk: ' + error.message);
    } else {
      navigate('/admin-dashboard');
    }
  };

  return (
    <div className="login-container">
      {step === 1 ? (
        <div>
              <h2>Log Masuk Admin</h2>
              <input 
                placeholder="Masukkan Admin ID" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)} 
              />
              <button onClick={handleCheckAdminId}>Seterusnya</button>
        </div>
      ) : (
        <div>
          <h2>Masukkan Kata Laluan</h2>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Masuk sebagai: {adminId}</p>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button onClick={handleLogin}>Log Masuk</button>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;