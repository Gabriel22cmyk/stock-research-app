import React, { useEffect, useState } from 'react';
import { fetchPortfolio, fetchProperties } from '../lib/supabaseClient';
import '../styles/Portfolio.css';

const PortfolioPage = () => {
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

  const totalInvestments = portfolio.reduce((sum, item) => {
    if (item.currency === 'GBP') return sum + (item.current_value || 0);
    return sum + ((item.current_value || 0) * 0.79); // rough USD to GBP
  }, 0);

  const totalPropertyEquity = properties.reduce((sum, p) => sum + (p.equity || 0), 0);
  const totalPropertyValue = properties.reduce((sum, p) => sum + (p.current_value || 0), 0);
  const totalMortgage = properties.reduce((sum, p) => sum + (p.mortgage_remaining || 0), 0);
  const totalNetWorth = totalInvestments + totalPropertyEquity;

  const totalProfit = portfolio.reduce((sum, item) => sum + (item.profit_loss || 0), 0);

  if (loading) {
    return (
      <div className="portfolio-container">
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Net Worth Summary */}
      <div className="net-worth-card">
        <h2>NET WORTH</h2>
        <div className="net-worth-amount">£{totalNetWorth.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
        <div className="net-worth-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Investments</span>
            <span className="breakdown-value">£{totalInvestments.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Property Equity</span>
            <span className="breakdown-value">£{totalPropertyEquity.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Total Profit</span>
            <span className={`breakdown-value ${totalProfit >= 0 ? 'profit' : 'loss'}`}>
              {totalProfit >= 0 ? '+' : ''}£{totalProfit.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

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
            <div key={prop.id} className="property-card">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
