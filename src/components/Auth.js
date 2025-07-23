import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ mode, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
      }

      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' 
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: '50px auto',
      padding: 40,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e1e8ed'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ 
          fontSize: 31, 
          fontWeight: 700, 
          color: '#0f1419',
          margin: '0 0 8px 0'
        }}>
          {mode === 'login' ? 'Sign in to FoodieBite' : 'Join FoodieBite today'}
        </h1>
        <p style={{ 
          fontSize: 15, 
          color: '#536471',
          margin: 0
        }}>
          {mode === 'login' ? 'Sign in to access your recipes and favorites' : 'Create your account to start sharing recipes'}
        </p>
      </div>

      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 14
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #cfd9de',
                borderRadius: 4,
                fontSize: 16,
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email"
            />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            {mode === 'login' ? 'Username or Email' : 'Username'}
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #cfd9de',
              borderRadius: 4,
              fontSize: 16,
              boxSizing: 'border-box'
            }}
            placeholder={mode === 'login' ? 'Username or email' : 'Choose a username'}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #cfd9de',
              borderRadius: 4,
              fontSize: 16,
              boxSizing: 'border-box'
            }}
            placeholder="Enter your password"
          />
        </div>

        {mode === 'register' && (
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #cfd9de',
                borderRadius: 4,
                fontSize: 16,
                boxSizing: 'border-box'
              }}
              placeholder="Confirm your password"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            background: loading ? '#1d9bf0' : '#1d9bf0',
            color: '#fff',
            border: 'none',
            borderRadius: 9999,
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Loading...' : (mode === 'login' ? 'Sign in' : 'Create account')}
        </button>
      </form>

      <div style={{ 
        textAlign: 'center', 
        marginTop: 24, 
        paddingTop: 24, 
        borderTop: '1px solid #e1e8ed' 
      }}>
        <p style={{ fontSize: 15, color: '#536471', margin: 0 }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => onSuccess({ switchMode: mode === 'login' ? 'register' : 'login' })}
            style={{
              background: 'none',
              border: 'none',
              color: '#1d9bf0',
              cursor: 'pointer',
              fontSize: 15,
              textDecoration: 'underline'
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm; 