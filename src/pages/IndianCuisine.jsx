import { useEffect } from 'react';

const IndianCuisine = () => {
  useEffect(() => {
    window.location.replace('/' + 'IndianCuisine.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to IndianCuisine.html…</h1>
      <p>If nothing happens, <a href="/IndianCuisine.html">click here</a>.</p>
    </div>
  );
};

export default IndianCuisine;
