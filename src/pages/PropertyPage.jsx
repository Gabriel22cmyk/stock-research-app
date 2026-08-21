import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProperties } from '../lib/supabaseClient';
import FileSection from '../components/FileSection';
import EditableSection from '../components/EditableSection';
import '../styles/Property.css';

const PropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      const properties = await fetchProperties();
      const prop = properties.find(p => p.id === id);
      setProperty(prop);
      setLoading(false);
    };
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="property-page-container">
        <p>Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-page-container">
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Portfolio</button>
        <p>Property not found</p>
      </div>
    );
  }

  const netMonthly = (property.monthly_income || 0) - (property.monthly_mortgage || 0);
  const annualIncome = (property.monthly_income || 0) * 12;
  const annualMortgage = (property.monthly_mortgage || 0) * 12;
  const annualNet = netMonthly * 12;
  const yield_pct = property.current_value
    ? ((annualIncome / property.current_value) * 100).toFixed(2)
    : null;

  return (
    <div className="property-page-container">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Portfolio</button>

      {/* Header */}
      <header className="property-page-header">
        <h1>{property.property_name}</h1>
        {property.owned_outright && <span className="owned-badge">OWNED OUTRIGHT</span>}
        <div className="property-badges">
          {property.property_type && <span className="badge">🏠 {property.property_type}</span>}
          {property.bedrooms && <span className="badge">🛏️ {property.bedrooms} bed</span>}
          {property.location && <span className="badge">📍 {property.location}</span>}
        </div>
      </header>

      {/* Address */}
      {(property.address || property.postcode) && (
        <section className="property-section">
          <h2>ADDRESS</h2>
          <div className="address-block">
            {property.address && <p className="address-line">{property.address}</p>}
            {property.postcode && <p className="postcode">{property.postcode}</p>}
          </div>
        </section>
      )}

      {/* Management - Editable */}
      <EditableSection
        propertyId={property.id}
        title="MANAGEMENT"
        fields={{
          management_company: property.management_company || ''
        }}
        onUpdate={(data) => setProperty(prev => ({ ...prev, ...data }))}
      />

      {/* Valuation */}
      <section className="property-section">
        <h2>VALUATION</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Property Value</span>
            <span className="stat-value">£{property.current_value?.toLocaleString('en-GB')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Your Equity</span>
            <span className="stat-value positive">£{property.equity?.toLocaleString('en-GB')}</span>
          </div>
          {property.mortgage_remaining > 0 && (
            <div className="stat-card">
              <span className="stat-label">Mortgage Remaining</span>
              <span className="stat-value negative">£{property.mortgage_remaining?.toLocaleString('en-GB')}</span>
            </div>
          )}
          {yield_pct && (
            <div className="stat-card">
              <span className="stat-label">Gross Yield</span>
              <span className="stat-value highlight">{yield_pct}%</span>
            </div>
          )}
        </div>
      </section>

      {/* Cashflow */}
      <section className="property-section">
        <h2>MONTHLY CASHFLOW</h2>
        <div className="cashflow-breakdown">
          <div className="cashflow-row income">
            <span className="cf-label">Rental Income</span>
            <span className="cf-amount">+£{(property.monthly_income || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
          </div>
          {property.monthly_mortgage > 0 && (
            <div className="cashflow-row outgoing">
              <span className="cf-label">Mortgage Payment</span>
              <span className="cf-amount">-£{(property.monthly_mortgage || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className={`cashflow-row net ${netMonthly >= 0 ? 'net-positive' : 'net-negative'}`}>
            <span className="cf-label">Net Monthly</span>
            <span className="cf-amount">{netMonthly >= 0 ? '+' : ''}£{netMonthly.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </section>

      {/* Annual */}
      <section className="property-section">
        <h2>ANNUAL SUMMARY</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Annual Income</span>
            <span className="stat-value positive">£{annualIncome.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
          </div>
          {annualMortgage > 0 && (
            <div className="stat-card">
              <span className="stat-label">Annual Mortgage</span>
              <span className="stat-value negative">£{annualMortgage.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="stat-card">
            <span className="stat-label">Annual Net Profit</span>
            <span className={`stat-value ${annualNet >= 0 ? 'positive' : 'negative'}`}>
              £{annualNet.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </section>

      {/* Property Info - Editable */}
      <EditableSection
        propertyId={property.id}
        title="PROPERTY INFO"
        fields={{
          completion_date: property.completion_date || ''
        }}
        onUpdate={(data) => setProperty(prev => ({ ...prev, ...data }))}
      />

      {/* Council Tax - Editable */}
      <EditableSection
        propertyId={property.id}
        title="COUNCIL TAX"
        fields={{
          council_tax_contact: property.council_tax_contact || '',
          council_tax_authority: property.council_tax_authority || ''
        }}
        onUpdate={(data) => setProperty(prev => ({ ...prev, ...data }))}
      />

      {/* Documents & Files */}
      <section className="property-section">
        <h2>DOCUMENTS</h2>
        <div className="file-sections-stack">
          <FileSection propertyId={property.id} folder="important" title="IMPORTANT FILES" icon="⭐" />
          <FileSection propertyId={property.id} folder="2026" title="2026 STATEMENTS" icon="📁" />
          <FileSection propertyId={property.id} folder="2025" title="2025 STATEMENTS" icon="📁" />
          <FileSection propertyId={property.id} folder="2024" title="2024 STATEMENTS" icon="📁" />
        </div>
      </section>

      {/* Utilities - Editable */}
      <EditableSection
        propertyId={property.id}
        title="UTILITIES"
        fields={{
          electricity_provider: property.electricity_provider || '',
          electricity_serial: property.electricity_serial || '',
          electricity_contact: property.electricity_contact || '',
          gas_provider: property.gas_provider || '',
          gas_serial: property.gas_serial || '',
          gas_contact: property.gas_contact || '',
          water_provider: property.water_provider || '',
          water_contact: property.water_contact || '',
          water_reference: property.water_reference || '',
          water_serial: property.water_serial || ''
        }}
        onUpdate={(data) => setProperty(prev => ({ ...prev, ...data }))}
      />
    </div>
  );
};

export default PropertyPage;
