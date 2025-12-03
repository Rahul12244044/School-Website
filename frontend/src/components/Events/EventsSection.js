import React, { useState } from 'react';
import useEvents from '../../hooks/useEvents';
import { Calendar, MapPin, Clock, Filter, Star, ChevronRight, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const EventsSection = () => {
  const { events, loading, error } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Academic', 'Sports', 'Cultural', 'Other', 'Featured'];

  // Debug log to see actual data structure
  console.log('Events data:', events);

  // Handle different data structures
  const getEventData = () => {
    if (!events) return [];
    
    // If events is the entire response object
    if (events.data && Array.isArray(events.data)) {
      return events.data;
    }
    // If events is already the array
    else if (Array.isArray(events)) {
      return events;
    }
    // If nested structure with attributes
    else if (events.data && Array.isArray(events.data) && events.data[0]?.attributes) {
      return events.data;
    }
    return [];
  };

  const eventData = getEventData();
  
  const filteredEvents = selectedCategory === 'All' 
    ? eventData
    : selectedCategory === 'Featured'
    ? eventData.filter(event => event?.featured === true)
    : eventData.filter(event => event?.category === selectedCategory);

  // Take only first 6 events
  const displayEvents = filteredEvents.slice(0, 6);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date to be announced';
    try {
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time to be announced';
    try {
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      }
      return timeString;
    } catch {
      return timeString || 'Time to be announced';
    }
  };

  const getImageUrl = (event) => {
    // Try different possible image structures
    const imageData = event?.image?.data?.attributes?.url || 
                      event?.attributes?.image?.data?.attributes?.url ||
                      event?.image?.url;
    
    if (imageData) {
      return `http://localhost:1337${imageData}`;
    }
    
    // Fallback based on event type
    const category = event?.category?.toLowerCase();
    const featured = event?.featured;
    
    const categoryImages = {
      'academic': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
      'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
      'cultural': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
      'featured': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'
    };

    if (featured) {
      return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop';
    }
    
    return categoryImages[category] || 
           'https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?w=600&h=400&fit=crop';
  };

  const getDescriptionText = (description) => {
    if (!description) return 'No description available';
    
    // If description is rich text (blocks), extract text
    if (Array.isArray(description)) {
      return description
        .filter(block => block.type === 'paragraph')
        .flatMap(block => 
          block.children?.map(child => child.text).filter(Boolean) || []
        )
        .join(' ')
        .substring(0, 100) + (description.length > 100 ? '...' : '');
    }
    
    // If it's a string
    const textOnly = description.toString().replace(/<[^>]*>/g, '');
    return textOnly.substring(0, 100) + (textOnly.length > 100 ? '...' : '');
  };

  const handleViewCalendar = () => {
    navigate('/events');
  };

  const handleLearnMore = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover exciting events and activities happening in our school community
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
          </div>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-600 rounded-full mb-4">
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Error Loading Events
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {error.toString()}
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
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar of Events
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Upcoming School Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us for exciting events, workshops, and activities throughout the academic year
          </p>
        </div>

        {/* Simple Category Filters */}
        

        {/* Events Grid - Only first 6 events */}
        {displayEvents.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayEvents.map((event) => {
                const eventId = event.id || event.documentId;
                const imageUrl = getImageUrl(event);
                const isFeatured = event.featured === true;
                
                return (
                  <div
                    key={eventId}
                    className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 group"
                  >
                    {/* Event Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={event.title || 'Event image'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?w=600&h=400&fit=crop';
                        }}
                      />
                      
                      {/* Featured Badge */}
                      {isFeatured && (
                        <div className="absolute top-4 left-4">
                          <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center shadow-lg">
                            <Star className="h-3 w-3 mr-1" />
                            Featured Event
                          </div>
                        </div>
                      )}
                      
                      {/* Date Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                        <div className="text-white">
                          <div className="text-sm font-medium opacity-90 mb-1">
                            {formatDate(event.date)}
                          </div>
                          <div className="text-xl font-bold">
                            {event.title || 'Untitled Event'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6">
                      {/* Event Description */}
                      <p className="text-gray-600 mb-6 line-clamp-2">
                        {getDescriptionText(event.description)}
                      </p>

                      {/* Event Info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-5 w-5 mr-3 text-blue-500" />
                          <div>
                            <div className="font-medium">Time</div>
                            <div className="text-sm text-gray-600">{formatTime(event.time)}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-5 w-5 mr-3 text-green-500" />
                          <div>
                            <div className="font-medium">Location</div>
                            <div className="text-sm text-gray-600">{event.location || 'To be announced'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => handleLearnMore(eventId)}
                          className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
                        >
                          <span>View Details</span>
                          <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Events Button */}
            <div className="text-center mt-12">
              <button 
                onClick={handleViewCalendar}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                View Full Event Calendar
                <ExternalLink className="ml-3 h-6 w-6" />
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-4">
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {selectedCategory !== 'All' 
                ? `There are no ${selectedCategory.toLowerCase()} events scheduled at the moment.`
                : 'There are no events scheduled at the moment. Please check back later.'
              }
            </p>
            <button 
              onClick={handleViewCalendar}
              className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-colors"
            >
              <Calendar className="h-5 w-5 mr-2" />
              View Full Calendar
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;