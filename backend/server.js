const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Recipe = require('./models/Recipe');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipesdb';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const { q, mood, dietary, ingredient } = req.query;
    let filter = {};

    if (q) filter.recipe_name = { $regex: q, $options: 'i' };
    if (mood) filter.mood = mood;
    if (dietary) filter.dietary_tags = dietary;
    if (ingredient) filter.ingredients = ingredient;

    const recipes = await Recipe.find(filter);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Add a review to a recipe
app.post('/api/recipes/:id/reviews', async (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    recipe.reviews.push({ user, rating, comment });
    await recipe.save();
    res.json(recipe.reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Recommend recipes based on mood and dietary
app.get('/api/recommendations', async (req, res) => {
  try {
    const { mood, dietary } = req.query;
    let filter = {};
    if (mood) filter.mood = mood;
    if (dietary) filter.dietary_tags = dietary;
    const recipes = await Recipe.find(filter).limit(5);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 