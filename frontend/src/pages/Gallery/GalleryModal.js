// components/Gallery/GalleryModal.js
import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, Play, Pause } from 'lucide-react';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

const GalleryModal = ({ gallery, currentIndex, onClose, onNavigate }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex || 0);
  
  const images = gallery?.images || [];
  const galleryTitle = gallery?.title || 'Gallery';
  
  // Get image URL
  const getImageUrl = (imageData) => {
    if (imageData?.url) {
      return `${STRAPI_URL}${imageData.url}`;
    }
    return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  };
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowLeft':
        handlePrev();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case 'Escape':
        onClose();
        break;
      case ' ':
        setAutoPlay(!autoPlay);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      default:
        break;
    }
  }, [currentImageIndex, autoPlay]);
  
  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (autoPlay && images.length > 1) {
      interval = setInterval(() => {
        handleNext();
      }, 3000); // Change image every 3 seconds
    }
    return () => clearInterval(interval);
  }, [autoPlay, currentImageIndex, images.length]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  const handlePrev = () => {
    const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    if (onNavigate) onNavigate(newIndex);
  };
  
  const handleNext = () => {
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    if (onNavigate) onNavigate(newIndex);
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  const handleDownload = () => {
    const currentImage = images[currentImageIndex];
    if (currentImage?.url) {
      const link = document.createElement('a');
      link.href = `${STRAPI_URL}${currentImage.url}`;
      link.download = currentImage.name || `gallery-image-${currentImageIndex + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  if (!gallery || images.length === 0) return null;
  
  const currentImage = images[currentImageIndex];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative z-10 w-full h-full flex flex-col ${
          isFullscreen ? '' : 'max-w-7xl max-h-[90vh] mx-4 my-8'
        }`}
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setTimeout(() => setShowControls(false), 2000)}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 text-white transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold">{galleryTitle}</h2>
              <p className="text-sm text-gray-300">
                Image {currentImageIndex + 1} of {images.length}
                {currentImage?.alternativeText && ` • ${currentImage.alternativeText}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label={autoPlay ? "Pause slideshow" : "Play slideshow"}
            >
              {autoPlay ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Download image"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Main Image Area */}
        <div className="flex-grow flex items-center justify-center p-4 relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className={`absolute left-4 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 ${
              showControls ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleNext}
            className={`absolute right-4 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 ${
              showControls ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={getImageUrl(currentImage)}
              alt={currentImage?.alternativeText || `${galleryTitle} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
              }}
            />
            
            {/* Image Info Overlay */}
            <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}>
              <p className="text-sm">
                {currentImage?.name || `Image ${currentImageIndex + 1}`}
                {currentImage?.size && ` • ${(currentImage.size).toFixed(1)} KB`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Thumbnail Strip */}
        <div className={`p-4 bg-black/50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {images.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  if (onNavigate) onNavigate(index);
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex
                    ? 'border-primary-500 scale-105'
                    : 'border-transparent hover:border-white/50'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;