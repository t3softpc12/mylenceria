// src/pages/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // adjust path
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, logout } = useAuth(); // assuming you have logout in AuthContext
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout(); // clear auth
      toast.success('Logged out successfully');
      navigate('/mylenceriaadmin');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/admin-dashboard' },
    { name: 'Hero Carousel', icon: '🖼️', path: '/admin-dashboard/hero' },
    { name: 'Category Carousel', icon: '🔄', path: '/admin-dashboard/category-carousel' },
    { name: 'Category Cards', icon: '📦', path: '/admin-dashboard/category-cards' },
    { name: 'Products', icon: '👗', path: '/admin-dashboard/products' },
    { name: 'Orders', icon: '📋', path: '/admin-dashboard/orders' },
    { name: 'Users', icon: '👥', path: '/admin-dashboard/users' },
    { name: 'Settings', icon: '⚙️', path: '/admin-dashboard/settings' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f4f4', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '260px' : '70px',
          background: '#000',
          color: 'white',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
        }}
      >
        {/* Logo & Toggle */}
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '22px', opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.3s' }}>
            MyLenceria
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ marginTop: '30px' }}>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                color: 'white',
                textDecoration: 'none',
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.background = '#333')}
              onMouseLeave={(e) => (e.target.style.background = 'transparent')}
            >
              <span style={{ fontSize: '24px', marginRight: sidebarOpen ? '15px' : '0' }}>{item.icon}</span>
              <span style={{ opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.3s' }}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px 20px',
              background: 'none',
              border: 'none',
              color: '#ff4444',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '24px', marginRight: sidebarOpen ? '15px' : '0' }}>🚪</span>
            <span style={{ opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.3s' }}>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Header */}
        <header style={{ background: 'white', padding: '20px 40px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#000' }}>Admin Dashboard</h1>
            <div style={{ color: '#555' }}>
              Welcome back, <strong>{user?.email || 'Admin'}</strong>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
          <div style={cardStyle('Total Products', '248', '#e91e63')}>
            <span style={{ fontSize: '48px' }}>👗</span>
          </div>
          <div style={cardStyle('Pending Orders', '12', '#ff9800')}>
            <span style={{ fontSize: '48px' }}>🛍️</span>
          </div>
          <div style={cardStyle('Total Users', '1,842', '#4caf50')}>
            <span style={{ fontSize: '48px' }}>👥</span>
          </div>
          <div style={cardStyle('Revenue Today', '₹45,200', '#2196f3')}>
            <span style={{ fontSize: '48px' }}>💰</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '0 40px 40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <Link to="/admin-dashboard/hero" style={actionCard('Manage Hero Carousel', 'Update main banner slides')}>
              🖼️
            </Link>
            <Link to="/admin-dashboard/category-carousel" style={actionCard('Manage Category Carousel', 'Edit rotating categories')}>
              🔄
            </Link>
            <Link to="/admin-dashboard/category-cards" style={actionCard('Manage Category Cards', 'Update featured collections')}>
              📦
            </Link>
            <Link to="/admin-dashboard/products" style={actionCard('Add New Product', 'Upload new lingerie items')}>
              ➕
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper styles
const cardStyle = (title, value, color) => ({
  background: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  textAlign: 'center',
});

const actionCard = (title, desc) => ({
  background: 'white',
  padding: '25px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  textDecoration: 'none',
  color: '#333',
  transition: 'transform 0.2s',
  display: 'block',
});

export default AdminDashboard;