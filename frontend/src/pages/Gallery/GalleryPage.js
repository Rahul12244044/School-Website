import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGallery,
  selectAllGalleries,
  selectGalleryLoading,
  selectGalleryError,
  selectFilteredGalleries,
  selectFilterBy,
  selectSearchQuery,
  setFilterBy,
  setSearchQuery,
  setSelectedGallery,
  clearSelectedGallery,
} from '../../store/slices/gallerySlice';
import { 
  Image as ImageIcon, 
  Grid, 
  List, 
  Search, 
  X, 
  Filter,
  Eye,
  BarChart3,
  Check,
  Phone,
  Mail,
  ChevronRight,
  Calendar
} from 'lucide-react';
import GalleryModal from "../../pages/Gallery/GalleryModal";

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

const GalleryPage = () => {
  const dispatch = useDispatch();
  const galleries = useSelector(selectAllGalleries);
  const filteredGalleries = useSelector(selectFilteredGalleries);
  const loading = useSelector(selectGalleryLoading);
  const error = useSelector(selectGalleryError);
  const filterBy = useSelector(selectFilterBy);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedGallery = useSelector(state => state.gallery.selectedGallery);
  
  const [viewMode, setViewMode] = useState('grid');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch galleries on component mount
  useEffect(() => {
    dispatch(getGallery());
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearch));
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  // Get image URL
  const getImageUrl = (imageData) => {
    if (imageData?.url) {
      return `${STRAPI_URL}${imageData.url}`;
    }
    return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
  };

  // Helper to safely get gallery images
  const getGalleryImages = (gallery) => {
    return gallery?.images || [];
  };

  // Helper to safely get gallery title
  const getGalleryTitle = (gallery) => {
    return gallery?.title || 'Untitled Gallery';
  };

  

  const handleSearch = (e) => {
    setLocalSearch(e.target.value);
  };

 
  // Open gallery modal
  const handleOpenGallery = (gallery, index = 0) => {
    dispatch(setSelectedGallery({ gallery, index }));
    setCurrentImageIndex(index);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    dispatch(clearSelectedGallery());
    document.body.style.overflow = 'auto';
  }, [dispatch]);

  // Handle navigation in modal
  const handleNavigate = (index) => {
    setCurrentImageIndex(index);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        handleCloseModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showModal, handleCloseModal]);

  // Calculate total photos
  const totalPhotos = galleries.reduce((total, gallery) => {
    const images = getGalleryImages(gallery);
    return total + images.length;
  }, 0);

  // Calculate galleries with images
  const galleriesWithImages = galleries.filter(gallery => 
    getGalleryImages(gallery).length > 0
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Gallery</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(getGallery())}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Fixed: Separate from controls */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">School Gallery</h1>
            <p className="text-xl text-white/90 mb-4">
              Explore moments from school events, activities, and daily life 
              through our photo collections. Relive the memories!
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section - Fixed: Proper spacing from hero */}
      <div className="container mx-auto px-4 mt-11">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 -mt-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search Bar - Fixed: Proper width and positioning */}
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={handleSearch}
                  placeholder="Search galleries by title..."
                  className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                {localSearch && (
                  <button
                    onClick={() => {
                      setLocalSearch('');
                      dispatch(setSearchQuery(''));
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* View Controls */}
            
          {/* Category Filters */}
          
    </div>
    </div>
    </div>

      {/* Gallery Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 text-center shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {galleries.length}
              </div>
              <div className="text-gray-600">Total Galleries</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {totalPhotos}
              </div>
              <div className="text-gray-600">Total Photos</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {galleriesWithImages}
              </div>
              <div className="text-gray-600">Active Galleries</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {filteredGalleries.length}
              </div>
              <div className="text-gray-600">Currently Showing</div>
            </div>
          </div>
        </div>

        {/* Search/Filter Status */}
        {(localSearch || filterBy !== 'all') && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-800 font-medium">
                  Showing results for: 
                  {localSearch && ` "${localSearch}"`}
                  {localSearch && filterBy !== 'all' && ' and '}
                  {filterBy !== 'all' && ` category: "${filterBy}"`}
                </span>
              </div>
              <button
                onClick={() => {
                  setLocalSearch('');
                  dispatch(setSearchQuery(''));
                  dispatch(setFilterBy('all'));
                }}
                className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 hover:bg-yellow-50 rounded-lg font-medium transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Gallery Grid/List - IMPROVED LAYOUT */}
        {filteredGalleries.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGalleries.map((gallery) => {
                const images = getGalleryImages(gallery);
                const galleryTitle = getGalleryTitle(gallery);

                return (
                  <div
                    key={gallery.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-primary-200"
                  >
                    {/* Gallery Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 truncate">
                            {galleryTitle}
                          </h3>
                          <div className="flex items-center space-x-3 text-gray-600">
                            <div className="flex items-center space-x-1">
                              <ImageIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="text-sm">{images.length} photo{images.length !== 1 ? 's' : ''}</span>
                            </div>
                            {gallery.createdAt && (
                              <span className="text-xs text-gray-500 hidden sm:inline">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {new Date(gallery.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {images.length > 0 && (
                          <div className="ml-4 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              Active
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Grid Preview - CLEANED UP LAYOUT */}
                    <div className="p-6">
                      {images.length === 0 ? (
                        <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-500 text-sm">No images available</p>
                        </div>
                      ) : images.length === 1 ? (
                        // Single image - Full width
                        <div className="aspect-square rounded-lg overflow-hidden relative cursor-pointer">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                          <img
                            src={getImageUrl(images[0])}
                            alt={images[0]?.alternativeText || galleryTitle}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            onClick={() => handleOpenGallery(gallery, 0)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        </div>
                      ) : images.length === 2 ? (
                        // Two images - Side by side
                        <div className="grid grid-cols-2 gap-2">
                          {images.slice(0, 2).map((image, index) => (
                            <div
                              key={image.id || index}
                              className="aspect-square rounded-lg overflow-hidden relative cursor-pointer"
                              onClick={() => handleOpenGallery(gallery, index)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                              <img
                                src={getImageUrl(image)}
                                alt={image.alternativeText || `${galleryTitle} - ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ))}
                        </div>
                      ) : images.length === 3 ? (
                        // Three images - One big, two small
                        <div className="grid grid-cols-2 gap-2">
                          <div
                            className="col-span-2 aspect-[2/1] rounded-lg overflow-hidden relative cursor-pointer"
                            onClick={() => handleOpenGallery(gallery, 0)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                            <img
                              src={getImageUrl(images[0])}
                              alt={images[0]?.alternativeText || `${galleryTitle} - 1`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          {images.slice(1, 3).map((image, index) => (
                            <div
                              key={image.id || index + 1}
                              className="aspect-square rounded-lg overflow-hidden relative cursor-pointer"
                              onClick={() => handleOpenGallery(gallery, index + 1)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                              <img
                                src={getImageUrl(image)}
                                alt={image.alternativeText || `${galleryTitle} - ${index + 2}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Four or more images - Clean grid layout
                        <div className="grid grid-cols-2 gap-2">
                          {images.slice(0, 4).map((image, index) => (
                            <div
                              key={image.id || index}
                              className="aspect-square rounded-lg overflow-hidden relative cursor-pointer"
                              onClick={() => handleOpenGallery(gallery, index)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                              <img
                                src={getImageUrl(image)}
                                alt={image.alternativeText || `${galleryTitle} - ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                              {index === 3 && images.length > 4 && (
                                <div 
                                  className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/50 flex items-center justify-center cursor-pointer"
                                  onClick={() => handleOpenGallery(gallery, 0)}
                                >
                                  <span className="text-white font-bold text-lg bg-black/60 px-3 py-1 rounded-full">
                                    +{images.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* View Gallery Button */}
                    <div className="px-6 pb-6">
                      <button 
                        onClick={() => handleOpenGallery(gallery, 0)}
                        className="w-full py-3 bg-gradient-to-r from-primary-110 to-primary-100 text-primary-700 hover:from-primary-100 hover:to-blue-500 rounded-xl font-semibold transition-all duration-200 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-primary-800 group-hover:text-black flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span>View Gallery</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List View - Cleaned up
            <div className="space-y-6">
              {filteredGalleries.map((gallery) => {
                const images = getGalleryImages(gallery);
                const galleryTitle = getGalleryTitle(gallery);

                return (
                  <div
                    key={gallery.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-primary-200"
                    onClick={() => handleOpenGallery(gallery, 0)}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Thumbnail */}
                      <div className="md:w-64 h-64 flex-shrink-0 relative">
                        {images.length > 0 ? (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                            <img
                              src={getImageUrl(images[0])}
                              alt={images[0]?.alternativeText || galleryTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-gray-500">No preview</p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-grow p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 truncate">
                              {galleryTitle}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600">
                              <div className="flex items-center space-x-1">
                                <ImageIcon className="h-4 w-4" />
                                <span>{images.length} photo{images.length !== 1 ? 's' : ''}</span>
                              </div>
                              {gallery.createdAt && (
                                <span className="text-sm text-gray-500">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {new Date(gallery.createdAt).toLocaleDateString()}
                                </span>
                              )}
                              {images.length > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {images.length} photos
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                            <button className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold">
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Quick Preview (for galleries with multiple images) */}
                        {images.length > 1 && (
                          <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-3 flex items-center">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              Quick preview:
                            </p>
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                              {images.slice(0, 5).map((image, index) => (
                                <div
                                  key={image.id || index}
                                  className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300 transition-colors duration-200"
                                >
                                  <img
                                    src={getImageUrl(image)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                                    }}
                                  />
                                </div>
                              ))}
                              {images.length > 5 && (
                                <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                  <span className="text-gray-600 font-bold text-sm">
                                    +{images.length - 5}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-gray-400 mb-6">
              <ImageIcon className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {galleries.length === 0 ? 'No Galleries Available' : 'No Matching Galleries Found'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {localSearch || filterBy !== 'all'
                ? `No galleries found matching "${localSearch || filterBy}". Try a different search or filter.`
                : 'There are no galleries available at the moment. Check back later!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(localSearch || filterBy !== 'all') && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    dispatch(setSearchQuery(''));
                    dispatch(setFilterBy('all'));
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              )}
              {galleries.length === 0 && (
                <button
                  onClick={() => dispatch(getGallery())}
                  className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>
        )}

        {/* Gallery Tips & Info Section */}
        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* How to View Section */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">How to View</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-700">1</span>
                  </div>
                  <span className="text-gray-700">Click on any gallery card to open</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-700">2</span>
                  </div>
                  <span className="text-gray-700">Use arrow keys or swipe to navigate</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-700">3</span>
                  </div>
                  <span className="text-gray-700">Press F for fullscreen mode</span>
                </li>
              </ul>
            </div>

            {/* Gallery Stats Section */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Gallery Statistics</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Galleries</span>
                  <span className="font-bold text-blue-700">{galleries.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Photos</span>
                  <span className="font-bold text-blue-700">{totalPhotos}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Galleries with Photos</span>
                  <span className="font-bold text-blue-700">{galleriesWithImages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Currently Showing</span>
                  <span className="font-bold text-blue-700">{filteredGalleries.length}</span>
                </div>
              </div>
            </div>

            {/* Search Tips Section */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Search Tips</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Use the search bar to find specific galleries</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Filter by category using the filter button</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Toggle between grid and list views</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Click "Clear All Filters" to reset</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          
        </div>
      </div>

      {/* Gallery Modal */}
      {showModal && selectedGallery && (
        <GalleryModal
          gallery={selectedGallery}
          currentIndex={currentImageIndex}
          onClose={handleCloseModal}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export default GalleryPage;