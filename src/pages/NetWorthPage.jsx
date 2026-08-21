import React, { useEffect, useState } from 'react';
import { fetchProperties } from '../lib/supabaseClient';
import '../styles/Portfolio.css';

const NetWorthPage = () => {
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

  const totalPropertyEquity = properties.reduce((sum, p) => sum + (p.equity || 0), 0);
  const totalPropertyValue = properties.reduce((sum, p) => sum + (p.current_value || 0), 0);
  const totalMortgage = properties.reduce((sum, p) => sum + (p.mortgage_remaining || 0), 0);
  const monthlyIncome = properties.reduce((sum, p) => sum + (p.monthly_income || 0), 0);
  const monthlyMortgage = properties.reduce((sum, p) => sum + (p.monthly_mortgage || 0), 0);
  const netMonthly = monthlyIncome - monthlyMortgage;
  const annualNet = netMonthly * 12;

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
        <p>Your property wealth at a glance</p>
      </header>

      <div className="net-worth-card">
        <h2>TOTAL EQUITY</h2>
        <div className="net-worth-amount">£{totalPropertyEquity.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
        <div className="net-worth-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Portfolio Value</span>
            <span className="breakdown-value">£{totalPropertyValue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
          </div>
          {totalMortgage > 0 && (
            <div className="breakdown-item">
              <span className="breakdown-label">Total Mortgage</span>
              <span className="breakdown-value loss">£{totalMortgage.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="breakdown-item">
            <span className="breakdown-label">Annual Net Profit</span>
            <span className={`breakdown-value ${annualNet >= 0 ? 'profit' : 'loss'}`}>
              {annualNet >= 0 ? '+' : ''}£{annualNet.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="portfolio-section">
        <h3>MONTHLY CASHFLOW</h3>
        <div className="property-summary">
          <div className="property-stat">
            <span className="stat-label">Rental Income</span>
            <span className="stat-value" style={{ color: '#10b981' }}>+£{monthlyIncome.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
          </div>
          {monthlyMortgage > 0 && (
            <div className="property-stat">
              <span className="stat-label">Mortgage Out</span>
              <span className="stat-value mortgage">-£{monthlyMortgage.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="property-stat">
            <span className="stat-label">Net Monthly</span>
            <span className="stat-value" style={{ color: netMonthly >= 0 ? '#60a5fa' : '#ef4444' }}>
              {netMonthly >= 0 ? '+' : ''}£{netMonthly.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetWorthPage;
