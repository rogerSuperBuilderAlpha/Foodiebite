const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
require('dotenv').config();

const Recipe = require('./models/Recipe');
const User = require('./models/User');
const Photo = require('./models/Photo'); // <-- Uncommented
const SupportMessage = require('./models/SupportMessage');
const Comment = require('./models/Comment');
const MealPlan = require('./models/MealPlan');
const PhotoMeal = require('./models/PhotoMeal');
const AthleteDiet = require('./models/AthleteDiet');
const Snack = require('./models/Snack');
const RecipeTranslation = require('./models/RecipeTranslation');
const HealthCondition = require('./models/HealthCondition');

const app = express(); // <-- Add semicolon

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openweathermap.org"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});

app.use(limiter);

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

// Environment Variables Validation
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

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
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected Routes
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/auth/profile', authenticateToken, validateInput, async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    
    // Validate bio length
    if (bio && bio.length > 160) {
      return res.status(400).json({ error: 'Bio must be 160 characters or less' });
    }
    
    // Validate avatar URL
    if (avatar && !validator.isURL(avatar)) {
      return res.status(400).json({ error: 'Invalid avatar URL' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio: validator.escape(bio), avatar },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update user avatar (profile picture)
app.put('/api/auth/profile/avatar', authenticateToken, async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar || !validator.isURL(avatar)) {
      return res.status(400).json({ error: 'Invalid avatar URL' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

// Favorites with validation
app.post('/api/auth/favorites/:recipeId', authenticateToken, async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.recipeId)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }
    const user = await User.findById(req.user.id);
    if (!user.isPremium && user.favorites.length >= 20) {
      return res.status(403).json({ error: 'Upgrade to premium to save more favorites.' });
    }
    if (!user.favorites.includes(req.params.recipeId)) {
      user.favorites.push(req.params.recipeId);
      await user.save();
    }
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

app.delete('/api/auth/favorites/:recipeId', authenticateToken, async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.recipeId)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }
    
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.recipeId);
    await user.save();
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Advanced Search/Filters and Sorting
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

// Support messages (help, export, delete requests)
app.post('/api/support', async (req, res) => {
  try {
    const { name, email, message, type } = req.body;
    await SupportMessage.create({ name, email, message, type });
    res.json({ message: 'Support request received' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit support request' });
  }
});

// Data export (stub) - in real app, compile user data and email or download
app.post('/api/account/export', authenticateToken, async (req, res) => {
  try {
    // TODO: compile data from User, Recipe, Photo, Comments
    res.json({ message: 'Data export requested. We will email you when ready.' });
  } catch {
    res.status(500).json({ error: 'Failed to request data export' });
  }
});

// Data delete (stub) - in real app, queue deletion, grace period
app.post('/api/account/delete', authenticateToken, async (req, res) => {
  try {
    // TODO: schedule account deletion per policy
    res.json({ message: 'Account deletion requested. Our team will process it shortly.' });
  } catch {
    res.status(500).json({ error: 'Failed to request account deletion' });
  }
});

// Stripe upgrade (placeholder)
app.post('/api/premium/checkout', authenticateToken, async (req, res) => {
  try {
    // TODO: Create Stripe checkout session and return URL
    res.json({ checkoutUrl: 'https://billing.stripe.com/session/test_placeholder' });
  } catch {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Comments API (edit, delete, report) – assuming Comment model created similarly
// Create comment
app.post('/api/comments', authenticateToken, async (req, res) => {
  try {
    const { content, targetType, targetId } = req.body;
    if (!content || !targetType || !targetId) return res.status(400).json({ error: 'Missing fields' });
    const comment = await Comment.create({ author: req.user.id, content, targetType, targetId });
    res.status(201).json(comment);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// List comments for a target
app.get('/api/comments', async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    if (!targetType || !targetId) return res.status(400).json({ error: 'Missing query' });
    const comments = await Comment.find({ targetType, targetId }).populate('author', 'username avatar').sort({ createdAt: -1 });
    res.json(comments);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Update comment
app.put('/api/comments/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Not found' });
    if (comment.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    comment.content = req.body.content ?? comment.content;
    await comment.save();
    res.json(comment);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
app.delete('/api/comments/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Not found' });
    const user = await User.findById(req.user.id);
    if (comment.author.toString() !== req.user.id && !user.isAdmin) return res.status(403).json({ error: 'Forbidden' });
    await comment.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Report comment
app.post('/api/comments/:id/report', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Not found' });
    comment.reported = true;
    await comment.save();
    res.json({ message: 'Reported' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to report comment' });
  }
});

// Recent activity (admin)
app.get('/api/admin/recent', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    const recentUsers = await User.find().sort({ _id: -1 }).limit(5).select('-password');
    const recentRecipes = await Recipe.find().sort({ _id: -1 }).limit(5);
    const recentPhotos = await Photo.find().sort({ _id: -1 }).limit(5);
    res.json({ recentUsers, recentRecipes, recentPhotos });
  } catch {
    res.status(500).json({ error: 'Failed to fetch recent activity' });
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

// Global recipe filtering by region
app.get('/api/recipes/global/:continent', async (req, res) => {
  try {
    const { continent } = req.params;
    const { cuisine, health_focus, dietary_tags } = req.query;
    
    let filter = { continent };
    
    if (cuisine) filter.cuisine = cuisine;
    if (health_focus) filter.health_tags = { $in: [health_focus] };
    if (dietary_tags) filter.dietary_tags = { $in: dietary_tags.split(',') };
    
    const recipes = await Recipe.find(filter)
      .select('recipe_name country region cuisine image_url nutrition_benefits health_tags rating')
      .limit(50);
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch global recipes' });
  }
});

// Get recipes by nutrition benefits for specific demographics
app.get('/api/recipes/nutrition/:demographic', async (req, res) => {
  try {
    const { demographic } = req.params;
    const { health_focus } = req.query;
    
    let filter = { 'nutrition_benefits.demographic': demographic };
    if (health_focus) filter.health_tags = { $in: [health_focus] };
    
    const recipes = await Recipe.find(filter)
      .select('recipe_name image_url nutrition_benefits health_tags rating cuisine')
      .limit(30);
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nutrition-focused recipes' });
  }
});

// Meal planning endpoints
app.post('/api/meal-plans', authenticateToken, async (req, res) => {
  try {
    const mealPlan = new MealPlan({
      ...req.body,
      user: req.user.id
    });
    await mealPlan.save();
    res.status(201).json(mealPlan);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create meal plan' });
  }
});

app.get('/api/meal-plans', authenticateToken, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.id })
      .populate('meals.recipe', 'recipe_name image_url cuisine')
      .sort({ created_at: -1 });
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meal plans' });
  }
});

app.put('/api/meal-plans/:id', authenticateToken, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!mealPlan) return res.status(404).json({ error: 'Meal plan not found' });
    res.json(mealPlan);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update meal plan' });
  }
});

// Photo-to-meal creation endpoints
app.post('/api/photo-meals', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    
    // Here you would integrate with an AI service like Google Vision API or similar
    // For now, we'll create a placeholder response
    const photoMeal = new PhotoMeal({
      user: req.user.id,
      original_photo: req.file.path,
      status: 'processing'
    });
    
    await photoMeal.save();
    
    // Simulate AI processing
    setTimeout(async () => {
      photoMeal.status = 'completed';
      photoMeal.identified_ingredients = [
        { name: 'tomato', confidence: 0.95, quantity: '2 medium', notes: 'Fresh red tomatoes' },
        { name: 'basil', confidence: 0.88, quantity: '1/4 cup', notes: 'Fresh basil leaves' }
      ];
      photoMeal.ai_analysis = {
        food_types: ['vegetables', 'herbs'],
        cooking_methods: ['raw', 'fresh'],
        cuisine_style: 'Mediterranean',
        health_benefits: ['antioxidants', 'vitamin-c'],
        dietary_tags: ['vegetarian', 'vegan', 'gluten-free']
      };
      await photoMeal.save();
    }, 3000);
    
    res.status(201).json(photoMeal);
  } catch (error) {
    res.status(400).json({ error: 'Failed to process photo meal' });
  }
});

app.get('/api/photo-meals', authenticateToken, async (req, res) => {
  try {
    const photoMeals = await PhotoMeal.find({ user: req.user.id })
      .sort({ created_at: -1 });
    res.json(photoMeals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photo meals' });
  }
});

// Get meal prep friendly recipes
app.get('/api/recipes/meal-prep', async (req, res) => {
  try {
    const recipes = await Recipe.find({ is_meal_prep_friendly: true })
      .select('recipe_name image_url meal_plan meal_prep_duration cuisine rating')
      .limit(30);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meal prep recipes' });
  }
});

// ===== NEW FEATURES ENDPOINTS =====

// Athlete Diet endpoints
app.post('/api/athlete-diets', authenticateToken, async (req, res) => {
  try {
    const athleteDiet = new AthleteDiet({
      ...req.body,
      user: req.user.id
    });
    await athleteDiet.save();
    res.status(201).json(athleteDiet);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create athlete diet' });
  }
});

app.get('/api/athlete-diets', async (req, res) => {
  try {
    const { sport, is_public } = req.query;
    let query = { is_public: true };
    
    if (sport) query.sport = sport;
    if (is_public !== undefined) query.is_public = is_public === 'true';
    
    const diets = await AthleteDiet.find(query)
      .populate('user', 'username avatar')
      .sort({ created_at: -1 })
      .limit(50);
    res.json(diets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch athlete diets' });
  }
});

app.get('/api/athlete-diets/:id', async (req, res) => {
  try {
    const diet = await AthleteDiet.findById(req.params.id)
      .populate('user', 'username avatar bio')
      .populate('comments');
    if (!diet) return res.status(404).json({ error: 'Athlete diet not found' });
    res.json(diet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch athlete diet' });
  }
});

// Snack endpoints
app.post('/api/snacks', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const snackData = {
      ...req.body,
      user: req.user.id
    };
    
    if (req.file) {
      snackData.image_url = req.file.path;
    }
    
    const snack = new Snack(snackData);
    await snack.save();
    res.status(201).json(snack);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create snack' });
  }
});

app.get('/api/snacks', async (req, res) => {
  try {
    const { category, dietary_tags, is_public } = req.query;
    let query = { is_public: true };
    
    if (category) query.category = category;
    if (dietary_tags) query.dietary_tags = { $in: dietary_tags.split(',') };
    if (is_public !== undefined) query.is_public = is_public === 'true';
    
    const snacks = await Snack.find(query)
      .populate('user', 'username avatar')
      .sort({ average_rating: -1, created_at: -1 })
      .limit(50);
    res.json(snacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch snacks' });
  }
});

app.get('/api/snacks/:id', async (req, res) => {
  try {
    const snack = await Snack.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate('comments');
    if (!snack) return res.status(404).json({ error: 'Snack not found' });
    res.json(snack);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch snack' });
  }
});

// Recipe Translation endpoints
app.post('/api/recipe-translations', authenticateToken, async (req, res) => {
  try {
    const translation = new RecipeTranslation({
      ...req.body,
      translated_by: req.user.id
    });
    await translation.save();
    res.status(201).json(translation);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create recipe translation' });
  }
});

app.get('/api/recipe-translations', async (req, res) => {
  try {
    const { language, recipe_id, status, is_public } = req.query;
    let query = {};
    
    if (language) query.language = language;
    if (recipe_id) query.original_recipe = recipe_id;
    if (status) query.translation_status = status;
    if (is_public !== undefined) query.is_public = is_public === 'true';
    
    const translations = await RecipeTranslation.find(query)
      .populate('original_recipe', 'recipe_name image_url')
      .populate('translated_by', 'username')
      .sort({ created_at: -1 })
      .limit(50);
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe translations' });
  }
});

app.get('/api/recipe-translations/:id', async (req, res) => {
  try {
    const translation = await RecipeTranslation.findById(req.params.id)
      .populate('original_recipe')
      .populate('translated_by', 'username avatar')
      .populate('user_ratings.user', 'username');
    if (!translation) return res.status(404).json({ error: 'Translation not found' });
    res.json(translation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch translation' });
  }
});

// Health Condition endpoints
app.post('/api/health-conditions', authenticateToken, async (req, res) => {
  try {
    const healthCondition = new HealthCondition({
      ...req.body,
      created_by: req.user.id
    });
    await healthCondition.save();
    res.status(201).json(healthCondition);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create health condition' });
  }
});

app.get('/api/health-conditions', async (req, res) => {
  try {
    const { condition_type, severity_level, is_public } = req.query;
    let query = { is_public: true };
    
    if (condition_type) query.condition_type = condition_type;
    if (severity_level) query.severity_level = severity_level;
    if (is_public !== undefined) query.is_public = is_public === 'true';
    
    const conditions = await HealthCondition.find(query)
      .populate('created_by', 'username')
      .sort({ created_at: -1 })
      .limit(50);
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch health conditions' });
  }
});

app.get('/api/health-conditions/:id', async (req, res) => {
  try {
    const condition = await HealthCondition.findById(req.params.id)
      .populate('created_by', 'username avatar')
      .populate('verified_by', 'username');
    if (!condition) return res.status(404).json({ error: 'Health condition not found' });
    res.json(condition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch health condition' });
  }
});

// Enhanced region-based recipe selection
app.get('/api/recipes/region/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const { cuisine, dietary_tags, difficulty, prep_time } = req.query;
    
    let query = { region: new RegExp(region, 'i') };
    
    if (cuisine) query.cuisine = new RegExp(cuisine, 'i');
    if (dietary_tags) query.dietary_tags = { $in: dietary_tags.split(',') };
    if (difficulty) query.difficulty = difficulty;
    if (prep_time) query.prep_time = { $lte: parseInt(prep_time) };
    
    const recipes = await Recipe.find(query)
      .select('recipe_name image_url cuisine region country rating review_count')
      .sort({ rating: -1, review_count: -1 })
      .limit(50);
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch regional recipes' });
  }
});

// Enhanced admin permissions check
const checkAdminPermissions = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Admin endpoints for new features
app.get('/api/admin/athlete-diets', authenticateToken, checkAdminPermissions, async (req, res) => {
  try {
    const diets = await AthleteDiet.find()
      .populate('user', 'username email')
      .sort({ created_at: -1 });
    res.json(diets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch athlete diets' });
  }
});

app.get('/api/admin/snacks', authenticateToken, checkAdminPermissions, async (req, res) => {
  try {
    const snacks = await Snack.find()
      .populate('user', 'username email')
      .sort({ created_at: -1 });
    res.json(snacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch snacks' });
  }
});

app.get('/api/admin/translations', authenticateToken, checkAdminPermissions, async (req, res) => {
  try {
    const translations = await RecipeTranslation.find()
      .populate('original_recipe', 'recipe_name')
      .populate('translated_by', 'username email')
      .sort({ created_at: -1 });
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

app.get('/api/admin/health-conditions', authenticateToken, checkAdminPermissions, async (req, res) => {
  try {
    const conditions = await HealthCondition.find()
      .populate('created_by', 'username email')
      .sort({ created_at: -1 });
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch health conditions' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('🚀 FoodieBite API is ready!');
  console.log('📱 Mobile-optimized for iOS & Android');
  console.log('🌍 Multi-language recipe support');
  console.log('🏃‍♂️ Athlete diet sharing platform');
  console.log('🍎 Health condition nutrition guidance');
  console.log('🥨 Snack upload & discovery');
}); 