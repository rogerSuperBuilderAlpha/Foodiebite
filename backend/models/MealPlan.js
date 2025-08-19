const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  meals: [{
    day: { type: String, required: true }, // Monday, Tuesday, etc.
    meal_type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    custom_meal: {
      name: String,
      ingredients: [String],
      instructions: [String],
      nutrition_info: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
      }
    },
    prep_notes: String,
    shopping_list: [String]
  }],
  nutrition_goals: {
    target_calories: Number,
    target_protein: Number,
    target_carbs: Number,
    target_fat: Number
  },
  dietary_restrictions: [String],
  health_focus: { type: String, enum: ['youth', 'elderly', 'women_period', 'general', 'weight_loss', 'muscle_gain', 'energy_boost'] },
  is_public: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

MealPlanSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
