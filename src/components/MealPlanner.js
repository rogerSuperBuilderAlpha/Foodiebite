import React, { useState, useEffect } from 'react';
import axios from 'axios';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function MealPlanner({ user }) {
  const [mealPlans, setMealPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    nutrition_goals: {
      target_calories: '',
      target_protein: '',
      target_carbs: '',
      target_fat: ''
    },
    dietary_restrictions: [],
    health_focus: 'general'
  });

  useEffect(() => {
    if (user) {
      fetchMealPlans();
      fetchRecipes();
    }
  }, [user]);

  const fetchMealPlans = async () => {
    try {
      const response = await axios.get('/api/meal-plans', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMealPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch meal plans:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  };

  const createMealPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/meal-plans', newPlan, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Initialize the plan with empty meals for each day
      const planWithMeals = {
        ...response.data,
        meals: daysOfWeek.map(day => 
          mealTypes.map(mealType => ({
            day,
            meal_type: mealType,
            recipe: null,
            custom_meal: null,
            prep_notes: '',
            shopping_list: []
          }))
        ).flat()
      };
      
      setMealPlans([planWithMeals, ...mealPlans]);
      setCurrentPlan(planWithMeals);
      setShowCreateForm(false);
      setNewPlan({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        nutrition_goals: { target_calories: '', target_protein: '', target_carbs: '', target_fat: '' },
        dietary_restrictions: [],
        health_focus: 'general'
      });
    } catch (error) {
      console.error('Failed to create meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMeal = async (planId, mealIndex, updates) => {
    try {
      const updatedPlan = { ...currentPlan };
      updatedPlan.meals[mealIndex] = { ...updatedPlan.meals[mealIndex], ...updates };
      
      const response = await axios.put(`/api/meal-plans/${planId}`, updatedPlan, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setCurrentPlan(response.data);
      setMealPlans(mealPlans.map(p => p._id === planId ? response.data : p));
    } catch (error) {
      console.error('Failed to update meal:', error);
    }
  };

  const addToShoppingList = (planId, mealIndex, ingredients) => {
    if (!ingredients || ingredients.length === 0) return;
    
    const updatedPlan = { ...currentPlan };
    const currentList = updatedPlan.meals[mealIndex].shopping_list || [];
    const newItems = ingredients.filter(item => !currentList.includes(item));
    
    updatedPlan.meals[mealIndex].shopping_list = [...currentList, ...newItems];
    updateMeal(planId, mealIndex, { shopping_list: updatedPlan.meals[mealIndex].shopping_list });
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.recipe_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher'
  ];

  const healthFocusOptions = [
    'general', 'weight_loss', 'muscle_gain', 'energy_boost', 'youth', 'elderly', 'women_period'
  ];

  return (
    <div className="meal-planner">
      <h3>📅 Meal Planner & Prep</h3>
      
      {!currentPlan && !showCreateForm && (
        <div className="meal-planner-intro">
          <p>Plan your weekly meals, track nutrition goals, and prepare for the week ahead!</p>
          <button 
            className="btn btn--primary" 
            onClick={() => setShowCreateForm(true)}
          >
            Create New Meal Plan
          </button>
          
          {mealPlans.length > 0 && (
            <div className="existing-plans">
              <h4>Your Meal Plans:</h4>
              {mealPlans.map(plan => (
                <div key={plan._id} className="plan-summary" onClick={() => setCurrentPlan(plan)}>
                  <h5>{plan.name}</h5>
                  <p>{plan.description}</p>
                  <small>{new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showCreateForm && (
        <div className="create-meal-plan">
          <h4>Create New Meal Plan</h4>
          <form onSubmit={(e) => { e.preventDefault(); createMealPlan(); }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Plan Name:</label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={newPlan.start_date}
                  onChange={(e) => setNewPlan({...newPlan, start_date: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>End Date:</label>
                <input
                  type="date"
                  value={newPlan.end_date}
                  onChange={(e) => setNewPlan({...newPlan, end_date: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Health Focus:</label>
                <select
                  value={newPlan.health_focus}
                  onChange={(e) => setNewPlan({...newPlan, health_focus: e.target.value})}
                >
                  {healthFocusOptions.map(option => (
                    <option key={option} value={option}>
                      {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="nutrition-goals">
              <h5>Nutrition Goals (optional):</h5>
              <div className="goals-grid">
                <div className="goal-item">
                  <label>Target Calories:</label>
                  <input
                    type="number"
                    value={newPlan.nutrition_goals.target_calories}
                    onChange={(e) => setNewPlan({
                      ...newPlan, 
                      nutrition_goals: {...newPlan.nutrition_goals, target_calories: e.target.value}
                    })}
                  />
                </div>
                <div className="goal-item">
                  <label>Target Protein (g):</label>
                  <input
                    type="number"
                    value={newPlan.nutrition_goals.target_protein}
                    onChange={(e) => setNewPlan({
                      ...newPlan, 
                      nutrition_goals: {...newPlan.nutrition_goals, target_protein: e.target.value}
                    })}
                  />
                </div>
                <div className="goal-item">
                  <label>Target Carbs (g):</label>
                  <input
                    type="number"
                    value={newPlan.nutrition_goals.target_carbs}
                    onChange={(e) => setNewPlan({
                      ...newPlan, 
                      nutrition_goals: {...newPlan.nutrition_goals, target_carbs: e.target.value}
                    })}
                  />
                </div>
                <div className="goal-item">
                  <label>Target Fat (g):</label>
                  <input
                    type="number"
                    value={newPlan.nutrition_goals.target_fat}
                    onChange={(e) => setNewPlan({
                      ...newPlan, 
                      nutrition_goals: {...newPlan.nutrition_goals, target_fat: e.target.value}
                    })}
                  />
                </div>
              </div>
            </div>
            
            <div className="dietary-restrictions">
              <h5>Dietary Restrictions:</h5>
              <div className="restrictions-grid">
                {dietaryOptions.map(option => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newPlan.dietary_restrictions.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewPlan({
                            ...newPlan, 
                            dietary_restrictions: [...newPlan.dietary_restrictions, option]
                          });
                        } else {
                          setNewPlan({
                            ...newPlan, 
                            dietary_restrictions: newPlan.dietary_restrictions.filter(r => r !== option)
                          });
                        }
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn--primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Meal Plan'}
              </button>
              <button 
                type="button" 
                className="btn btn--ghost" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {currentPlan && (
        <div className="meal-plan-view">
          <div className="plan-header">
            <h4>{currentPlan.name}</h4>
            <p>{currentPlan.description}</p>
            <div className="plan-actions">
              <button 
                className="btn btn--ghost" 
                onClick={() => setCurrentPlan(null)}
              >
                ← Back to Plans
              </button>
              <button 
                className="btn btn--primary" 
                onClick={() => window.print()}
              >
                📄 Print Plan
              </button>
            </div>
          </div>

          <div className="weekly-meal-grid">
            {daysOfWeek.map(day => (
              <div key={day} className="day-column">
                <h5 className="day-header">{day}</h5>
                {mealTypes.map(mealType => {
                  const mealIndex = currentPlan.meals.findIndex(
                    m => m.day === day && m.meal_type === mealType
                  );
                  const meal = currentPlan.meals[mealIndex];
                  
                  return (
                    <div key={mealType} className="meal-slot">
                      <h6 className="meal-type">{mealType}</h6>
                      
                      {meal.recipe ? (
                        <div className="assigned-recipe">
                          <img src={meal.recipe.image_url} alt={meal.recipe.recipe_name} />
                          <h6>{meal.recipe.recipe_name}</h6>
                          <button 
                            className="btn btn--small"
                            onClick={() => updateMeal(currentPlan._id, mealIndex, { recipe: null })}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="empty-meal">
                          <input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          
                          {searchQuery && (
                            <div className="recipe-search-results">
                              {filteredRecipes.slice(0, 5).map(recipe => (
                                <div 
                                  key={recipe._id} 
                                  className="recipe-option"
                                  onClick={() => {
                                    updateMeal(currentPlan._id, mealIndex, { recipe });
                                    setSearchQuery('');
                                  }}
                                >
                                  <img src={recipe.image_url} alt={recipe.recipe_name} />
                                  <span>{recipe.recipe_name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <textarea
                        placeholder="Prep notes..."
                        value={meal.prep_notes || ''}
                        onChange={(e) => updateMeal(currentPlan._id, mealIndex, { prep_notes: e.target.value })}
                      />
                      
                      {meal.recipe && (
                        <button 
                          className="btn btn--small btn--secondary"
                          onClick={() => addToShoppingList(currentPlan._id, mealIndex, meal.recipe.ingredients)}
                        >
                          Add to Shopping List
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="shopping-list">
            <h5>🛒 Shopping List</h5>
            <div className="shopping-items">
              {Array.from(new Set(
                currentPlan.meals
                  .filter(m => m.shopping_list && m.shopping_list.length > 0)
                  .flatMap(m => m.shopping_list)
              )).map((item, index) => (
                <div key={index} className="shopping-item">
                  <input type="checkbox" id={`item-${index}`} />
                  <label htmlFor={`item-${index}`}>{item}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
