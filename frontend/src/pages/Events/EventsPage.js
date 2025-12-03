import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getEvents,
  selectFilteredEvents,
  selectEventsLoading,
  selectEventsError,
  selectSelectedCategory,
  setSelectedCategory,
  sortEventsByDate,
} from '../../store/slices/eventsSlice';
import { 
  Filter, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  ChevronDown, 
  Search,
  Star,
  ArrowRight,
  Bell,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

const EventsPage = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectFilteredEvents);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);
  const selectedCategory = useSelector(selectSelectedCategory);
  
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  // Convert Strapi blocks to plain text
  const convertBlocksToText = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return 'No description available';
    
    let text = '';
    blocks.forEach(block => {
      if (block.type === 'paragraph' && block.children) {
        block.children.forEach(child => {
          if (child.type === 'text' && child.text) {
            text += child.text + ' ';
          }
        });
      }
    });
    
    return text.trim() || 'No description available';
  };

  // Safe string conversion for description
  const getSafeDescription = (description) => {
    if (!description) return 'No description available';
    
    // Handle Strapi blocks format
    if (Array.isArray(description)) {
      return convertBlocksToText(description);
    }
    
    // Handle string format
    if (typeof description === 'string') return description;
    
    // Handle other types
    if (typeof description === 'object') {
      try {
        return JSON.stringify(description);
      } catch {
        return 'Invalid description format';
      }
    }
    
    return String(description);
  };

  // Filter events based on search query
  const filteredEvents = React.useMemo(() => {
    if (!searchQuery.trim()) return events || [];
    
    const query = searchQuery.toLowerCase();
    return (events || []).filter(event => {
      const title = event?.title || '';
      const description = getSafeDescription(event?.description);
      const location = event?.location || '';
      
      return title.toLowerCase().includes(query) ||
             description.toLowerCase().includes(query) ||
             location.toLowerCase().includes(query);
    });
  }, [events, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (order) => {
    setSortOrder(order);
    dispatch(sortEventsByDate({ order }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stats calculation
  const stats = React.useMemo(() => {
    const allEvents = events || [];
    
    // Featured events
    const featuredEventsCount = allEvents.filter(e => e?.featured === true).length;
    
    // Upcoming events
    const upcomingEventsCount = allEvents.filter(e => {
      if (!e?.date) return false;
      try {
        const eventDate = new Date(e.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
      } catch {
        return false;
      }
    }).length;
    
    // Past events
    const pastEventsCount = allEvents.filter(e => {
      if (!e?.date) return false;
      try {
        const eventDate = new Date(e.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate < today;
      } catch {
        return false;
      }
    }).length;
    
    // Unique months
    const uniqueMonths = [...new Set(
      allEvents
        .map(e => {
          const date = e?.date;
          if (date) {
            try {
              return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            } catch {
              return null;
            }
          }
          return null;
        })
        .filter(month => month !== null)
    )].length;

    return {
      total: allEvents.length,
      featured: featuredEventsCount,
      upcoming: upcomingEventsCount,
      past: pastEventsCount,
      months: uniqueMonths
    };
  }, [events]);

  // Get image URL safely
  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    
    // If imageData is an object with url property
    if (imageData?.url) {
      return `${STRAPI_URL}${imageData.url}`;
    }
    
    // If imageData is a string path
    if (typeof imageData === 'string') {
      if (imageData.startsWith('/')) {
        return `${STRAPI_URL}${imageData}`;
      }
      return imageData;
    }
    
    return null;
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'Date TBA';
    }
  };

  // Format time safely
  const formatTime = (timeString) => {
    if (!timeString) return 'Time TBA';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  // Get day and month safely
  const getDayAndMonth = (dateString) => {
    if (!dateString) return { day: '??', month: '???' };
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { day: '??', month: '???' };
      return {
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      };
    } catch {
      return { day: '??', month: '???' };
    }
  };

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`px-3 py-2 rounded-lg mx-1 ${currentPage === 1 ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
      >
        1
      </button>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis1" className="px-2 text-gray-500">...</span>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 rounded-lg mx-1 ${currentPage === i ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
          >
            {i}
          </button>
        );
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis2" className="px-2 text-gray-500">...</span>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-2 rounded-lg mx-1 ${currentPage === totalPages ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading events...</p>
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
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Unable to Load Events</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(getEvents())}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100/30 to-white">
      {/* Hero Section with Dark Background */}
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              School <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Events</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover exciting events, workshops, and activities happening at our school.
              Join us in creating memorable experiences and building community connections.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative backdrop-blur-md bg-white/10 rounded-2xl p-1 border border-white/20 shadow-2xl">
                <div className="flex items-center">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events by title, location, or description..."
                    className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-sm text-gray-300">Total Events</div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-sm text-gray-300">Upcoming</div>
                  <div className="text-2xl font-bold">{stats.upcoming}</div>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-sm text-gray-300">Featured</div>
                  <div className="text-2xl font-bold">{stats.featured}</div>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-sm text-gray-300">Active Months</div>
                  <div className="text-2xl font-bold">{stats.months}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-8 relative">
        {/* Controls Card - Now has stronger contrast */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border border-gray-200/80 sticky top-4 z-10 backdrop-blur-sm bg-white/95">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* View Toggle */}
            <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm border border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm ${
                        viewMode === 'grid' 
                          ? 'bg-white' 
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
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm border border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="w-5 h-5 flex flex-col space-y-0.5">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full ${
                        viewMode === 'list' 
                          ? 'bg-white' 
                          : 'bg-gray-400'
                      }`}
                    ></div>
                  ))}
                </div>
              </button>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => handleSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2.5 pr-10 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer transition-all duration-300 shadow-sm"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Filter Button */}
              
            </div>
          </div>

          {/* Search Status */}
          {searchQuery && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    Showing {filteredEvents.length} results for: 
                    <span className="font-semibold text-primary-600 ml-1">"{searchQuery}"</span>
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <span>Clear search</span>
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards with better contrast */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: stats.total, color: 'text-primary-600', bg: 'bg-white', border: 'border-primary-200' },
            { label: 'Upcoming', value: stats.upcoming, color: 'text-green-600', bg: 'bg-white', border: 'border-green-200' },
            { label: 'Featured', value: stats.featured, color: 'text-purple-600', bg: 'bg-white', border: 'border-purple-200' },
            { label: 'Active Months', value: stats.months, color: 'text-orange-600', bg: 'bg-white', border: 'border-orange-200' },
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`${stat.bg} rounded-xl p-6 text-center shadow-lg border ${stat.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
              <div className="text-sm text-gray-500 mt-1">All time records</div>
            </div>
          ))}
        </div>

        {/* Events Grid/List */}
        {currentEvents.length > 0 ? (
          viewMode === 'grid' ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentEvents.map((event) => {
                  const description = getSafeDescription(event?.description);
                  const { day, month } = getDayAndMonth(event?.date);
                  const imageUrl = getImageUrl(event?.image);
                  
                  return (
                    <Link key={event?.id} to={`/events/${event?.id}`} className="group block">
                      {/* Enhanced Card with stronger shadows and borders */}
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-200/80 hover:border-primary-300 group-hover:ring-1 group-hover:ring-primary-100">
                        {/* Event Image */}
                        <div className="relative h-48 overflow-hidden">
                          {imageUrl ? (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
                              <img
                                src={imageUrl}
                                alt={event?.title || 'Event image'}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                }}
                              />
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                              <Calendar className="h-16 w-16 text-white/80" />
                            </div>
                          )}
                          
                          {/* Featured Badge */}
                          {event?.featured && (
                            <div className="absolute top-4 left-4 z-20">
                              <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-lg shadow-lg flex items-center space-x-1">
                                <Star className="h-3 w-3" />
                                <span>Featured</span>
                              </span>
                            </div>
                          )}
                          
                          {/* Date Badge */}
                          <div className="absolute top-4 right-4 z-20">
                            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg border border-white/20">
                              <div className="text-sm font-bold text-gray-800">{day}</div>
                              <div className="text-xs text-gray-600 uppercase">{month}</div>
                            </div>
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="p-6 flex-grow flex flex-col">
                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-lg">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(event?.date)}</span>
                            </div>
                            {event?.time && (
                              <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-lg">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(event.time)}</span>
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                            {event?.title || 'Untitled Event'}
                          </h3>

                          {/* Description */}
                          <div className="mb-6 flex-grow">
                            <p className="text-gray-600 line-clamp-3 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                              {description.substring(0, 120)}...
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-3">
                              {event?.location ? (
                                <>
                                  <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-50 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                                    <MapPin className="h-5 w-5 text-primary-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                                      {event.location}
                                    </div>
                                    <div className="text-xs text-gray-500">Location</div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                                    <Users className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      Join now
                                    </div>
                                    <div className="text-xs text-gray-500">Be the first</div>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* View Details Button */}
                            <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors bg-primary-50 px-4 py-2 rounded-lg border border-primary-100">
                              Details
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEvents.length)} of {filteredEvents.length} events
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 border disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {renderPagination()}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 border disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // List View
            <div className="space-y-6">
              {currentEvents.map((event) => {
                const description = getSafeDescription(event?.description);
                const { day, month } = getDayAndMonth(event?.date);
                const imageUrl = getImageUrl(event?.image);
                
                return (
                  <Link key={event?.id} to={`/events/${event?.id}`} className="group block">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-200/80 hover:border-primary-300">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="md:w-1/3 h-64 md:h-auto relative">
                          {imageUrl ? (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
                              <img
                                src={imageUrl}
                                alt={event?.title || 'Event image'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                }}
                              />
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                              <Calendar className="h-20 w-20 text-white/80" />
                            </div>
                          )}
                          
                          {/* Date Badge */}
                          <div className="absolute bottom-4 left-4 z-20">
                            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 text-center shadow-lg border border-white/20">
                              <div className="text-xl font-bold text-gray-800">{day}</div>
                              <div className="text-sm text-gray-600 uppercase">{month}</div>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="md:w-2/3 p-8 flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-grow">
                              {/* Meta Info */}
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1.5 rounded-lg">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(event?.date)}</span>
                                </div>
                                {event?.time && (
                                  <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1.5 rounded-lg">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatTime(event.time)}</span>
                                  </div>
                                )}
                                {event?.location && (
                                  <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1.5 rounded-lg">
                                    <MapPin className="h-4 w-4" />
                                    <span className="max-w-[200px] truncate">{event.location}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Title */}
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 mb-3">
                                {event?.title || 'Untitled Event'}
                              </h3>
                              
                              {/* Description */}
                              <div className="mb-6">
                                <p className="text-gray-600 line-clamp-3 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                  {description.substring(0, 250)}...
                                </p>
                              </div>
                            </div>
                            
                            {/* Featured Badge */}
                            {event?.featured && (
                              <div className="ml-4 flex-shrink-0">
                                <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-lg shadow-lg flex items-center space-x-1">
                                  <Star className="h-3 w-3" />
                                  <span>Featured</span>
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-50 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                                <Users className="h-5 w-5 text-primary-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {event?.attendees ? `${event.attendees} people attending` : 'Be the first to join'}
                                </div>
                                <div className="text-xs text-gray-500">Community event</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 bg-primary-50 px-4 py-2.5 rounded-lg border border-primary-100">
                              View Event Details
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
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
            <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200/80">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {searchQuery ? 'No Events Found' : 'No Events Scheduled'}
              </h3>
              <p className="text-gray-600 mb-8">
                {searchQuery
                  ? `No events found for "${searchQuery}". Try a different search term.`
                  : 'There are currently no events scheduled. Check back later for upcoming events!'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Newsletter/Reminder Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>
              
              <div className="relative p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <Bell className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Never Miss an Event
                  </h3>
                 
                  
                 
                  
                  <p className="text-gray-400 text-sm mt-6">
                    We'll only send you important event updates. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;