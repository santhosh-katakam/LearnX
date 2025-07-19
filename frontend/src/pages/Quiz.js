import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Quiz = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch course details (public endpoint)
    axios.get(`${API_BASE_URL}/courses/${courseId}`)
      .then(res => {
        console.log('Quiz course loaded:', res.data.title);
        setCourse(res.data);
      })
      .catch(err => {
        console.error('Error loading course for quiz:', err);
        navigate('/courses');
      });
  }, [courseId, navigate]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    course.quiz.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / course.quiz.length) * 100);
  };

  const handleSubmitQuiz = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);

    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/progress/${courseId}/quiz`, {
        score: finalScore,
        answers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < course.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (!course) return <div className="spinner"></div>;

  if (showResults) {
    return (
      <div className="page-container">
        <div className="quiz-container fade-in-up">
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: score >= 70 ? '#4facfe' : '#ff6b6b',
              marginBottom: '1rem'
            }}>
              {score >= 70 ? '🎉 Congratulations!' : '📚 Keep Learning!'}
            </h1>
            
            <div className="card" style={{ 
              background: score >= 70 ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              color: 'white',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div className="stat-number">{score}%</div>
              <div className="stat-label">Your Score</div>
              <p style={{ marginTop: '1rem', opacity: '0.9' }}>
                You answered {Object.values(answers).filter((answer, index) => answer === course.quiz[index]?.correctAnswer).length} out of {course.quiz.length} questions correctly
              </p>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Quiz Results</h3>
              {course.quiz.map((question, index) => (
                <div key={index} style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1rem',
                  border: `2px solid ${answers[index] === question.correctAnswer ? '#4facfe' : '#ff6b6b'}`,
                  borderRadius: '8px',
                  background: answers[index] === question.correctAnswer ? 'rgba(79, 172, 254, 0.1)' : 'rgba(255, 107, 107, 0.1)'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                    {index + 1}. {question.question}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Your answer: {question.options[answers[index]] || 'Not answered'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#4facfe', fontWeight: '600' }}>
                    Correct answer: {question.options[question.correctAnswer]}
                  </div>
                  {question.explanation && (
                    <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      {question.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => navigate(`/completion/${courseId}`)}
                className="btn btn-primary"
              >
                {score >= 70 ? 'View Certificate' : 'Continue Learning'}
              </button>
              <button 
                onClick={() => navigate('/courses')}
                className="btn btn-outline"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = course.quiz[currentQuestion];

  return (
    <div className="page-container">
      <div className="quiz-container fade-in-up">
        {/* Quiz Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#333' }}>
            {course.title} - Quiz
          </h1>
          <div style={{ 
            padding: '0.5rem 1rem',
            background: timeLeft < 300 ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            ⏰ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: '2rem' }}>
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / course.quiz.length) * 100}%` }}
          ></div>
        </div>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
          Question {currentQuestion + 1} of {course.quiz.length}
        </p>

        {/* Question */}
        <div className="card">
          <div className="quiz-question">
            {currentQuestionData.question}
          </div>
          
          <div className="quiz-options">
            {currentQuestionData.options.map((option, index) => (
              <div
                key={index}
                className={`quiz-option ${answers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
              >
                <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className="btn btn-secondary"
          >
            ← Previous
          </button>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {currentQuestion === course.quiz.length - 1 ? (
              <button 
                onClick={handleSubmitQuiz}
                className="btn btn-success"
                disabled={Object.keys(answers).length !== course.quiz.length}
              >
                Submit Quiz
              </button>
            ) : (
              <button 
                onClick={handleNextQuestion}
                className="btn btn-primary"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Question Overview */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#333' }}>Question Overview</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {course.quiz.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: answers[index] !== undefined 
                    ? (currentQuestion === index ? '#667eea' : '#4facfe')
                    : (currentQuestion === index ? '#667eea' : '#e0e0e0'),
                  color: answers[index] !== undefined || currentQuestion === index ? 'white' : '#666'
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
