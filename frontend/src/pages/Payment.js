import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Payment = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: ''
  });
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [realTransactionId, setRealTransactionId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch course details
    axios.get(`${API_BASE_URL}/courses/${courseId}`)
      .then(res => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading course:', err);
        navigate('/courses');
      });
  }, [courseId, navigate]);

  const handleInputChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Handle instant PhonePe payment
    if (paymentMethod === 'phonepe') {
      handlePhonePePayment();
      return;
    }

    try {
      // Prepare payment details based on method
      let paymentDetails = {};

      if (paymentMethod === 'card') {
        paymentDetails = {
          cardLast4: paymentData.cardNumber.slice(-4),
          cardType: 'Credit/Debit'
        };
      } else if (paymentMethod === 'upi') {
        paymentDetails = {
          upiId: paymentData.upiId
        };
      } else if (paymentMethod === 'qr') {
        paymentDetails = {
          qrReference: `QR_${Date.now()}`
        };
      }

      // Process payment through backend
      const response = await axios.post(`${API_BASE_URL}/payments/process`, {
        courseId: courseId,
        amount: course.price,
        paymentMethod: paymentMethod,
        paymentDetails: paymentDetails
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        if (response.data.requiresVerification) {
          // Payment initiated, now requires verification
          setVerificationData({
            transactionId: response.data.transactionId,
            verificationCode: response.data.verificationCode
          });
          setPaymentInitiated(true);
        } else {
          alert(`Payment successful! Transaction ID: ${response.data.transactionId}`);
          navigate(`/student-details/${courseId}`);
        }
      } else {
        alert('Payment failed. Please try again.');
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.msg || 'Payment failed. Please try again.');
    }
  };

  const handlePhonePePayment = async () => {
    const token = localStorage.getItem('token');

    try {
      // Create PhonePe order
      const orderResponse = await axios.post(`${API_BASE_URL}/payments/create-phonepe-order`, {
        courseId: courseId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { orderId, amount, upiId, qrCodeUrl } = orderResponse.data;

      // Show PhonePe payment instructions
      setVerificationData({
        orderId: orderId,
        amount: amount,
        upiId: upiId,
        qrCodeUrl: qrCodeUrl
      });
      setPaymentInitiated(true);

    } catch (error) {
      console.error('PhonePe order creation error:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const handlePhonePeVerification = async (e) => {
    e.preventDefault();

    if (!realTransactionId.trim()) {
      alert('Please enter the PhonePe transaction ID');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_BASE_URL}/payments/verify-phonepe-payment`, {
        orderId: verificationData.orderId,
        transactionId: realTransactionId,
        amount: verificationData.amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('🎉 Payment verified! You now have instant access to the course.');
        navigate(`/student-details/${courseId}`);
      } else {
        alert('Payment verification failed. Please check your transaction ID.');
      }

    } catch (error) {
      console.error('PhonePe verification error:', error);
      alert(error.response?.data?.msg || 'Verification failed. Please try again.');
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();

    if (!realTransactionId.trim()) {
      alert('Please enter the transaction ID from your PhonePe payment');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_BASE_URL}/payments/verify`, {
        transactionId: verificationData.transactionId,
        realTransactionId: realTransactionId,
        verificationCode: verificationData.verificationCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Payment verification submitted! Admin will verify and grant access within 24 hours. You will receive an email confirmation.');
        navigate('/dashboard');
      } else {
        alert('Verification failed. Please try again.');
      }

    } catch (error) {
      console.error('Verification error:', error);
      alert(error.response?.data?.msg || 'Verification failed. Please try again.');
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (!course) return <div>Course not found</div>;

  // Show verification form after payment is initiated
  if (paymentInitiated && verificationData) {
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
            Payment Verification Required
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem'
          }}>
            Complete your payment and verify to get course access
          </p>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card">
            <h3 style={{ color: '#1a237e', marginBottom: '1rem' }}>📱 Payment Instructions</h3>

            <div style={{
              padding: '1rem',
              backgroundColor: '#f3e5f5',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '2px solid #9c27b0'
            }}>
              <h4 style={{ color: '#7b1fa2', marginBottom: '1rem' }}>Step 1: Complete Payment</h4>
              <p style={{ margin: '0.5rem 0', color: '#7b1fa2' }}>
                📲 Open PhonePe app → Pay to <strong>9392963190@ybl</strong>
              </p>
              <p style={{ margin: '0.5rem 0', color: '#7b1fa2' }}>
                💰 Amount: <strong>₹{verificationData?.amount || course.price}</strong>
              </p>
              <p style={{ margin: '0.5rem 0', color: '#7b1fa2' }}>
                📝 Note: <strong>Course Payment - {course.title}</strong>
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '2px solid #2196f3'
            }}>
              <h4 style={{ color: '#1565c0', marginBottom: '1rem' }}>Step 2: Enter Transaction ID</h4>
              <p style={{ margin: '0.5rem 0', color: '#1565c0' }}>
                After payment, you'll receive a transaction ID from PhonePe. Enter it below:
              </p>
            </div>

            <form onSubmit={paymentMethod === 'phonepe' ? handlePhonePeVerification : handleVerification}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    value={realTransactionId}
                    onChange={(e) => setRealTransactionId(e.target.value)}
                    required
                  />
                  <label className="form-label">PhonePe Transaction ID *</label>
                </div>
                <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  Example: T2312345678901234567
                </small>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: '#fff3e0',
                borderRadius: '8px',
                marginBottom: '2rem',
                fontSize: '0.9rem',
                color: '#f57c00'
              }}>
                <p style={{ margin: '0.5rem 0', fontWeight: '600' }}>
                  ⚠️ Important: Only enter the transaction ID AFTER you have completed the actual payment
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  • Enter transaction ID for instant verification
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  • Course access granted immediately after verification
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  • Order ID: <strong>{verificationData?.orderId}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/courses')}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  ✅ Verify Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
          Complete Your Payment
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Secure payment for your course enrollment
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Course Summary */}
        <div className="card">
          <h3 style={{ color: '#1a237e', marginBottom: '1rem' }}>📚 Course Summary</h3>
          
          {course.thumbnail && (
            <div style={{
              width: '100%',
              height: '150px',
              backgroundImage: `url(${course.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}></div>
          )}
          
          <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>{course.title}</h4>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {course.shortDescription}
          </p>
          
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Course Fee:</span>
              <span style={{ fontWeight: '600' }}>₹{course.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Processing Fee:</span>
              <span>₹0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '0.5rem', fontSize: '1.1rem', fontWeight: '700' }}>
              <span>Total Amount:</span>
              <span style={{ color: '#1a237e' }}>₹{course.price}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="card">
          <h3 style={{ color: '#1a237e', marginBottom: '1rem' }}>💳 Payment Details</h3>
          
          {/* Payment Method Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Payment Method</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                💳 Credit/Debit Card
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                📱 UPI
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  value="qr"
                  checked={paymentMethod === 'qr'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                📲 QR Code
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  value="phonepe"
                  checked={paymentMethod === 'phonepe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                ⚡ PhonePe Instant
              </label>
            </div>
          </div>

          <form onSubmit={handlePayment}>
            {paymentMethod === 'card' ? (
              <>
                <div className="form-group">
                  <div className="form-floating">
                    <input
                      type="text"
                      name="cardholderName"
                      className="form-control"
                      value={paymentData.cardholderName}
                      onChange={handleInputChange}
                      required
                    />
                    <label className="form-label">Cardholder Name *</label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-floating">
                    <input
                      type="text"
                      name="cardNumber"
                      className="form-control"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      maxLength="19"
                      required
                    />
                    <label className="form-label">Card Number *</label>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="expiryDate"
                        className="form-control"
                        value={paymentData.expiryDate}
                        onChange={handleInputChange}
                        maxLength="5"
                        required
                      />
                      <label className="form-label">Expiry Date *</label>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="cvv"
                        className="form-control"
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        maxLength="3"
                        required
                      />
                      <label className="form-label">CVV *</label>
                    </div>
                  </div>
                </div>
              </>
            ) : paymentMethod === 'upi' ? (
              <div className="form-group">
                <div className="form-floating">
                  <input
                    type="text"
                    name="upiId"
                    className="form-control"
                    value={paymentData.upiId}
                    onChange={handleInputChange}
                    required
                  />
                  <label className="form-label">UPI ID *</label>
                </div>
              </div>
            ) : paymentMethod === 'phonepe' ? (
              // PhonePe Instant Payment
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: '#1a237e', marginBottom: '1rem' }}>⚡ PhonePe Instant Payment</h4>
                <div style={{
                  padding: '2rem',
                  backgroundColor: '#f3e5f5',
                  borderRadius: '12px',
                  border: '2px solid #9c27b0',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
                  <h3 style={{ color: '#7b1fa2', marginBottom: '1rem' }}>Pay & Get Instant Access</h3>
                  <p style={{ color: '#666', marginBottom: '1rem' }}>
                    Pay with PhonePe and get immediate course access
                  </p>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6B46C1', marginBottom: '1rem' }}>
                    ₹{course.price}
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <p style={{ margin: '0.5rem 0', color: '#7b1fa2', fontWeight: '600' }}>
                      📱 Pay to: 9392963190@ybl
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                      Account: LearnX
                    </p>
                  </div>
                </div>
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '8px',
                  border: '1px solid #28a745'
                }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#2e7d32', fontWeight: '600' }}>
                    ⚡ Enter transaction ID after payment for instant access
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#2e7d32' }}>
                    No waiting time - immediate verification
                  </p>
                </div>
              </div>
            ) : (
              // QR Code Payment
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: '#6B46C1', marginBottom: '1rem' }}>📲 Pay with PhonePe QR Code</h4>
                <div style={{
                  display: 'inline-block',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px solid #e9ecef'
                }}>
                  <div style={{
                    width: '200px',
                    height: '200px',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=9392963190@ybl&pn=SR University&am=${course.price}&cu=INR&tn=Course Payment - ${course.title}`}
                      alt="Payment QR Code"
                      style={{ width: '180px', height: '180px' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    <p style={{ margin: '0.5rem 0', fontWeight: '600' }}>📱 9392963190@ybl</p>
                    <p style={{ margin: '0.5rem 0' }}>Amount: ₹{course.price}</p>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.8rem' }}>Scan with PhonePe or any UPI app</p>
                  </div>
                </div>
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3e5f5', borderRadius: '8px', border: '1px solid #9c27b0' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#7b1fa2', fontWeight: '600' }}>
                    📱 Open PhonePe app → Scan QR → Pay ₹{course.price}
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#7b1fa2' }}>
                    After payment, click "Confirm Payment" below
                  </p>
                </div>
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/courses')}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                {paymentMethod === 'qr' ? '✅ Confirm Payment' :
                 paymentMethod === 'phonepe' ? `⚡ Pay ₹${course.price} with PhonePe` :
                 `💳 Pay ₹${course.price}`}
              </button>
            </div>
          </form>

          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '0.85rem', color: '#666' }}>
            🔒 Your payment information is secure and encrypted. Payments go directly to SR University's PhonePe account.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
