import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="fade-in-up">
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6B46C1 0%, #0D9488 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            Welcome to LearnX
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#666',
            marginBottom: '3rem',
            lineHeight: '1.6'
          }}>
            Excellence in Education, Innovation in Learning. Join LearnX's comprehensive online learning platform designed for academic excellence and professional growth.
          </p>
        </div>

        <div className="course-grid" style={{ marginBottom: '3rem' }}>
          <div className="card fade-in-up" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>Academic Excellence</h3>
            <p style={{ color: '#666' }}>World-class education with experienced faculty and cutting-edge curriculum</p>
          </div>

          <div className="card fade-in-up" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>University Degrees</h3>
            <p style={{ color: '#666' }}>Earn recognized degrees and certificates from LearnX</p>
          </div>

          <div className="card fade-in-up" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌐</div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>Digital Campus</h3>
            <p style={{ color: '#666' }}>Access your courses and resources from anywhere, anytime</p>
          </div>
        </div>

        <div className="fade-in-up" style={{ margin: '3rem 0' }}>
          <button
            onClick={() => navigate('/courses')}
            className="btn btn-primary"
            style={{
              fontSize: '1.2rem',
              padding: '16px 32px',
              margin: '10px'
            }}
          >
            📚 Explore Programs
          </button>

          <button
            onClick={() => navigate('/login')}
            className="btn btn-outline"
            style={{
              fontSize: '1.2rem',
              padding: '16px 32px',
              margin: '10px'
            }}
          >
            Sign In
          </button>
        </div>

        <div className="card fade-in-up" style={{
          background: 'linear-gradient(135deg, #6B46C1 0%, #0D9488 100%)',
          color: 'white',
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Join LearnX Today!</h2>
          <p style={{ fontSize: '1.1rem', opacity: '0.9', marginBottom: '2rem' }}>
            Be part of LearnX's legacy of academic excellence and innovation in learning
          </p>
          <div className="dashboard-stats" style={{ color: 'white' }}>
            <div>
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Students</div>
            </div>
            <div>
              <div className="stat-number">200+</div>
              <div className="stat-label">Programs</div>
            </div>
            <div>
              <div className="stat-number">150+</div>
              <div className="stat-label">Faculty</div>
            </div>
            <div>
              <div className="stat-number">98%</div>
              <div className="stat-label">Placement Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;