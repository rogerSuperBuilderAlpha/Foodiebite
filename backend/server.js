const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Recipe = require('./models/Recipe');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// MongoDB Connection with Security
mongoose.connect(MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected securely'))
.catch(err => console.error('MongoDB connection error:', err));

// Input Validation Middleware
const validateInput = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (username && !validator.isLength(username, { min: 3, max: 15 })) {
    return res.status(400).json({ error: 'Username must be between 3 and 15 characters' });
  }
  
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (password && !validator.isLength(password, { min: 6 })) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  // Sanitize inputs
  if (username) req.body.username = validator.escape(username.trim());
  if (email) req.body.email = validator.normalizeEmail(email);
  
  next();
};

// JWT Middleware with Enhanced Security
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes with Rate Limiting
app.post('/api/auth/register', authLimiter, validateInput, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Additional validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validator.isStrongPassword(password, { 
      minLength: 6, 
      minLowercase: 1, 
      minUppercase: 1, 
      minNumbers: 1 
    })) {
      return res.status(400).json({ 
        error: 'Password must contain at least 6 characters with lowercase, uppercase, and number' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password with higher salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token with shorter expiration
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', authLimiter, validateInput, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const { q, mood, dietary, ingredient, cuisine, min_prep, max_prep, difficulty, sort } = req.query;
    let filter = {};

    if (q) filter.recipe_name = { $regex: validator.escape(q), $options: 'i' };
    if (mood) filter.mood = validator.escape(mood);
    if (dietary) filter.dietary_tags = validator.escape(dietary);
    if (ingredient) filter.ingredients = validator.escape(ingredient);
    if (cuisine) filter.cuisine = validator.escape(cuisine);
    if (difficulty) filter.difficulty = validator.escape(difficulty);
    if (min_prep || max_prep) {
      filter.prep_time = {};
      if (min_prep) filter.prep_time.$gte = Number(min_prep);
      if (max_prep) filter.prep_time.$lte = Number(max_prep);
    }

    let query = Recipe.find(filter);
    // Sorting
    if (sort === 'rating') {
      query = query.sort({ 'reviews.rating': -1 });
    } else if (sort === 'newest') {
      query = query.sort({ _id: -1 });
    } else if (sort === 'prep_time') {
      query = query.sort({ prep_time: 1 });
    }

    const recipes = await query;
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Get a user's favorite recipes
app.get('/api/auth/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Admin role to User model (add if not present)
// Add isAdmin field to UserSchema in models/User.js:
// isAdmin: { type: Boolean, default: false }

// Admin endpoints
app.get('/api/admin/recipes', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.delete('/api/admin/recipes/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.post('/api/recipes', authenticateToken, validateInput, async (req, res) => {
  try {
    // Validate recipe data
    const { recipe_name, ingredients, instructions } = req.body;
    
    if (!recipe_name || recipe_name.length < 3) {
      return res.status(400).json({ error: 'Recipe name must be at least 3 characters' });
    }
    
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'At least one ingredient is required' });
    }
    
    if (!instructions || instructions.length < 10) {
      return res.status(400).json({ error: 'Instructions must be at least 10 characters' });
    }
    
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create recipe' });
  }
});

app.put('/api/recipes/:id', authenticateToken, validateInput, async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }
    
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update recipe' });
  }
});

app.post('/api/recipes/:id/reviews', authenticateToken, validateInput, async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }
    
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    if (!comment || comment.length < 3) {
      return res.status(400).json({ error: 'Comment must be at least 3 characters' });
    }
    
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    recipe.reviews.push({ 
      user: req.user.username, 
      rating, 
      comment: validator.escape(comment)
    });
    await recipe.save();
    res.json(recipe.reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

app.get('/api/recommendations', async (req, res) => {
  try {
    const { mood, dietary } = req.query;
    let filter = {};
    if (mood) filter.mood = validator.escape(mood);
    if (dietary) filter.dietary_tags = validator.escape(dietary);
    const recipes = await Recipe.find(filter).limit(5);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Upload photo
app.post('/api/photos', authenticateToken, async (req, res) => {
  const { image_url, recipe } = req.body;
  const photo = await Photo.create({ image_url, recipe, uploader: req.user.id });
  res.status(201).json(photo);
});

// Get all photos
app.get('/api/photos', async (req, res) => {
  const photos = await Photo.find().populate('uploader', 'username avatar').populate('recipe', 'recipe_name');
  res.json(photos);
});

// Like/unlike photo
app.post('/api/photos/:id/like', authenticateToken, async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  const userId = req.user.id;
  if (!photo.likes.includes(userId)) {
    photo.likes.push(userId);
  } else {
    photo.likes = photo.likes.filter(id => id.toString() !== userId);
  }
  await photo.save();
  res.json({ likes: photo.likes.length });
});

// Rate photo
app.post('/api/photos/:id/rate', authenticateToken, async (req, res) => {
  const { value } = req.body;
  const photo = await Photo.findById(req.params.id);
  const userId = req.user.id;
  // Remove previous rating if exists
  photo.ratings = photo.ratings.filter(r => r.user.toString() !== userId);
  photo.ratings.push({ user: userId, value });
  await photo.save();
  const avgRating = photo.ratings.reduce((sum, r) => sum + r.value, 0) / photo.ratings.length;
  res.json({ avgRating, ratingsCount: photo.ratings.length });
});

// Promote/demote user to admin
app.post('/api/admin/users/:id/promote', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    target.isAdmin = true;
    await target.save();
    res.json({ message: 'User promoted to admin' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

app.post('/api/admin/users/:id/demote', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    target.isAdmin = false;
    await target.save();
    res.json({ message: 'User demoted from admin' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to demote user' });
  }
});

// Promote/demote user to premium
app.post('/api/admin/users/:id/premium', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    target.isPremium = true;
    await target.save();
    res.json({ message: 'User promoted to premium' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to promote user to premium' });
  }
});

app.post('/api/admin/users/:id/unpremium', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    target.isPremium = false;
    await target.save();
    res.json({ message: 'User demoted from premium' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to demote user from premium' });
  }
});

// List premium users
app.get('/api/admin/premium-users', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    const users = await User.find({ isPremium: true });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch premium users' });
  }
});

// List premium recipes/photos (example: recipes with a premium flag)
// You can add a 'premium' field to Recipe/Photo if you want exclusive content

// Admin dashboard stats
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    const userCount = await User.countDocuments();
    const recipeCount = await Recipe.countDocuments();
    const photoCount = await Photo.countDocuments();
    res.json({ userCount, recipeCount, photoCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Secure server running on port ${PORT}`);
}); 