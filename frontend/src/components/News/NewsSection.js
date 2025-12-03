import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Tag, Award, Trophy, GraduationCap, Megaphone, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchNews } from '../../services/api';
import { format } from 'date-fns';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchNews();
        
        // Debug log to see what we're getting
        console.log('API Response:', response);
        
        // Handle different response structures
        if (response && Array.isArray(response.data)) {
          // Direct array structure (your current structure)
          setNews(response.data);
        } else if (response && response.data && Array.isArray(response.data.data)) {
          // Nested data structure
          setNews(response.data.data);
        } else if (Array.isArray(response)) {
          // Just an array
          setNews(response);
        } else {
          console.warn('Unexpected response structure:', response);
          setNews([]);
        }
        
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Failed to load news. Please try again later.');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadNews();
  }, []);

  // Handle View All News click
  const handleViewAllNews = () => {
    navigate('/news');
  };

  // Handle Read More click for individual news
  const handleReadMore = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'achievements':
        return <Award className="h-4 w-4" />;
      case 'sports':
        return <Trophy className="h-4 w-4" />;
      case 'academic':
        return <GraduationCap className="h-4 w-4" />;
      case 'announcements':
        return <Megaphone className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch(category?.toLowerCase()) {
      case 'achievements':
        return 'bg-yellow-100 text-yellow-800';
      case 'sports':
        return 'bg-green-100 text-green-800';
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'announcements':
        return 'bg-purple-100 text-purple-800';
      case 'events':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format category name
  const formatCategoryName = (category) => {
    if (!category) return 'General';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Get image URL - updated to handle Strapi v4 structure
  const getImageUrl = (item) => {
    // Try to get image from different possible structures
    const imageData = item?.image?.data?.attributes?.url || 
                      item?.attributes?.image?.data?.attributes?.url ||
                      item?.image?.url;
    
    if (imageData) {
      return `http://localhost:1337${imageData}`;
    }
    
    // Fallback to category-based images
    const category = item?.category?.toLowerCase();
    const categoryImages = {
      'achievements': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format',
      'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop&auto=format',
      'academic': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&auto=format',
      'announcements': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop&auto=format',
      'events': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop&auto=format',
    };

    return categoryImages[category] || 
           'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop&auto=format';
  };

  // Helper to safely access item properties
  const getItemProp = (item, prop) => {
    // Handle both direct properties and nested attributes
    return item?.[prop] || item?.attributes?.[prop];
  };

  // Helper to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.warn('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Format time for news
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Latest School News
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest announcements, achievements, and 
              important information from our school community.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading news articles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Latest School News
            </h2>
          </div>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-600 rounded-full mb-4">
              <Megaphone className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Error Loading News
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <Megaphone className="h-4 w-4 mr-2" />
            Latest Updates
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            School News & Announcements
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed about our school's latest achievements, events, and important announcements.
          </p>
        </div>

        {/* News Grid */}
        {news.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.slice(0, 6).map((item) => {
                // Safely extract properties
                const title = getItemProp(item, 'title');
                const content = getItemProp(item, 'content');
                const category = getItemProp(item, 'category');
                const author = getItemProp(item, 'author');
                const publishDate = getItemProp(item, 'publishDate');
                const viewCount = getItemProp(item, 'viewCount');
                const newsId = item.id || item.documentId;
                
                const categoryIcon = getCategoryIcon(category);
                const categoryColor = getCategoryColor(category);
                const formattedCategory = formatCategoryName(category);
                const imageUrl = getImageUrl(item);
                const formattedDate = formatDate(publishDate);
                const formattedTime = formatTime(publishDate);
                
                return (
                  <article 
                    key={newsId} 
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 group cursor-pointer"
                    onClick={() => handleReadMore(newsId)}
                  >
                    {/* News Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={title || 'News image'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop&auto=format';
                        }}
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${categoryColor}`}>
                          {categoryIcon}
                          <span>{formattedCategory}</span>
                        </div>
                      </div>
                      
                      {/* View Count (if available) */}
                      {viewCount !== null && viewCount !== undefined && (
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 bg-black/70 text-white text-xs font-semibold rounded-full backdrop-blur-sm flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{viewCount}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* News Content */}
                    <div className="p-6">
                      {/* Date and Author */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span>
                            {formattedTime && (
                              <span className="text-xs">• {formattedTime}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{author || 'School Admin'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {title || 'Untitled News'}
                      </h3>

                      {/* Content Preview */}
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {(() => {
                          if (!content) return 'No content available';
                          
                          // Remove HTML tags if any
                          const textOnly = content.toString().replace(/<[^>]*>/g, '');
                          const preview = textOnly.substring(0, 120) + 
                            (textOnly.length > 120 ? '...' : '');
                          
                          return preview || 'Content preview not available';
                        })()}
                      </p>

                      {/* Read More Button */}
                      <div className="pt-4 border-t border-gray-100">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent parent click
                            handleReadMore(newsId);
                          }}
                          className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
                        >
                          <span>Read Full Story</span>
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* View All Button - Always show if there are news */}
            {news.length > 0 && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleViewAllNews}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  View All News Articles
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* Stats info */}
                <div className="mt-4 text-gray-500 text-sm">
                  Showing {Math.min(news.length, 6)} of {news.length} news articles
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-4">
              <Megaphone className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No News Available
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              We're currently updating our news section. Please check back later for the latest announcements and updates.
            </p>
            <button 
              onClick={handleViewAllNews}
              className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-colors"
            >
              <Calendar className="h-5 w-5 mr-2" />
              View Calendar of Events
            </button>
          </div>
        )}

        {/* News Stats */}
       
      </div>
    </section>
  );
};

export default NewsSection;