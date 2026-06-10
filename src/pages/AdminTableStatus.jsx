import { useEffect } from 'react';

const AdminTableStatus = () => {
  useEffect(() => {
    window.location.replace('/' + 'AdminTableStatus.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to AdminTableStatus.html…</h1>
      <p>If nothing happens, <a href="/AdminTableStatus.html">click here</a>.</p>
    </div>
  );
};

export default AdminTableStatus;
