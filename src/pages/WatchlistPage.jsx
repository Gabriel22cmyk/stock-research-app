import React, { useEffect, useState } from 'react';
import StockCard from '../components/StockCard';
import StockDetail from '../components/StockDetail';
import { removeFromWatchlist, fetchWatchlist, addToWatchlist } from '../lib/supabaseClient';
import '../styles/HomePage.css';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    const data = await fetchWatchlist();
    setWatchlist(data);
    setLoading(false);
  };

  const handleRemoveWatchlist = async (stockId) => {
    await removeFromWatchlist(stockId);
    await loadWatchlist();
  };

  const handleAddWatchlist = async (stockId) => {
    await addToWatchlist(stockId);
    await loadWatchlist();
  };

  if (loading) {
    return <div className="container"><p>Loading watchlist...</p></div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>⭐ Your Watchlist</h1>
        <p>{watchlist.length} stocks tracked</p>
      </header>

      <div className="nav-tabs">
        <button className="tab-btn" onClick={() => window.location.href = '/'}>
          Latest Picks
        </button>
        <button className="tab-btn active">Watchlist</button>
      </div>

      <section className="stocks-grid">
        {watchlist.length > 0 ? (
          watchlist.map(stock => (
            <StockCard
              key={stock.id}
              stock={stock}
              isWatchlisted={true}
              onAddWatchlist={handleAddWatchlist}
              onRemoveWatchlist={handleRemoveWatchlist}
              onViewDetails={setSelectedStock}
            />
          ))
        ) : (
          <p>Your watchlist is empty. Add some stocks!</p>
        )}
      </section>

      {selectedStock && (
        <StockDetail
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
};

export default WatchlistPage;
