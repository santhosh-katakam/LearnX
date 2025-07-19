import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const EditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    level: 'Undergraduate',
    category: '',
    department: '',
    maxStudents: 50,
    price: 0
  });

  const [videos, setVideos] = useState([
    { title: '', description: '', videoUrl: '', duration: '', order: 1 }
  ]);

  const [quizQuestions, setQuizQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }
  ]);

  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...videos];

    // Auto-convert YouTube URLs to embed format
    if (field === 'videoUrl' && value) {
      value = convertToEmbedUrl(value);
    }

    updatedVideos[index][field] = value;
    setVideos(updatedVideos);
  };

  const convertToEmbedUrl = (url) => {
    if (!url) return url;

    // Extract video ID from various YouTube URL formats
    let videoId = null;

    // Handle youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    // Handle youtu.be/VIDEO_ID
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    // Handle youtube.com/embed/VIDEO_ID (already correct)
    else if (url.includes('youtube.com/embed/')) {
      return url;
    }

    // If we found a video ID, convert to embed format
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Return original URL if no conversion needed
    return url;
  };

  const addVideo = () => {
    setVideos([...videos, { title: '', description: '', videoUrl: '', duration: '', order: videos.length + 1 }]);
  };

  const removeVideo = (index) => {
    if (videos.length > 1) {
      setVideos(videos.filter((_, i) => i !== index));
    }
  };

  const handleQuizChange = (questionIndex, field, value, optionIndex = null) => {
    const updatedQuestions = [...quizQuestions];
    if (field === 'options' && optionIndex !== null) {
      updatedQuestions[questionIndex].options[optionIndex] = value;
    } else {
      updatedQuestions[questionIndex][field] = value;
    }
    setQuizQuestions(updatedQuestions);
  };

  const addQuizQuestion = () => {
    setQuizQuestions([...quizQuestions, { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]);
  };

  const removeQuizQuestion = (index) => {
    if (quizQuestions.length > 1) {
      setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
    }
  };

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
      .then(res => {
        const course = res.data;
        setFormData({
          title: course.title || '',
          description: course.description || '',
          instructor: course.instructor || '',
          level: course.level || 'Undergraduate',
          category: course.category || '',
          department: course.department || '',
          maxStudents: course.maxStudents || 50,
          price: course.price || 0
        });

        // Set videos data
        if (course.videos && course.videos.length > 0) {
          setVideos(course.videos);
        }

        // Set quiz data
        if (course.quiz && course.quiz.length > 0) {
          setQuizQuestions(course.quiz);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load course details');
        navigate('/admin');
      });
  }, [courseId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    // Validate form data
    if (!formData.title || !formData.description || !formData.instructor || !formData.department || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (videos.some(video => !video.title || !video.videoUrl)) {
      alert('Please fill in all video details');
      return;
    }

    if (quizQuestions.some(q => !q.question || q.options.some(opt => !opt) || !q.explanation)) {
      alert('Please fill in all quiz questions completely');
      return;
    }

    try {
      const courseData = {
        ...formData,
        shortDescription: formData.description.substring(0, 100) + (formData.description.length > 100 ? '...' : ''),
        videos: videos,
        quiz: quizQuestions
      };

      await axios.put(`${API_BASE_URL}/courses/${courseId}`, courseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Course updated successfully!');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to update course');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="page-container">
      <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Edit Course
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Update course information, videos, and quiz questions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Basic Course Information */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#1a237e', marginBottom: '1rem' }}>📚 Course Information</h3>

          <div className="form-group">
            <div className="form-floating">
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <label className="form-label">Course Title *</label>
            </div>
          </div>

          <div className="form-group">
            <div className="form-floating">
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                style={{ height: '120px' }}
                required
              />
              <label className="form-label">Course Description *</label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <div className="form-floating">
                <input
                  type="text"
                  name="instructor"
                  className="form-control"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                />
                <label className="form-label">Instructor Name *</label>
              </div>
            </div>

            <div className="form-group">
              <div className="form-floating">
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
                <label className="form-label">Department *</label>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div className="form-group">
              <div className="form-floating">
                <select
                  name="level"
                  className="form-control"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
                <label className="form-label">Course Level *</label>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <div className="form-floating">
                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
                <label className="form-label">Category *</label>
              </div>
            </div>

            <div className="form-group">
              <div className="form-floating">
                <input
                  type="number"
                  name="maxStudents"
                  className="form-control"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  min="1"
                  max="200"
                  required
                />
                <label className="form-label">Max Students *</label>
              </div>
            </div>

            <div className="form-group">
              <div className="form-floating">
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
                <label className="form-label">Price (₹) - 0 for Free</label>
              </div>
              <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                💡 Set price to 0 for free courses, or enter amount for paid courses
              </small>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#1a237e' }}>🎥 Course Videos</h3>
            <button
              type="button"
              className="btn btn-outline"
              onClick={addVideo}
              style={{ fontSize: '0.9rem', padding: '8px 16px' }}
            >
              + Add Video
            </button>
          </div>

          {videos.map((video, index) => (
            <div key={index} className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: '#333', margin: 0 }}>Video {index + 1}</h4>
                {videos.length > 1 && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => removeVideo(index)}
                    style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '0.8rem', padding: '4px 8px' }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      value={video.title}
                      onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                      required
                    />
                    <label className="form-label">Video Title *</label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      value={video.duration}
                      onChange={(e) => handleVideoChange(index, 'duration', e.target.value)}
                      required
                    />
                    <label className="form-label">Duration (e.g., 15:30) *</label>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <div className="form-floating">
                  <input
                    type="url"
                    className="form-control"
                    value={video.videoUrl}
                    onChange={(e) => handleVideoChange(index, 'videoUrl', e.target.value)}
                    required
                  />
                  <label className="form-label">YouTube Video URL (any format) *</label>
                </div>
                <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  💡 Paste any YouTube URL format - it will be automatically converted to embed format
                </small>
              </div>

              <div className="form-group">
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    value={video.description}
                    onChange={(e) => handleVideoChange(index, 'description', e.target.value)}
                    style={{ height: '80px' }}
                    required
                  />
                  <label className="form-label">Video Description *</label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#1a237e' }}>❓ Quiz Questions</h3>
            <button
              type="button"
              className="btn btn-outline"
              onClick={addQuizQuestion}
              style={{ fontSize: '0.9rem', padding: '8px 16px' }}
            >
              + Add Question
            </button>
          </div>

          {quizQuestions.map((question, questionIndex) => (
            <div key={questionIndex} className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: '#333', margin: 0 }}>Question {questionIndex + 1}</h4>
                {quizQuestions.length > 1 && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => removeQuizQuestion(questionIndex)}
                    style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '0.8rem', padding: '4px 8px' }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    value={question.question}
                    onChange={(e) => handleQuizChange(questionIndex, 'question', e.target.value)}
                    style={{ height: '80px' }}
                    required
                  />
                  <label className="form-label">Question Text *</label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="form-group">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        value={option}
                        onChange={(e) => handleQuizChange(questionIndex, 'options', e.target.value, optionIndex)}
                        required
                      />
                      <label className="form-label">Option {optionIndex + 1} *</label>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div className="form-group">
                  <div className="form-floating">
                    <select
                      className="form-control"
                      value={question.correctAnswer}
                      onChange={(e) => handleQuizChange(questionIndex, 'correctAnswer', parseInt(e.target.value))}
                      required
                    >
                      <option value={0}>Option 1</option>
                      <option value={1}>Option 2</option>
                      <option value={2}>Option 3</option>
                      <option value={3}>Option 4</option>
                    </select>
                    <label className="form-label">Correct Answer *</label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      value={question.explanation}
                      onChange={(e) => handleQuizChange(questionIndex, 'explanation', e.target.value)}
                      style={{ height: '80px' }}
                      required
                    />
                    <label className="form-label">Explanation *</label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 32px' }}>
            🎓 Update Course
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/admin')}
            style={{ fontSize: '1.1rem', padding: '12px 32px', marginLeft: '1rem' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
