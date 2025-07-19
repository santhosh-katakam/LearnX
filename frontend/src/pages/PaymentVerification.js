import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const PaymentVerification = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch all payments for admin verification
    axios.get(`${API_BASE_URL}/payments/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // Filter payments that need verification
        const pendingPayments = res.data.filter(payment => 
          payment.paymentStatus === 'pending' || payment.paymentStatus === 'verification_required'
        );
        setPayments(pendingPayments);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading payments:', err);
        if (err.response?.status === 403) {
          alert('Access denied. Admin only.');
          navigate('/admin');
        }
        setLoading(false);
      });
  }, [navigate]);

  const handleVerifyPayment = async (paymentId, approved) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/admin/verify/${paymentId}`, {
        approved: approved
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert(approved ? 'Payment approved! Student will get course access.' : 'Payment rejected.');
        // Remove the payment from the list
        setPayments(payments.filter(p => p._id !== paymentId));
      }
    } catch (err) {
      console.error('Verification error:', err);
      alert('Failed to verify payment');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          Payment Verification
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Verify student payments and grant course access
        </p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {payments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>No payments to verify</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              All payments have been processed. New payment verifications will appear here.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/payment-analytics')}
            >
              View Payment Analytics
            </button>
          </div>
        ) : (
          <div className="fade-in-up">
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#fff3e0',
                borderRadius: '20px',
                color: '#f57c00',
                fontWeight: '600'
              }}>
                {payments.length} payment{payments.length !== 1 ? 's' : ''} awaiting verification
              </div>
            </div>

            {payments.map((payment) => (
              <div key={payment._id} className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <h4 style={{ color: '#333', margin: 0 }}>
                        {payment.userId?.name || 'Unknown User'}
                      </h4>
                      <span style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: '#fff3e0',
                        color: '#f57c00'
                      }}>
                        PENDING VERIFICATION
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ margin: '0.5rem 0', color: '#666' }}>
                        <strong>Course:</strong> {payment.courseId?.title || 'Unknown Course'}
                      </p>
                      <p style={{ margin: '0.5rem 0', color: '#666' }}>
                        <strong>Student Email:</strong> {payment.userId?.email || 'Unknown'}
                      </p>
                      <p style={{ margin: '0.5rem 0', color: '#666' }}>
                        <strong>Payment Date:</strong> {formatDate(payment.paymentDate)}
                      </p>
                    </div>

                    <div style={{ 
                      padding: '1rem', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}>
                      <h5 style={{ color: '#333', marginBottom: '0.5rem' }}>Payment Details:</h5>
                      <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                        <strong>Our Transaction ID:</strong> {payment.transactionId}
                      </p>
                      {payment.realTransactionId && (
                        <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                          <strong>Student's Transaction ID:</strong> {payment.realTransactionId}
                        </p>
                      )}
                      <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                        <strong>Payment Method:</strong> {payment.paymentMethod.toUpperCase()}
                      </p>
                      <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                        <strong>Verification Code:</strong> {payment.verificationCode}
                      </p>
                    </div>

                    <div style={{ 
                      padding: '1rem', 
                      backgroundColor: '#f3e5f5', 
                      borderRadius: '8px',
                      border: '1px solid #9c27b0'
                    }}>
                      <h5 style={{ color: '#7b1fa2', marginBottom: '0.5rem' }}>Verify in PhonePe:</h5>
                      <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#7b1fa2' }}>
                        1. Open PhonePe app → Check transaction history
                      </p>
                      <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#7b1fa2' }}>
                        2. Look for payment of ₹{payment.amount} from {payment.userId?.name}
                      </p>
                      <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#7b1fa2' }}>
                        3. Match transaction ID: {payment.realTransactionId || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', marginLeft: '2rem' }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: '700', 
                      color: '#1a237e',
                      marginBottom: '1rem'
                    }}>
                      ₹{payment.amount}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleVerifyPayment(payment._id, true)}
                        style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                      >
                        ✅ Approve Payment
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleVerifyPayment(payment._id, false)}
                        style={{ 
                          fontSize: '0.9rem', 
                          padding: '8px 16px',
                          backgroundColor: '#dc3545',
                          color: 'white'
                        }}
                      >
                        ❌ Reject Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/admin')}
          >
            ← Back to Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;
