import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

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
      .then(res => {
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email
        });
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      });

    // Fetch enrolled courses
    axios.get(`${API_BASE_URL}/courses/enrolled/my-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setEnrolledCourses(res.data))
      .catch(err => console.error(err));
  }, [navigate]);

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
      const res = await axios.put(`${API_BASE_URL}/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to update profile');
    }
  };

  if (!user) return <div>Loading...</div>;

  const containerStyle = {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px'
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
    backgroundColor: '#f9f9f9'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const successButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white'
  };

  const courseCardStyle = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: 'white'
  };

  return (
    <div style={containerStyle}>
      <h2>My Profile</h2>
      
      <div style={cardStyle}>
        <h3>Personal Information</h3>
        {!isEditing ? (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            <button style={primaryButtonStyle} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <button type="submit" style={successButtonStyle}>
                Save Changes
              </button>
              <button 
                type="button" 
                style={secondaryButtonStyle}
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name,
                    email: user.email
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div style={cardStyle}>
        <h3>My Enrolled Courses ({enrolledCourses.length})</h3>
        {enrolledCourses.length === 0 ? (
          <p>You haven't enrolled in any courses yet.</p>
        ) : (
          enrolledCourses.map(course => (
            <div key={course._id} style={courseCardStyle}>
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
                {course.instructor && <span>Instructor: {course.instructor}</span>}
                {course.duration && <span>Duration: {course.duration}</span>}
                {course.level && <span>Level: {course.level}</span>}
              </div>
            </div>
          ))
        )}
        
        {enrolledCourses.length === 0 && (
          <button 
            style={primaryButtonStyle}
            onClick={() => navigate('/courses')}
          >
            Browse Courses
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
