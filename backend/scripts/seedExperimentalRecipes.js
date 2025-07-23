const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipesdb';

const recipes = [
  {
    recipe_name: 'Crispy Chicken Tenders',
    country: 'USA',
    image_url: 'https://thegoldenbalance.com/crispy-chicken-tenders.jpg',
    ingredients: ['Chicken breast', 'Flour', 'Eggs', 'Breadcrumbs', 'Spices'],
    dietary_tags: ['Halal'],
    instructions: 'Coat chicken in flour, dip in eggs, then breadcrumbs. Fry until golden brown.',
    cultural_context: 'thegoldenbalance',
    cuisine: 'American',
    prep_time: 30,
    difficulty: 'Easy',
    experimental: true
  },
  {
    recipe_name: 'Vegan Mac & Cheese',
    country: 'USA',
    image_url: 'https://justkriston.com/vegan-mac-cheese.jpg',
    ingredients: ['Macaroni', 'Cashews', 'Nutritional yeast', 'Plant milk', 'Spices'],
    dietary_tags: ['Vegan'],
    instructions: 'Blend cashews, nutritional yeast, and plant milk. Mix with cooked macaroni.',
    cultural_context: 'justkriston',
    cuisine: 'American',
    prep_time: 25,
    difficulty: 'Medium',
    experimental: true
  },
  {
    recipe_name: 'Stealthy Green Smoothie',
    country: 'USA',
    image_url: 'https://stealthhealthlife.com/green-smoothie.jpg',
    ingredients: ['Spinach', 'Banana', 'Almond milk', 'Chia seeds', 'Honey'],
    dietary_tags: ['Vegetarian', 'Gluten-Free'],
    instructions: 'Blend all ingredients until smooth. Serve chilled.',
    cultural_context: 'stealth_health_life',
    cuisine: 'Smoothie',
    prep_time: 10,
    difficulty: 'Easy',
    experimental: true
  },
  // Add more recipes as needed...
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Recipe.deleteMany({ experimental: true });
  await Recipe.insertMany(recipes);
  console.log('Seeded experimental recipes!');
  mongoose.disconnect();
}

seed(); 