import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    window.location.replace('/' + 'Home.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to Home.html…</h1>
      <p>If nothing happens, <a href="/Home.html">click here</a>.</p>
    </div>
  );
};

export default Home;
