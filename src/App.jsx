import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import BusinessForm from './components/BusinessForm';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [prefilledEmail, setPrefilledEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setShowLogin(false);
    setPrefilledEmail('');
  };

  const handleSignup = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setShowSignup(false);
    setPrefilledEmail('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleGetStarted = (email) => {
    setPrefilledEmail(email);
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    setPrefilledEmail('');
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
    setPrefilledEmail('');
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          isAuthenticated={isAuthenticated} 
          onLoginClick={() => setShowLogin(true)}
          onSignupClick={() => setShowSignup(true)}
          onLogout={handleLogout}
          user={user}
        />
        
        {showLogin && (
          <Login 
            onClose={handleCloseLogin}
            onLogin={handleLogin}
            onSwitchToSignup={handleSwitchToSignup}
            prefilledEmail={prefilledEmail}
          />
        )}
        
        {showSignup && (
          <Signup 
            onClose={handleCloseSignup}
            onSignup={handleSignup}
            onSwitchToLogin={handleSwitchToLogin}
            prefilledEmail={prefilledEmail}
          />
        )}

        <Routes>
          <Route path="/" element={<Home onGetStarted={handleGetStarted} />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/create-listing" 
            element={isAuthenticated && user?.role !== 'admin' ? <BusinessForm /> : <Navigate to="/" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated && user?.role !== 'admin' ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin" 
            element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;