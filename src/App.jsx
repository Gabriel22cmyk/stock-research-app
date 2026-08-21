import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import PropertyPage from './pages/PropertyPage';
import NetWorthPage from './pages/NetWorthPage';
import Nav from './components/Nav';
import './App.css';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="/networth" element={<NetWorthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
