import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { fetchGallery } from '../../services/api';

const GallerySection = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        const data = await fetchGallery();
        setGalleries(data || []); // Ensure it's always an array
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    loadGalleries();
  }, []);

  const getImageUrl = (imageData) => {
    if (imageData?.attributes?.url) {
      return `http://localhost:1337${imageData.attributes.url}`;
    }
    return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
  };

  const openLightbox = (gallery, index = 0) => {
    if (!gallery) return;
    setSelectedGallery(gallery);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedGallery(null);
    setSelectedImageIndex(0);
  };

  const navigateImage = (direction) => {
    if (!selectedGallery) return;
    
    const images = selectedGallery?.attributes?.images?.data || [];
    if (images.length === 0) return;
    
    const newIndex = direction === 'next' 
      ? (selectedImageIndex + 1) % images.length
      : (selectedImageIndex - 1 + images.length) % images.length;
    
    setSelectedImageIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            School Gallery
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore moments from our school events, activities, and daily life 
            through our photo gallery.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(galleries || []).map((gallery) => {
            // Safely access gallery data
            const galleryAttributes = gallery?.attributes || {};
            const images = galleryAttributes?.images?.data || [];
            const galleryTitle = galleryAttributes.title || 'Untitled Gallery';
            
            // If no images, return null
            if (images.length === 0) return null;

            return images.slice(0, 4).map((image, index) => (
              <div
                key={`${gallery.id || 'gallery'}-${index}`}
                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openLightbox(gallery, index)}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${galleryTitle} - Image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Gallery Title Overlay - Only show on first image */}
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {galleryTitle}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {images.length} photo{images.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            ));
          })}
        </div>

        {/* Empty State */}
        {!loading && (galleries.length === 0 || 
          galleries.every(g => !g?.attributes?.images?.data || g.attributes.images.data.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ImageIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Gallery Photos Available
            </h3>
            <p className="text-gray-600 mb-6">
              Check back later for gallery updates.
            </p>
          </div>
        )}

        {/* View All Button - Only show if there are galleries with images */}
        {(galleries || []).some(g => g?.attributes?.images?.data?.length > 0) && (
          <div className="text-center mt-12">
            <button className="btn-primary inline-flex items-center">
              View Full Gallery
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedGallery && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-4 text-white hover:text-gray-300 z-10"
            disabled={!selectedGallery?.attributes?.images?.data?.length}
          >
            <ChevronLeft className="h-12 w-12" />
          </button>

          <button
            onClick={() => navigateImage('next')}
            className="absolute right-4 text-white hover:text-gray-300 z-10"
            disabled={!selectedGallery?.attributes?.images?.data?.length}
          >
            <ChevronRight className="h-12 w-12" />
          </button>

          <div className="max-w-4xl max-h-[80vh] w-full">
            {(() => {
              const currentImage = selectedGallery?.attributes?.images?.data?.[selectedImageIndex];
              if (!currentImage) {
                return (
                  <div className="flex items-center justify-center h-64 text-white">
                    No image available
                  </div>
                );
              }
              
              return (
                <img
                  src={getImageUrl(currentImage)}
                  alt={`Gallery image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                  }}
                />
              );
            })()}
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 overflow-x-auto px-4">
            {(selectedGallery?.attributes?.images?.data || []).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-16 h-16 rounded overflow-hidden border-2 flex-shrink-0 ${
                  index === selectedImageIndex
                    ? 'border-primary-600'
                    : 'border-transparent hover:border-gray-400'
                }`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;