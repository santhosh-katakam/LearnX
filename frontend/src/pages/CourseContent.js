import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const CourseContent = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [videosWatched, setVideosWatched] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessInfo, setAccessInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadCourseAndCheckAccess = async () => {
      try {
        // First, fetch course details
        const courseResponse = await axios.get(`${API_BASE_URL}/courses/${courseId}`);
        setCourse(courseResponse.data);

        // Then check if user has access to this course
        const accessResponse = await axios.get(`${API_BASE_URL}/payments/access/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setHasAccess(accessResponse.data.hasAccess);
        setAccessInfo(accessResponse.data);

        // If user has access, fetch progress
        if (accessResponse.data.hasAccess) {
          try {
            const progressResponse = await axios.get(`${API_BASE_URL}/progress/${courseId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setProgress(progressResponse.data);
            setVideosWatched(progressResponse.data.videosWatched || []);
          } catch (err) {
            console.error('Error loading progress:', err);
          }
        }

        setLoading(false);

      } catch (err) {
        console.error('Error loading course or checking access:', err);
        setLoading(false);
        navigate('/courses');
      }
    };

    loadCourseAndCheckAccess();
  }, [courseId, navigate]);

  const markVideoWatched = async (videoIndex) => {
    if (videosWatched.includes(videoIndex)) return;

    const token = localStorage.getItem('token');
    const newVideosWatched = [...videosWatched, videoIndex];
    setVideosWatched(newVideosWatched);

    try {
      await axios.post(`${API_BASE_URL}/progress/${courseId}/video`, {
        videoIndex
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getProgressPercentage = () => {
    if (!course || !course.videos) return 0;
    return Math.round((videosWatched.length / course.videos.length) * 100);
  };

  const canTakeQuiz = () => {
    return course && videosWatched.length === course.videos.length;
  };

  if (loading || !course) return <div className="spinner"></div>;

  // Check if user has access to the course
  if (!hasAccess) {
    return (
      <div className="page-container">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ color: '#333', marginBottom: '1rem' }}>Course Access Restricted</h2>

            {accessInfo?.reason === 'payment_required' && (
              <>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                  This is a paid course. Please complete payment to access the content.
                </p>
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1a237e', marginBottom: '0.5rem' }}>
                    ₹{course.price}
                  </div>
                  <p style={{ color: '#666' }}>One-time payment for lifetime access</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/payment/${course._id}`)}
                  style={{ fontSize: '1.1rem', padding: '12px 32px' }}
                >
                  💳 Pay Now
                </button>
              </>
            )}

            {accessInfo?.reason === 'payment_pending' && (
              <>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                  Your payment is being verified. Course access will be granted within 24 hours after verification.
                </p>
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fff3e0',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                  fontSize: '0.9rem',
                  color: '#f57c00'
                }}>
                  <p style={{ margin: '0.5rem 0', fontWeight: '600' }}>
                    Transaction ID: {accessInfo.transactionId}
                  </p>
                  <p style={{ margin: '0.5rem 0' }}>
                    Status: {accessInfo.paymentStatus === 'verification_required' ? 'Waiting for verification' : 'Under review'}
                  </p>
                </div>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate('/payment-history')}
                >
                  View Payment History
                </button>
              </>
            )}

            <div style={{ marginTop: '2rem' }}>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/courses')}
              >
                ← Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentVideoData = course.videos[currentVideo];

  return (
    <div className="page-container">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Course Header */}
        <div className="fade-in-up" style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/courses')}
            className="btn btn-outline"
            style={{ marginBottom: '1rem' }}
          >
            ← Back to Courses
          </button>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#333',
            marginBottom: '1rem'
          }}>
            {course.title}
          </h1>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#666' }}>
            Progress: {getProgressPercentage()}% ({videosWatched.length}/{course.videos.length} videos completed)
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Video Player */}
          <div className="fade-in-up">
            <div className="card">
              <div className="video-container">
                {currentVideoData?.videoUrl ? (
                  <iframe
                    src={currentVideoData.videoUrl}
                    title={currentVideoData.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => markVideoWatched(currentVideo)}
                    style={{ width: '100%', height: '400px' }}
                  ></iframe>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}>
                    <div style={{ textAlign: 'center', color: '#666' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📹</div>
                      <p>Video URL not available</p>
                      <small>Please contact admin to fix this video</small>
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ padding: '1rem 0' }}>
                <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>
                  {currentVideoData?.title}
                </h2>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  Duration: {currentVideoData?.duration}
                </p>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  {currentVideoData?.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <button 
                  onClick={() => setCurrentVideo(Math.max(0, currentVideo - 1))}
                  disabled={currentVideo === 0}
                  className="btn btn-secondary"
                >
                  ← Previous
                </button>
                
                <button 
                  onClick={() => markVideoWatched(currentVideo)}
                  className={`btn ${videosWatched.includes(currentVideo) ? 'btn-success' : 'btn-primary'}`}
                  disabled={videosWatched.includes(currentVideo)}
                >
                  {videosWatched.includes(currentVideo) ? '✓ Watched' : 'Mark as Watched'}
                </button>
                
                <button 
                  onClick={() => setCurrentVideo(Math.min(course.videos.length - 1, currentVideo + 1))}
                  disabled={currentVideo === course.videos.length - 1}
                  className="btn btn-secondary"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="fade-in-up">
            {/* Course Info */}
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Course Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span><strong>Instructor:</strong> {course.instructor}</span>
                <span><strong>Duration:</strong> {course.duration}</span>
                <span><strong>Level:</strong> {course.level}</span>
                <span><strong>Category:</strong> {course.category}</span>
                <span><strong>Rating:</strong> ⭐ {course.rating}/5</span>
              </div>
            </div>

            {/* Video List */}
            <div className="card">
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Course Videos</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {course.videos.map((video, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentVideo(index)}
                    style={{
                      padding: '0.75rem',
                      border: `2px solid ${currentVideo === index ? '#667eea' : 'rgba(102, 126, 234, 0.2)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: currentVideo === index ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        color: videosWatched.includes(index) ? '#4facfe' : '#666',
                        fontSize: '1.2rem'
                      }}>
                        {videosWatched.includes(index) ? '✓' : `${index + 1}.`}
                      </span>
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          color: currentVideo === index ? '#667eea' : '#333',
                          fontSize: '0.9rem'
                        }}>
                          {video.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {video.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Button */}
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Ready for the Quiz?</h3>
              <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Complete all videos to unlock the quiz
              </p>
              <button 
                onClick={() => navigate(`/quiz/${courseId}`)}
                disabled={!canTakeQuiz()}
                className={`btn ${canTakeQuiz() ? 'btn-success' : 'btn-secondary'}`}
                style={{ width: '100%' }}
              >
                {canTakeQuiz() ? '🎯 Take Quiz' : '🔒 Complete Videos First'}
              </button>
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="card fade-in-up" style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>About This Course</h3>
          <p style={{ color: '#555', lineHeight: '1.6' }}>
            {course.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
