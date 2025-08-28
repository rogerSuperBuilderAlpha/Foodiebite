import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Snacks = () => {
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    category: '',
    ingredients: [''],
    nutrition_info: {
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      fiber: '',
      sugar: ''
    },
    preparation_time: '',
    difficulty: 'Easy',
    serving_size: '',
    storage_instructions: '',
    best_time_to_eat: [],
    dietary_tags: [],
    health_benefits: []
  });

  const categories = ['Sweet', 'Savory', 'Healthy', 'Protein', 'Energy', 'Low-carb', 'Vegan', 'Gluten-free', 'Other'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Sugar', 'High-Protein', 'Low-Carb'];
  const timeOptions = ['Pre-workout', 'Post-workout', 'Mid-morning', 'Afternoon', 'Evening', 'Late-night'];

  useEffect(() => {
    fetchSnacks();
  }, [selectedCategory, selectedDietary]);

  const fetchSnacks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedDietary.length > 0) params.dietary_tags = selectedDietary.join(',');
      
      const response = await axios.get('http://localhost:5000/api/snacks', { params });
      setSnacks(response.data);
    } catch (err) {
      setError('Failed to fetch snacks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to upload snacks');
        return;
      }

      await axios.post('http://localhost:5000/api/snacks', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        image_url: '',
        category: '',
        ingredients: [''],
        nutrition_info: { calories: '', protein: '', carbs: '', fats: '', fiber: '', sugar: '' },
        preparation_time: '',
        difficulty: 'Easy',
        serving_size: '',
        storage_instructions: '',
        best_time_to_eat: [],
        dietary_tags: [],
        health_benefits: []
      });
      fetchSnacks();
    } catch (err) {
      setError('Failed to create snack');
      console.error(err);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const updateIngredient = (index, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const toggleDietaryTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      dietary_tags: prev.dietary_tags.includes(tag)
        ? prev.dietary_tags.filter(t => t !== tag)
        : [...prev.dietary_tags, tag]
    }));
  };

  const toggleTimeToEat = (time) => {
    setFormData(prev => ({
      ...prev,
      best_time_to_eat: prev.best_time_to_eat.includes(time)
        ? prev.best_time_to_eat.filter(t => t !== time)
        : [...prev.best_time_to_eat, time]
    }));
  };

  const addHealthBenefit = () => {
    setFormData(prev => ({
      ...prev,
      health_benefits: [...prev.health_benefits, '']
    }));
  };

  const updateHealthBenefit = (index, value) => {
    setFormData(prev => ({
      ...prev,
      health_benefits: prev.health_benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const removeHealthBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      health_benefits: prev.health_benefits.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div className="loading">Loading snacks...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="snacks-container">
      <div className="snacks-header">
        <h2>🥨 Snack Discovery & Sharing</h2>
        <p>Upload your favorite snacks and discover new ones</p>
        
        <div className="snack-filters">
          <div className="filter-group">
            <label htmlFor="category-select">Category:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Dietary Tags:</label>
            <div className="dietary-tags">
              {dietaryOptions.map(tag => (
                <label key={tag} className="tag-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedDietary.includes(tag)}
                    onChange={() => {
                      if (selectedDietary.includes(tag)) {
                        setSelectedDietary(selectedDietary.filter(t => t !== tag));
                      } else {
                        setSelectedDietary([...selectedDietary, tag]);
                      }
                    }}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Upload Snack'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="snack-form">
          <h3>Upload Your Snack</h3>
          
          <div className="form-group">
            <label htmlFor="name">Snack Name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Protein Energy Balls"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your snack, taste, texture..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image URL *</label>
            <input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/snack-image.jpg"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="preparation_time">Prep Time (minutes)</label>
              <input
                id="preparation_time"
                type="number"
                value={formData.preparation_time}
                onChange={(e) => setFormData(prev => ({ ...prev, preparation_time: e.target.value }))}
                placeholder="e.g., 15"
              />
            </div>

            <div className="form-group">
              <label htmlFor="serving_size">Serving Size</label>
              <input
                id="serving_size"
                type="text"
                value={formData.serving_size}
                onChange={(e) => setFormData(prev => ({ ...prev, serving_size: e.target.value }))}
                placeholder="e.g., 2 balls, 1 cup"
              />
            </div>
          </div>

          <div className="ingredients-section">
            <h4>Ingredients *</h4>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-input">
                <input
                  type="text"
                  placeholder="Ingredient"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  required
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="btn btn-danger btn-small"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="btn btn-secondary"
            >
              + Add Ingredient
            </button>
          </div>

          <div className="nutrition-section">
            <h4>Nutrition Information (per serving)</h4>
            <div className="nutrition-grid">
              <div className="form-group">
                <label htmlFor="calories">Calories</label>
                <input
                  id="calories"
                  type="number"
                  value={formData.nutrition_info.calories}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutrition_info: { ...prev.nutrition_info, calories: e.target.value }
                  }))}
                  placeholder="e.g., 150"
                />
              </div>
              <div className="form-group">
                <label htmlFor="protein">Protein (g)</label>
                <input
                  id="protein"
                  type="number"
                  value={formData.nutrition_info.protein}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutrition_info: { ...prev.nutrition_info, protein: e.target.value }
                  }))}
                  placeholder="e.g., 8"
                />
              </div>
              <div className="form-group">
                <label htmlFor="carbs">Carbs (g)</label>
                <input
                  id="carbs"
                  type="number"
                  value={formData.nutrition_info.carbs}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutrition_info: { ...prev.nutrition_info, carbs: e.target.value }
                  }))}
                  placeholder="e.g., 20"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fats">Fats (g)</label>
                <input
                  id="fats"
                  type="number"
                  value={formData.nutrition_info.fats}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutrition_info: { ...prev.nutrition_info, fats: e.target.value }
                  }))}
                  placeholder="e.g., 6"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fiber">Fiber (g)</label>
                <input
                  id="fiber"
                  type="number"
                  value={formData.nutrition_info.fiber}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutrition_info: { ...prev.nutrition_info, fiber: e.target.value }
                  }))}
                  placeholder="e.g., 3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="sugar">Sugar (g)</label>
                <input
                  id="sugar"
                  type="number"
                  value={formData.nutrition_info.sugar}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutrition_info: { ...prev.nutrition_info, sugar: e.target.value }
                  }))}
                  placeholder="e.g., 12"
                />
              </div>
            </div>
          </div>

          <div className="dietary-tags-section">
            <h4>Dietary Tags</h4>
            <div className="dietary-tags">
              {dietaryOptions.map(tag => (
                <label key={tag} className="tag-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.dietary_tags.includes(tag)}
                    onChange={() => toggleDietaryTag(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <div className="time-to-eat-section">
            <h4>Best Time to Eat</h4>
            <div className="time-options">
              {timeOptions.map(time => (
                <label key={time} className="time-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.best_time_to_eat.includes(time)}
                    onChange={() => toggleTimeToEat(time)}
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>

          <div className="health-benefits-section">
            <h4>Health Benefits</h4>
            {formData.health_benefits.map((benefit, index) => (
              <div key={index} className="benefit-input">
                <input
                  type="text"
                  placeholder="Health benefit"
                  value={benefit}
                  onChange={(e) => updateHealthBenefit(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeHealthBenefit(index)}
                  className="btn btn-danger btn-small"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addHealthBenefit}
              className="btn btn-secondary"
            >
              + Add Health Benefit
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="storage">Storage Instructions</label>
            <textarea
              id="storage"
              value={formData.storage_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, storage_instructions: e.target.value }))}
              placeholder="e.g., Store in airtight container in refrigerator for up to 1 week"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Upload Snack
          </button>
        </form>
      )}

      <div className="snacks-grid">
        {snacks.map(snack => (
          <div key={snack._id} className="snack-card">
            <div className="snack-image">
              <img src={snack.image_url} alt={snack.name} />
              <span className="category-badge">{snack.category}</span>
            </div>
            
            <div className="snack-content">
              <h3>{snack.name}</h3>
              <p className="description">{snack.description}</p>
              
              <div className="snack-meta">
                <span className="difficulty">{snack.difficulty}</span>
                {snack.preparation_time && (
                  <span className="prep-time">⏱️ {snack.preparation_time} min</span>
                )}
                {snack.serving_size && (
                  <span className="serving-size">🍽️ {snack.serving_size}</span>
                )}
              </div>

              {snack.nutrition_info && (
                <div className="nutrition-preview">
                  <div className="nutrition-item">
                    <span className="label">Calories:</span>
                    <span className="value">{snack.nutrition_info.calories}</span>
                  </div>
                  {snack.nutrition_info.protein && (
                    <div className="nutrition-item">
                      <span className="label">Protein:</span>
                      <span className="value">{snack.nutrition_info.protein}g</span>
                    </div>
                  )}
                  {snack.nutrition_info.carbs && (
                    <div className="nutrition-item">
                      <span className="label">Carbs:</span>
                      <span className="value">{snack.nutrition_info.carbs}g</span>
                    </div>
                  )}
                </div>
              )}

              {snack.dietary_tags && snack.dietary_tags.length > 0 && (
                <div className="dietary-tags-preview">
                  {snack.dietary_tags.map(tag => (
                    <span key={tag} className="dietary-tag">{tag}</span>
                  ))}
                </div>
              )}

              {snack.ingredients && snack.ingredients.length > 0 && (
                <div className="ingredients-preview">
                  <h4>Ingredients</h4>
                  <p>{snack.ingredients.slice(0, 3).join(', ')}</p>
                  {snack.ingredients.length > 3 && (
                    <p className="more-ingredients">+{snack.ingredients.length - 3} more</p>
                  )}
                </div>
              )}

              {snack.best_time_to_eat && snack.best_time_to_eat.length > 0 && (
                <div className="time-preview">
                  <h4>Best Time</h4>
                  <p>{snack.best_time_to_eat.join(', ')}</p>
                </div>
              )}

              {snack.health_benefits && snack.health_benefits.length > 0 && (
                <div className="benefits-preview">
                  <h4>Health Benefits</h4>
                  <p>{snack.health_benefits.slice(0, 2).join(', ')}</p>
                  {snack.health_benefits.length > 2 && (
                    <p className="more-benefits">+{snack.health_benefits.length - 2} more</p>
                  )}
                </div>
              )}
            </div>

            <div className="snack-footer">
              <div className="user-info">
                <span>By {snack.user?.username || 'Anonymous'}</span>
                <span className="date">
                  {new Date(snack.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="rating-info">
                {snack.average_rating > 0 && (
                  <div className="rating">
                    ⭐ {snack.average_rating.toFixed(1)} ({snack.total_ratings})
                  </div>
                )}
              </div>

              <div className="snack-actions">
                <button className="btn btn-secondary btn-small">
                  💬 Comment
                </button>
                <button className="btn btn-primary btn-small">
                  📖 View Full
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {snacks.length === 0 && !loading && (
        <div className="no-snacks">
          <p>No snacks found matching your criteria.</p>
          <p>Be the first to upload a snack!</p>
        </div>
      )}
    </div>
  );
};

export default Snacks;
