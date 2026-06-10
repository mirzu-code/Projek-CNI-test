import { useEffect } from 'react';

const JapaneseCuisine = () => {
  useEffect(() => {
    window.location.replace('/' + 'JapaneseCuisine.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to JapaneseCuisine.html…</h1>
      <p>If nothing happens, <a href="/JapaneseCuisine.html">click here</a>.</p>
    </div>
  );
};

export default JapaneseCuisine;
