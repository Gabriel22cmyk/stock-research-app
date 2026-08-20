import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import StocksPage from './pages/StocksPage';
import WatchlistPage from './pages/WatchlistPage';
import Nav from './components/Nav';
import './App.css';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/stocks" element={<StocksPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
      </Routes>
    </Router>
  );
}

export default App;
