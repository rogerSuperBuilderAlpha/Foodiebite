// Security Configuration for FoodieBite
// This file contains security settings and validation functions

const crypto = require('crypto');

// Security Configuration
const securityConfig = {
  // JWT Settings
  jwt: {
    secret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
    expiresIn: '24h', // Shorter token expiration for security
    algorithm: 'HS256'
  },

  // Password Requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
    authMax: 5 // auth requests per window
  },

  // CORS Settings
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com', 'https://www.yourdomain.com']
      : ['http://localhost:3000'],
    credentials: true
  },

  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openweathermap.org"]
    }
  }
};

// Input Validation Functions
const validators = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isStrongPassword: (password) => {
    const { minLength, requireUppercase, requireLowercase, requireNumbers } = securityConfig.password;
    
    if (password.length < minLength) return false;
    if (requireUppercase && !/[A-Z]/.test(password)) return false;
    if (requireLowercase && !/[a-z]/.test(password)) return false;
    if (requireNumbers && !/\d/.test(password)) return false;
    
    return true;
  },

  // Validate username
  isValidUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    return usernameRegex.test(username);
  },

  // Sanitize input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  },

  // Validate MongoDB ObjectId
  isValidObjectId: (id) => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  },

  // Validate URL
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

// Security Headers Configuration
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// Error Messages
const errorMessages = {
  INVALID_EMAIL: 'Please provide a valid email address',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  INVALID_USERNAME: 'Username must be 3-15 characters with letters, numbers, and underscores only',
  INVALID_INPUT: 'Invalid input provided',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error'
};

module.exports = {
  securityConfig,
  validators,
  securityHeaders,
  errorMessages
}; 