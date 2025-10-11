import React from 'react';
import Navbar from './Navbar_home';
import background from '../background/home_background.png';

const Home = ({currentUser, onLogout}) => {
  return (
    <div className='home-container'>
      <Navbar currentUser={currentUser} onLogout={onLogout}/>
      <img src={background} alt="Background" style={{ width: '100%', height: 'auto' }} />
      <h1>Bienvenido, {currentUser}!</h1>
      <p></p>
    </div>
  );
};
export default Home;

