import React, { useState, useContext, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import Navbar from './../Components/Navbar'; // Asegúrate de tener el componente Navbar
import Sidebar from './../Components/Sidebar';
import Footer from './../Components/Footer';  // Asegúrate de tener el componente Footer


const restaurantLayout = ({ children }) => {
 

  return (
    <div className="" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar /> {/* El Navbar se incluye al inicio */}
      <Sidebar/>
      <div className='container p-5 pt-[100px] sm:pt-[120px] md:pt-[140px] max-w-full' style={{ flex: 1 } }>
        <Outlet />
      </div>
     
    </div>
  );
};

export default restaurantLayout;
