import { useEffect } from 'react';

const Checkout = () => {
  useEffect(() => {
    window.location.replace('/' + 'Checkout.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to Checkout.html…</h1>
      <p>If nothing happens, <a href="/Checkout.html">click here</a>.</p>
    </div>
  );
};

export default Checkout;
