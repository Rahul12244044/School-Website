import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getNews,
  selectFilteredNews,
  selectNewsLoading,
  selectNewsError,
  selectSearchQuery,
  setSearchQuery,
} from '../../store/slices/newsSlice';
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  Filter, 
  Clock, 
  TrendingUp, 
  BookOpen,
  Newspaper,
  Share2,
  Bookmark,
  Eye,
  ChevronDown,
  Check,
  Bell,
  Mail,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

const NewsPage = () => {
  const dispatch = useDispatch();
  const news = useSelector(selectFilteredNews);
  const loading = useSelector(selectNewsLoading);
  const error = useSelector(selectNewsError);
  const searchQuery = useSelector(selectSearchQuery);
  
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarked, setBookmarked] = useState([]);

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearch));
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  const getImageUrl = (imageData) => {
    if (imageData?.url) {
      return `${STRAPI_URL}${imageData.url}`;
    }
    return 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  };

  const filterByDate = (items) => {
    if (dateFilter === 'all') return items;
    
    const now = new Date();
    const filtered = items.filter(item => {
      const publishDate = new Date(item?.publishDate);
      const diffTime = Math.abs(now - publishDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'week':
          return diffDays <= 7;
        case 'month':
          return diffDays <= 30;
        case 'year':
          return diffDays <= 365;
        default:
          return true;
      }
    });
    
    return filtered;
  };

  const filterByCategory = (items) => {
    if (activeCategory === 'all') return items;
    return items.filter(item => item?.category?.toLowerCase() === activeCategory.toLowerCase());
  };

  const sortItems = (items) => {
    const sorted = [...items];
    switch (sortBy) {
      case 'latest':
        return sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
      case 'popular':
        return sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      default:
        return sorted;
    }
  };

  const filteredNews = sortItems(filterByCategory(filterByDate(news || [])));

  const categories = [
    { id: 'all', name: 'All News', count: news?.length || 0, color: 'from-gray-600 to-gray-800' },
    { id: 'announcements', name: 'Announcements', count: news?.filter(n => n?.category === 'announcements')?.length || 0, color: 'from-blue-600 to-blue-800' },
    { id: 'events', name: 'Events', count: news?.filter(n => n?.category === 'events')?.length || 0, color: 'from-green-600 to-green-800' },
    { id: 'achievements', name: 'Achievements', count: news?.filter(n => n?.category === 'achievements')?.length || 0, color: 'from-yellow-600 to-yellow-800' },
    { id: 'academic', name: 'Academic', count: news?.filter(n => n?.category === 'academic')?.length || 0, color: 'from-purple-600 to-purple-800' },
    { id: 'sports', name: 'Sports', count: news?.filter(n => n?.category === 'sports')?.length || 0, color: 'from-red-600 to-red-800' },
  ];

  const toggleBookmark = (id) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(item => item !== id));
    } else {
      setBookmarked([...bookmarked, id]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-red-500 text-2xl">!</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Unable to Load News</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(getNews())}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Parallax Effect */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:40px_40px]"></div>
        </div>
        
        {/* Animated Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-300 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronDown className="h-3 w-3 transform -rotate-90" />
              <span className="text-white font-medium">News & Updates</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              School <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">News</span> & Updates
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Stay informed with the latest announcements, achievements, events, 
              and important information from our dynamic school community.
            </p>
            
            {/* Search Bar with Glassmorphism */}
            <div className="max-w-2xl mx-auto">
              <div className="relative backdrop-blur-md bg-white/10 rounded-2xl p-1 border border-white/20 shadow-2xl">
                <div className="flex items-center">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search articles, announcements, events..."
                    className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  />
                  {localSearch && (
                    <button
                      onClick={() => {
                        setLocalSearch('');
                        dispatch(setSearchQuery(''));
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-sm text-gray-300">Total Articles</div>
                  <div className="text-2xl font-bold">{news?.length || 0}</div>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-sm text-gray-300">This Week</div>
                  <div className="text-2xl font-bold">
                    {news?.filter(n => {
                      const date = new Date(n?.publishDate);
                      const diffDays = Math.ceil((new Date() - date) / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }).length || 0}
                  </div>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-sm text-gray-300">Categories</div>
                  <div className="text-2xl font-bold">{categories.length - 1}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with subtle background */}
      <div className="bg-gradient-to-b from-white via-gray-50/50 to-gray-100/30">
        <div className="container mx-auto px-4 py-12 -mt-8 relative">
          {/* Floating Controls Card - Enhanced with shadow and border */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border border-gray-200/50 sticky top-4 z-10 backdrop-blur-sm bg-white/95">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Categories */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex space-x-2 pb-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 shadow-sm ${
                        activeCategory === category.id
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform -translate-y-0.5 ring-2 ring-white/30`
                          : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow border border-gray-200'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        activeCategory === category.id 
                          ? 'bg-white/30' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2.5 pr-10 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer transition-all duration-300 shadow-sm"
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 shadow-sm border border-primary-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i} 
                          className={`rounded-sm ${
                            viewMode === 'grid' 
                              ? 'bg-primary-600' 
                              : 'bg-gray-400'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 shadow-sm border border-primary-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-5 h-5 flex flex-col space-y-0.5">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={`h-1 rounded-full ${
                            viewMode === 'list' 
                              ? 'bg-primary-600' 
                              : 'bg-gray-400'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </button>
                </div>

                {/* Filter Button */}
                
              </div>
            </div>

            {/* Date Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  {['all', 'week', 'month', 'year'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setDateFilter(filter)}
                      className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 capitalize border shadow-sm ${
                        dateFilter === filter
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow transform -translate-y-0.5 ring-2 ring-primary-200 border-primary-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {filter === 'all' ? 'All Time' : `This ${filter}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Showing {filteredNews.length} of {news?.length || 0} articles
              </h3>
              {searchQuery && (
                <p className="text-gray-600 mt-1">
                  Search results for: <span className="font-semibold text-primary-600">"{searchQuery}"</span>
                </p>
              )}
            </div>
            {(searchQuery || dateFilter !== 'all' || activeCategory !== 'all') && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  dispatch(setSearchQuery(''));
                  setDateFilter('all');
                  setActiveCategory('all');
                }}
                className="px-4 py-2.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow flex items-center space-x-2 hover:bg-gray-50"
              >
                <span>Clear All</span>
                <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600">✕</span>
                </div>
              </button>
            )}
          </div>

          {/* News Grid/List with improved card visibility */}
          {filteredNews.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((item) => {
                  const newsItem = item || {};
                  const imageUrl = getImageUrl(newsItem.image);
                  const newsTitle = newsItem.title || 'Untitled News';
                  const publishDate = newsItem.publishDate;
                  const author = newsItem.author || 'School Admin';
                  const content = newsItem.content || '';
                  const isBookmarked = bookmarked.includes(newsItem.id);
                  const readTime = Math.ceil(content.length / 1000);
                  const categoryColor = categories.find(c => c.id === (newsItem.category || 'all'))?.color || 'from-primary-600 to-primary-700';

                  return (
                    <Link
                      key={newsItem.id}
                      to={`/news/${newsItem.id}`}
                      className="group block transform transition-all duration-500 hover:-translate-y-2"
                    >
                      {/* Enhanced Card with better shadows and borders */}
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-200/70 hover:border-gray-300 group-hover:ring-1 group-hover:ring-gray-200/50">
                        {/* News Image with Overlay */}
                        <div className="relative h-64 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
                          <img
                            src={imageUrl}
                            alt={newsTitle}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                            }}
                          />
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4 z-20">
                            <span className={`px-3 py-1.5 bg-gradient-to-r ${categoryColor} text-white text-sm font-semibold rounded-lg shadow-lg`}>
                              {newsItem.category || 'News'}
                            </span>
                          </div>
                          
                          {/* Bookmark Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBookmark(newsItem.id);
                            }}
                            className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-white/30"
                          >
                            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary-600 text-primary-600' : 'text-gray-600'}`} />
                          </button>
                          
                          {/* Gradient Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
                        </div>

                        {/* News Content */}
                        <div className="p-6 flex-grow flex flex-col">
                          {/* Date & Stats */}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {publishDate ? format(new Date(publishDate), 'MMM dd, yyyy') : 'Date not specified'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Clock className="h-4 w-4" />
                                <span>{readTime} min read</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                              <Eye className="h-4 w-4" />
                              <span>{newsItem.viewCount || '0'}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                            {newsTitle}
                          </h3>

                          {/* Excerpt with subtle background */}
                          <div className="mb-6 flex-grow">
                            <p className="text-gray-600 line-clamp-3 leading-relaxed bg-gray-50/50 p-3 rounded-lg">
                              {content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                            </p>
                          </div>

                          {/* Footer with author info */}
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-50 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                                <User className="h-5 w-5 text-primary-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{author}</div>
                                <div className="text-xs text-gray-500">Author</div>
                              </div>
                            </div>
                            
                            {/* Read More Button */}
                            <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors bg-primary-50 px-4 py-2 rounded-lg">
                              Read More
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              // List View with enhanced cards
              <div className="space-y-6">
                {filteredNews.map((item) => {
                  const newsItem = item || {};
                  const imageUrl = getImageUrl(newsItem.image);
                  const newsTitle = newsItem.title || 'Untitled News';
                  const publishDate = newsItem.publishDate;
                  const author = newsItem.author || 'School Admin';
                  const content = newsItem.content || '';
                  const isBookmarked = bookmarked.includes(newsItem.id);
                  const readTime = Math.ceil(content.length / 1000);
                  const categoryColor = categories.find(c => c.id === (newsItem.category || 'all'))?.color || 'from-primary-600 to-primary-700';

                  return (
                    <Link
                      key={newsItem.id}
                      to={`/news/${newsItem.id}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-200/70 hover:border-gray-300">
                        <div className="flex flex-col md:flex-row">
                          {/* Image Section */}
                          <div className="md:w-1/3 h-64 md:h-auto relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
                            <img
                              src={imageUrl}
                              alt={newsTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 z-20">
                              <span className={`px-3 py-1.5 bg-gradient-to-r ${categoryColor} text-white text-sm font-semibold rounded-lg shadow-lg`}>
                                {newsItem.category || 'News'}
                              </span>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="md:w-2/3 p-8 flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-grow">
                                {/* Meta Info */}
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                  <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <Calendar className="h-4 w-4" />
                                    <span>{format(new Date(publishDate), 'MMM dd, yyyy')}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <Clock className="h-4 w-4" />
                                    <span>{readTime} min read</span>
                                  </div>
                                  <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <Eye className="h-4 w-4" />
                                    <span>{newsItem.viewCount || '0'} views</span>
                                  </div>
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 mb-3">
                                  {newsTitle}
                                </h3>
                                
                                {/* Excerpt */}
                                <div className="mb-6">
                                  <p className="text-gray-600 line-clamp-3 leading-relaxed bg-gray-50/50 p-3 rounded-lg">
                                    {content.replace(/<[^>]*>/g, '').substring(0, 300)}...
                                  </p>
                                </div>
                              </div>
                              
                              {/* Bookmark Button */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleBookmark(newsItem.id);
                                }}
                                className="w-10 h-10 bg-white border border-gray-300 hover:border-gray-400 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm hover:shadow ml-4 flex-shrink-0"
                              >
                                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary-600 text-primary-600' : 'text-gray-500'}`} />
                              </button>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-50 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                                  <User className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{author}</div>
                                  <div className="text-xs text-gray-500">Posted by</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <button className="text-gray-500 hover:text-gray-700 transition-colors w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                                  <Share2 className="h-5 w-5" />
                                </button>
                                <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 bg-primary-50 px-4 py-2.5 rounded-lg">
                                  Read Full Story
                                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )
          ) : (
            // No Results State
            <div className="text-center py-20">
              <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Newspaper className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  No Articles Found
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchQuery
                    ? `No articles found for "${searchQuery}". Try a different search term or clear filters.`
                    : 'There are no news articles matching your current filters.'}
                </p>
                {(searchQuery || dateFilter !== 'all' || activeCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setLocalSearch('');
                      dispatch(setSearchQuery(''));
                      setDateFilter('all');
                      setActiveCategory('all');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-black font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Newsletter Section */}
          <div className="mt-20">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>
                
                {/* Content */}
                <div className="relative p-12 text-center">
                  <div className="max-w-xl mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                      <Bell className="h-10 w-10 text-white" />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Never Miss an Update
                    </h3>
                    
                    
                    
                   
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;