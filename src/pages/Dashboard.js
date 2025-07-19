import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageScore: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user data
    axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      });

    // Fetch completed courses
    axios.get(`${API_BASE_URL}/progress/completed/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCompletedCourses(res.data);

        // Calculate stats
        const totalCompleted = res.data.length;
        const totalScore = res.data.reduce((sum, progress) => sum + progress.quizScore, 0);
        const averageScore = totalCompleted > 0 ? Math.round(totalScore / totalCompleted) : 0;

        setStats(prev => ({
          ...prev,
          completedCourses: totalCompleted,
          averageScore
        }));
      })
      .catch(err => console.error(err));

    // Fetch enrolled courses
    axios.get(`${API_BASE_URL}/courses/enrolled/my-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setEnrolledCourses(res.data);
        setStats(prev => ({
          ...prev,
          totalCourses: res.data.length,
          inProgressCourses: res.data.length - completedCourses.length
        }));
      })
      .catch(err => console.error(err));
  }, [navigate, completedCourses.length]);

  if (!user) return <div className="spinner"></div>;

  return (
    <div className="page-container">
      <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #6B46C1 0%, #0D9488 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Welcome back, {user.name}! 👋
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Track your learning progress and continue your educational journey
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="dashboard-stats fade-in-up" style={{ marginBottom: '3rem' }}>
        <div className="stat-card">
          <div className="stat-number">{stats.totalCourses}</div>
          <div className="stat-label">Enrolled Courses</div>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }}>
          <div className="stat-number">{stats.completedCourses}</div>
          <div className="stat-label">Completed Courses</div>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #ffa726 0%, #ff7043 100%)'
        }}>
          <div className="stat-number">{stats.inProgressCourses}</div>
          <div className="stat-label">In Progress</div>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)'
        }}>
          <div className="stat-number">{stats.averageScore}%</div>
          <div className="stat-label">Average Score</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fade-in-up" style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/courses')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            📚 Browse Courses
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/payment-history')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            💳 Payment History
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            👤 Profile
          </button>
        </div>
      </div>

      {/* Completed Courses */}
      <div className="fade-in-up" style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          🏆 Completed Courses
        </h2>

        {completedCourses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>No completed courses yet</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Start learning today and earn your first certificate!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/courses')}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="course-grid">
            {completedCourses.map((progress) => (
              <div key={progress._id} className="course-card">
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  ✓ Completed
                </div>

                {progress.courseId?.thumbnail && (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundImage: `url(${progress.courseId.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px',
                    marginBottom: '1rem'
                  }}></div>
                )}

                <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>
                  {progress.courseId?.title}
                </h3>

                <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {progress.courseId?.shortDescription}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{
                    background: 'rgba(79, 172, 254, 0.1)',
                    color: '#4facfe',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    Score: {progress.quizScore}%
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    Completed: {new Date(progress.completedAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                  onClick={() => navigate(`/completion/${progress.courseId._id}`)}
                >
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card fade-in-up" style={{
        background: 'linear-gradient(135deg, #6B46C1 0%, #0D9488 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Ready to Learn More?</h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
            onClick={() => navigate('/courses')}
          >
            📚 Browse Courses
          </button>
          <button
            className="btn"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
            onClick={() => navigate('/profile')}
          >
            👤 View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;