import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X, Search } from 'lucide-react'
import { mockRecipes, moodCategories, dietaryOptions } from '../data/mockData'
import { RecipeCard } from '../components/RecipeCard'
import clsx from 'clsx'

export const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [recipes, setRecipes] = useState(mockRecipes)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    mood: searchParams.get('mood') || '',
    diet: searchParams.get('diet') || '',
    difficulty: '',
    cookTime: '',
    rating: ''
  })
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    filterRecipes()
  }, [filters, sortBy])

  useEffect(() => {
    // Update filters from URL params
    setFilters(prev => ({
      ...prev,
      search: searchParams.get('search') || '',
      mood: searchParams.get('mood') || '',
      diet: searchParams.get('diet') || ''
    }))
  }, [searchParams])

  const filterRecipes = () => {
    let filtered = [...mockRecipes]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
      )
    }

    // Mood filter
    if (filters.mood) {
      filtered = filtered.filter(recipe => recipe.mood === filters.mood)
    }

    // Diet filter
    if (filters.diet) {
      filtered = filtered.filter(recipe => recipe.diet.includes(filters.diet))
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty === filters.difficulty)
    }

    // Cook time filter
    if (filters.cookTime) {
      const [min, max] = filters.cookTime.split('-').map(t => parseInt(t))
      filtered = filtered.filter(recipe => {
        const time = parseInt(recipe.cookTime.replace(/[^\d]/g, ''))
        return time >= min && (max ? time <= max : true)
      })
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating)
      filtered = filtered.filter(recipe => recipe.rating >= minRating)
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'popular':
          return b.likes - a.likes
        case 'quickest':
          return parseInt(a.cookTime.replace(/[^\d]/g, '')) - parseInt(b.cookTime.replace(/[^\d]/g, ''))
        default:
          return 0
      }
    })

    setRecipes(filtered)
  }

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update URL params
    const newParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v)
    })
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      mood: '',
      diet: '',
      difficulty: '',
      cookTime: '',
      rating: ''
    })
    setSearchParams({})
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-72 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Discover Recipes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find the perfect recipe for your mood and taste preferences
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes, ingredients, or creators..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors',
              showFilters
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2 text-sm"
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="quickest">Quickest</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="card p-6 space-y-6">
            {/* Mood Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Mood</h3>
              <div className="flex flex-wrap gap-2">
                {moodCategories.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => updateFilter('mood', filters.mood === mood.id ? '' : mood.id)}
                    className={clsx(
                      'px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-1',
                      filters.mood === mood.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                  >
                    <span>{mood.emoji}</span>
                    <span>{mood.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Diet Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((diet) => (
                  <button
                    key={diet.id}
                    onClick={() => updateFilter('diet', filters.diet === diet.id ? '' : diet.id)}
                    className={clsx(
                      'px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-1',
                      filters.diet === diet.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                  >
                    <span>{diet.emoji}</span>
                    <span>{diet.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => updateFilter('difficulty', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cook Time
                </label>
                <select
                  value={filters.cookTime}
                  onChange={(e) => updateFilter('cookTime', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any</option>
                  <option value="0-15">Under 15 min</option>
                  <option value="15-30">15-30 min</option>
                  <option value="30-60">30-60 min</option>
                  <option value="60">Over 1 hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => updateFilter('rating', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                  <span>Clear all filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No recipes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
