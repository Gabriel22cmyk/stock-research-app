import React, { useEffect, useState } from 'react';
import { fetchRecommendations, fetchPriceHistory } from '../lib/supabaseClient';
import '../styles/StockDetail.css';

const StockDetail = ({ stock, onClose }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const recs = await fetchRecommendations(stock.id);
      const history = await fetchPriceHistory(stock.id);
      setRecommendations(recs);
      setPriceHistory(history);
      setLoading(false);
    };
    loadData();
  }, [stock.id]);

  const upside = stock.target_price && stock.current_price
    ? ((stock.target_price - stock.current_price) / stock.current_price * 100).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <p style={{ color: '#94a3b8' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="detail-header">
          <h2>{stock.symbol}</h2>
          <p className="detail-company-name">{stock.company_name}</p>
          <div className="detail-tags">
            {stock.sector && <span className="tag sector-tag">📊 {stock.sector}</span>}
            {stock.founded_year && <span className="tag founded-tag">🏛 Founded {stock.founded_year}</span>}
            {stock.available_on && <span className="tag broker-tag">🏦 {stock.available_on}</span>}
          </div>
        </div>

        {/* What the company does */}
        {stock.description && (
          <div className="detail-section">
            <h3>About the Company</h3>
            <p className="detail-description">{stock.description}</p>
          </div>
        )}

        {/* Price Info */}
        <div className="detail-section">
          <h3>Price Information</h3>
          <div className="detail-grid">
            <div><strong>Current Price</strong><span>${stock.current_price?.toFixed(2)}</span></div>
            <div><strong>Target Price</strong><span className="target-price">${stock.target_price?.toFixed(2)}</span></div>
            {upside && (
              <div>
                <strong>Potential Upside</strong>
                <span className={parseFloat(upside) >= 0 ? 'positive' : 'negative'}>
                  {upside > 0 ? '+' : ''}{upside}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        {stock.upcoming_events && (
          <div className="detail-section">
            <h3>⚡ Upcoming Events</h3>
            <div className="event-box">
              <p>{stock.upcoming_events}</p>
            </div>
          </div>
        )}

        {/* Merger / M&A Info */}
        {stock.merger_info && (
          <div className="detail-section">
            <h3>🤝 Merger & Acquisition Activity</h3>
            <div className="merger-box">
              <p>{stock.merger_info}</p>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="detail-section">
            <h3>Analyst Recommendation</h3>
            {recommendations.map(rec => (
              <div key={rec.id} className="recommendation-item">
                <span className={`rating ${rec.rating?.toLowerCase().replace(/\s+/g, '-')}`}>
                  {rec.rating}
                </span>
                <p>{rec.recommendation_text}</p>
                <small>{new Date(rec.recommended_date).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        )}

        {/* Price History */}
        {priceHistory.length > 0 && (
          <div className="detail-section">
            <h3>Price History</h3>
            <div className="price-history">
              {priceHistory.map(entry => (
                <div key={entry.id} className="history-item">
                  <span>{new Date(entry.recorded_at).toLocaleDateString()}</span>
                  <span className="price">${entry.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetail;
