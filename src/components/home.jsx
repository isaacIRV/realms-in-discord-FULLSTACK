import React from 'react';
import Navbar from './Navbar_home';
import background from '../background/home_background.png';
const Home = () => {
  return (
    
    <div>
       
      <Navbar />
       <img src={background} alt="Background" style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};
export default Home;