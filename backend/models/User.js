const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 15
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String, 
    default: '' 
  },
  bio: { 
    type: String, 
    maxlength: 160,
    default: ''
  },
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Recipe' 
  }],
  isAdmin: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema); 