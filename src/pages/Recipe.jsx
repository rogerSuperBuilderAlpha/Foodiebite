import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Clock, Users, ChefHat, Heart, Bookmark, Share2, Crown, Play } from 'lucide-react'
import { mockRecipes, mockUsers } from '../data/mockData'
import { useUser } from '../context/UserContext'
import clsx from 'clsx'

export const Recipe = () => {
  const { recipeId } = useParams()
  const recipe = mockRecipes.find(r => r.id === recipeId)
  const {
    currentUser,
    isPremium,
    toggleFavorite,
    toggleLikeRecipe,
    isFavorite,
    isLikedRecipe,
    upgradeToPremium
  } = useUser()

  const [activeTab, setActiveTab] = useState('ingredients')
  const [servingSize, setServingSize] = useState(recipe?.servings || 2)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recipe not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const isRecipeFavorite = isFavorite(recipe.id)
  const isRecipeLiked = isLikedRecipe(recipe.id)
  const isPremiumContent = recipe.isPremium && !isPremium

  const scaledIngredients = recipe.ingredients.map(ingredient => {
    // Simple scaling logic - in a real app, this would be more sophisticated
    const scale = servingSize / recipe.servings
    return ingredient.replace(/(\d+(?:\.\d+)?)/g, (match) => {
      const num = parseFloat(match)
      return (num * scale).toFixed(num % 1 === 0 ? 0 : 1)
    })
  })

  const handlePremiumAction = () => {
    if (isPremiumContent) {
      setShowPremiumModal(true)
    }
  }

  const handleUpgrade = async () => {
    await upgradeToPremium()
    setShowPremiumModal(false)
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Link
          to="/discover"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to recipes
        </Link>

        {/* Recipe Header */}
        <div className="card overflow-hidden mb-8">
          <div className="relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            
            {/* Premium Overlay */}
            {isPremiumContent && (
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                onClick={handlePremiumAction}
              >
                <div className="text-center text-white">
                  <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                  <h3 className="text-xl font-bold mb-2">Premium Recipe</h3>
                  <p className="mb-4">Unlock this exclusive content</p>
                  <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold">
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => toggleFavorite(recipe.id)}
                className={clsx(
                  'p-3 rounded-full backdrop-blur-sm transition-colors',
                  isRecipeFavorite
                    ? 'bg-white/90 text-red-500'
                    : 'bg-black/20 text-white hover:bg-white/90 hover:text-red-500'
                )}
              >
                <Bookmark className="w-5 h-5" fill={isRecipeFavorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => toggleLikeRecipe(recipe.id)}
                className={clsx(
                  'p-3 rounded-full backdrop-blur-sm transition-colors',
                  isRecipeLiked
                    ? 'bg-white/90 text-red-500'
                    : 'bg-black/20 text-white hover:bg-white/90 hover:text-red-500'
                )}
              >
                <Heart className="w-5 h-5" fill={isRecipeLiked ? 'currentColor' : 'none'} />
              </button>
              <button className="p-3 rounded-full backdrop-blur-sm bg-black/20 text-white hover:bg-white/90 hover:text-gray-900 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Title and Description */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {recipe.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {recipe.description}
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center justify-between mb-6">
              <Link
                to={`/profile/${recipe.author.id}`}
                className="flex items-center space-x-3 group"
              >
                <img
                  src={recipe.author.avatar}
                  alt={recipe.author.displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary">
                      {recipe.author.displayName}
                    </span>
                    {recipe.author.verified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {recipe.author.recipesCount} recipes
                  </span>
                </div>
              </Link>

              {/* Recipe Stats */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-semibold">{recipe.rating}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    ({recipe.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Heart className="w-4 h-4 mr-1" />
                  {recipe.likes}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Bookmark className="w-4 h-4 mr-1" />
                  {recipe.saves}
                </div>
              </div>
            </div>

            {/* Recipe Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Clock className="w-6 h-6 mx-auto text-primary mb-2" />
                <div className="text-sm text-gray-500 dark:text-gray-400">Prep Time</div>
                <div className="font-semibold text-gray-900 dark:text-white">{recipe.prepTime}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <ChefHat className="w-6 h-6 mx-auto text-primary mb-2" />
                <div className="text-sm text-gray-500 dark:text-gray-400">Cook Time</div>
                <div className="font-semibold text-gray-900 dark:text-white">{recipe.cookTime}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Users className="w-6 h-6 mx-auto text-primary mb-2" />
                <div className="text-sm text-gray-500 dark:text-gray-400">Servings</div>
                <div className="font-semibold text-gray-900 dark:text-white">{recipe.servings}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-2xl mb-2 block">🔥</span>
                <div className="text-sm text-gray-500 dark:text-gray-400">Calories</div>
                <div className="font-semibold text-gray-900 dark:text-white">{recipe.calories}</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={clsx(
                    'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'ingredients'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  Ingredients
                </button>
                <button
                  onClick={() => setActiveTab('instructions')}
                  className={clsx(
                    'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'instructions'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  Instructions
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={clsx(
                    'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'reviews'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  Reviews ({recipe.reviewCount})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'ingredients' && (
                <div>
                  {/* Serving Size Adjuster */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Ingredients
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Servings:</span>
                      <button
                        onClick={() => setServingSize(Math.max(1, servingSize - 1))}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{servingSize}</span>
                      <button
                        onClick={() => setServingSize(servingSize + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {(isPremiumContent ? recipe.ingredients.slice(0, 3) : scaledIngredients).map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="text-gray-900 dark:text-white">{ingredient}</span>
                      </div>
                    ))}
                    {isPremiumContent && (
                      <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primaryLight/10 rounded-lg">
                        <Crown className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Unlock all ingredients with Premium
                        </p>
                        <button
                          onClick={handlePremiumAction}
                          className="mt-2 btn-primary"
                        >
                          Upgrade Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'instructions' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Instructions
                  </h3>
                  <div className="space-y-4">
                    {(isPremiumContent ? recipe.instructions.slice(0, 2) : recipe.instructions).map((instruction, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white">{instruction}</p>
                        </div>
                      </div>
                    ))}
                    {isPremiumContent && (
                      <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primaryLight/10 rounded-lg">
                        <Crown className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Complete instructions available with Premium
                        </p>
                        <button
                          onClick={handlePremiumAction}
                          className="mt-2 btn-primary"
                        >
                          Upgrade Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Reviews & Ratings
                  </h3>
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">⭐</div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Reviews coming soon! Be the first to rate this recipe.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Recipes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            More from {recipe.author.displayName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockRecipes
              .filter(r => r.author.id === recipe.author.id && r.id !== recipe.id)
              .slice(0, 3)
              .map((relatedRecipe) => (
                <Link
                  key={relatedRecipe.id}
                  to={`/recipe/${relatedRecipe.id}`}
                  className="card overflow-hidden card-hover"
                >
                  <img
                    src={relatedRecipe.image}
                    alt={relatedRecipe.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {relatedRecipe.title}
                    </h3>
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      {relatedRecipe.rating}
                      <Clock className="w-3 h-3 ml-3 mr-1" />
                      {relatedRecipe.cookTime}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full p-6 text-center">
            <Crown className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Upgrade to Premium
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get unlimited access to exclusive recipes, ad-free browsing, and priority support.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all"
              >
                Start 14-Day Free Trial
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full btn-secondary"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
