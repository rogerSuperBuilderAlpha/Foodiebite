import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function PhotoToMeal({ user }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [photoMeals, setPhotoMeals] = useState([]);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const fileInputRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const processPhoto = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const response = await axios.post('/api/photo-meals', formData, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const newPhotoMeal = response.data;
      setPhotoMeals([newPhotoMeal, ...photoMeals]);
      setCurrentMeal(newPhotoMeal);

      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const updatedResponse = await axios.get(`/api/photo-meals/${newPhotoMeal._id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          
          if (updatedResponse.data.status === 'completed') {
            setCurrentMeal(updatedResponse.data);
            setPhotoMeals(prev => prev.map(pm => 
              pm._id === newPhotoMeal._id ? updatedResponse.data : pm
            ));
            clearInterval(pollInterval);
            setIsProcessing(false);
          }
        } catch (error) {
          console.error('Error polling photo meal:', error);
        }
      }, 2000);

    } catch (error) {
      console.error('Error processing photo:', error);
      setIsProcessing(false);
    }
  };

  const createRecipeFromMeal = async (photoMeal) => {
    if (!photoMeal.created_meal) return;

    try {
      const recipeData = {
        recipe_name: photoMeal.created_meal.name || 'Photo-Created Recipe',
        ingredients: photoMeal.created_meal.ingredients,
        instructions: photoMeal.created_meal.instructions,
        prep_time: photoMeal.created_meal.prep_time || 30,
        difficulty: photoMeal.created_meal.difficulty || 'Medium',
        cuisine: photoMeal.ai_analysis?.cuisine_style || 'International',
        health_tags: photoMeal.ai_analysis?.health_benefits || [],
        dietary_tags: photoMeal.ai_analysis?.dietary_tags || [],
        image_url: photoMeal.original_photo,
        country: 'User Created',
        region: 'Photo Generated',
        continent: 'Global'
      };

      const response = await axios.post('/api/recipes', recipeData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Recipe created successfully!');
      return response.data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe. Please try again.');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setCurrentMeal(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="photo-to-meal">
      <h3>📸 Photo-to-Meal Creator</h3>
      <p>Take a photo of your ingredients and let AI create a recipe for you!</p>

      {!selectedFile && !currentMeal && (
        <div className="photo-input-options">
          <div className="input-option">
            <h4>📁 Upload Photo</h4>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
            />
            <button 
              className="btn btn--secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </button>
          </div>

          <div className="input-option">
            <h4>📷 Take Photo</h4>
            <button 
              className="btn btn--primary"
              onClick={startCamera}
            >
              Open Camera
            </button>
          </div>
        </div>
      )}

      {showCamera && (
        <div className="camera-view">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="camera-video"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className="camera-controls">
            <button 
              className="btn btn--primary"
              onClick={capturePhoto}
            >
              📸 Capture
            </button>
            <button 
              className="btn btn--ghost"
              onClick={stopCamera}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="photo-preview">
          <h4>Photo Preview</h4>
          <img src={previewUrl} alt="Preview" className="preview-image" />
          <div className="preview-actions">
            <button 
              className="btn btn--primary"
              onClick={processPhoto}
              disabled={isProcessing}
            >
              {isProcessing ? '🔄 Processing...' : '🔍 Analyze Photo'}
            </button>
            <button 
              className="btn btn--ghost"
              onClick={resetForm}
            >
              Try Different Photo
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="processing-status">
          <div className="loading-spinner"></div>
          <p>AI is analyzing your photo and identifying ingredients...</p>
          <p>This may take a few moments.</p>
        </div>
      )}

      {currentMeal && currentMeal.status === 'completed' && (
        <div className="meal-results">
          <h4>🍽️ AI-Generated Recipe</h4>
          
          <div className="identified-ingredients">
            <h5>Identified Ingredients:</h5>
            <div className="ingredients-grid">
              {currentMeal.identified_ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                  <span className="ingredient-name">{ingredient.name}</span>
                  <span className="ingredient-quantity">{ingredient.quantity}</span>
                  <span className="confidence">{(ingredient.confidence * 100).toFixed(0)}%</span>
                  <p className="ingredient-notes">{ingredient.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {currentMeal.ai_analysis && (
            <div className="ai-analysis">
              <h5>AI Analysis:</h5>
              <div className="analysis-grid">
                <div className="analysis-item">
                  <strong>Food Types:</strong>
                  <span>{currentMeal.ai_analysis.food_types.join(', ')}</span>
                </div>
                <div className="analysis-item">
                  <strong>Cooking Methods:</strong>
                  <span>{currentMeal.ai_analysis.cooking_methods.join(', ')}</span>
                </div>
                <div className="analysis-item">
                  <strong>Cuisine Style:</strong>
                  <span>{currentMeal.ai_analysis.cuisine_style}</span>
                </div>
                <div className="analysis-item">
                  <strong>Health Benefits:</strong>
                  <span>{currentMeal.ai_analysis.health_benefits.join(', ')}</span>
                </div>
              </div>
            </div>
          )}

          {currentMeal.created_meal && (
            <div className="generated-recipe">
              <h5>Suggested Recipe:</h5>
              <div className="recipe-details">
                <h6>{currentMeal.created_meal.name}</h6>
                <div className="recipe-meta">
                  <span>⏱️ {currentMeal.created_meal.prep_time} min</span>
                  <span>📊 {currentMeal.created_meal.difficulty}</span>
                </div>
                
                <div className="recipe-ingredients">
                  <h6>Ingredients:</h6>
                  <ul>
                    {currentMeal.created_meal.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="recipe-instructions">
                  <h6>Instructions:</h6>
                  <ol>
                    {currentMeal.created_meal.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>

                {currentMeal.created_meal.estimated_nutrition && (
                  <div className="nutrition-estimate">
                    <h6>Estimated Nutrition:</h6>
                    <div className="nutrition-grid">
                      <span>Calories: {currentMeal.created_meal.estimated_nutrition.calories}</span>
                      <span>Protein: {currentMeal.created_meal.estimated_nutrition.protein}g</span>
                      <span>Carbs: {currentMeal.created_meal.estimated_nutrition.carbs}g</span>
                      <span>Fat: {currentMeal.created_meal.estimated_nutrition.fat}g</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="meal-actions">
            <button 
              className="btn btn--primary"
              onClick={() => createRecipeFromMeal(currentMeal)}
            >
              💾 Save as Recipe
            </button>
            <button 
              className="btn btn--secondary"
              onClick={resetForm}
            >
              🆕 Create Another
            </button>
          </div>
        </div>
      )}

      {photoMeals.length > 0 && (
        <div className="photo-meal-history">
          <h4>📚 Your Photo Meals</h4>
          <div className="history-grid">
            {photoMeals.map(meal => (
              <div key={meal._id} className="history-item">
                <img src={meal.original_photo} alt="Photo meal" />
                <div className="history-details">
                  <h6>{meal.created_meal?.name || 'Processing...'}</h6>
                  <p>Status: {meal.status}</p>
                  <small>{new Date(meal.created_at).toLocaleDateString()}</small>
                </div>
                <button 
                  className="btn btn--small"
                  onClick={() => setCurrentMeal(meal)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
