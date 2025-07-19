import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // Fetch user data to check role
      axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUser(res.data))
        .catch(err => console.error(err));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navStyle = {
    backgroundColor: '#6B46C1', // LearnX primary color
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const logoStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#0D9488' // LearnX accent color
  };

  const buttonStyle = {
    ...linkStyle,
    backgroundColor: '#dc3545'
  };

  return (
    <nav style={navStyle}>
      <div 
        style={logoStyle}
        onClick={() => navigate('/')}
      >
        🎓 LearnX
      </div>
      
      <div style={navLinksStyle}>
        {!token ? (
          // Not logged in
          <>
            <button
              style={location.pathname === '/' ? activeLinkStyle : linkStyle}
              onClick={() => navigate('/')}
            >
              Home
            </button>
            <button
              style={location.pathname === '/login' ? activeLinkStyle : linkStyle}
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              style={location.pathname === '/signup' ? activeLinkStyle : linkStyle}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </>
        ) : (
          // Logged in
          <>
            <button
              style={location.pathname === '/dashboard' ? activeLinkStyle : linkStyle}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button
              style={location.pathname === '/courses' ? activeLinkStyle : linkStyle}
              onClick={() => navigate('/courses')}
            >
              Courses
            </button>
            <button
              style={location.pathname === '/profile' ? activeLinkStyle : linkStyle}
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>
            {user && user.role === 'admin' && (
              <>
                <button
                  style={location.pathname === '/create-course' ? activeLinkStyle : linkStyle}
                  onClick={() => navigate('/create-course')}
                >
                  Create Course
                </button>
                <button
                  style={location.pathname === '/admin' ? activeLinkStyle : linkStyle}
                  onClick={() => navigate('/admin')}
                >
                  Admin Panel
                </button>
              </>
            )}
            <button
              style={buttonStyle}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
