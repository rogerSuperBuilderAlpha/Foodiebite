import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Navigation } from './components/Navigation'
import { Home } from './pages/Home'
import { Discover } from './pages/Discover'
import { Feed } from './pages/Feed'
import { Profile } from './pages/Profile'
import { Recipe } from './pages/Recipe'
import { UserProvider } from './context/UserContext'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <UserProvider>
      <Router>
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          <main className="pb-20 md:pb-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/recipe/:recipeId" element={<Recipe />} />
            </Routes>
          </main>

          <Navigation />
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
