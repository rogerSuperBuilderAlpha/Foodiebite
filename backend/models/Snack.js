const mongoose = require('mongoose');

const SnackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Sweet', 'Savory', 'Healthy', 'Protein', 'Energy', 'Low-carb', 'Vegan', 'Gluten-free', 'Other'],
    required: true
  },
  ingredients: [String],
  nutrition_info: {
    calories: Number,
    protein: Number, // grams
    carbs: Number,   // grams
    fats: Number,    // grams
    fiber: Number,   // grams
    sugar: Number    // grams
  },
  preparation_time: {
    type: Number, // minutes
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  serving_size: String,
  storage_instructions: String,
  best_time_to_eat: [String], // e.g., ['Pre-workout', 'Post-workout', 'Mid-morning']
  dietary_tags: [String],
  health_benefits: [String],
  is_public: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  average_rating: {
    type: Number,
    default: 0
  },
  total_ratings: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
SnackSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Calculate average rating
SnackSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.average_rating = 0;
    this.total_ratings = 0;
  } else {
    const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.average_rating = totalRating / this.ratings.length;
    this.total_ratings = this.ratings.length;
  }
};

module.exports = mongoose.model('Snack', SnackSchema);
