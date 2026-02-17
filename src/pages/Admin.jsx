// src/pages/Admin.jsx
import React, { useState } from 'react';
import logo from '../assets/logo.svg'; // Adjust path to your MyLenceria logo
import AdminLogin from '../components/AdminComponents/AdminLogin';

const Admin = () => {
  const [showLogin, setShowLogin] = useState(false);

  // If login is clicked, show the login form
  if (showLogin) {
    return <AdminLogin />;
  }

  // Intro screen with logo and arrow
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #000000, #1a1a1a)', // Dark elegant background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
        paddingTop: '0px',
      }}
    >
      {/* Logo */}
      <img
        src={logo}
        alt="MyLenceria Admin"
        style={{
          width: '220px',
          maxWidth: '80vw',
          marginBottom: '60px',
          filter: 'drop-shadow(0 4px 10px rgba(255,255,255,0.2))',
        }}
      />

      {/* Welcome Text */}
      <h2 style={{ fontSize: '28px', marginBottom: '40px', opacity: 0.9 }}>
        Admin Portal
      </h2>

      {/* Arrow / Enter Button */}
      <button
        onClick={() => setShowLogin(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          animation: 'pulse 2s infinite',
        }}
      >
        <div
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            transition: 'transform 0.3s ease',
            color: 'grey',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'translateX(10px)')}
          onMouseLeave={(e) => (e.target.style.transform = 'translateX(0)')}
        >
          →
        </div>
      </button>

      {/* Optional subtle text */}
      <p style={{ position: 'absolute', bottom: '30px', fontSize: '14px', opacity: 0.6 }}>
        Authorized access only
      </p>

      {/* Simple pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default Admin;