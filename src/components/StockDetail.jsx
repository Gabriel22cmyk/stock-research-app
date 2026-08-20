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

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <h2>{stock.symbol} - {stock.company_name}</h2>
        
        <div className="detail-section">
          <h3>Price Information</h3>
          <div className="detail-grid">
            <div>
              <strong>Current Price:</strong> ${stock.current_price?.toFixed(2)}
            </div>
            <div>
              <strong>Target Price:</strong> ${stock.target_price?.toFixed(2)}
            </div>
            <div>
              <strong>Potential Upside:</strong> {((stock.target_price - stock.current_price) / stock.current_price * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="detail-section">
            <h3>Recommendations</h3>
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

        {priceHistory.length > 0 && (
          <div className="detail-section">
            <h3>Recent Price History</h3>
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
