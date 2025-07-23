import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Recipes() {
  const [freeRecipes, setFreeRecipes] = useState([]);
  const [experimental, setExperimental] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch free, tested recipes from an open API (e.g., TheMealDB)
    axios.get('https://www.themealdb.com/api/json/v1/1/search.php?f=c')
      .then(res => setFreeRecipes(res.data.meals || []));
    // Fetch experimental recipes from your backend
    axios.get('http://localhost:5000/api/recipes?experimental=true')
      .then(res => setExperimental(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading recipes...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2>Free, Tested Online Recipes</h2>
      <RecipeList recipes={freeRecipes} source="external" />
      <h2 style={{ marginTop: 40 }}>Experimental Food</h2>
      <RecipeList recipes={experimental} source="experimental" />
    </div>
  );
}

function RecipeList({ recipes, source }) {
  if (!recipes.length) return <div>No recipes found.</div>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {recipes.map(recipe => (
        <div key={recipe.idMeal || recipe._id} style={{
          border: '1px solid #eee', borderRadius: 8, padding: 16, width: 260, background: '#fafbfc'
        }}>
          <img
            src={recipe.strMealThumb || recipe.image_url}
            alt={recipe.strMeal || recipe.recipe_name}
            style={{ width: '100%', borderRadius: 6, marginBottom: 8 }}
          />
          <h4>{recipe.strMeal || recipe.recipe_name}</h4>
          <p>
            {source === 'external' && recipe.strSource && (
              <a href={recipe.strSource} target="_blank" rel="noopener noreferrer">View Source</a>
            )}
            {source === 'experimental' && recipe.instructions && (
              <span>{recipe.instructions.slice(0, 80)}...</span>
            )}
          </p>
          {/* Attribution for experimental recipes */}
          {source === 'experimental' && recipe.cultural_context && (
            <div style={{ fontSize: 12, color: '#888' }}>By {recipe.cultural_context}</div>
          )}
        </div>
      ))}
    </div>
  );
} 