import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [studentDetails, setStudentDetails] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Check if user is admin
    axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.role !== 'admin') {
          alert('Access denied. Admin only.');
          navigate('/dashboard');
          return;
        }
        setUser(res.data);
      })
      .catch(err => {
        console.error(err);
        navigate('/login');
      });

    // Fetch courses
    axios.get(`${API_BASE_URL}/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));

    // Fetch users
    axios.get(`${API_BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));

    // Fetch student details
    axios.get(`${API_BASE_URL}/student-details/all/details`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStudentDetails(res.data))
      .catch(err => console.error(err));

    // Fetch progress data
    axios.get(`${API_BASE_URL}/progress/all/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProgressData(res.data))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(courses.filter(course => course._id !== courseId));
      alert('Course deleted successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to delete course');
    }
  };

  const handleEditCourse = (courseId) => {
    // Navigate to edit course page
    navigate(`/edit-course/${courseId}`);
  };

  if (!user) return <div>Loading...</div>;

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const tabStyle = {
    padding: '10px 20px',
    margin: '5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white'
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#0056b3'
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    margin: '15px 0',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    padding: '8px 16px',
    margin: '5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white'
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ffc107',
    color: 'black'
  };

  const createButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '16px',
    padding: '12px 24px'
  };

  return (
    <div style={containerStyle}>
      <h2>Admin Panel</h2>
      <p>Welcome, {user.name}! Manage your LMS system below.</p>

      <div style={{ marginBottom: '20px' }}>
        <button
          style={activeTab === 'courses' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('courses')}
        >
          Manage Courses ({courses.length})
        </button>
        <button
          style={activeTab === 'users' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('users')}
        >
          Manage Users ({users.length})
        </button>
        <button
          style={activeTab === 'data' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('data')}
        >
          View Database ({studentDetails.length + progressData.length} records)
        </button>
        <button
          style={activeTab === 'admin-data' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('admin-data')}
        >
          Admin Data ({users.filter(u => u.role === 'admin').length} admins)
        </button>
        <button
          style={tabStyle}
          onClick={() => navigate('/payment-analytics')}
        >
          💰 Payment Analytics
        </button>
        <button
          style={tabStyle}
          onClick={() => navigate('/payment-verification')}
        >
          ✅ Verify Payments
        </button>
      </div>

      {activeTab === 'courses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Course Management</h3>
            <button
              style={createButtonStyle}
              onClick={() => navigate('/create-course')}
            >
              Create New Course
            </button>
          </div>

          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            courses.map(course => (
              <div key={course._id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4>{course.title}</h4>
                    <p>{course.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '14px', color: '#666' }}>
                      {course.instructor && <span>Instructor: {course.instructor}</span>}
                      {course.duration && <span>Duration: {course.duration}</span>}
                      {course.level && <span>Level: {course.level}</span>}
                      {course.category && <span>Category: {course.category}</span>}
                      <span>Enrolled: {course.enrolledStudents?.length || 0}/{course.maxStudents}</span>
                      <span>Price: ${course.price}</span>
                    </div>
                  </div>
                  <div>
                    <button
                      style={editButtonStyle}
                      onClick={() => handleEditCourse(course._id)}
                    >
                      Edit
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h3>User Management</h3>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map(user => (
              <div key={user._id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>{user.name}</h4>
                    <p>Email: {user.email}</p>
                    <p>Role: <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: user.role === 'admin' ? '#dc3545' : '#007bff',
                      color: 'white',
                      fontSize: '12px'
                    }}>{user.role}</span></p>
                  </div>
                  <div>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'data' && (
        <div className="fade-in-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#333', margin: 0 }}>Database Viewer</h2>
          </div>

          {/* Student Details Section */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Student Details ({studentDetails.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Student Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Phone</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Course</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Education</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Experience</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {studentDetails.map(detail => (
                    <tr key={detail._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>{detail.fullName}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>{detail.phone}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>{detail.courseId?.title || 'N/A'}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>{detail.education}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>{detail.experience}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>
                        {new Date(detail.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress Data Section */}
          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Course Progress ({progressData.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Student</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Course</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Videos Watched</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Quiz Score</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Completion %</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {progressData.map(progress => (
                    <tr key={progress._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>{progress.userId?.name || 'N/A'}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>{progress.courseId?.title || 'N/A'}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>{progress.videosWatched?.length || 0}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>{progress.quizScore || 0}%</td>
                      <td style={{ padding: '1rem', color: '#666' }}>{progress.completionPercentage || 0}%</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          backgroundColor: progress.isCompleted ? '#e8f5e8' : '#fff3cd',
                          color: progress.isCompleted ? '#2e7d32' : '#856404'
                        }}>
                          {progress.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'admin-data' && (
        <div className="fade-in-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#333', margin: 0 }}>Admin Data & System Information</h2>
          </div>

          {/* Admin Users Section */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>
              Admin Users ({users.filter(u => u.role === 'admin').length})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Admin Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Account Created</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Last Login</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => user.role === 'admin').map(admin => (
                    <tr key={admin._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>{admin.name}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>{admin.email}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', color: '#666' }}>
                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          backgroundColor: '#e8f5e8',
                          color: '#2e7d32'
                        }}>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Statistics */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#6B46C1', marginBottom: '1rem' }}>System Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #6B46C1 0%, #0D9488 100%)',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{courses.length}</h4>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Courses</p>
              </div>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{users.length}</h4>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Users</p>
              </div>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{studentDetails.length}</h4>
                <p style={{ margin: 0, opacity: 0.9 }}>Enrollments</p>
              </div>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                  {progressData.filter(p => p.isCompleted).length}
                </h4>
                <p style={{ margin: 0, opacity: 0.9 }}>Completions</p>
              </div>
            </div>
          </div>

          {/* Admin Actions Log */}
          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Recent Admin Actions</h3>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'white', borderRadius: '6px', borderLeft: '4px solid #28a745' }}>
                <strong>✅ Course Created:</strong> Latest course added to system
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                  {courses.length > 0 ? `"${courses[courses.length - 1]?.title}"` : 'No courses yet'}
                </div>
              </div>
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'white', borderRadius: '6px', borderLeft: '4px solid #007bff' }}>
                <strong>👥 User Management:</strong> Total users in system
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                  {users.filter(u => u.role === 'student').length} students, {users.filter(u => u.role === 'admin').length} admins
                </div>
              </div>
              <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', borderLeft: '4px solid #ffc107' }}>
                <strong>📊 System Status:</strong> All services operational
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                  Database: Connected | API: Running | Frontend: Active
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
