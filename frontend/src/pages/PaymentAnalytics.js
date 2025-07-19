import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const PaymentAnalytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    paymentsByMethod: [],
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch payment analytics
    axios.get(`${API_BASE_URL}/payments/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading payment analytics:', err);
        if (err.response?.status === 403) {
          alert('Access denied. Admin only.');
          navigate('/dashboard');
        }
        setLoading(false);
      });
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card': return '💳';
      case 'upi': return '📱';
      case 'qr': return '📲';
      default: return '💰';
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
          Payment Analytics
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Track revenue and payment insights for LearnX
        </p>
      </div>

      {/* Revenue Summary */}
      <div className="fade-in-up" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>💰 Total Revenue</h2>
          <div style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            color: '#4caf50',
            marginBottom: '0.5rem'
          }}>
            ₹{analytics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Received in PhonePe: 9392963190@ybl
          </p>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="fade-in-up" style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem', textAlign: 'center' }}>
          📊 Payment Methods Breakdown
        </h2>
        
        {analytics.paymentsByMethod.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#666' }}>No payments received yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {analytics.paymentsByMethod.map((method, index) => (
              <div key={index} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {getPaymentMethodIcon(method._id)}
                </div>
                <h3 style={{ color: '#333', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {method._id}
                </h3>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a237e', marginBottom: '0.5rem' }}>
                  ₹{method.total.toLocaleString('en-IN')}
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {method.count} transaction{method.count !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Payments */}
      <div className="fade-in-up" style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem', textAlign: 'center' }}>
          🕒 Recent Payments
        </h2>
        
        {analytics.recentPayments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💳</div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>No payments yet</h3>
            <p style={{ color: '#666' }}>
              Payments will appear here once students start enrolling in paid courses.
            </p>
          </div>
        ) : (
          <div>
            {analytics.recentPayments.map((payment, index) => (
              <div key={payment._id} className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {getPaymentMethodIcon(payment.paymentMethod)}
                      </span>
                      <h4 style={{ color: '#333', margin: 0 }}>
                        {payment.userId?.name || 'Unknown User'}
                      </h4>
                    </div>
                    
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>
                      Course: {payment.courseId?.title || 'Unknown Course'}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                      <span>📅 {formatDate(payment.paymentDate)}</span>
                      <span>🔢 {payment.transactionId}</span>
                      <span style={{ textTransform: 'uppercase' }}>
                        {payment.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: '#4caf50',
                      marginBottom: '0.5rem'
                    }}>
                      ₹{payment.amount}
                    </div>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: '#e8f5e8',
                      color: '#2e7d32'
                    }}>
                      COMPLETED
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PhonePe Account Info */}
      <div className="fade-in-up" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>📱 PhonePe Account Details</h3>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            <strong>UPI ID:</strong> 9392963190@ybl
          </div>
          <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            <strong>Account Holder:</strong> LearnX
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.9 }}>
            All course payments are received directly in this PhonePe account
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          className="btn btn-outline"
          onClick={() => navigate('/admin')}
        >
          ← Back to Admin Panel
        </button>
      </div>
    </div>
  );
};

export default PaymentAnalytics;
