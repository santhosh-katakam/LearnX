import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch payment history
    axios.get(`${API_BASE_URL}/payments/history`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading payment history:', err);
        setLoading(false);
      });
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
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
          Payment History
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Track all your course payments and transactions
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {payments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💳</div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>No payments found</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              You haven't made any course payments yet.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/courses')}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="fade-in-up">
            {payments.map((payment, index) => (
              <div key={payment._id} className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {getPaymentMethodIcon(payment.paymentMethod)}
                      </span>
                      <h4 style={{ color: '#333', margin: 0 }}>
                        {payment.courseId?.title || 'Course Not Found'}
                      </h4>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>Transaction ID:</span>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                          {payment.transactionId}
                        </p>
                      </div>
                      <div>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>Payment Date:</span>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                          {formatDate(payment.paymentDate)}
                        </p>
                      </div>
                      <div>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>Method:</span>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                          {payment.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {payment.paymentDetails && (
                      <div style={{ marginBottom: '1rem' }}>
                        {payment.paymentMethod === 'card' && payment.paymentDetails.cardLast4 && (
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                            Card ending in ****{payment.paymentDetails.cardLast4}
                          </p>
                        )}
                        {payment.paymentMethod === 'upi' && payment.paymentDetails.upiId && (
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                            UPI ID: {payment.paymentDetails.upiId}
                          </p>
                        )}
                        {payment.paymentMethod === 'qr' && (
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                            QR Code Payment to 9392963190@ybl (PhonePe)
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: '#6B46C1',
                      marginBottom: '0.5rem'
                    }}>
                      ₹{payment.amount}
                    </div>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: `${getStatusColor(payment.paymentStatus)}20`,
                      color: getStatusColor(payment.paymentStatus),
                      textTransform: 'uppercase'
                    }}>
                      {payment.paymentStatus}
                    </span>
                  </div>
                </div>

                {payment.paymentStatus === 'completed' && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.5rem',
                    backgroundColor: '#e8f5e8',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: '#2e7d32'
                  }}>
                    ✅ Payment received in PhonePe: 9392963190@ybl (LearnX)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
