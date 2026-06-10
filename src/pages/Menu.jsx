import { useEffect } from 'react';

const Menu = () => {
  useEffect(() => {
    window.location.replace('/' + 'Menu.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to Menu.html…</h1>
      <p>If nothing happens, <a href="/Menu.html">click here</a>.</p>
    </div>
  );
};

export default Menu;
