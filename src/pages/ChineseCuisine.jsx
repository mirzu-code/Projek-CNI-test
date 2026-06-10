import { useEffect } from 'react';

const ChineseCuisine = () => {
  useEffect(() => {
    window.location.replace('/' + 'ChineseCuisine.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to ChineseCuisine.html…</h1>
      <p>If nothing happens, <a href="/ChineseCuisine.html">click here</a>.</p>
    </div>
  );
};

export default ChineseCuisine;
