import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting signup with:', formData);
      const res = await axios.post(`${API_BASE_URL}/auth/signup`, formData);
      console.log('Signup response:', res.data);

      if (res.data.token) {
        // Store the token for immediate login
        localStorage.setItem('token', res.data.token);
        alert('Signup successful! Welcome to LearnX Portal!');

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        alert('Signup successful! Please login to continue.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error response:', err.response?.data);
      alert(err.response?.data?.msg || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
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
            Welcome to LearnX
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem'
          }}>
            Create your account and join LearnX's digital campus for academic excellence.
          </p>
        </div>

        <div className="card fade-in-up" style={{ textAlign: 'left' }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#333'
          }}>
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-floating">
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label className="form-label">Full Name</label>
            </div>

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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#666' }}>
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                style={{
                  color: '#667eea',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textDecoration: 'underline'
                }}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
