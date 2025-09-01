import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockUsers } from '../data/mockData'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  // Simulate current user (in real app, this would come from auth)
  const [currentUser, setCurrentUser] = useState(mockUsers[3]) // foodie_explorer as default user
  const [isPremium, setIsPremium] = useState(false)
  
  // User interactions stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })
  
  const [likedRecipes, setLikedRecipes] = useState(() => {
    const saved = localStorage.getItem('likedRecipes')
    return saved ? JSON.parse(saved) : []
  })
  
  const [likedPhotos, setLikedPhotos] = useState(() => {
    const saved = localStorage.getItem('likedPhotos')
    return saved ? JSON.parse(saved) : []
  })
  
  const [userComments, setUserComments] = useState(() => {
    const saved = localStorage.getItem('userComments')
    return saved ? JSON.parse(saved) : {}
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])
  
  useEffect(() => {
    localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes))
  }, [likedRecipes])
  
  useEffect(() => {
    localStorage.setItem('likedPhotos', JSON.stringify(likedPhotos))
  }, [likedPhotos])
  
  useEffect(() => {
    localStorage.setItem('userComments', JSON.stringify(userComments))
  }, [userComments])

  // Actions
  const toggleFavorite = (recipeId) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }
  
  const toggleLikeRecipe = (recipeId) => {
    setLikedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }
  
  const toggleLikePhoto = (photoId) => {
    setLikedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }
  
  const addComment = (itemId, comment) => {
    const newComment = {
      id: Date.now().toString(),
      user: currentUser,
      text: comment,
      timestamp: new Date().toISOString()
    }
    
    setUserComments(prev => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), newComment]
    }))
  }
  
  const upgradeToPremium = async () => {
    setIsPremium(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  const isFavorite = (recipeId) => favorites.includes(recipeId)
  const isLikedRecipe = (recipeId) => likedRecipes.includes(recipeId)
  const isLikedPhoto = (photoId) => likedPhotos.includes(photoId)

  const value = {
    currentUser,
    isPremium,
    favorites,
    likedRecipes,
    likedPhotos,
    userComments,
    toggleFavorite,
    toggleLikeRecipe,
    toggleLikePhoto,
    addComment,
    upgradeToPremium,
    isFavorite,
    isLikedRecipe,
    isLikedPhoto
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
