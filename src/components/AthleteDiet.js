import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AthleteDiet = () => {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sport: '',
    diet_name: '',
    description: '',
    daily_calories: '',
    macronutrients: {
      protein: '',
      carbs: '',
      fats: ''
    },
    meal_plan: [],
    supplements: [],
    hydration_plan: {
      daily_water: '',
      pre_workout: '',
      during_workout: '',
      post_workout: ''
    },
    training_schedule: {
      days_per_week: '',
      workout_duration: '',
      rest_days: []
    }
  });

  const sports = ['Football', 'Basketball', 'Soccer', 'Tennis', 'Swimming', 'Running', 'Weightlifting', 'Yoga', 'CrossFit', 'Other'];
  const mealTypes = ['Breakfast', 'Snack', 'Lunch', 'Pre-workout', 'Post-workout', 'Dinner'];

  useEffect(() => {
    fetchDiets();
  }, [selectedSport]);

  const fetchDiets = async () => {
    try {
      setLoading(true);
      const params = selectedSport ? { sport: selectedSport } : {};
      const response = await axios.get('http://localhost:5000/api/athlete-diets', { params });
      setDiets(response.data);
    } catch (err) {
      setError('Failed to fetch athlete diets');
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
        setError('Please login to share your diet');
        return;
      }

      await axios.post('http://localhost:5000/api/athlete-diets', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowForm(false);
      setFormData({
        sport: '',
        diet_name: '',
        description: '',
        daily_calories: '',
        macronutrients: { protein: '', carbs: '', fats: '' },
        meal_plan: [],
        supplements: [],
        hydration_plan: { daily_water: '', pre_workout: '', during_workout: '', post_workout: '' },
        training_schedule: { days_per_week: '', workout_duration: '', rest_days: [] }
      });
      fetchDiets();
    } catch (err) {
      setError('Failed to create athlete diet');
      console.error(err);
    }
  };

  const addMealPlan = () => {
    setFormData(prev => ({
      ...prev,
      meal_plan: [...prev.meal_plan, {
        meal_type: '',
        foods: [''],
        timing: '',
        notes: ''
      }]
    }));
  };

  const updateMealPlan = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      meal_plan: prev.meal_plan.map((meal, i) => 
        i === index ? { ...meal, [field]: value } : meal
      )
    }));
  };

  const addFoodToMeal = (mealIndex) => {
    setFormData(prev => ({
      ...prev,
      meal_plan: prev.meal_plan.map((meal, i) => 
        i === mealIndex ? { ...meal, foods: [...meal.foods, ''] } : meal
      )
    }));
  };

  const updateFood = (mealIndex, foodIndex, value) => {
    setFormData(prev => ({
      ...prev,
      meal_plan: prev.meal_plan.map((meal, i) => 
        i === mealIndex ? {
          ...meal,
          foods: meal.foods.map((food, j) => j === foodIndex ? value : food)
        } : meal
      )
    }));
  };

  if (loading) return <div className="loading">Loading athlete diets...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="athlete-diet-container">
      <div className="athlete-diet-header">
        <h2>🏃‍♂️ Athlete Diet Sharing</h2>
        <p>Discover and share nutrition plans for your sport</p>
        
        <div className="sport-filter">
          <label htmlFor="sport-select">Filter by Sport:</label>
          <select
            id="sport-select"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">All Sports</option>
            {sports.map(sport => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Share Your Diet'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="athlete-diet-form">
          <h3>Share Your Athlete Diet</h3>
          
          <div className="form-group">
            <label htmlFor="sport">Sport *</label>
            <select
              id="sport"
              value={formData.sport}
              onChange={(e) => setFormData(prev => ({ ...prev, sport: e.target.value }))}
              required
            >
              <option value="">Select Sport</option>
              {sports.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="diet_name">Diet Name *</label>
            <input
              id="diet_name"
              type="text"
              value={formData.diet_name}
              onChange={(e) => setFormData(prev => ({ ...prev, diet_name: e.target.value }))}
              placeholder="e.g., Pre-Season Football Diet"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your diet plan and goals..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="daily_calories">Daily Calories *</label>
            <input
              id="daily_calories"
              type="number"
              value={formData.daily_calories}
              onChange={(e) => setFormData(prev => ({ ...prev, daily_calories: e.target.value }))}
              placeholder="e.g., 2500"
              required
            />
          </div>

          <div className="macronutrients-group">
            <h4>Macronutrients (grams per day)</h4>
            <div className="macro-inputs">
              <div className="form-group">
                <label htmlFor="protein">Protein</label>
                <input
                  id="protein"
                  type="number"
                  value={formData.macronutrients.protein}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    macronutrients: { ...prev.macronutrients, protein: e.target.value }
                  }))}
                  placeholder="e.g., 150"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="carbs">Carbs</label>
                <input
                  id="carbs"
                  type="number"
                  value={formData.macronutrients.carbs}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    macronutrients: { ...prev.macronutrients, carbs: e.target.value }
                  }))}
                  placeholder="e.g., 300"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="fats">Fats</label>
                <input
                  id="fats"
                  type="number"
                  value={formData.macronutrients.fats}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    macronutrients: { ...prev.macronutrients, fats: e.target.value }
                  }))}
                  placeholder="e.g., 80"
                  required
                />
              </div>
            </div>
          </div>

          <div className="meal-plan-section">
            <h4>Meal Plan</h4>
            {formData.meal_plan.map((meal, mealIndex) => (
              <div key={mealIndex} className="meal-plan-item">
                <div className="meal-header">
                  <select
                    value={meal.meal_type}
                    onChange={(e) => updateMealPlan(mealIndex, 'meal_type', e.target.value)}
                    required
                  >
                    <option value="">Select Meal Type</option>
                    {mealTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Timing (e.g., 7:00 AM)"
                    value={meal.timing}
                    onChange={(e) => updateMealPlan(mealIndex, 'timing', e.target.value)}
                  />
                </div>
                
                <div className="foods-list">
                  {meal.foods.map((food, foodIndex) => (
                    <input
                      key={foodIndex}
                      type="text"
                      placeholder="Food item"
                      value={food}
                      onChange={(e) => updateFood(mealIndex, foodIndex, e.target.value)}
                      required
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addFoodToMeal(mealIndex)}
                    className="btn btn-secondary btn-small"
                  >
                    + Add Food
                  </button>
                </div>
                
                <textarea
                  placeholder="Notes (optional)"
                  value={meal.notes}
                  onChange={(e) => updateMealPlan(mealIndex, 'notes', e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addMealPlan}
              className="btn btn-secondary"
            >
              + Add Meal
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="supplements">Supplements (comma-separated)</label>
            <input
              id="supplements"
              type="text"
              value={formData.supplements.join(', ')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                supplements: e.target.value.split(',').map(s => s.trim()).filter(s => s)
              }))}
              placeholder="e.g., Whey protein, Creatine, BCAAs"
            />
          </div>

          <div className="hydration-section">
            <h4>Hydration Plan</h4>
            <div className="hydration-inputs">
              <div className="form-group">
                <label htmlFor="daily_water">Daily Water (liters)</label>
                <input
                  id="daily_water"
                  type="number"
                  step="0.1"
                  value={formData.hydration_plan.daily_water}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    hydration_plan: { ...prev.hydration_plan, daily_water: e.target.value }
                  }))}
                  placeholder="e.g., 3.5"
                />
              </div>
              <div className="form-group">
                <label htmlFor="pre_workout">Pre-Workout Hydration</label>
                <input
                  id="pre_workout"
                  type="text"
                  value={formData.hydration_plan.pre_workout}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    hydration_plan: { ...prev.hydration_plan, pre_workout: e.target.value }
                  }))}
                  placeholder="e.g., 500ml water 2 hours before"
                />
              </div>
              <div className="form-group">
                <label htmlFor="during_workout">During Workout</label>
                <input
                  id="during_workout"
                  type="text"
                  value={formData.hydration_plan.during_workout}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    hydration_plan: { ...prev.hydration_plan, during_workout: e.target.value }
                  }))}
                  placeholder="e.g., 250ml every 15 minutes"
                />
              </div>
              <div className="form-group">
                <label htmlFor="post_workout">Post-Workout</label>
                <input
                  id="post_workout"
                  type="text"
                  value={formData.hydration_plan.post_workout}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    hydration_plan: { ...prev.hydration_plan, post_workout: e.target.value }
                  }))}
                  placeholder="e.g., 500ml water + electrolytes"
                />
              </div>
            </div>
          </div>

          <div className="training-section">
            <h4>Training Schedule</h4>
            <div className="training-inputs">
              <div className="form-group">
                <label htmlFor="days_per_week">Training Days per Week</label>
                <input
                  id="days_per_week"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.training_schedule.days_per_week}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    training_schedule: { ...prev.training_schedule, days_per_week: e.target.value }
                  }))}
                  placeholder="e.g., 5"
                />
              </div>
              <div className="form-group">
                <label htmlFor="workout_duration">Workout Duration (minutes)</label>
                <input
                  id="workout_duration"
                  type="number"
                  value={formData.training_schedule.workout_duration}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    training_schedule: { ...prev.training_schedule, workout_duration: e.target.value }
                  }))}
                  placeholder="e.g., 90"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Share Diet Plan
          </button>
        </form>
      )}

      <div className="diets-grid">
        {diets.map(diet => (
          <div key={diet._id} className="diet-card">
            <div className="diet-header">
              <h3>{diet.diet_name}</h3>
              <span className="sport-badge">{diet.sport}</span>
            </div>
            
            <div className="diet-info">
              <p className="description">{diet.description}</p>
              
              <div className="nutrition-summary">
                <div className="nutrition-item">
                  <span className="label">Calories:</span>
                  <span className="value">{diet.daily_calories}</span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Protein:</span>
                  <span className="value">{diet.macronutrients.protein}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Carbs:</span>
                  <span className="value">{diet.macronutrients.carbs}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Fats:</span>
                  <span className="value">{diet.macronutrients.fats}g</span>
                </div>
              </div>

              {diet.meal_plan && diet.meal_plan.length > 0 && (
                <div className="meal-plan-preview">
                  <h4>Meal Plan</h4>
                  {diet.meal_plan.slice(0, 3).map((meal, index) => (
                    <div key={index} className="meal-preview">
                      <strong>{meal.meal_type}</strong>: {meal.foods.join(', ')}
                    </div>
                  ))}
                  {diet.meal_plan.length > 3 && (
                    <p className="more-meals">+{diet.meal_plan.length - 3} more meals</p>
                  )}
                </div>
              )}

              {diet.supplements && diet.supplements.length > 0 && (
                <div className="supplements">
                  <h4>Supplements</h4>
                  <p>{diet.supplements.join(', ')}</p>
                </div>
              )}

              {diet.hydration_plan && (
                <div className="hydration-preview">
                  <h4>Hydration</h4>
                  <p>Daily: {diet.hydration_plan.daily_water}L water</p>
                </div>
              )}

              {diet.training_schedule && (
                <div className="training-preview">
                  <h4>Training</h4>
                  <p>{diet.training_schedule.days_per_week} days/week, {diet.training_schedule.workout_duration} min sessions</p>
                </div>
              )}
            </div>

            <div className="diet-footer">
              <div className="user-info">
                <span>By {diet.user?.username || 'Anonymous'}</span>
                <span className="date">
                  {new Date(diet.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="diet-actions">
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

      {diets.length === 0 && !loading && (
        <div className="no-diets">
          <p>No athlete diets found for {selectedSport || 'any sport'}.</p>
          <p>Be the first to share your nutrition plan!</p>
        </div>
      )}
    </div>
  );
};

export default AthleteDiet;
