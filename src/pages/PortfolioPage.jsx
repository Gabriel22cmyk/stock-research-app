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
  const totalMonthlyIncome = properties.reduce((sum, p) => sum + (p.monthly_income || 0), 0);
  const totalMonthlyMortgage = properties.reduce((sum, p) => sum + (p.monthly_mortgage || 0), 0);

  if (loading) {
    return (
      <div className="portfolio-container">
        <p className="loading-text">Loading properties…</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <h1>PROPERTIES</h1>
        <p>Your property portfolio</p>
      </header>

      <div className="summary-grid">
        <div className="summary-tile">
          <span className="summary-label">Properties</span>
          <span className="summary-value">{properties.length}</span>
        </div>
        <div className="summary-tile">
          <span className="summary-label">Total Value</span>
          <span className="summary-value">£{totalPropertyValue.toLocaleString('en-GB')}</span>
        </div>
        <div className="summary-tile">
          <span className="summary-label">Total Equity</span>
          <span className="summary-value">£{totalPropertyEquity.toLocaleString('en-GB')}</span>
        </div>
        <div className="summary-tile">
          <span className="summary-label">Monthly Income</span>
          <span className="summary-value income">£{totalMonthlyIncome.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
        </div>
        {totalMonthlyMortgage > 0 && (
          <div className="summary-tile">
            <span className="summary-label">Monthly Mortgage</span>
            <span className="summary-value mortgage">£{totalMonthlyMortgage.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        {totalMortgage > 0 && (
          <div className="summary-tile">
            <span className="summary-label">Total Mortgage</span>
            <span className="summary-value mortgage">£{totalMortgage.toLocaleString('en-GB')}</span>
          </div>
        )}
      </div>

      <div className="properties-grid">
        {properties.map(prop => (
          <button
            key={prop.id}
            className="property-tile"
            onClick={() => navigate(`/property/${prop.id}`)}
          >
            <div className="property-tile-top">
              <h2>{prop.property_name}</h2>
              {prop.owned_outright && <span className="owned-pill">OWNED</span>}
            </div>
            {prop.location && (
              <p className="property-tile-location">📍 {prop.location}</p>
            )}
            <div className="property-tile-arrow">View details →</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
