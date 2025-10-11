import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ background: '#222', padding: '10px' }}>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        <li style={{ marginRight: '20px', color: '#ffffffff', cursor: 'pointer' }}>Play</li>
        <li style={{ marginRight: '20px', color: '#ffffffff', cursor: 'pointer' }}>Mazo</li>
        <li style={{ color: '#ffffffff', cursor: 'pointer' }}>Biblioteca</li>
      </ul>
    </nav>
  );
};
export default Navbar;