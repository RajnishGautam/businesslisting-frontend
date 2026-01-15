import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, onLoginClick, onSignupClick, onLogout, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      onLogout();
      navigate('/');
    } else {
      onLoginClick();
    }
  };

  const getNavLinkClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link";
  const getMobileLinkClass = ({ isActive }) => isActive ? "mobile-link active" : "mobile-link";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="logo">
            <NavLink to="/" className="logo-link">
              <span className="logo-text">BizList</span>
            </NavLink>
          </div>

          <div className="desktop-menu">
            <NavLink to="/" className={getNavLinkClass}>Home</NavLink>
            <NavLink to="/about" className={getNavLinkClass}>About Us</NavLink>
            <NavLink to="/contact" className={getNavLinkClass}>Contact Us</NavLink>
            <NavLink to="/business" className={getNavLinkClass}>Browse Listings</NavLink>
            
            {isAuthenticated && user?.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active admin-link" : "nav-link admin-link"}>
                Admin Dashboard
              </NavLink>
            )}
            
            {isAuthenticated && user?.role !== 'admin' && (
              <NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
            )}
          </div>

          <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-name">Hi, {user?.name}</span>
                <button onClick={handleAuthClick} className="auth-button">Logout</button>
              </div>
            ) : (
              <button onClick={onLoginClick} className="auth-button">Login / Signup</button>
            )}
          </div>

          <div className="mobile-menu-button">
            <button onClick={() => setIsOpen(!isOpen)} className="hamburger">
              {isOpen ? <span className="close-icon">✕</span> : <span className="menu-icon">☰</span>}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mobile-menu">
          <NavLink to="/" className={getMobileLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={getMobileLinkClass} onClick={() => setIsOpen(false)}>About Us</NavLink>
          <NavLink to="/contact" className={getMobileLinkClass} onClick={() => setIsOpen(false)}>Contact Us</NavLink>
          <NavLink to="/business" className={getMobileLinkClass} onClick={() => setIsOpen(false)}>Browse Listings</NavLink>
          
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? "mobile-link active" : "mobile-link"} onClick={() => setIsOpen(false)}>
              Admin Dashboard
            </NavLink>
          )}
          
          {isAuthenticated && user?.role !== 'admin' && (
            <NavLink to="/dashboard" className={getMobileLinkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
          )}
          
          {isAuthenticated ? (
            <>
              <span className="mobile-user">
                Hi, {user?.name}
                {user?.role === 'admin' && <span className="admin-badge-mobile">Admin</span>}
              </span>
              <button onClick={() => { handleAuthClick(); setIsOpen(false); }} className="mobile-auth-button">Logout</button>
            </>
          ) : (
            <button onClick={() => { onLoginClick(); setIsOpen(false); }} className="mobile-auth-button">Login / Signup</button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
