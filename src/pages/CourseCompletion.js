import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const CourseCompletion = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [user, setUser] = useState(null);

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
      .catch(err => console.error(err));

    // Fetch course details
    axios.get(`${API_BASE_URL}/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCourse(res.data))
      .catch(err => {
        console.error(err);
        navigate('/courses');
      });

    // Fetch progress
    axios.get(`${API_BASE_URL}/progress/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProgress(res.data))
      .catch(err => console.error(err));
  }, [courseId, navigate]);

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: '#4facfe', message: 'Outstanding!' };
    if (score >= 80) return { grade: 'A', color: '#4facfe', message: 'Excellent!' };
    if (score >= 70) return { grade: 'B', color: '#6B46C1', message: 'Good Job!' };
    if (score >= 60) return { grade: 'C', color: '#ffa726', message: 'Satisfactory' };
    return { grade: 'F', color: '#ff6b6b', message: 'Needs Improvement' };
  };

  const downloadCertificate = () => {
    // In a real app, this would generate and download a PDF certificate
    alert('Certificate download feature would be implemented here!');
  };

  if (!course || !progress || !user) return <div className="spinner"></div>;

  const gradeInfo = getGrade(progress.quizScore);
  const isPassed = progress.quizScore >= 70;

  return (
    <div className="page-container">
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div className="fade-in-up">
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            color: isPassed ? '#4facfe' : '#ff6b6b',
            marginBottom: '1rem'
          }}>
            {isPassed ? '🎉 Congratulations!' : '📚 Course Completed'}
          </h1>
          
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#666', 
            marginBottom: '2rem' 
          }}>
            {isPassed 
              ? 'You have successfully completed the course!' 
              : 'You have completed the course. Consider retaking the quiz to improve your score.'
            }
          </p>
        </div>

        {/* Certificate Card */}
        {isPassed && (
          <div className="card fade-in-up" style={{ 
            background: 'linear-gradient(135deg, #6B46C1 0%, #0D9488 100%)',
            color: 'white',
            padding: '3rem 2rem',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '100px',
              height: '100px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h2 style={{ marginBottom: '1rem' }}>Certificate of Completion</h2>
            <p style={{ fontSize: '1.1rem', opacity: '0.9', marginBottom: '1rem' }}>
              This certifies that
            </p>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{user.name}</h3>
            <p style={{ fontSize: '1.1rem', opacity: '0.9', marginBottom: '1rem' }}>
              has successfully completed
            </p>
            <h4 style={{ fontSize: '1.4rem', marginBottom: '2rem' }}>{course.title}</h4>
            <p style={{ fontSize: '0.9rem', opacity: '0.8' }}>
              Completed on {new Date().toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Course Stats */}
        <div className="dashboard-stats fade-in-up" style={{ marginBottom: '2rem' }}>
          <div className="stat-card" style={{ 
            background: `linear-gradient(135deg, ${gradeInfo.color} 0%, ${gradeInfo.color}dd 100%)` 
          }}>
            <div className="stat-number">{gradeInfo.grade}</div>
            <div className="stat-label">Final Grade</div>
            <p style={{ marginTop: '0.5rem', opacity: '0.9', fontSize: '0.9rem' }}>
              {gradeInfo.message}
            </p>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{progress.quizScore}%</div>
            <div className="stat-label">Quiz Score</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{progress.videosWatched?.length || 0}</div>
            <div className="stat-label">Videos Watched</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{progress.completionPercentage}%</div>
            <div className="stat-label">Course Progress</div>
          </div>
        </div>

        {/* Course Details */}
        <div className="card fade-in-up" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ color: '#333', marginBottom: '1rem', textAlign: 'center' }}>Course Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Course:</strong> {course.title}
            </div>
            <div>
              <strong>Instructor:</strong> {course.instructor}
            </div>
            <div>
              <strong>Duration:</strong> {course.duration}
            </div>
            <div>
              <strong>Level:</strong> {course.level}
            </div>
            <div>
              <strong>Category:</strong> {course.category}
            </div>
            <div>
              <strong>Completed:</strong> {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fade-in-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isPassed && (
            <button 
              onClick={downloadCertificate}
              className="btn btn-primary"
              style={{ fontSize: '1.1rem', padding: '12px 24px' }}
            >
              📜 Download Certificate
            </button>
          )}
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-success"
            style={{ fontSize: '1.1rem', padding: '12px 24px' }}
          >
            📊 View Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/courses')}
            className="btn btn-outline"
            style={{ fontSize: '1.1rem', padding: '12px 24px' }}
          >
            📚 Browse More Courses
          </button>
          
          {!isPassed && (
            <button 
              onClick={() => navigate(`/quiz/${courseId}`)}
              className="btn btn-secondary"
              style={{ fontSize: '1.1rem', padding: '12px 24px' }}
            >
              🔄 Retake Quiz
            </button>
          )}
        </div>

        {/* Motivational Message */}
        <div className="card fade-in-up" style={{ 
          marginTop: '2rem',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>
            {isPassed ? 'Keep Learning!' : 'Don\'t Give Up!'}
          </h3>
          <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
            {isPassed 
              ? 'You\'ve shown great dedication and skill. Continue your learning journey with more courses to expand your knowledge and advance your career!'
              : 'Learning is a journey, not a destination. Review the course materials and try the quiz again. You\'ve got this!'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCompletion;
