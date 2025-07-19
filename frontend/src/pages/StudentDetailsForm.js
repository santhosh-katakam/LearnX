import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const StudentDetailsForm = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    education: '',
    experience: '',
    motivation: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch course details
    axios.get(`${API_BASE_URL}/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCourse(res.data))
      .catch(err => {
        console.error(err);
        navigate('/courses');
      });
  }, [courseId, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      await axios.post(`${API_BASE_URL}/student-details/${courseId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Enroll in course
      await axios.post(`${API_BASE_URL}/courses/enroll/${courseId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Enrollment successful! Welcome to the course!');
      navigate(`/course/${courseId}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Enrollment failed');
    }
  };

  if (!course) return <div className="spinner"></div>;

  return (
    <div className="page-container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            Complete Your Enrollment
          </h1>
          <div className="card" style={{
            background: 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)',
            color: 'white',
            textAlign: 'left'
          }}>
            <h2 style={{ marginBottom: '0.5rem' }}>{course.title}</h2>
            <p style={{ opacity: '0.9', marginBottom: '1rem' }}>{course.shortDescription}</p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <span>👨‍🏫 {course.instructor}</span>
              <span>⏱️ {course.duration}</span>
              <span>📊 {course.level}</span>
              <span>⭐ {course.rating}/5</span>
            </div>
          </div>
        </div>

        <div className="card fade-in-up">
          <h2 style={{ marginBottom: '2rem', color: '#333' }}>Student Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div className="form-floating">
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={formData.fullName}
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
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <label className="form-label">Phone Number</label>
              </div>

              <div className="form-floating">
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-control"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                <label className="form-label">Date of Birth</label>
              </div>
            </div>

            <div className="form-floating">
              <textarea
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                style={{ minHeight: '100px' }}
                required
              />
              <label className="form-label">Address</label>
            </div>

            <div className="form-floating">
              <select
                name="education"
                className="form-control"
                value={formData.education}
                onChange={handleChange}
                required
              >
                <option value="">Select Education Level</option>
                <option value="High School">High School</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
              <label className="form-label">Education Level</label>
            </div>

            <div className="form-floating">
              <textarea
                name="experience"
                className="form-control"
                value={formData.experience}
                onChange={handleChange}
                style={{ minHeight: '100px' }}
              />
              <label className="form-label">Previous Experience (Optional)</label>
            </div>

            <div className="form-floating">
              <textarea
                name="motivation"
                className="form-control"
                value={formData.motivation}
                onChange={handleChange}
                style={{ minHeight: '120px' }}
                required
              />
              <label className="form-label">Why do you want to take this course?</label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/courses')}
              >
                Back to Courses
              </button>
              <button type="submit" className="btn btn-primary">
                Complete Enrollment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsForm;
