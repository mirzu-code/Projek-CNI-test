import { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    window.location.replace('/' + 'About.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to About.html…</h1>
      <p>If nothing happens, <a href="/About.html">click here</a>.</p>
    </div>
  );
};

export default About;
