import { useEffect } from 'react';

const WesternCuisine = () => {
  useEffect(() => {
    window.location.replace('/' + 'WesternCuisine.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to WesternCuisine.html…</h1>
      <p>If nothing happens, <a href="/WesternCuisine.html">click here</a>.</p>
    </div>
  );
};

export default WesternCuisine;
