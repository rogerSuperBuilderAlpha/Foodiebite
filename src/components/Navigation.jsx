import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Camera, User, Heart } from 'lucide-react'
import { useUser } from '../context/UserContext'
import clsx from 'clsx'

export const Navigation = () => {
  const location = useLocation()
  const { favorites } = useUser()

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
      exact: true
    },
    {
      path: '/discover',
      icon: Search,
      label: 'Discover',
      exact: false
    },
    {
      path: '/feed',
      icon: Camera,
      label: 'Feed',
      exact: false
    },
    {
      path: '/profile?tab=favorites',
      icon: Heart,
      label: 'Favorites',
      exact: false,
      badge: favorites.length > 0 ? favorites.length : null
    },
    {
      path: '/profile',
      icon: User,
      label: 'Profile',
      exact: false
    }
  ]

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden z-40">
        <div className="grid grid-cols-5 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex flex-col items-center justify-center py-2 px-1 transition-colors relative',
                  active
                    ? 'text-primary dark:text-primaryLight'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full"></div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation - Can be implemented later if needed */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-16 lg:w-64 lg:h-full lg:bg-white lg:dark:bg-gray-900 lg:border-r lg:border-gray-200 lg:dark:border-gray-700 lg:p-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative',
                  active
                    ? 'bg-primary/10 text-primary dark:text-primaryLight border-r-2 border-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Premium Upgrade Card */}
        <div className="mt-8 p-4 bg-gradient-to-br from-primary to-primaryLight rounded-lg text-white">
          <h3 className="font-semibold mb-2">Upgrade to Premium</h3>
          <p className="text-sm mb-3 opacity-90">
            Unlock exclusive recipes, ad-free experience, and more!
          </p>
          <button className="w-full bg-white text-primary font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
            Try 14 Days Free
          </button>
        </div>
      </aside>
    </>
  )
}
