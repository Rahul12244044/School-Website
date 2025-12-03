import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGallery } from '../../services/api';

// Async thunks
export const getGallery = createAsyncThunk(
  'gallery/fetchGallery',
  async (_, { rejectWithValue }) => {
    try {
      const gallery = await fetchGallery();
      console.log("getGallery: ", gallery);
      return gallery;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  filteredItems: [], // Added for better search/filter performance
  loading: false,
  error: null,
  selectedGallery: null,
  selectedImageIndex: 0,
  filterBy: 'all',
  searchQuery: '', // Added for search
};

// Create slice
const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setSelectedGallery: (state, action) => {
      console.log("selectedGallery: ", action.payload);
      state.selectedGallery = action.payload.gallery;
      state.selectedImageIndex = action.payload.index || 0;
    },
    clearSelectedGallery: (state) => {
      state.selectedGallery = null;
      state.selectedImageIndex = 0;
    },
    setFilterBy: (state, action) => {
      state.filterBy = action.payload;
      
      // Apply filter
      if (action.payload === 'all') {
        state.filteredItems = state.items;
      } else {
        state.filteredItems = state.items.filter((gallery) => 
          gallery?.category === action.payload
        );
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      
      // Apply search filter
      if (!action.payload) {
        state.filteredItems = state.items;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredItems = state.items.filter((gallery) => 
          (gallery?.title || '').toLowerCase().includes(query)
        );
      }
    },
    navigateImage: (state, action) => {
      const { direction } = action.payload;
      if (!state.selectedGallery) return;
      
      // Direct access to images, no attributes wrapper
      const images = state.selectedGallery?.images || [];
      if (images.length === 0) return;
      
      state.selectedImageIndex = direction === 'next'
        ? (state.selectedImageIndex + 1) % images.length
        : (state.selectedImageIndex - 1 + images.length) % images.length;
    },
    setImageIndex: (state, action) => {
      state.selectedImageIndex = action.payload;
    },
    clearGalleryError: (state) => {
      state.error = null;
    },
    clearFilters: (state) => {
      state.filterBy = 'all';
      state.searchQuery = '';
      state.filteredItems = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Gallery
      .addCase(getGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.filteredItems = action.payload || []; // Initialize filtered items
      })
      .addCase(getGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch gallery';
        state.items = [];
        state.filteredItems = [];
      });
  },
});

// Export actions
export const {
  setSelectedGallery,
  clearSelectedGallery,
  setFilterBy,
  setSearchQuery,
  navigateImage,
  setImageIndex,
  clearGalleryError,
  clearFilters,
} = gallerySlice.actions;

// Selectors
export const selectAllGalleries = (state) => state.gallery.items || [];
export const selectFilteredGalleries = (state) => state.gallery.filteredItems || [];
export const selectGalleryLoading = (state) => state.gallery.loading;
export const selectGalleryError = (state) => state.gallery.error;
export const selectSelectedGallery = (state) => state.gallery.selectedGallery;
export const selectSelectedImageIndex = (state) => state.gallery.selectedImageIndex;
export const selectFilterBy = (state) => state.gallery.filterBy;
export const selectSearchQuery = (state) => state.gallery.searchQuery;

// Additional selectors for statistics
export const selectGalleryStats = (state) => {
  const items = state.gallery.items || [];
  
  const totalGalleries = items.length;
  const totalPhotos = items.reduce((total, gallery) => {
    return total + (gallery?.images?.length || 0);
  }, 0);
  
  const galleriesWithImages = items.filter(gallery => 
    gallery?.images?.length > 0
  ).length;
  
  return {
    totalGalleries,
    totalPhotos,
    galleriesWithImages,
    galleriesWithoutImages: totalGalleries - galleriesWithImages,
  };
};

// Selector for galleries with images
export const selectGalleriesWithImages = (state) => {
  return (state.gallery.items || []).filter(gallery => 
    gallery?.images?.length > 0
  );
};

// Selector for empty galleries
export const selectEmptyGalleries = (state) => {
  return (state.gallery.items || []).filter(gallery => 
    !gallery?.images || gallery.images.length === 0
  );
};

export default gallerySlice.reducer;