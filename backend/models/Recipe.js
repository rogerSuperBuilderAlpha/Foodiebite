const mongoose = require('mongoose');

const DrinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image_url: String, // URL to drink image
  description: String
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  user: String, // or userId if you have authentication
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  recipe_name: { type: String, required: true },
  country: String,
  dish_of_the_month: { type: Boolean, default: false },
  image_url: String, // URL to food image
  ingredients: [String],
  dietary_tags: [String],
  instructions: String,
  cultural_context: String,
  drinks: [DrinkSchema],
  reviews: [ReviewSchema]
});

module.exports = mongoose.model('Recipe', RecipeSchema); 