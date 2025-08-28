const mongoose = require('mongoose');

const RecipeTranslationSchema = new mongoose.Schema({
  original_recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Other']
  },
  language_code: {
    type: String,
    required: true,
    enum: ['es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'other']
  },
  translated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  translation_status: {
    type: String,
    enum: ['Draft', 'Pending Review', 'Approved', 'Rejected'],
    default: 'Draft'
  },
  reviewed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  review_notes: String,
  translated_content: {
    recipe_name: {
      type: String,
      required: true
    },
    description: String,
    ingredients: [{
      original: String,
      translated: String,
      notes: String
    }],
    instructions: [{
      step_number: Number,
      original: String,
      translated: String,
      notes: String
    }],
    cultural_context: String,
    tips: String,
    serving_suggestions: String
  },
  cultural_adaptations: {
    local_ingredients: [String],
    cooking_methods: [String],
    serving_style: String,
    cultural_notes: String
  },
  accuracy_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  user_ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  average_rating: {
    type: Number,
    default: 0
  },
  total_ratings: {
    type: Number,
    default: 0
  },
  is_public: {
    type: Boolean,
    default: false
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
RecipeTranslationSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Calculate average rating
RecipeTranslationSchema.methods.calculateAverageRating = function() {
  if (this.user_ratings.length === 0) {
    this.average_rating = 0;
    this.total_ratings = 0;
  } else {
    const totalRating = this.user_ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.average_rating = totalRating / this.user_ratings.length;
    this.total_ratings = this.user_ratings.length;
  }
};

module.exports = mongoose.model('RecipeTranslation', RecipeTranslationSchema);
