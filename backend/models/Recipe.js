const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  username: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  date: { type: Date, default: Date.now }
});

const NutritionBenefitSchema = new mongoose.Schema({
  demographic: { 
    type: String, 
    enum: ['youth', 'elderly', 'women_period', 'general'], 
    required: true 
  },
  benefits: [String],
  nutrients: [String],
  health_tips: [String]
});

const MealPlanSchema = new mongoose.Schema({
  name: String,
  description: String,
  prep_time: Number,
  cook_time: Number,
  servings: Number,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  ingredients: [{
    name: String,
    amount: String,
    unit: String,
    notes: String
  }],
  instructions: [String],
  nutrition_info: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  meal_prep_tips: [String],
  storage_instructions: String,
  reheating_instructions: String
});

const RecipeSchema = new mongoose.Schema({
  recipe_name: { type: String, required: true },
  country: { type: String, required: true },
  region: { type: String, required: true }, // Global region selection
  continent: { type: String, required: true }, // For easier filtering
  dish_of_the_month: { type: Boolean, default: false },
  image_url: String,
  ingredients: [String],
  dietary_tags: [String],
  instructions: [String],
  cultural_context: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  prep_time: Number,
  cook_time: Number,
  servings: Number,
  cuisine: String,
  experimental: { type: Boolean, default: false },
  
  // Nutrition and health benefits
  nutrition_benefits: [NutritionBenefitSchema],
  health_tags: [String], // e.g., ['anti-inflammatory', 'energy-boosting', 'digestive-health']
  
  // Meal planning and prep
  meal_plan: MealPlanSchema,
  is_meal_prep_friendly: { type: Boolean, default: false },
  meal_prep_duration: Number, // How long it stays fresh in days
  
  // Photo recognition support
  photo_ingredients: [String], // Ingredients that can be identified from photos
  visual_cues: [String], // Visual characteristics for photo matching
  
  drinks: [{
    name: String,
    image_url: String,
    description: String
  }],
  
  reviews: [ReviewSchema],
  rating: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update timestamp on save
RecipeSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Recipe', RecipeSchema); 