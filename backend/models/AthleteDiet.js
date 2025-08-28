const mongoose = require('mongoose');

const AthleteDietSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sport: {
    type: String,
    required: true,
    enum: ['Football', 'Basketball', 'Soccer', 'Tennis', 'Swimming', 'Running', 'Weightlifting', 'Yoga', 'CrossFit', 'Other']
  },
  diet_name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  daily_calories: {
    type: Number,
    required: true
  },
  macronutrients: {
    protein: { type: Number, required: true }, // grams
    carbs: { type: Number, required: true },   // grams
    fats: { type: Number, required: true }     // grams
  },
  meal_plan: [{
    meal_type: {
      type: String,
      enum: ['Breakfast', 'Snack', 'Lunch', 'Pre-workout', 'Post-workout', 'Dinner']
    },
    foods: [String],
    timing: String,
    notes: String
  }],
  supplements: [String],
  hydration_plan: {
    daily_water: Number, // liters
    pre_workout: String,
    during_workout: String,
    post_workout: String
  },
  training_schedule: {
    days_per_week: Number,
    workout_duration: Number, // minutes
    rest_days: [String]
  },
  results: {
    weight_change: Number, // kg
    performance_improvement: String,
    energy_levels: String
  },
  is_public: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
AthleteDietSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('AthleteDiet', AthleteDietSchema);
