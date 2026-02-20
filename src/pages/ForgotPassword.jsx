import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/users/password/reset/', { email });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
        </div>

        {success && (
          <div className="success-message">
            <strong>✓ Email Sent!</strong>
            <p>Check your inbox for password reset instructions. The link will expire in 24 hours.</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            <Link to="/login">← Back to Login</Link>
          </p>
          {success && (
            <p style={{ marginTop: '10px' }}>
              Didn't receive it? <a href="#" onClick={(e) => { e.preventDefault(); setSuccess(false); }}>Try again</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
