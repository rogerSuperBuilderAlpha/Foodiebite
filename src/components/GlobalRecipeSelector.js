import React, { useState, useEffect } from 'react';
import axios from 'axios';

const continents = [
  { name: 'Africa', regions: ['North Africa', 'West Africa', 'East Africa', 'Central Africa', 'Southern Africa'] },
  { name: 'Asia', regions: ['East Asia', 'South Asia', 'Southeast Asia', 'Central Asia', 'West Asia'] },
  { name: 'Europe', regions: ['Western Europe', 'Eastern Europe', 'Northern Europe', 'Southern Europe'] },
  { name: 'North America', regions: ['United States', 'Canada', 'Mexico', 'Caribbean', 'Central America'] },
  { name: 'South America', regions: ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela'] },
  { name: 'Oceania', regions: ['Australia', 'New Zealand', 'Pacific Islands'] }
];

export default function GlobalRecipeSelector({ onRecipeSelect }) {
  const [selectedContinent, setSelectedContinent] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [healthFocus, setHealthFocus] = useState('');
  const [dietaryTags, setDietaryTags] = useState([]);

  const healthOptions = [
    'anti-inflammatory', 'energy-boosting', 'digestive-health', 
    'heart-healthy', 'immune-boosting', 'bone-strength'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut-Free', 'Halal', 'Kosher', 'Low-Carb', 'Keto'
  ];

  const fetchGlobalRecipes = async () => {
    if (!selectedContinent) return;
    
    setLoading(true);
    try {
      const params = { continent: selectedContinent };
      if (selectedRegion) params.region = selectedRegion;
      if (healthFocus) params.health_focus = healthFocus;
      if (dietaryTags.length > 0) params.dietary_tags = dietaryTags.join(',');
      
      const response = await axios.get(`/api/recipes/global/${selectedContinent}`, { params });
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch global recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedContinent) {
      fetchGlobalRecipes();
    }
  }, [selectedContinent, selectedRegion, healthFocus, dietaryTags]);

  const handleDietaryChange = (tag) => {
    setDietaryTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="global-recipe-selector">
      <h3>🌍 Global Recipe Explorer</h3>
      
      <div className="selector-controls">
        <div className="control-group">
          <label>Continent:</label>
          <select 
            value={selectedContinent} 
            onChange={(e) => {
              setSelectedContinent(e.target.value);
              setSelectedRegion('');
            }}
          >
            <option value="">Select Continent</option>
            {continents.map(continent => (
              <option key={continent.name} value={continent.name}>
                {continent.name}
              </option>
            ))}
          </select>
        </div>

        {selectedContinent && (
          <div className="control-group">
            <label>Region:</label>
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">All Regions</option>
              {continents
                .find(c => c.name === selectedContinent)
                ?.regions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="control-group">
          <label>Health Focus:</label>
          <select 
            value={healthFocus} 
            onChange={(e) => setHealthFocus(e.target.value)}
          >
            <option value="">Any Health Focus</option>
            {healthOptions.map(option => (
              <option key={option} value={option}>
                {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Dietary Preferences:</label>
          <div className="dietary-tags">
            {dietaryOptions.map(tag => (
              <label key={tag} className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={dietaryTags.includes(tag)}
                  onChange={() => handleDietaryChange(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      </div>

      {loading && <div className="loading">Loading recipes...</div>}

      {recipes.length > 0 && (
        <div className="global-recipes">
          <h4>Recipes from {selectedContinent}</h4>
          <div className="recipe-grid">
            {recipes.map(recipe => (
              <div key={recipe._id} className="recipe-card" onClick={() => onRecipeSelect(recipe)}>
                <img src={recipe.image_url} alt={recipe.recipe_name} />
                <h5>{recipe.recipe_name}</h5>
                <p>{recipe.country}, {recipe.region}</p>
                <p className="cuisine">{recipe.cuisine}</p>
                {recipe.health_tags && recipe.health_tags.length > 0 && (
                  <div className="health-tags">
                    {recipe.health_tags.slice(0, 2).map(tag => (
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

      {!loading && selectedContinent && recipes.length === 0 && (
        <div className="no-recipes">
          <p>No recipes found for the selected criteria. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
