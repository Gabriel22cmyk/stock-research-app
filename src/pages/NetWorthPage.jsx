import React, { useEffect, useState } from 'react';
import { fetchPortfolio, fetchProperties } from '../lib/supabaseClient';
import '../styles/Portfolio.css';

const NetWorthPage = () => {
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
  const totalNetWorth = totalInvestments + totalPropertyEquity;
  const totalProfit = portfolio.reduce((sum, item) => sum + (item.profit_loss || 0), 0);

  if (loading) {
    return (
      <div className="portfolio-container">
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>Loading net worth...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <h1>NET WORTH</h1>
        <p>Your total wealth at a glance</p>
      </header>

      <div className="net-worth-card">
        <h2>TOTAL NET WORTH</h2>
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
    </div>
  );
};

export default NetWorthPage;
