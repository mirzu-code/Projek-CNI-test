import { useEffect } from 'react';

const MalayCuisine = () => {
  useEffect(() => {
    window.location.replace('/' + 'MalayCuisine.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to MalayCuisine.html…</h1>
      <p>If nothing happens, <a href="/MalayCuisine.html">click here</a>.</p>
    </div>
  );
};

export default MalayCuisine;
