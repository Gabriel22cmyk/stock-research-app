import React from 'react';
import './PropertyDetail.css';

const PropertyDetail = ({ property, onClose }) => {
  if (!property) return null;

  const netMonthly = (property.monthly_income || 0) - (property.monthly_mortgage || 0);
  const annualIncome = (property.monthly_income || 0) * 12;
  const annualMortgage = (property.monthly_mortgage || 0) * 12;
  const annualNet = netMonthly * 12;
  const yield_pct = property.current_value
    ? ((annualIncome / property.current_value) * 100).toFixed(2)
    : null;

  return (
    <div className="property-modal-overlay" onClick={onClose}>
      <div className="property-modal-content" onClick={e => e.stopPropagation()}>
        <button className="property-close-btn" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="property-modal-header">
          <h2>{property.property_name}</h2>
          {property.owned_outright && <span className="owned-badge-large">OWNED OUTRIGHT</span>}
          <div className="property-modal-tags">
            {property.property_type && <span className="prop-tag">🏠 {property.property_type}</span>}
            {property.bedrooms && <span className="prop-tag">🛏 {property.bedrooms} bed</span>}
            {property.location && <span className="prop-tag">📍 {property.location}</span>}
          </div>
          {(property.address || property.postcode) && (
            <div className="property-modal-address">
              {property.address && <p>{property.address}</p>}
              {property.postcode && <p className="postcode">{property.postcode}</p>}
            </div>
          )}
          {property.management_company && (
            <div className="property-modal-manager">
              <span>Managed by:</span> {property.management_company}
            </div>
          )}
        </div>

        {/* Valuation */}
        <div className="property-modal-section">
          <h3>VALUATION</h3>
          <div className="property-modal-grid">
            <div className="prop-stat-item">
              <span className="prop-stat-label">Property Value</span>
              <span className="prop-stat-value">£{property.current_value?.toLocaleString('en-GB')}</span>
            </div>
            <div className="prop-stat-item">
              <span className="prop-stat-label">Your Equity</span>
              <span className="prop-stat-value positive">£{property.equity?.toLocaleString('en-GB')}</span>
            </div>
            {property.mortgage_remaining > 0 && (
              <div className="prop-stat-item">
                <span className="prop-stat-label">Mortgage Remaining</span>
                <span className="prop-stat-value negative">£{property.mortgage_remaining?.toLocaleString('en-GB')}</span>
              </div>
            )}
            {yield_pct && (
              <div className="prop-stat-item">
                <span className="prop-stat-label">Gross Yield</span>
                <span className="prop-stat-value highlight">{yield_pct}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Cashflow */}
        <div className="property-modal-section">
          <h3>MONTHLY CASHFLOW</h3>
          <div className="cashflow-grid">
            <div className="cashflow-item income">
              <span className="cashflow-label">Rental Income</span>
              <span className="cashflow-amount">+£{(property.monthly_income || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
            {property.monthly_mortgage > 0 && (
              <div className="cashflow-item outgoing">
                <span className="cashflow-label">Mortgage Payment</span>
                <span className="cashflow-amount">-£{(property.monthly_mortgage || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className={`cashflow-item net ${netMonthly >= 0 ? 'net-positive' : 'net-negative'}`}>
              <span className="cashflow-label">Net Monthly</span>
              <span className="cashflow-amount">
                {netMonthly >= 0 ? '+' : ''}£{netMonthly.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Annual Summary */}
        <div className="property-modal-section">
          <h3>ANNUAL SUMMARY</h3>
          <div className="property-modal-grid">
            <div className="prop-stat-item">
              <span className="prop-stat-label">Annual Income</span>
              <span className="prop-stat-value positive">£{annualIncome.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
            {annualMortgage > 0 && (
              <div className="prop-stat-item">
                <span className="prop-stat-label">Annual Mortgage</span>
                <span className="prop-stat-value negative">£{annualMortgage.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="prop-stat-item">
              <span className="prop-stat-label">Annual Net Profit</span>
              <span className={`prop-stat-value ${annualNet >= 0 ? 'positive' : 'negative'}`}>
                £{annualNet.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Property Information */}
        {property.completion_date && (
          <div className="property-modal-section">
            <h3>PROPERTY INFO</h3>
            <div className="info-row">
              <span className="info-label">📅 Completion Date</span>
              <span className="info-value">{property.completion_date}</span>
            </div>
          </div>
        )}

        {/* Council Tax */}
        {property.council_tax_contact && (
          <div className="property-modal-section">
            <h3>COUNCIL TAX</h3>
            <div className="contact-block">
              <a href={`tel:${property.council_tax_contact.replace(/\s/g, '')}`} className="contact-link">
                📞 {property.council_tax_contact}
              </a>
              {property.council_tax_authority && (
                <p className="contact-note">{property.council_tax_authority}</p>
              )}
            </div>
          </div>
        )}

        {/* Utilities */}
        {(property.electricity_provider || property.gas_provider || property.water_provider) && (
          <div className="property-modal-section">
            <h3>UTILITIES</h3>
            <div className="utilities-list">
              {property.electricity_provider && (
                <div className="utility-item">
                  <div className="utility-header">
                    <span className="utility-icon">⚡</span>
                    <span className="utility-name">Electricity</span>
                  </div>
                  <div className="utility-details">
                    <p className="utility-provider">{property.electricity_provider}</p>
                    {property.electricity_serial && (
                      <p className="utility-serial">Serial: {property.electricity_serial}</p>
                    )}
                    {property.electricity_contact && (
                      <a href={`tel:${property.electricity_contact.replace(/\s/g, '')}`} className="utility-contact">
                        📞 {property.electricity_contact}
                      </a>
                    )}
                  </div>
                </div>
              )}
              {property.gas_provider && (
                <div className="utility-item">
                  <div className="utility-header">
                    <span className="utility-icon">🔥</span>
                    <span className="utility-name">Gas</span>
                  </div>
                  <div className="utility-details">
                    <p className="utility-provider">{property.gas_provider}</p>
                    {property.gas_serial && (
                      <p className="utility-serial">Serial: {property.gas_serial}</p>
                    )}
                    {property.gas_contact && (
                      <a href={`tel:${property.gas_contact.replace(/\s/g, '')}`} className="utility-contact">
                        📞 {property.gas_contact}
                      </a>
                    )}
                  </div>
                </div>
              )}
              {property.water_provider && (
                <div className="utility-item">
                  <div className="utility-header">
                    <span className="utility-icon">💧</span>
                    <span className="utility-name">Water</span>
                  </div>
                  <div className="utility-details">
                    <p className="utility-provider">{property.water_provider}</p>
                    {property.water_contact && (
                      <a href={`tel:${property.water_contact.replace(/\s/g, '')}`} className="utility-contact">
                        📞 {property.water_contact}
                      </a>
                    )}
                    {property.water_reference && (
                      <p className="utility-serial">Reference: {property.water_reference}</p>
                    )}
                    {property.water_serial && (
                      <p className="utility-serial">Serial: {property.water_serial}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
