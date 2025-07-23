// Frontend Security Utilities for FoodieBite

// Token Management
export const tokenManager = {
  // Store token securely
  setToken: (token) => {
    try {
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Failed to store token:', error);
      return false;
    }
  },

  // Get token
  getToken: () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  // Remove token
  removeToken: () => {
    try {
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error('Failed to remove token:', error);
      return false;
    }
  },

  // Check if token is valid
  isTokenValid: (token) => {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
};

// Input Sanitization
export const sanitizer = {
  // Sanitize text input
  sanitizeText: (text) => {
    if (typeof text !== 'string') return '';
    
    return text
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  },

  // Sanitize email
  sanitizeEmail: (email) => {
    if (typeof email !== 'string') return '';
    
    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailRegex.test(sanitized) ? sanitized : '';
  },

  // Sanitize username
  sanitizeUsername: (username) => {
    if (typeof username !== 'string') return '';
    
    const sanitized = username.trim().replace(/[^a-zA-Z0-9_]/g, '');
    return sanitized.length >= 3 && sanitized.length <= 15 ? sanitized : '';
  },

  // Sanitize URL
  sanitizeUrl: (url) => {
    if (typeof url !== 'string') return '';
    
    try {
      const sanitized = url.trim();
      new URL(sanitized); // Validate URL
      return sanitized;
    } catch {
      return '';
    }
  }
};

// Validation Functions
export const validators = {
  // Validate email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isStrongPassword: (password) => {
    if (typeof password !== 'string') return false;
    
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return password.length >= minLength && hasUppercase && hasLowercase && hasNumber;
  },

  // Validate username
  isValidUsername: (username) => {
    if (typeof username !== 'string') return false;
    
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    return usernameRegex.test(username);
  },

  // Validate rating
  isValidRating: (rating) => {
    const num = Number(rating);
    return !isNaN(num) && num >= 1 && num <= 5;
  }
};

// Security Headers for API Requests
export const getSecureHeaders = () => {
  const token = tokenManager.getToken();
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  };

  if (token && tokenManager.isTokenValid(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// CSRF Protection
export const csrfProtection = {
  // Generate CSRF token
  generateToken: () => {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('csrfToken', token);
    return token;
  },

  // Get CSRF token
  getToken: () => {
    return sessionStorage.getItem('csrfToken');
  },

  // Validate CSRF token
  validateToken: (token) => {
    const storedToken = sessionStorage.getItem('csrfToken');
    return token === storedToken;
  }
};

// XSS Protection
export const xssProtection = {
  // Escape HTML
  escapeHtml: (text) => {
    if (typeof text !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Safe innerHTML
  setInnerHTML: (element, content) => {
    if (element && typeof content === 'string') {
      element.textContent = content; // Use textContent instead of innerHTML
    }
  }
};

// Error Handling
export const securityErrorHandler = {
  // Handle authentication errors
  handleAuthError: (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken();
      window.location.href = '/auth';
      return 'Session expired. Please log in again.';
    }
    return error.response?.data?.error || 'An error occurred';
  },

  // Handle validation errors
  handleValidationError: (error) => {
    if (error.response?.status === 400) {
      return error.response.data.error || 'Invalid input provided';
    }
    return 'An error occurred';
  },

  // Handle rate limiting
  handleRateLimitError: (error) => {
    if (error.response?.status === 429) {
      return 'Too many requests. Please try again later.';
    }
    return 'An error occurred';
  }
};

// Security Configuration
export const securityConfig = {
  // API base URL
  apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Token expiration check interval (in minutes)
  tokenCheckInterval: 5,
  
  // Maximum retry attempts for failed requests
  maxRetries: 3,
  
  // Request timeout (in milliseconds)
  requestTimeout: 10000
};

export default {
  tokenManager,
  sanitizer,
  validators,
  getSecureHeaders,
  csrfProtection,
  xssProtection,
  securityErrorHandler,
  securityConfig
}; 