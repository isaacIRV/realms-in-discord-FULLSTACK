import React from 'react';
import Navbar from './Navbar_home';
import background from '../background/home_background.png';
const Home = () => {
  return (
<<<<<<< Updated upstream
    
    <div>
       
      <Navbar />
       <img src={background} alt="Background" style={{ width: '100%', height: 'auto' }} />
=======
    <div className='home-container'>
      <Navbar currentUser={currentUser} onLogout={onLogout}/>
      <img src={background} alt="Background" style={{ width: '100%', height: 'auto' }} />
    
      <p></p>
>>>>>>> Stashed changes
    </div>
  );
};
export default Home;