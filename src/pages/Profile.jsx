import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Settings, Grid, Heart, BookOpen, Users, MapPin, Link as LinkIcon, Calendar } from 'lucide-react'
import { mockUsers, mockRecipes } from '../data/mockData'
import { useUser } from '../context/UserContext'
import { RecipeCard } from '../components/RecipeCard'

export const Profile = () => {
  const { userId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentUser, favorites, likedRecipes } = useUser()
  const [activeTab, setActiveTab] = useState('recipes')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['recipes', 'favorites', 'liked'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])
  
  // If no userId provided, show current user profile
  const user = userId ? mockUsers.find(u => u.id === userId) : currentUser
  const isOwnProfile = !userId || userId === currentUser?.id

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User not found</h1>
        </div>
      </div>
    )
  }

  // Get user's recipes or favorites based on tab
  const getUserRecipes = () => {
    if (isOwnProfile && activeTab === 'favorites') {
      return mockRecipes.filter(recipe => favorites.includes(recipe.id))
    } else if (isOwnProfile && activeTab === 'liked') {
      return mockRecipes.filter(recipe => likedRecipes.includes(recipe.id))
    } else {
      // Show user's created recipes
      return mockRecipes.filter(recipe => recipe.author.id === user.id)
    }
  }

  const userRecipes = getUserRecipes()

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const tabs = isOwnProfile
    ? [
        { id: 'recipes', label: 'My Recipes', icon: Grid, count: mockRecipes.filter(r => r.author.id === user.id).length },
        { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
        { id: 'liked', label: 'Liked', icon: Heart, count: likedRecipes.length }
      ]
    : [
        { id: 'recipes', label: 'Recipes', icon: Grid, count: mockRecipes.filter(r => r.author.id === user.id).length }
      ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-72 py-6">
      {/* Profile Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            {user.verified && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                <span className="text-white text-lg">✓</span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {user.displayName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  @{user.username}
                </p>
              </div>
              
              {isOwnProfile && (
                <button className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Bio */}
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
              {user.bio}
            </p>

            {/* Stats */}
            <div className="flex items-center space-x-8 mb-6">
              <div className="text-center">
                <div className="font-bold text-xl text-gray-900 dark:text-white">
                  {formatNumber(user.followers)}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl text-gray-900 dark:text-white">
                  {formatNumber(user.following)}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Following</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl text-gray-900 dark:text-white">
                  {user.recipesCount}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Recipes</div>
              </div>
            </div>

            {/* Creator Badge */}
            {user.isCreator && (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium mb-4">
                <BookOpen className="w-4 h-4" />
                <span>Verified Creator</span>
              </div>
            )}

            {/* Profile Details */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Kitchen Worldwide</span>
              </div>
              <div className="flex items-center">
                <LinkIcon className="w-4 h-4 mr-1" />
                <a href="#" className="text-primary hover:underline">
                  foodiebite.com/{user.username}
                </a>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Joined January 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (isOwnProfile) {
                    const newParams = new URLSearchParams()
                    if (tab.id !== 'recipes') {
                      newParams.set('tab', tab.id)
                    }
                    setSearchParams(newParams)
                  }
                }}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div>
        {userRecipes.length === 0 ? (
          <div className="text-center py-12">
            {activeTab === 'recipes' && (
              <>
                <div className="text-6xl mb-4">👨‍🍳</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {isOwnProfile ? "You haven't created any recipes yet" : "No recipes yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isOwnProfile ? "Start cooking and share your creations!" : "Check back later for amazing recipes."}
                </p>
              </>
            )}
            {activeTab === 'favorites' && (
              <>
                <div className="text-6xl mb-4">💝</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start exploring and save your favorite recipes!
                </p>
              </>
            )}
            {activeTab === 'liked' && (
              <>
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No liked recipes yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Show some love to recipes you enjoy!
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
