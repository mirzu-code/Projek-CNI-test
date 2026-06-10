import { useEffect } from 'react';

const BookingFlow = () => {
  useEffect(() => {
    window.location.replace('/' + 'BookingFlow.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to BookingFlow.html…</h1>
      <p>If nothing happens, <a href="/BookingFlow.html">click here</a>.</p>
    </div>
  );
};

export default BookingFlow;
