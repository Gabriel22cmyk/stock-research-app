import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PortfolioPage from './pages/PortfolioPage';
import PropertyPage from './pages/PropertyPage';
import LoginPage from './pages/LoginPage';
import Nav from './components/Nav';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Routes>
                    <Route path="/" element={<PortfolioPage />} />
                    <Route path="/property/:id" element={<PropertyPage />} />
                  </Routes>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
