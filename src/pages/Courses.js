import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all courses (public - no auth required)
    axios.get(`${API_BASE_URL}/courses`)
      .then(res => {
        console.log('Courses loaded:', res.data.length);
        setCourses(res.data);
      })
      .catch(err => {
        console.error('Error loading courses:', err);
      });

    // Fetch enrolled courses (only if user is logged in)
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE_URL}/courses/enrolled/my-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          console.log('Enrolled courses loaded:', res.data.length);
          setEnrolledCourses(res.data);
        })
        .catch(err => {
          console.error('Error loading enrolled courses:', err);
        });
    }
  }, [navigate]);

  const handleEnroll = (courseId, price = 0) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    if (price > 0) {
      // For paid courses, navigate to payment page
      navigate(`/payment/${courseId}`);
    } else {
      // For free courses, navigate to student details form
      navigate(`/student-details/${courseId}`);
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course._id === courseId);
  };

  const displayCourses = activeTab === 'all' ? courses : enrolledCourses;

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
          Academic Programs & Courses
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Explore LearnX's comprehensive academic programs designed for excellence in education
        </p>
      </div>

      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <button
          className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('all')}
          style={{ margin: '0 0.5rem' }}
        >
          All Programs ({courses.length})
        </button>
        <button
          className={`btn ${activeTab === 'enrolled' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('enrolled')}
          style={{ margin: '0 0.5rem' }}
        >
          My Enrolled Programs ({enrolledCourses.length})
        </button>
      </div>

      {displayCourses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>No courses available</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            {activeTab === 'all'
              ? 'No courses have been created yet. Admin can add courses from the admin panel.'
              : 'You haven\'t enrolled in any courses yet. Browse available courses to get started!'
            }
          </p>
          {activeTab === 'all' && (
            <p style={{ color: '#999', fontSize: '0.9rem' }}>
              Admin login: admin@sru.edu.in
            </p>
          )}
        </div>
      ) : (
        <div className="course-grid">
          {displayCourses.map(course => (
            <div key={course._id} className="course-card fade-in-up">
              {course.thumbnail && (
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundImage: `url(${course.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px',
                  marginBottom: '1rem'
                }}></div>
              )}

              <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
                {course.title}
              </h3>

              <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {course.shortDescription || course.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  ⭐ {course.rating || 4.5}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  👥 {course.studentsCount || course.enrolledStudents?.length || 0}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  📊 {course.level}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {course.category}
                </span>
                <span style={{
                  background: 'rgba(79, 172, 254, 0.1)',
                  color: '#4facfe',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {course.duration}
                </span>
                <span style={{
                  background: course.price > 0 ? 'rgba(255, 193, 7, 0.1)' : 'rgba(40, 167, 69, 0.1)',
                  color: course.price > 0 ? '#ffc107' : '#28a745',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {course.price > 0 ? `₹${course.price}` : 'FREE'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                  👨‍🏫 {course.instructor}
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#667eea' }}>
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
              </div>

              <div style={{ marginTop: 'auto' }}>
                {activeTab === 'all' && (
                  isEnrolled(course._id) ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-success" style={{ flex: 1 }} disabled>
                        ✓ Enrolled
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/course/${course._id}`)}
                      >
                        Continue
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => handleEnroll(course._id, course.price)}
                      disabled={course.enrolledStudents?.length >= course.maxStudents}
                    >
                      {course.enrolledStudents?.length >= course.maxStudents
                        ? '🔒 Course Full'
                        : course.price > 0
                          ? `💳 Pay ₹${course.price}`
                          : 'Enroll Now'
                      }
                    </button>
                  )
                )}

                {activeTab === 'enrolled' && (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => navigate(`/course/${course._id}`)}
                  >
                    📖 Continue Learning
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;