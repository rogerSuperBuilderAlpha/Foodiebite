import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, Users, Heart, Crown, Bookmark } from 'lucide-react'
import { useUser } from '../context/UserContext'
import clsx from 'clsx'

export const RecipeCard = ({ recipe, compact = false }) => {
  const { toggleFavorite, toggleLikeRecipe, isFavorite, isLikedRecipe, isPremium } = useUser()
  
  const isRecipeFavorite = isFavorite(recipe.id)
  const isRecipeLiked = isLikedRecipe(recipe.id)

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(recipe.id)
  }

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLikeRecipe(recipe.id)
  }

  if (compact) {
    return (
      <div className="card overflow-hidden card-hover">
        <Link to={`/recipe/${recipe.id}`} className="block">
          <div className="relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-32 object-cover"
            />
            {recipe.isPremium && !isPremium && (
              <div className="absolute top-2 left-2">
                <Crown className="w-4 h-4 text-yellow-400" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={handleFavorite}
                className={clsx(
                  'p-1.5 rounded-full backdrop-blur-sm transition-colors',
                  isRecipeFavorite
                    ? 'bg-white/90 text-red-500'
                    : 'bg-black/20 text-white hover:bg-white/90 hover:text-red-500'
                )}
              >
                <Bookmark className="w-3 h-3" fill={isRecipeFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
              {recipe.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              by {recipe.author.displayName}
            </p>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-400 mr-1" />
                {recipe.rating}
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {recipe.cookTime}
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden card-hover animate-fade-in-up">
      <Link to={`/recipe/${recipe.id}`} className="block">
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
          
          {/* Premium Badge */}
          {recipe.isPremium && !isPremium && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium">
              <Crown className="w-3 h-3" />
              <span>Premium</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <button
              onClick={handleFavorite}
              className={clsx(
                'p-2 rounded-full backdrop-blur-sm transition-colors',
                isRecipeFavorite
                  ? 'bg-white/90 text-red-500'
                  : 'bg-black/20 text-white hover:bg-white/90 hover:text-red-500'
              )}
            >
              <Bookmark className="w-4 h-4" fill={isRecipeFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleLike}
              className={clsx(
                'p-2 rounded-full backdrop-blur-sm transition-colors',
                isRecipeLiked
                  ? 'bg-white/90 text-red-500'
                  : 'bg-black/20 text-white hover:bg-white/90 hover:text-red-500'
              )}
            >
              <Heart className="w-4 h-4" fill={isRecipeLiked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 recipe-card-overlay"></div>
          
          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <img
                src={recipe.author.avatar}
                alt={recipe.author.displayName}
                className="w-6 h-6 rounded-full object-cover border-2 border-white"
              />
              <span className="text-sm font-medium">{recipe.author.displayName}</span>
              {recipe.author.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2">
            {recipe.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {recipe.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                +{recipe.tags.length - 3} more
              </span>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{recipe.rating}</span>
                <span className="ml-1">({recipe.reviewCount})</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {recipe.cookTime}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                {recipe.likes}
              </div>
              <div className="flex items-center">
                <Bookmark className="w-4 h-4 mr-1" />
                {recipe.saves}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
