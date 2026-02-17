// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import NavBar from '../components/NavBar';
import ValidateUser from '../components/ValidateUser';
import React from 'react';

const MainLayout = () => {

  const profileRef = React.useRef();
  return (
    <>
    <div style={{paddingTop:"15vh"}}>
      <NavBar />
      <Outlet />  {/* This renders the page content (Home, Shop, etc.) */}
      <ToastContainer />
      <Footer />
      </div>

      <ValidateUser ref={profileRef} />
    </>
  );
};

export default MainLayout;