import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ni betul
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [step, setStep] = useState(1);
  const [adminId, setAdminId] = useState('');
  const [email, setEmail] = useState(''); // Untuk simpan email hasil carian
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Langkah 1: Semak ID Admin
  const handleCheckId = async () => {
    const { data, error } = await supabase
      .from('admin_user') // Nama table anda
      .select('email')
      .eq('admin_id', adminId)
      .single();

    if (data) {
      setEmail(data.email);
      setStep(2);
    } else {
      alert("ID Admin tidak sah.");
    }
  };

  // Langkah 2: Login
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Password salah!");
    } else {
      navigate('/admin-dashboard'); // Tukar ke path dashboard anda
    }
  };

  return (
    <div className="login-container">
      {step === 1 ? (
        <div>
          <h2>Log Masuk Admin</h2>
          <input 
            placeholder="Masukkan Admin ID" 
            onChange={(e) => setAdminId(e.target.value)} 
          />
          <button onClick={handleCheckId}>Seterusnya</button>
        </div>
      ) : (
        <div>
          <h2>Masukkan Kata Laluan</h2>
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button onClick={handleLogin}>Log Masuk</button>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;