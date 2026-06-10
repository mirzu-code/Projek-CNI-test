import { useEffect } from 'react';

const MyBooking = () => {
  useEffect(() => {
    window.location.replace('/' + 'MyBooking.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to MyBooking.html…</h1>
      <p>If nothing happens, <a href="/MyBooking.html">click here</a>.</p>
    </div>
  );
};

export default MyBooking;
