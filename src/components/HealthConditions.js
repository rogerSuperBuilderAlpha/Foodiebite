import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthConditions = () => {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    condition_type: '',
    condition_name: '',
    description: '',
    severity_level: '',
    dietary_restrictions: [],
    recommended_foods: [],
    foods_to_avoid: [],
    nutritional_guidelines: {
      daily_calories: { min: '', max: '' },
      macronutrients: {
        protein: { min: '', max: '' },
        carbs: { min: '', max: '' },
        fats: { min: '', max: '' }
      },
      micronutrients: {
        fiber: { min: '', max: '' },
        sodium: { min: '', max: '' },
        potassium: { min: '', max: '' },
        vitamins: [],
        minerals: []
      }
    },
    meal_timing: {
      frequency: '',
      spacing: '',
      special_considerations: ''
    },
    cooking_methods: {
      recommended: [],
      avoid: []
    },
    monitoring: {
      blood_sugar: false,
      weight: false,
      blood_pressure: false,
      other_metrics: []
    },
    emergency_signs: [],
    professional_advice: '',
    resources: []
  });

  const conditionTypes = ['Diabetes', 'Eating Disorder', 'Heart Disease', 'Celiac Disease', 'Lactose Intolerance', 'Hypertension', 'Other'];
  const severityLevels = ['Mild', 'Moderate', 'Severe'];
  const cookingMethods = ['Steaming', 'Grilling', 'Baking', 'Boiling', 'Sautéing', 'Raw', 'Fermenting', 'Slow Cooking'];
  const monitoringMetrics = ['Blood Sugar', 'Weight', 'Blood Pressure', 'Heart Rate', 'Cholesterol', 'Iron Levels', 'Vitamin D', 'Other'];

  useEffect(() => {
    fetchConditions();
  }, [selectedType, selectedSeverity]);

  const fetchConditions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedType) params.condition_type = selectedType;
      if (selectedSeverity) params.severity_level = selectedSeverity;
      
      const response = await axios.get('http://localhost:5000/api/health-conditions', { params });
      setConditions(response.data);
    } catch (err) {
      setError('Failed to fetch health conditions');
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
        setError('Please login to share health condition information');
        return;
      }

      await axios.post('http://localhost:5000/api/health-conditions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowForm(false);
      setFormData({
        condition_type: '',
        condition_name: '',
        description: '',
        severity_level: '',
        dietary_restrictions: [],
        recommended_foods: [],
        foods_to_avoid: [],
        nutritional_guidelines: {
          daily_calories: { min: '', max: '' },
          macronutrients: { protein: { min: '', max: '' }, carbs: { min: '', max: '' }, fats: { min: '', max: '' } },
          micronutrients: { fiber: { min: '', max: '' }, sodium: { min: '', max: '' }, potassium: { min: '', max: '' }, vitamins: [], minerals: [] }
        },
        meal_timing: { frequency: '', spacing: '', special_considerations: '' },
        cooking_methods: { recommended: [], avoid: [] },
        monitoring: { blood_sugar: false, weight: false, blood_pressure: false, other_metrics: [] },
        emergency_signs: [],
        professional_advice: '',
        resources: []
      });
      fetchConditions();
    } catch (err) {
      setError('Failed to create health condition');
      console.error(err);
    }
  };

  const addArrayItem = (field, value = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleCookingMethod = (method, isRecommended = true) => {
    const field = isRecommended ? 'recommended' : 'avoid';
    setFormData(prev => ({
      ...prev,
      cooking_methods: {
        ...prev.cooking_methods,
        [field]: prev.cooking_methods[field].includes(method)
          ? prev.cooking_methods[field].filter(m => m !== method)
          : [...prev.cooking_methods[field], method]
      }
    }));
  };

  const toggleMonitoring = (metric) => {
    setFormData(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        [metric.toLowerCase().replace(' ', '_')]: !prev.monitoring[metric.toLowerCase().replace(' ', '_')]
      }
    }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { title: '', url: '', description: '' }]
    }));
  };

  const updateResource = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    }));
  };

  if (loading) return <div className="loading">Loading health conditions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="health-conditions-container">
      <div className="health-conditions-header">
        <h2>🍎 Health Condition Nutrition Guide</h2>
        <p>Discover nutrition guidance for diabetes, eating disorders, and other health conditions</p>
        
        <div className="condition-filters">
          <div className="filter-group">
            <label htmlFor="type-select">Condition Type:</label>
            <select
              id="type-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {conditionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="severity-select">Severity Level:</label>
            <select
              id="severity-select"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="">All Levels</option>
              {severityLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Share Health Information'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="health-condition-form">
          <h3>Share Health Condition Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="condition_type">Condition Type *</label>
              <select
                id="condition_type"
                value={formData.condition_type}
                onChange={(e) => setFormData(prev => ({ ...prev, condition_type: e.target.value }))}
                required
              >
                <option value="">Select Condition Type</option>
                {conditionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="condition_name">Condition Name *</label>
              <input
                id="condition_name"
                type="text"
                value={formData.condition_name}
                onChange={(e) => setFormData(prev => ({ ...prev, condition_name: e.target.value }))}
                placeholder="e.g., Type 2 Diabetes, Anorexia Nervosa"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the condition and its nutritional impact..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="severity_level">Severity Level *</label>
            <select
              id="severity_level"
              value={formData.severity_level}
              onChange={(e) => setFormData(prev => ({ ...prev, severity_level: e.target.value }))}
              required
            >
              <option value="">Select Severity</option>
              {severityLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="dietary-section">
            <h4>Dietary Guidelines</h4>
            
            <div className="form-group">
              <label htmlFor="dietary_restrictions">Dietary Restrictions (comma-separated)</label>
              <input
                id="dietary_restrictions"
                type="text"
                value={formData.dietary_restrictions.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dietary_restrictions: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }))}
                placeholder="e.g., Low sodium, No added sugar, Limited carbs"
              />
            </div>

            <div className="form-group">
              <label htmlFor="recommended_foods">Recommended Foods (comma-separated)</label>
              <input
                id="recommended_foods"
                type="text"
                value={formData.recommended_foods.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  recommended_foods: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }))}
                placeholder="e.g., Leafy greens, Lean protein, Whole grains"
              />
            </div>

            <div className="form-group">
              <label htmlFor="foods_to_avoid">Foods to Avoid (comma-separated)</label>
              <input
                id="foods_to_avoid"
                type="text"
                value={formData.foods_to_avoid.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  foods_to_avoid: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }))}
                placeholder="e.g., Processed foods, High sodium items, Refined sugars"
              />
            </div>
          </div>

          <div className="nutritional-guidelines-section">
            <h4>Nutritional Guidelines</h4>
            
            <div className="calories-section">
              <h5>Daily Calories</h5>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="calories_min">Minimum</label>
                  <input
                    id="calories_min"
                    type="number"
                    value={formData.nutritional_guidelines.daily_calories.min}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutritional_guidelines: {
                        ...prev.nutritional_guidelines,
                        daily_calories: { ...prev.nutritional_guidelines.daily_calories, min: e.target.value }
                      }
                    }))}
                    placeholder="e.g., 1200"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="calories_max">Maximum</label>
                  <input
                    id="calories_max"
                    type="number"
                    value={formData.nutritional_guidelines.daily_calories.max}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutritional_guidelines: {
                        ...prev.nutritional_guidelines,
                        daily_calories: { ...prev.nutritional_guidelines.daily_calories, max: e.target.value }
                      }
                    }))}
                    placeholder="e.g., 2000"
                  />
                </div>
              </div>
            </div>

            <div className="macronutrients-section">
              <h5>Macronutrients (% of daily calories)</h5>
              <div className="macro-grid">
                {['protein', 'carbs', 'fats'].map(macro => (
                  <div key={macro} className="macro-input">
                    <label htmlFor={`${macro}_min`}>{macro.charAt(0).toUpperCase() + macro.slice(1)} Min (%)</label>
                    <input
                      id={`${macro}_min`}
                      type="number"
                      min="0"
                      max="100"
                      value={formData.nutritional_guidelines.macronutrients[macro].min}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        nutritional_guidelines: {
                          ...prev.nutritional_guidelines,
                          macronutrients: {
                            ...prev.nutritional_guidelines.macronutrients,
                            [macro]: { ...prev.nutritional_guidelines.macronutrients[macro], min: e.target.value }
                          }
                        }
                      }))}
                      placeholder="e.g., 20"
                    />
                    <label htmlFor={`${macro}_max`}>{macro.charAt(0).toUpperCase() + macro.slice(1)} Max (%)</label>
                    <input
                      id={`${macro}_max`}
                      type="number"
                      min="0"
                      max="100"
                      value={formData.nutritional_guidelines.macronutrients[macro].max}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        nutritional_guidelines: {
                          ...prev.nutritional_guidelines,
                          macronutrients: {
                            ...prev.nutritional_guidelines.macronutrients,
                            [macro]: { ...prev.nutritional_guidelines.macronutrients[macro], max: e.target.value }
                          }
                        }
                      }))}
                      placeholder="e.g., 30"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="micronutrients-section">
              <h5>Micronutrients</h5>
              <div className="micro-grid">
                <div className="form-group">
                  <label htmlFor="fiber_min">Fiber Min (g)</label>
                  <input
                    id="fiber_min"
                    type="number"
                    value={formData.nutritional_guidelines.micronutrients.fiber.min}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutritional_guidelines: {
                        ...prev.nutritional_guidelines,
                        micronutrients: {
                          ...prev.nutritional_guidelines.micronutrients,
                          fiber: { ...prev.nutritional_guidelines.micronutrients.fiber, min: e.target.value }
                        }
                      }
                    }))}
                    placeholder="e.g., 25"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fiber_max">Fiber Max (g)</label>
                  <input
                    id="fiber_max"
                    type="number"
                    value={formData.nutritional_guidelines.micronutrients.fiber.max}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutritional_guidelines: {
                        ...prev.nutritional_guidelines,
                        micronutrients: {
                          ...prev.nutritional_guidelines.micronutrients,
                          fiber: { ...prev.nutritional_guidelines.micronutrients.fiber, max: e.target.value }
                        }
                      }
                    }))}
                    placeholder="e.g., 35"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="sodium_max">Sodium Max (mg)</label>
                  <input
                    id="sodium_max"
                    type="number"
                    value={formData.nutritional_guidelines.micronutrients.sodium.max}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutritional_guidelines: {
                        ...prev.nutritional_guidelines,
                        micronutrients: {
                          ...prev.nutritional_guidelines.micronutrients,
                          sodium: { ...prev.nutritional_guidelines.micronutrients.sodium, max: e.target.value }
                        }
                      }
                    }))}
                    placeholder="e.g., 1500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="meal-timing-section">
            <h4>Meal Timing</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="frequency">Meal Frequency</label>
                <input
                  id="frequency"
                  type="text"
                  value={formData.meal_timing.frequency}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    meal_timing: { ...prev.meal_timing, frequency: e.target.value }
                  }))}
                  placeholder="e.g., 3 main meals + 2 snacks"
                />
              </div>
              <div className="form-group">
                <label htmlFor="spacing">Meal Spacing</label>
                <input
                  id="spacing"
                  type="text"
                  value={formData.meal_timing.spacing}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    meal_timing: { ...prev.meal_timing, spacing: e.target.value }
                  }))}
                  placeholder="e.g., Every 3-4 hours"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="special_considerations">Special Considerations</label>
              <textarea
                id="special_considerations"
                value={formData.meal_timing.special_considerations}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  meal_timing: { ...prev.meal_timing, special_considerations: e.target.value }
                }))}
                placeholder="e.g., Take medication with meals, avoid eating 2 hours before bed"
              />
            </div>
          </div>

          <div className="cooking-methods-section">
            <h4>Cooking Methods</h4>
            <div className="cooking-methods-grid">
              <div className="recommended-methods">
                <h5>Recommended Methods</h5>
                <div className="method-checkboxes">
                  {cookingMethods.map(method => (
                    <label key={method} className="method-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.cooking_methods.recommended.includes(method)}
                        onChange={() => toggleCookingMethod(method, true)}
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>
              <div className="avoid-methods">
                <h5>Methods to Avoid</h5>
                <div className="method-checkboxes">
                  {cookingMethods.map(method => (
                    <label key={method} className="method-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.cooking_methods.avoid.includes(method)}
                        onChange={() => toggleCookingMethod(method, false)}
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="monitoring-section">
            <h4>Health Monitoring</h4>
            <div className="monitoring-checkboxes">
              {monitoringMetrics.map(metric => {
                const key = metric.toLowerCase().replace(' ', '_');
                return (
                  <label key={metric} className="monitoring-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.monitoring[key] || false}
                      onChange={() => toggleMonitoring(metric)}
                    />
                    {metric}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="emergency-section">
            <h4>Emergency Signs</h4>
            <div className="emergency-signs">
              {formData.emergency_signs.map((sign, index) => (
                <div key={index} className="emergency-sign-input">
                  <input
                    type="text"
                    placeholder="Emergency sign or symptom"
                    value={sign}
                    onChange={(e) => updateArrayItem('emergency_signs', index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('emergency_signs', index)}
                    className="btn btn-danger btn-small"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('emergency_signs')}
                className="btn btn-secondary"
              >
                + Add Emergency Sign
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="professional_advice">Professional Advice</label>
            <textarea
              id="professional_advice"
              value={formData.professional_advice}
              onChange={(e) => setFormData(prev => ({ ...prev, professional_advice: e.target.value }))}
              placeholder="Important medical advice, when to seek help..."
            />
          </div>

          <div className="resources-section">
            <h4>Resources & References</h4>
            {formData.resources.map((resource, index) => (
              <div key={index} className="resource-input">
                <input
                  type="text"
                  placeholder="Resource title"
                  value={resource.title}
                  onChange={(e) => updateResource(index, 'title', e.target.value)}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={resource.url}
                  onChange={(e) => updateResource(index, 'url', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={resource.description}
                  onChange={(e) => updateResource(index, 'description', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('resources', index)}
                  className="btn btn-danger btn-small"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addResource}
              className="btn btn-secondary"
            >
              + Add Resource
            </button>
          </div>

          <button type="submit" className="btn btn-primary">
            Share Health Information
          </button>
        </form>
      )}

      <div className="conditions-grid">
        {conditions.map(condition => (
          <div key={condition._id} className="condition-card">
            <div className="condition-header">
              <h3>{condition.condition_name}</h3>
              <div className="condition-badges">
                <span className="type-badge">{condition.condition_type}</span>
                <span className="severity-badge">{condition.severity_level}</span>
              </div>
            </div>
            
            <div className="condition-content">
              <p className="description">{condition.description}</p>
              
              {condition.dietary_restrictions && condition.dietary_restrictions.length > 0 && (
                <div className="dietary-info">
                  <h4>Dietary Restrictions</h4>
                  <p>{condition.dietary_restrictions.join(', ')}</p>
                </div>
              )}

              {condition.recommended_foods && condition.recommended_foods.length > 0 && (
                <div className="recommended-foods">
                  <h4>Recommended Foods</h4>
                  <p>{condition.recommended_foods.join(', ')}</p>
                </div>
              )}

              {condition.foods_to_avoid && condition.foods_to_avoid.length > 0 && (
                <div className="foods-to-avoid">
                  <h4>Foods to Avoid</h4>
                  <p>{condition.foods_to_avoid.join(', ')}</p>
                </div>
              )}

              {condition.nutritional_guidelines && (
                <div className="nutritional-guidelines">
                  <h4>Nutritional Guidelines</h4>
                  {condition.nutritional_guidelines.daily_calories && (
                    <div className="guideline-item">
                      <strong>Daily Calories:</strong> {condition.nutritional_guidelines.daily_calories.min}-{condition.nutritional_guidelines.daily_calories.max} kcal
                    </div>
                  )}
                  {condition.nutritional_guidelines.macronutrients && (
                    <div className="guideline-item">
                      <strong>Macros:</strong> Protein: {condition.nutritional_guidelines.macronutrients.protein.min}-{condition.nutritional_guidelines.macronutrients.protein.max}%, 
                      Carbs: {condition.nutritional_guidelines.macronutrients.carbs.min}-{condition.nutritional_guidelines.macronutrients.carbs.max}%, 
                      Fats: {condition.nutritional_guidelines.macronutrients.fats.min}-{condition.nutritional_guidelines.macronutrients.fats.max}%
                    </div>
                  )}
                </div>
              )}

              {condition.meal_timing && (
                <div className="meal-timing">
                  <h4>Meal Timing</h4>
                  <p><strong>Frequency:</strong> {condition.meal_timing.frequency}</p>
                  <p><strong>Spacing:</strong> {condition.meal_timing.spacing}</p>
                  {condition.meal_timing.special_considerations && (
                    <p><strong>Special:</strong> {condition.meal_timing.special_considerations}</p>
                  )}
                </div>
              )}

              {condition.cooking_methods && (
                <div className="cooking-methods">
                  <h4>Cooking Methods</h4>
                  {condition.cooking_methods.recommended && condition.cooking_methods.recommended.length > 0 && (
                    <p><strong>Recommended:</strong> {condition.cooking_methods.recommended.join(', ')}</p>
                  )}
                  {condition.cooking_methods.avoid && condition.cooking_methods.avoid.length > 0 && (
                    <p><strong>Avoid:</strong> {condition.cooking_methods.avoid.join(', ')}</p>
                  )}
                </div>
              )}

              {condition.monitoring && (
                <div className="monitoring">
                  <h4>Health Monitoring</h4>
                  <div className="monitoring-items">
                    {Object.entries(condition.monitoring).map(([key, value]) => {
                      if (typeof value === 'boolean' && value) {
                        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        return <span key={key} className="monitoring-item">✓ {label}</span>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {condition.emergency_signs && condition.emergency_signs.length > 0 && (
                <div className="emergency-signs-display">
                  <h4>⚠️ Emergency Signs</h4>
                  <ul>
                    {condition.emergency_signs.map((sign, index) => (
                      <li key={index}>{sign}</li>
                    ))}
                  </ul>
                </div>
              )}

              {condition.professional_advice && (
                <div className="professional-advice">
                  <h4>Professional Advice</h4>
                  <p>{condition.professional_advice}</p>
                </div>
              )}

              {condition.resources && condition.resources.length > 0 && (
                <div className="resources-display">
                  <h4>Resources</h4>
                  {condition.resources.map((resource, index) => (
                    <div key={index} className="resource-item">
                      <strong>{resource.title}</strong>
                      {resource.url && <a href={resource.url} target="_blank" rel="noopener noreferrer">🔗 Link</a>}
                      {resource.description && <p>{resource.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="condition-footer">
              <div className="user-info">
                <span>By {condition.created_by?.username || 'Anonymous'}</span>
                <span className="date">
                  {new Date(condition.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {condition.is_verified && (
                <div className="verification-badge">
                  ✅ Verified by {condition.verified_by?.username || 'Admin'}
                </div>
              )}

              <div className="condition-actions">
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

      {conditions.length === 0 && !loading && (
        <div className="no-conditions">
          <p>No health conditions found matching your criteria.</p>
          <p>Be the first to share nutrition guidance for a health condition!</p>
        </div>
      )}
    </div>
  );
};

export default HealthConditions;
