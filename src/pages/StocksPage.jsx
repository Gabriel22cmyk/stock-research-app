import React, { useEffect, useState } from 'react';
import StockCard from '../components/StockCard';
import StockDetail from '../components/StockDetail';
import { fetchStocks, addToWatchlist, removeFromWatchlist, fetchWatchlist } from '../lib/supabaseClient';
import '../styles/HomePage.css';

const HomePage = () => {
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const stocksData = await fetchStocks();
    const watchlistData = await fetchWatchlist();
    setStocks(stocksData);
    setWatchlist(watchlistData);
    setLoading(false);
  };

  const handleAddWatchlist = async (stockId) => {
    await addToWatchlist(stockId);
    await loadData();
  };

  const handleRemoveWatchlist = async (stockId) => {
    await removeFromWatchlist(stockId);
    await loadData();
  };

  const isWatchlisted = (stockId) => {
    return watchlist.some(item => item.id === stockId);
  };

  if (loading) {
    return <div className="container"><p>Loading stocks...</p></div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>STOCK RESEARCH</h1>
        <p>High-conviction mid-cap picks — $250M to $2B market cap</p>
      </header>

      <section className="stocks-grid">
        {stocks.length > 0 ? (
          stocks.map(stock => (
            <StockCard
              key={stock.id}
              stock={stock}
              isWatchlisted={isWatchlisted(stock.id)}
              onAddWatchlist={handleAddWatchlist}
              onRemoveWatchlist={handleRemoveWatchlist}
              onViewDetails={setSelectedStock}
            />
          ))
        ) : (
          <p>No stocks found. Check back later!</p>
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

export default HomePage;
