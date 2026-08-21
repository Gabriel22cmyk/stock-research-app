import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPortfolio, fetchProperties } from '../lib/supabaseClient';
import '../styles/Portfolio.css';

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [portfolioData, propertiesData] = await Promise.all([
        fetchPortfolio(),
        fetchProperties()
      ]);
      setPortfolio(portfolioData);
      setProperties(propertiesData);
      setLoading(false);
    };
    loadData();
  }, []);

  const totalPropertyEquity = properties.reduce((sum, p) => sum + (p.equity || 0), 0);
  const totalPropertyValue = properties.reduce((sum, p) => sum + (p.current_value || 0), 0);
  const totalMortgage = properties.reduce((sum, p) => sum + (p.mortgage_remaining || 0), 0);

  if (loading) {
    return (
      <div className="portfolio-container">
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <h1>PORTFOLIO</h1>
        <p>Your investments and property</p>
      </header>

      {/* Investments Section */}
      <div className="portfolio-section">
        <h3>INVESTMENTS</h3>
        <div className="portfolio-grid">
          {portfolio.map(item => (
            <div key={item.id} className="portfolio-card">
              <div className="portfolio-card-header">
                <div>
                  <h4>{item.asset_name}</h4>
                  <span className="asset-type">{item.asset_type}</span>
                </div>
                <span className="platform-badge">{item.platform}</span>
              </div>

              <div className="portfolio-value">
                <span className="currency">{item.currency === 'GBP' ? '£' : '$'}</span>
                <span className="amount">{item.current_value?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>

              {item.profit_loss != null && (
                <div className={`portfolio-pl ${item.profit_loss >= 0 ? 'positive' : 'negative'}`}>
                  <span className="pl-amount">
                    {item.profit_loss >= 0 ? '+' : ''}£{item.profit_loss?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="pl-pct">
                    ({item.profit_loss_pct >= 0 ? '+' : ''}{item.profit_loss_pct}%)
                  </span>
                </div>
              )}

              {item.notes && <p className="portfolio-notes">{item.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Properties Section */}
      <div className="portfolio-section">
        <h3>PROPERTY</h3>
        <div className="property-summary">
          <div className="property-stat">
            <span className="stat-label">Total Value</span>
            <span className="stat-value">£{totalPropertyValue.toLocaleString('en-GB')}</span>
          </div>
          <div className="property-stat">
            <span className="stat-label">Total Equity</span>
            <span className="stat-value">£{totalPropertyEquity.toLocaleString('en-GB')}</span>
          </div>
          <div className="property-stat">
            <span className="stat-label">Mortgage</span>
            <span className="stat-value mortgage">£{totalMortgage.toLocaleString('en-GB')}</span>
          </div>
        </div>

        <div className="portfolio-grid">
          {properties.map(prop => (
            <div key={prop.id} className="property-card" onClick={() => navigate(`/property/${prop.id}`)} style={{ cursor: 'pointer' }}>
              <div className="property-card-header">
                <h4>{prop.property_name}</h4>
                {prop.owned_outright && <span className="owned-badge">OWNED OUTRIGHT</span>}
              </div>

              <div className="property-details">
                <div className="property-row">
                  <span>Value</span>
                  <span className="property-amount">£{prop.current_value?.toLocaleString('en-GB')}</span>
                </div>
                <div className="property-row">
                  <span>Equity</span>
                  <span className="property-amount equity">£{prop.equity?.toLocaleString('en-GB')}</span>
                </div>
                {prop.mortgage_remaining > 0 && (
                  <div className="property-row">
                    <span>Mortgage</span>
                    <span className="property-amount mortgage">-£{prop.mortgage_remaining?.toLocaleString('en-GB')}</span>
                  </div>
                )}
              </div>

              {prop.notes && <p className="property-notes">{prop.notes}</p>}
              <p className="property-click-hint">Click for details →</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
