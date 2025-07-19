import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', formData);
      const res = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      console.log('Login response:', res.data);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        alert('Login successful!');

        // Force page reload to update navigation
        window.location.href = '/dashboard';
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      alert(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div className="fade-in-up">
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            Welcome to LearnX Portal
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem'
          }}>
            Sign in to continue your learning journey
          </p>
        </div>

        <div className="card fade-in-up" style={{ textAlign: 'left' }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#333'
          }}>
            Sign In
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-floating">
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label className="form-label">Email Address</label>
            </div>

            <div className="form-floating">
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label className="form-label">Password</label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#666' }}>
              Don't have an account?{' '}
              <span
                onClick={() => window.location.href = '/'}
                style={{
                  color: '#667eea',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textDecoration: 'underline'
                }}
              >
                Sign Up
              </span>
            </p>
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#667eea', fontWeight: '600', marginBottom: '0.5rem' }}>
              Demo Admin Account:
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Email: admin@sru.edu.in<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;