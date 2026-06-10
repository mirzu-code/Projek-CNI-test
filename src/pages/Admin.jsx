import { useEffect } from 'react';

const Admin = () => {
  useEffect(() => {
    window.location.replace('/' + 'Admin.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to Admin.html…</h1>
      <p>If nothing happens, <a href="/Admin.html">click here</a>.</p>
    </div>
  );
};

export default Admin;
