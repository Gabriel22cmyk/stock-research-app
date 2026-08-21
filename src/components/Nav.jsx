import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import './Nav.css';

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const tabs = [
    { label: 'Properties', path: '/', icon: '🏠' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="main-nav">
      <div className="nav-logo" onClick={() => navigate('/')}>
        <span className="logo-text">PROPERTY</span>
        <span className="logo-sub">by Cayde</span>
      </div>
      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.path}
            className={`nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
        {user && (
          <button className="nav-signout" onClick={handleSignOut} title={user.email}>
            <span className="tab-icon">🚪</span>
            <span className="tab-label">Sign out</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
