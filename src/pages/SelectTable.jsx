import { useEffect } from 'react';

const SelectTable = () => {
  useEffect(() => {
    window.location.replace('/' + 'select-table.html');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to select-table.html…</h1>
      <p>If nothing happens, <a href="/select-table.html">click here</a>.</p>
    </div>
  );
};

export default SelectTable;
