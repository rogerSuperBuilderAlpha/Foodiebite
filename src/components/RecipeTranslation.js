import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeTranslation = () => {
  const [translations, setTranslations] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    original_recipe: '',
    language: '',
    language_code: '',
    translated_content: {
      recipe_name: '',
      description: '',
      ingredients: [],
      instructions: [],
      cultural_context: '',
      tips: '',
      serving_suggestions: ''
    },
    cultural_adaptations: {
      local_ingredients: [],
      cooking_methods: [],
      serving_style: '',
      cultural_notes: ''
    }
  });

  const languages = [
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Italian', code: 'it' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Russian', code: 'ru' },
    { name: 'Chinese', code: 'zh' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Korean', code: 'ko' },
    { name: 'Arabic', code: 'ar' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Other', code: 'other' }
  ];

  useEffect(() => {
    fetchTranslations();
    fetchRecipes();
  }, [selectedLanguage, selectedRecipe]);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedLanguage) params.language = selectedLanguage;
      if (selectedRecipe) params.recipe_id = selectedRecipe;
      
      const response = await axios.get('http://localhost:5000/api/recipe-translations', { params });
      setTranslations(response.data);
    } catch (err) {
      setError('Failed to fetch translations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(response.data);
    } catch (err) {
      console.error('Failed to fetch recipes for translation');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to create translations');
        return;
      }

      await axios.post('http://localhost:5000/api/recipe-translations', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowForm(false);
      setFormData({
        original_recipe: '',
        language: '',
        language_code: '',
        translated_content: {
          recipe_name: '',
          description: '',
          ingredients: [],
          instructions: [],
          cultural_context: '',
          tips: '',
          serving_suggestions: ''
        },
        cultural_adaptations: {
          local_ingredients: [],
          cooking_methods: [],
          serving_style: '',
          cultural_notes: ''
        }
      });
      fetchTranslations();
    } catch (err) {
      setError('Failed to create translation');
      console.error(err);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      translated_content: {
        ...prev.translated_content,
        ingredients: [...prev.translated_content.ingredients, { original: '', translated: '', notes: '' }]
      }
    }));
  };

  const updateIngredient = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      translated_content: {
        ...prev.translated_content,
        ingredients: prev.translated_content.ingredients.map((ing, i) => 
          i === index ? { ...ing, [field]: value } : ing
        )
      }
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      translated_content: {
        ...prev.translated_content,
        ingredients: prev.translated_content.ingredients.filter((_, i) => i !== index)
      }
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      translated_content: {
        ...prev.translated_content,
        instructions: [...prev.translated_content.instructions, { step_number: prev.translated_content.instructions.length + 1, original: '', translated: '', notes: '' }]
      }
    }));
  };

  const updateInstruction = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      translated_content: {
        ...prev.translated_content,
        instructions: prev.translated_content.instructions.map((inst, i) => 
          i === index ? { ...inst, [field]: value } : inst
        )
      }
    }));
  };

  const removeInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      translated_content: {
        ...prev.translated_content,
        instructions: prev.translated_content.instructions.filter((_, i) => i !== index)
      }
    }));
  };

  const addLocalIngredient = () => {
    setFormData(prev => ({
      ...prev,
      cultural_adaptations: {
        ...prev.cultural_adaptations,
        local_ingredients: [...prev.cultural_adaptations.local_ingredients, '']
      }
    }));
  };

  const updateLocalIngredient = (index, value) => {
    setFormData(prev => ({
      ...prev,
      cultural_adaptations: {
        ...prev.cultural_adaptations,
        local_ingredients: prev.cultural_adaptations.local_ingredients.map((ing, i) => 
          i === index ? value : ing
        )
      }
    }));
  };

  const removeLocalIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      cultural_adaptations: {
        ...prev.cultural_adaptations,
        local_ingredients: prev.cultural_adaptations.local_ingredients.filter((_, i) => i !== index)
      }
    }));
  };

  const addCookingMethod = () => {
    setFormData(prev => ({
      ...prev,
      cultural_adaptations: {
        ...prev.cultural_adaptations,
        cooking_methods: [...prev.cultural_adaptations.cooking_methods, '']
      }
    }));
  };

  const updateCookingMethod = (index, value) => {
    setFormData(prev => ({
      ...prev,
      cultural_adaptations: {
        ...prev.cultural_adaptations,
        cooking_methods: prev.cultural_adaptations.cooking_methods.map((method, i) => 
          i === index ? value : method
        )
      }
    }));
  };

  const removeCookingMethod = (index) => {
    setFormData(prev => ({
      ...prev,
      cultural_adaptations: {
        ...prev.cultural_adaptations,
        cooking_methods: prev.cultural_adaptations.cooking_methods.filter((_, i) => i !== index)
      }
    }));
  };

  const handleLanguageChange = (languageName) => {
    const language = languages.find(lang => lang.name === languageName);
    setFormData(prev => ({
      ...prev,
      language: languageName,
      language_code: language.code
    }));
  };

  if (loading) return <div className="loading">Loading translations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recipe-translation-container">
      <div className="translation-header">
        <h2>🌍 Recipe Translation Hub</h2>
        <p>Translate recipes into different languages and share cultural adaptations</p>
        
        <div className="translation-filters">
          <div className="filter-group">
            <label htmlFor="language-select">Language:</label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map(lang => (
                <option key={lang.code} value={lang.name}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="recipe-select">Recipe:</label>
            <select
              id="recipe-select"
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
            >
              <option value="">All Recipes</option>
              {recipes.map(recipe => (
                <option key={recipe._id} value={recipe._id}>{recipe.recipe_name}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create Translation'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="translation-form">
          <h3>Create Recipe Translation</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="original_recipe">Original Recipe *</label>
              <select
                id="original_recipe"
                value={formData.original_recipe}
                onChange={(e) => setFormData(prev => ({ ...prev, original_recipe: e.target.value }))}
                required
              >
                <option value="">Select Recipe to Translate</option>
                {recipes.map(recipe => (
                  <option key={recipe._id} value={recipe._id}>{recipe.recipe_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="language">Target Language *</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                required
              >
                <option value="">Select Language</option>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.name}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="translated-content-section">
            <h4>Translated Content</h4>
            
            <div className="form-group">
              <label htmlFor="translated_name">Recipe Name (Translated) *</label>
              <input
                id="translated_name"
                type="text"
                value={formData.translated_content.recipe_name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  translated_content: { ...prev.translated_content, recipe_name: e.target.value }
                }))}
                placeholder="Translated recipe name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="translated_description">Description (Translated)</label>
              <textarea
                id="translated_description"
                value={formData.translated_content.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  translated_content: { ...prev.translated_content, description: e.target.value }
                }))}
                placeholder="Translated description"
              />
            </div>

            <div className="ingredients-translation-section">
              <h5>Ingredients Translation</h5>
              {formData.translated_content.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-translation">
                  <div className="ingredient-inputs">
                    <input
                      type="text"
                      placeholder="Original ingredient"
                      value={ingredient.original}
                      onChange={(e) => updateIngredient(index, 'original', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Translated ingredient"
                      value={ingredient.translated}
                      onChange={(e) => updateIngredient(index, 'translated', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={ingredient.notes}
                      onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="btn btn-danger btn-small"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="btn btn-secondary"
              >
                + Add Ingredient Translation
              </button>
            </div>

            <div className="instructions-translation-section">
              <h5>Instructions Translation</h5>
              {formData.translated_content.instructions.map((instruction, index) => (
                <div key={index} className="instruction-translation">
                  <div className="instruction-header">
                    <span className="step-number">Step {instruction.step_number}</span>
                  </div>
                  <div className="instruction-inputs">
                    <textarea
                      placeholder="Original instruction"
                      value={instruction.original}
                      onChange={(e) => updateInstruction(index, 'original', e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="Translated instruction"
                      value={instruction.translated}
                      onChange={(e) => updateInstruction(index, 'translated', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={instruction.notes}
                      onChange={(e) => updateInstruction(index, 'notes', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="btn btn-danger btn-small"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addInstruction}
                className="btn btn-secondary"
              >
                + Add Instruction Translation
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="cultural_context">Cultural Context</label>
              <textarea
                id="cultural_context"
                value={formData.translated_content.cultural_context}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  translated_content: { ...prev.translated_content, cultural_context: e.target.value }
                }))}
                placeholder="Cultural background, traditions, or significance..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="tips">Cooking Tips</label>
              <textarea
                id="tips"
                value={formData.translated_content.tips}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  translated_content: { ...prev.translated_content, tips: e.target.value }
                }))}
                placeholder="Helpful tips for cooking this dish..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="serving_suggestions">Serving Suggestions</label>
              <textarea
                id="serving_suggestions"
                value={formData.translated_content.serving_suggestions}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  translated_content: { ...prev.translated_content, serving_suggestions: e.target.value }
                }))}
                placeholder="How to serve, accompaniments, presentation..."
              />
            </div>
          </div>

          <div className="cultural-adaptations-section">
            <h4>Cultural Adaptations</h4>
            
            <div className="local-ingredients-section">
              <h5>Local Ingredient Substitutions</h5>
              {formData.cultural_adaptations.local_ingredients.map((ingredient, index) => (
                <div key={index} className="local-ingredient-input">
                  <input
                    type="text"
                    placeholder="Local ingredient alternative"
                    value={ingredient}
                    onChange={(e) => updateLocalIngredient(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeLocalIngredient(index)}
                    className="btn btn-danger btn-small"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLocalIngredient}
                className="btn btn-secondary"
              >
                + Add Local Ingredient
              </button>
            </div>

            <div className="cooking-methods-section">
              <h5>Local Cooking Methods</h5>
              {formData.cultural_adaptations.cooking_methods.map((method, index) => (
                <div key={index} className="cooking-method-input">
                  <input
                    type="text"
                    placeholder="Local cooking method"
                    value={method}
                    onChange={(e) => updateCookingMethod(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeCookingMethod(index)}
                    className="btn btn-danger btn-small"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCookingMethod}
                className="btn btn-secondary"
              >
                + Add Cooking Method
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="serving_style">Local Serving Style</label>
              <input
                id="serving_style"
                type="text"
                value={formData.cultural_adaptations.serving_style}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  cultural_adaptations: { ...prev.cultural_adaptations, serving_style: e.target.value }
                }))}
                placeholder="e.g., Family-style, Individual plates, Communal bowl"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cultural_notes">Cultural Notes</label>
              <textarea
                id="cultural_notes"
                value={formData.cultural_adaptations.cultural_notes}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  cultural_adaptations: { ...prev.cultural_adaptations, cultural_notes: e.target.value }
                }))}
                placeholder="Additional cultural context, traditions, or customs..."
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Create Translation
          </button>
        </form>
      )}

      <div className="translations-grid">
        {translations.map(translation => (
          <div key={translation._id} className="translation-card">
            <div className="translation-header">
              <h3>{translation.translated_content.recipe_name}</h3>
              <div className="translation-badges">
                <span className="language-badge">{translation.language}</span>
                <span className="status-badge">{translation.translation_status}</span>
              </div>
            </div>
            
            <div className="translation-content">
              <div className="original-recipe-info">
                <h4>Original Recipe</h4>
                <p><strong>Name:</strong> {translation.original_recipe?.recipe_name || 'Unknown'}</p>
                {translation.original_recipe?.image_url && (
                  <img 
                    src={translation.original_recipe.image_url} 
                    alt={translation.original_recipe.recipe_name}
                    className="recipe-thumbnail"
                  />
                )}
              </div>

              {translation.translated_content.description && (
                <div className="translated-description">
                  <h4>Description</h4>
                  <p>{translation.translated_content.description}</p>
                </div>
              )}

              {translation.translated_content.ingredients && translation.translated_content.ingredients.length > 0 && (
                <div className="translated-ingredients">
                  <h4>Ingredients</h4>
                  <div className="ingredients-list">
                    {translation.translated_content.ingredients.slice(0, 3).map((ingredient, index) => (
                      <div key={index} className="ingredient-item">
                        <span className="original">{ingredient.original}</span>
                        <span className="arrow">→</span>
                        <span className="translated">{ingredient.translated}</span>
                      </div>
                    ))}
                    {translation.translated_content.ingredients.length > 3 && (
                      <p className="more-ingredients">+{translation.translated_content.ingredients.length - 3} more ingredients</p>
                    )}
                  </div>
                </div>
              )}

              {translation.translated_content.instructions && translation.translated_content.instructions.length > 0 && (
                <div className="translated-instructions">
                  <h4>Instructions</h4>
                  <div className="instructions-preview">
                    {translation.translated_content.instructions.slice(0, 2).map((instruction, index) => (
                      <div key={index} className="instruction-preview">
                        <strong>Step {instruction.step_number}:</strong> {instruction.translated}
                      </div>
                    ))}
                    {translation.translated_content.instructions.length > 2 && (
                      <p className="more-instructions">+{translation.translated_content.instructions.length - 2} more steps</p>
                    )}
                  </div>
                </div>
              )}

              {translation.cultural_adaptations && (
                <div className="cultural-adaptations-preview">
                  <h4>Cultural Adaptations</h4>
                  {translation.cultural_adaptations.local_ingredients && translation.cultural_adaptations.local_ingredients.length > 0 && (
                    <p><strong>Local Ingredients:</strong> {translation.cultural_adaptations.local_ingredients.join(', ')}</p>
                  )}
                  {translation.cultural_adaptations.cooking_methods && translation.cultural_adaptations.cooking_methods.length > 0 && (
                    <p><strong>Local Methods:</strong> {translation.cultural_adaptations.cooking_methods.join(', ')}</p>
                  )}
                  {translation.cultural_adaptations.serving_style && (
                    <p><strong>Serving Style:</strong> {translation.cultural_adaptations.serving_style}</p>
                  )}
                </div>
              )}

              {translation.accuracy_score > 0 && (
                <div className="accuracy-score">
                  <h4>Accuracy Score</h4>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${translation.accuracy_score}%` }}
                    ></div>
                  </div>
                  <span className="score-text">{translation.accuracy_score}%</span>
                </div>
              )}
            </div>

            <div className="translation-footer">
              <div className="user-info">
                <span>Translated by {translation.translated_by?.username || 'Anonymous'}</span>
                <span className="date">
                  {new Date(translation.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="rating-info">
                {translation.average_rating > 0 && (
                  <div className="rating">
                    ⭐ {translation.average_rating.toFixed(1)} ({translation.total_ratings})
                  </div>
                )}
              </div>

              <div className="translation-actions">
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

      {translations.length === 0 && !loading && (
        <div className="no-translations">
          <p>No translations found matching your criteria.</p>
          <p>Be the first to translate a recipe!</p>
        </div>
      )}
    </div>
  );
};

export default RecipeTranslation;
