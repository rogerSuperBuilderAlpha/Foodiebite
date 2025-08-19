import React, { useState, useEffect } from 'react';
import axios from 'axios';

const demographics = [
  { 
    id: 'youth', 
    name: 'Youth (13-25)', 
    icon: '👨‍🎓',
    description: 'Recipes optimized for growing bodies, energy, and brain development'
  },
  { 
    id: 'elderly', 
    name: 'Elderly (65+)', 
    icon: '👴',
    description: 'Nutrient-dense meals supporting bone health, heart health, and digestion'
  },
  { 
    id: 'women_period', 
    name: 'Women (Period)', 
    icon: '👩',
    description: 'Iron-rich, anti-inflammatory foods to support menstrual health'
  },
  { 
    id: 'general', 
    name: 'General Health', 
    icon: '🏃',
    description: 'Balanced nutrition for overall wellness and vitality'
  }
];

const healthFocusOptions = {
  youth: ['energy-boosting', 'brain-health', 'growth-support', 'immune-boosting'],
  elderly: ['bone-strength', 'heart-health', 'digestive-health', 'anti-inflammatory'],
  women_period: ['iron-rich', 'anti-inflammatory', 'mood-support', 'energy-boosting'],
  general: ['balanced-nutrition', 'immune-boosting', 'heart-health', 'digestive-health']
};

export default function NutritionBenefits() {
  const [selectedDemographic, setSelectedDemographic] = useState('');
  const [healthFocus, setHealthFocus] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nutritionInfo, setNutritionInfo] = useState(null);

  const nutritionTips = {
    youth: {
      keyNutrients: ['Protein', 'Omega-3', 'Iron', 'Calcium', 'Vitamin D'],
      tips: [
        'Include lean proteins for muscle development',
        'Choose whole grains for sustained energy',
        'Add colorful fruits and vegetables for antioxidants',
        'Stay hydrated throughout the day',
        'Limit processed foods and added sugars'
      ]
    },
    elderly: {
      keyNutrients: ['Calcium', 'Vitamin D', 'B12', 'Fiber', 'Omega-3'],
      tips: [
        'Focus on calcium-rich foods for bone health',
        'Include fiber for digestive health',
        'Choose soft, easy-to-chew foods',
        'Stay hydrated and limit sodium',
        'Small, frequent meals may be easier to digest'
      ]
    },
    women_period: {
      keyNutrients: ['Iron', 'Vitamin C', 'Magnesium', 'B6', 'Omega-3'],
      tips: [
        'Include iron-rich foods with vitamin C for absorption',
        'Choose anti-inflammatory foods like fatty fish',
        'Add magnesium-rich foods for muscle relaxation',
        'Stay hydrated and limit caffeine',
        'Include mood-supporting foods like dark chocolate'
      ]
    },
    general: {
      keyNutrients: ['Protein', 'Fiber', 'Antioxidants', 'Healthy Fats', 'Vitamins'],
      tips: [
        'Eat a rainbow of fruits and vegetables',
        'Include lean proteins and healthy fats',
        'Choose whole grains over refined grains',
        'Stay hydrated with water',
        'Practice mindful eating habits'
      ]
    }
  };

  const fetchNutritionRecipes = async () => {
    if (!selectedDemographic) return;
    
    setLoading(true);
    try {
      const params = { demographic: selectedDemographic };
      if (healthFocus) params.health_focus = healthFocus;
      
      const response = await axios.get(`/api/recipes/nutrition/${selectedDemographic}`, { params });
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch nutrition recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDemographic) {
      setHealthFocus('');
      fetchNutritionRecipes();
      setNutritionInfo(nutritionTips[selectedDemographic]);
    }
  }, [selectedDemographic]);

  useEffect(() => {
    if (selectedDemographic && healthFocus) {
      fetchNutritionRecipes();
    }
  }, [healthFocus]);

  return (
    <div className="nutrition-benefits">
      <h3>🥗 Nutrition Benefits by Demographics</h3>
      
      <div className="demographic-selector">
        {demographics.map(demo => (
          <button
            key={demo.id}
            className={`demo-card ${selectedDemographic === demo.id ? 'active' : ''}`}
            onClick={() => setSelectedDemographic(demo.id)}
          >
            <span className="demo-icon">{demo.icon}</span>
            <h4>{demo.name}</h4>
            <p>{demo.description}</p>
          </button>
        ))}
      </div>

      {selectedDemographic && nutritionInfo && (
        <div className="nutrition-details">
          <div className="nutrition-info">
            <h4>Key Nutrients for {nutritionInfo.keyNutrients.join(', ')}</h4>
            <div className="tips-list">
              {nutritionInfo.tips.map((tip, index) => (
                <div key={index} className="tip-item">
                  <span className="tip-icon">💡</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="health-focus">
            <label>Health Focus:</label>
            <select 
              value={healthFocus} 
              onChange={(e) => setHealthFocus(e.target.value)}
            >
              <option value="">All Health Benefits</option>
              {healthFocusOptions[selectedDemographic].map(option => (
                <option key={option} value={option}>
                  {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading nutrition-focused recipes...</div>}

      {recipes.length > 0 && (
        <div className="nutrition-recipes">
          <h4>Recipes for {selectedDemographic && demographics.find(d => d.id === selectedDemographic)?.name}</h4>
          <div className="recipe-grid">
            {recipes.map(recipe => (
              <div key={recipe._id} className="recipe-card nutrition-card">
                <img src={recipe.image_url} alt={recipe.recipe_name} />
                <h5>{recipe.recipe_name}</h5>
                <p className="cuisine">{recipe.cuisine}</p>
                
                {recipe.nutrition_benefits && recipe.nutrition_benefits.length > 0 && (
                  <div className="nutrition-benefits-list">
                    {recipe.nutrition_benefits
                      .filter(benefit => benefit.demographic === selectedDemographic)
                      .map((benefit, index) => (
                        <div key={index} className="benefit-item">
                          <h6>Benefits:</h6>
                          <ul>
                            {benefit.benefits.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                          <h6>Key Nutrients:</h6>
                          <ul>
                            {benefit.nutrients.map((n, i) => (
                              <li key={i}>{n}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                )}
                
                {recipe.health_tags && recipe.health_tags.length > 0 && (
                  <div className="health-tags">
                    {recipe.health_tags.map(tag => (
                      <span key={tag} className="health-tag">{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="rating">⭐ {recipe.rating.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && selectedDemographic && recipes.length === 0 && (
        <div className="no-recipes">
          <p>No recipes found for the selected demographic and health focus. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
