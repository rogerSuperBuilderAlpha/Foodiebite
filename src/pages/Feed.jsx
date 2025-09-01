import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, Send, MoreHorizontal } from 'lucide-react'
import { mockPhotoFeed, mockComments } from '../data/mockData'
import { useUser } from '../context/UserContext'
import clsx from 'clsx'

export const Feed = () => {
  const { currentUser, toggleLikePhoto, isLikedPhoto, addComment, userComments } = useUser()
  const [commentInputs, setCommentInputs] = useState({})
  const [showComments, setShowComments] = useState({})

  const handleLike = (photoId) => {
    toggleLikePhoto(photoId)
  }

  const handleComment = (photoId) => {
    const comment = commentInputs[photoId]?.trim()
    if (comment) {
      addComment(photoId, comment)
      setCommentInputs(prev => ({ ...prev, [photoId]: '' }))
    }
  }

  const getComments = (photoId) => {
    return [...(mockComments[photoId] || []), ...(userComments[photoId] || [])]
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Photo Feed
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover delicious creations from our community
        </p>
      </div>

      {/* Feed */}
      <div className="space-y-8">
        {mockPhotoFeed.map((post) => {
          const isLiked = isLikedPhoto(post.id)
          const comments = getComments(post.id)
          const showPostComments = showComments[post.id]
          
          return (
            <div key={post.id} className="card overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <Link
                  to={`/profile/${post.user.id}`}
                  className="flex items-center space-x-3"
                >
                  <img
                    src={post.user.avatar}
                    alt={post.user.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {post.user.displayName}
                      </span>
                      {post.user.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(post.timestamp)}
                    </span>
                  </div>
                </Link>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Post Image */}
              <div className="relative">
                <img
                  src={post.image}
                  alt="Food post"
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={clsx(
                        'p-2 -m-2 transition-colors',
                        isLiked
                          ? 'text-red-500'
                          : 'text-gray-700 dark:text-gray-300 hover:text-red-500'
                      )}
                    >
                      <Heart
                        className="w-6 h-6"
                        fill={isLiked ? 'currentColor' : 'none'}
                      />
                    </button>
                    <button
                      onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !showPostComments }))}
                      className="p-2 -m-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    >
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="p-2 -m-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
                  <button className="p-2 -m-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>

                {/* Like Count */}
                <div className="mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {post.likes + (isLiked && !post.isLiked ? 1 : isLiked || post.isLiked ? 0 : 0)} likes
                  </span>
                </div>

                {/* Caption */}
                <div className="mb-2">
                  <Link
                    to={`/profile/${post.user.id}`}
                    className="font-semibold text-gray-900 dark:text-white hover:underline"
                  >
                    {post.user.username}
                  </Link>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {post.caption}
                  </span>
                </div>

                {/* Recipe Link */}
                {post.recipe && (
                  <Link
                    to={`/recipe/${post.recipe.id}`}
                    className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors mb-3"
                  >
                    View Recipe: {post.recipe.title}
                  </Link>
                )}

                {/* Comments Toggle */}
                {comments.length > 0 && (
                  <button
                    onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !showPostComments }))}
                    className="text-gray-500 dark:text-gray-400 text-sm mb-2 hover:underline"
                  >
                    {showPostComments
                      ? 'Hide comments'
                      : `View all ${comments.length} comment${comments.length !== 1 ? 's' : ''}`
                    }
                  </button>
                )}

                {/* Comments */}
                {showPostComments && comments.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.displayName}
                          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/profile/${comment.user.id}`}
                            className="font-semibold text-gray-900 dark:text-white hover:underline text-sm"
                          >
                            {comment.user.username || comment.user.displayName}
                          </Link>
                          <span className="ml-2 text-gray-900 dark:text-white text-sm">
                            {comment.text}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatTimeAgo(comment.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                      className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {commentInputs[post.id]?.trim() && (
                      <button
                        onClick={() => handleComment(post.id)}
                        className="text-primary hover:text-primaryDark font-semibold text-sm"
                      >
                        Post
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="btn-secondary">
          Load More Posts
        </button>
      </div>
    </div>
  )
}
