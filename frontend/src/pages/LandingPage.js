import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCourseClick = () => {
    navigate('/dashboard');
  };



  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Animation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: 'float 20s ease-in-out infinite'
      }} />

      {/* Header with two sections */}
      <div style={{
        display: 'flex',
        height: '100px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>


        {/* COURSE Section */}
        <div
          onClick={handleCourseClick}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            fontSize: '2.5rem',
            fontWeight: '700',
            letterSpacing: '0.1em',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 12px 40px rgba(245, 87, 108, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>COURSE</span>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }} />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '3rem',
        position: 'relative',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          animation: 'fadeInUp 1s ease-out'
        }}>
          <h2 style={{
            fontSize: '4rem',
            marginBottom: '1.5rem',
            background: '#1e3a8a',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }}>
            Welcome to SR University
          </h2>
          <p style={{
            marginBottom: '3rem',
            fontSize: '1.4rem',
            color: '#4a5568',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Discover excellence in education with our comprehensive learning management system
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '800px',
            width: '100%'
          }}>


            <div
              onClick={handleCourseClick}
              style={{
                padding: '3rem 2rem',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'center',
                color: 'white',
                boxShadow: '0 10px 30px rgba(245, 87, 108, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px) scale(1.02)';
                e.target.style.boxShadow = '0 20px 40px rgba(245, 87, 108, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 30px rgba(245, 87, 108, 0.3)';
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>🎓</div>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '2rem',
                fontWeight: '700',
                letterSpacing: '0.05em'
              }}>COURSE</h3>
              <p style={{
                margin: 0,
                fontSize: '1.1rem',
                opacity: 0.9,
                lineHeight: '1.5'
              }}>Learning Management System</p>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div style={{ position: 'absolute', top: '30px', right: '30px', zIndex: 1000 }}>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span>🚪</span> Logout
          </button>
        </div>

        {/* Add CSS animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LandingPage;
