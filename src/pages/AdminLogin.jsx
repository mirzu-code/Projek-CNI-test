import { useEffect } from 'react';

const AdminLogin = () => {
  useEffect(() => {
    window.location.replace('/' + 'AdminLogin.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to AdminLogin.html…</h1>
      <p>If nothing happens, <a href="/AdminLogin.html">click here</a>.</p>
    </div>
  );
};

export default AdminLogin;
