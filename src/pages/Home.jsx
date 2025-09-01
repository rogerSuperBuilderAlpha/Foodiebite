import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Star, Clock, Users, TrendingUp } from 'lucide-react'
import { mockRecipes, moodCategories, mockUsers } from '../data/mockData'
import { RecipeCard } from '../components/RecipeCard'
import { UserCard } from '../components/UserCard'

export const Home = () => {
  // Get featured recipes (highest rated and most recent)
  const featuredRecipes = mockRecipes
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)

  const trendingRecipes = mockRecipes
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4)

  const featuredCreators = mockUsers.filter(user => user.isCreator)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-72 py-6">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative bg-gradient-to-br from-primary to-primaryLight rounded-2xl p-8 text-white overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Your mood, your meal
            </h1>
            <p className="text-xl mb-6 opacity-90 max-w-2xl">
              Discover, share, and savor with FoodieBite. Find curated recipes that match your mood and dietary preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/discover"
                className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Start Cooking
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                to="/feed"
                className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center"
              >
                Explore Feed
              </Link>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        </div>
      </section>

      {/* Mood Categories */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cook by Mood
          </h2>
          <Link
            to="/discover"
            className="text-primary hover:text-primaryDark font-medium inline-flex items-center"
          >
            See all
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {moodCategories.map((mood) => (
            <Link
              key={mood.id}
              to={`/discover?mood=${mood.id}`}
              className="group card p-6 text-center hover:shadow-lg transition-all duration-200 card-hover"
            >
              <div className="text-4xl mb-3">{mood.emoji}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {mood.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mood.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Recipes
          </h2>
          <Link
            to="/discover"
            className="text-primary hover:text-primaryDark font-medium inline-flex items-center"
          >
            View all
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Trending This Week */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="mr-2 w-6 h-6 text-primary" />
              Trending This Week
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Most loved recipes by the community
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingRecipes.map((recipe, index) => (
            <div key={recipe.id} className="card p-4 flex space-x-4">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-primary">#{index + 1}</span>
              </div>
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/recipe/${recipe.id}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-primary line-clamp-2"
                >
                  {recipe.title}
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  by {recipe.author.displayName}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {recipe.rating}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {recipe.cookTime}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {recipe.likes}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Creators */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Creators
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCreators.map((creator) => (
            <UserCard key={creator.id} user={creator} />
          ))}
        </div>
      </section>
    </div>
  )
}
