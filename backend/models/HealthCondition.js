const mongoose = require('mongoose');

const HealthConditionSchema = new mongoose.Schema({
  condition_type: {
    type: String,
    enum: ['Diabetes', 'Eating Disorder', 'Heart Disease', 'Celiac Disease', 'Lactose Intolerance', 'Hypertension', 'Other'],
    required: true
  },
  condition_name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  severity_level: {
    type: String,
    enum: ['Mild', 'Moderate', 'Severe'],
    required: true
  },
  dietary_restrictions: [String],
  recommended_foods: [String],
  foods_to_avoid: [String],
  nutritional_guidelines: {
    daily_calories: {
      min: Number,
      max: Number
    },
    macronutrients: {
      protein: { min: Number, max: Number }, // percentage of daily calories
      carbs: { min: Number, max: Number },   // percentage of daily calories
      fats: { min: Number, max: Number }     // percentage of daily calories
    },
    micronutrients: {
      fiber: { min: Number, max: Number },   // grams
      sodium: { min: Number, max: Number },  // mg
      potassium: { min: Number, min: Number }, // mg
      vitamins: [String],
      minerals: [String]
    }
  },
  meal_timing: {
    frequency: String, // e.g., "3 main meals + 2 snacks"
    spacing: String,   // e.g., "Every 3-4 hours"
    special_considerations: String
  },
  cooking_methods: {
    recommended: [String], // e.g., ["Steaming", "Grilling", "Baking"]
    avoid: [String]        // e.g., ["Deep frying", "Charring"]
  },
  monitoring: {
    blood_sugar: Boolean,
    weight: Boolean,
    blood_pressure: Boolean,
    other_metrics: [String]
  },
  emergency_signs: [String],
  professional_advice: String,
  resources: [{
    title: String,
    url: String,
    description: String
  }],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  verified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verification_date: Date,
  is_public: {
    type: Boolean,
    default: true
  },
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
HealthConditionSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('HealthCondition', HealthConditionSchema);
