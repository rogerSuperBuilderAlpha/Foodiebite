import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, BookOpen, CheckCircle, UserPlus, UserCheck } from 'lucide-react'

export const UserCard = ({ user, showFollowButton = true }) => {
  const [isFollowing, setIsFollowing] = useState(false)
  
  const handleFollow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFollowing(!isFollowing)
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <div className="card p-6 text-center card-hover animate-fade-in-up">
      <Link to={`/profile/${user.id}`} className="block">
        <div className="relative inline-block mb-4">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white dark:border-gray-800 shadow-lg"
          />
          {user.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
          {user.displayName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {user.bio}
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <div className="font-bold text-gray-900 dark:text-white">
              {formatNumber(user.followers)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Followers
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="font-bold text-gray-900 dark:text-white">
              {user.recipesCount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Recipes
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <div className="font-bold text-gray-900 dark:text-white">
              {formatNumber(user.following)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Following
            </div>
          </div>
        </div>

        {/* Creator Badge */}
        {user.isCreator && (
          <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-4">
            <CheckCircle className="w-3 h-3" />
            <span>Creator</span>
          </div>
        )}
      </Link>

      {/* Follow Button */}
      {showFollowButton && (
        <button
          onClick={handleFollow}
          className={`w-full font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
            isFollowing
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              : 'btn-primary'
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Follow</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
