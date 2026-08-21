import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProperties } from '../lib/supabaseClient';
import '../styles/Portfolio.css';

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const propertiesData = await fetchProperties();
      setProperties(propertiesData);
      setLoading(false);
    };
    loadData();
  }, []);

  const totalPropertyValue = properties.reduce((sum, p) => sum + (p.current_value || 0), 0);
  const totalPropertyEquity = properties.reduce((sum, p) => sum + (p.equity || 0), 0);
  const totalMortgage = properties.reduce((sum, p) => sum + (p.mortgage_remaining || 0), 0);

  if (loading) {
    return (
      <div className="portfolio-container">
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <h1>PROPERTIES</h1>
        <p>Your property portfolio</p>
      </header>

      <div className="portfolio-section">
        <div className="property-summary">
          <div className="property-stat">
            <span className="stat-label">Properties</span>
            <span className="stat-value">{properties.length}</span>
          </div>
          <div className="property-stat">
            <span className="stat-label">Total Value</span>
            <span className="stat-value">£{totalPropertyValue.toLocaleString('en-GB')}</span>
          </div>
          <div className="property-stat">
            <span className="stat-label">Total Equity</span>
            <span className="stat-value">£{totalPropertyEquity.toLocaleString('en-GB')}</span>
          </div>
          {totalMortgage > 0 && (
            <div className="property-stat">
              <span className="stat-label">Mortgage</span>
              <span className="stat-value mortgage">£{totalMortgage.toLocaleString('en-GB')}</span>
            </div>
          )}
        </div>

        <div className="portfolio-grid">
          {properties.map(prop => (
            <div key={prop.id} className="property-card" onClick={() => navigate(`/property/${prop.id}`)} style={{ cursor: 'pointer' }}>
              <div className="property-card-header">
                <h4>{prop.property_name}</h4>
                {prop.owned_outright && <span className="owned-badge">OWNED OUTRIGHT</span>}
              </div>

              {prop.location && (
                <div className="property-location">
                  📍 {prop.location}
                </div>
              )}

              <div className="property-quick-stats">
                <div className="quick-stat">
                  <span className="quick-label">Value</span>
                  <span className="quick-value">£{prop.current_value?.toLocaleString('en-GB')}</span>
                </div>
                <div className="quick-stat">
                  <span className="quick-label">Equity</span>
                  <span className="quick-value">£{prop.equity?.toLocaleString('en-GB')}</span>
                </div>
              </div>

              <p className="property-click-hint">View details →</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
