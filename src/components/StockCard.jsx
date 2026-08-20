import React from 'react';
import '../styles/StockCard.css';

const StockCard = ({ stock, isWatchlisted, onAddWatchlist, onRemoveWatchlist, onViewDetails }) => {
  const priceChange = stock.target_price - stock.current_price;
  const percentChange = ((priceChange / stock.current_price) * 100).toFixed(2);

  return (
    <div className="stock-card">
      <div className="card-header">
        <div>
          <h3>{stock.symbol}</h3>
          <p className="company-name">{stock.company_name}</p>
        </div>
        <button
          className={`watchlist-btn ${isWatchlisted ? 'active' : ''}`}
          onClick={() => isWatchlisted ? onRemoveWatchlist(stock.id) : onAddWatchlist(stock.id)}
        >
          {isWatchlisted ? '★' : '☆'}
        </button>
      </div>

      <div className="card-prices">
        <div className="price-item">
          <span className="label">Current</span>
          <span className="price">${stock.current_price?.toFixed(2) || 'N/A'}</span>
        </div>
        <div className="price-item">
          <span className="label">Target</span>
          <span className="price target">${stock.target_price?.toFixed(2) || 'N/A'}</span>
        </div>
        <div className={`price-item ${priceChange >= 0 ? 'positive' : 'negative'}`}>
          <span className="label">Potential</span>
          <span className="price">{percentChange}%</span>
        </div>
      </div>

      <button className="view-btn" onClick={() => onViewDetails(stock)}>
        View Details
      </button>
    </div>
  );
};

export default StockCard;
