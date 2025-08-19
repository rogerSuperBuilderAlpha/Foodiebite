const mongoose = require('mongoose');

const PhotoMealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  original_photo: { type: String, required: true }, // URL to uploaded photo
  identified_ingredients: [{
    name: String,
    confidence: Number, // AI confidence score
    quantity: String,
    notes: String
  }],
  suggested_recipes: [{
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    match_score: Number,
    reason: String
  }],
  created_meal: {
    name: String,
    ingredients: [String],
    instructions: [String],
    estimated_nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    prep_time: Number
  },
  ai_analysis: {
    food_types: [String],
    cooking_methods: [String],
    cuisine_style: String,
    health_benefits: [String],
    dietary_tags: [String]
  },
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PhotoMeal', PhotoMealSchema);
