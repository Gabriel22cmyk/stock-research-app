import React from 'react';
import '../styles/StockCard.css';

const StockCard = ({ stock, isWatchlisted, onAddWatchlist, onRemoveWatchlist, onViewDetails }) => {
  const priceChange = stock.target_price - stock.current_price;
  const percentChange = ((priceChange / stock.current_price) * 100).toFixed(1);

  return (
    <div className="stock-card">
      <div className="card-header">
        <div>
          <h3>{stock.symbol}</h3>
          <p className="company-name">{stock.company_name}</p>
          {stock.sector && <span className="card-sector">{stock.sector}</span>}
        </div>
        <button
          className={`watchlist-btn ${isWatchlisted ? 'active' : ''}`}
          onClick={() => isWatchlisted ? onRemoveWatchlist(stock.id) : onAddWatchlist(stock.id)}
        >
          {isWatchlisted ? '★' : '☆'}
        </button>
      </div>

      {stock.description && (
        <p className="card-description">{stock.description}</p>
      )}

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
          <span className="label">Upside</span>
          <span className="price">{priceChange >= 0 ? '+' : ''}{percentChange}%</span>
        </div>
      </div>

      {stock.upcoming_events && (
        <div className="card-event">
          <span className="event-label">⚡ Upcoming</span>
          <span className="event-text">{stock.upcoming_events}</span>
        </div>
      )}

      {stock.founded_year && (
        <div className="card-meta">
          <span>🏛 Founded {stock.founded_year}</span>
          {stock.available_on && <span>🏦 {stock.available_on}</span>}
        </div>
      )}

      <button className="view-btn" onClick={() => onViewDetails(stock)}>
        Full Details →
      </button>
    </div>
  );
};

export default StockCard;
