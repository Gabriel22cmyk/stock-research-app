import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: 'Portfolio', path: '/', icon: '💼' },
    { label: 'Stocks', path: '/stocks', icon: '📈' },
    { label: 'Watchlist', path: '/watchlist', icon: '⭐' },
  ];

  return (
    <nav className="main-nav">
      <div className="nav-logo" onClick={() => navigate('/')}>
        <span className="logo-text">WEALTH</span>
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
      </div>
    </nav>
  );
};

export default Nav;
