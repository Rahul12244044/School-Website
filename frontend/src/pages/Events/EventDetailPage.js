import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents, getEventById, selectCurrentEvent, selectEventsLoading, selectEventsError, selectAllEvents } from '../../store/slices/eventsSlice';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, Ticket, ChevronRight, Home, ExternalLink, Bookmark, Mail, Phone, Building2 } from 'lucide-react';
import { format } from 'date-fns';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const event = useSelector(selectCurrentEvent);
  const allEvents = useSelector(selectAllEvents);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);
  
  const [isLoading, setIsLoading] = useState(true);
  const [localEvent, setLocalEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (id) {
      const eventId = parseInt(id);
      const foundEvent = allEvents.find(e => e.id === eventId);
      
      if (foundEvent) {
        setLocalEvent(foundEvent);
        setIsLoading(false);
        
        const related = allEvents
          .filter(e => e.id !== eventId && (e.featured === true || e.date === foundEvent.date))
          .slice(0, 3);
        setRelatedEvents(related);
      } else {
        dispatch(getEventById(id))
          .then(() => setIsLoading(false))
          .catch(() => setIsLoading(false));
      }
    }
  }, [id, dispatch, allEvents]);

  const getImageUrl = (imageData) => {
    if (!imageData) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    
    if (imageData.url) {
      return `${STRAPI_URL}${imageData.url}`;
    }
    
    if (typeof imageData === 'string') {
      if (imageData.startsWith('/')) {
        return `${STRAPI_URL}${imageData}`;
      }
      return imageData;
    }
    
    if (imageData.data?.attributes?.url) {
      return `${STRAPI_URL}${imageData.data.attributes.url}`;
    }
    
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  };

  const extractDescription = (description) => {
    if (!description) return 'No description available';
    
    if (Array.isArray(description)) {
      return description
        .filter(block => block.type === 'paragraph')
        .map(block => 
          block.children?.map(child => child.text).join('') || ''
        )
        .join(' ');
    }
    
    if (typeof description === 'string') return description;
    
    if (typeof description === 'object') {
      try {
        return JSON.stringify(description);
      } catch {
        return 'Description not available';
      }
    }
    
    return String(description || 'No description available');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time TBD';
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

  const currentEvent = localEvent || event;

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-red-500 text-2xl">!</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Event Not Found</h3>
          <p className="text-gray-600 mb-6">
            {error || 'The requested event could not be found.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
            >
              Go Back
            </button>
            <Link
              to="/events"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              View All Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(currentEvent.image);
  const description = extractDescription(currentEvent.description);
  const formattedDate = currentEvent.date ? format(new Date(currentEvent.date), 'EEEE, MMMM do, yyyy') : 'Date TBD';
  const eventTime = formatTime(currentEvent.time);
  const shortDate = currentEvent.date ? format(new Date(currentEvent.date), 'MMM dd') : 'Date TBD';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100/30 to-white">
      {/* Enhanced Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-primary-600 flex items-center transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg">
              <Home className="h-4 w-4 mr-1.5" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link to="/events" className="text-gray-600 hover:text-primary-600 transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg">
              Events
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-900 font-medium truncate bg-primary-50 px-3 py-1.5 rounded-lg">
              {currentEvent.title || 'Event Details'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section with Enhanced Contrast */}
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

        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Back Button */}
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center space-x-2 text-white/90 hover:text-white mb-8 group transition-all bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to All Events</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-start gap-8">
              {/* Event Header */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {currentEvent.featured && (
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg flex items-center space-x-2 border border-yellow-300">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      <span>Featured Event</span>
                    </span>
                  )}
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/30">
                    {formattedDate}
                  </span>
                  
                  {/* Bookmark Button */}
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="ml-auto bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-sm border border-white/20 transition-all"
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-white text-white' : 'text-white/80'}`} />
                  </button>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  {currentEvent.title || 'Untitled Event'}
                </h1>

                {/* Enhanced Event Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-white/80 font-medium">Time</div>
                      <div className="font-semibold text-lg text-white">{eventTime}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-white/80 font-medium">Location</div>
                      <div className="font-semibold text-lg text-white">{currentEvent.location || 'Location TBD'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-white/80 font-medium">Event Type</div>
                      <div className="font-semibold text-lg text-white">
                        {currentEvent.featured ? 'Featured Event' : 'Regular Event'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Register Button */}
               
              </div>

              {/* Enhanced Event Image Preview */}
              <div className="lg:w-1/3">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 group">
                  <img
                    src={imageUrl}
                    alt={currentEvent.title || 'Event image'}
                    className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{shortDate.split(' ')[1]}</div>
                      <div className="text-xs text-white/90 uppercase">{shortDate.split(' ')[0]}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Enhanced Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Event Description Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/80 hover:border-gray-300 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full mr-3"></span>
                  About This Event
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy event link"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="prose prose-lg max-w-none prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4">
                <p className="text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                  {description}
                </p>
              </div>
            </div>

            {/* Enhanced Schedule Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/80 hover:border-gray-300 transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-2 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full mr-3"></span>
                Event Schedule
              </h2>
              <div className="space-y-4">
                {[
                  { time: '09:00 AM', title: 'Registration & Breakfast', desc: 'Welcome and registration process' },
                  { time: '10:00 AM', title: 'Opening Ceremony', desc: 'Keynote speech by principal' },
                  { time: '11:30 AM', title: 'Main Activities', desc: 'Various workshops and sessions' },
                  { time: '01:00 PM', title: 'Lunch Break', desc: 'Networking lunch' },
                  { time: '02:30 PM', title: 'Continuing Sessions', desc: 'Special guest presentations' },
                  { time: '04:00 PM', title: 'Closing Remarks', desc: 'Awards and acknowledgments' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group hover:bg-gray-50 p-4 rounded-xl transition-all border border-gray-100 hover:border-gray-200">
                    <div className="flex-shrink-0 w-28">
                      <div className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-semibold py-3 px-4 rounded-lg text-center group-hover:from-primary-100 group-hover:to-primary-200 transition-all shadow-sm">
                        {item.time}
                      </div>
                    </div>
                    <div className="flex-grow border-l-2 border-primary-300 pl-6 pb-6 relative">
                      <div className="absolute -left-2 top-4 w-4 h-4 bg-primary-500 rounded-full border-2 border-white" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Register Card */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 shadow-2xl border border-primary-500/30">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl text-black font-bold">Register Now</h3>
    <Ticket className="h-6 w-6 text-black" />
  </div>
  <p className="text-gray-900 mb-6 leading-relaxed">
    Secure your spot for this exciting event. Limited seats available!
  </p>
  <button className="w-full bg-white text-gray-900 hover:bg-gray-50 font-bold py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl border border-white/30">
    <Ticket className="h-5 w-5 text-gray-900" />
    <span>Register for Event</span>
  </button>
  <div className="mt-4 pt-4 border-t border-gray-800">
    <div className="flex items-center justify-center space-x-4 text-sm">
      <span className="bg-gray-900/20 text-gray-900 px-3 py-1 rounded-full">Free for students</span>
      <span className="bg-gray-900/20 text-gray-900 px-3 py-1 rounded-full">$20 for guests</span>
    </div>
  </div>
</div>

            {/* Enhanced Event Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200/80 hover:border-gray-300 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                Event Details
              </h3>
              <div className="space-y-5">
                <div className="flex items-start space-x-4 p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Date</div>
                    <div className="text-gray-600 font-medium">{formattedDate}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Time</div>
                    <div className="text-gray-600 font-medium">{eventTime}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Location</div>
                    <div className="text-gray-600 font-medium">{currentEvent.location || 'Location TBD'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Share Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200/80 hover:border-gray-300 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share This Event</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                  <span className="font-bold">f</span>
                  <span>Facebook</span>
                </button>
                <button className="bg-black hover:bg-gray-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                  <span className="font-bold">𝕏</span>
                  <span>Twitter</span>
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                  <span className="font-bold">in</span>
                  <span>LinkedIn</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Event link copied to clipboard!');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 shadow-sm hover:shadow"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>

            {/* Enhanced Organizer Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200/80 hover:border-gray-300 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Building2 className="h-5 w-5 text-primary-600 mr-2" />
                Organized By
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50/50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-primary-50 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">School Events Committee</div>
                    <div className="text-sm text-gray-600">Department of Student Affairs</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>events@school.edu</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>(555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200/80 hover:border-gray-300 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Events</h3>
                <div className="space-y-3">
                  {relatedEvents.map(relatedEvent => {
                    const relatedImage = getImageUrl(relatedEvent.image);
                    const relatedDate = relatedEvent.date ? format(new Date(relatedEvent.date), 'MMM dd') : 'Date TBD';
                    
                    return (
                      <Link
                        key={relatedEvent.id}
                        to={`/events/${relatedEvent.id}`}
                        className="group flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                      >
                        <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={relatedImage}
                            alt={relatedEvent.title || 'Event'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                            {relatedEvent.title || 'Event'}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{relatedDate}</span>
                            {relatedEvent.featured && (
                              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Featured</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back to Events Button */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium bg-white px-6 py-3 rounded-xl border border-gray-300 hover:border-primary-300 hover:bg-primary-50 transition-all shadow-sm hover:shadow"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to All Events</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;