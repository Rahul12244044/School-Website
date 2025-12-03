import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEvents, fetchSingleEvent } from '../../services/api';

// Async thunks
export const getEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { limit } = params; // Removed category since events don't have it
      let events = await fetchEvents();
      
      // Ensure events is an array
      events = events || [];
      
      // Removed category filtering since events don't have category field
      // if (category && category !== 'All') {
      //   events = events.filter(event => 
      //     event?.category === category // Direct access, no attributes
      //   );
      // }
      
      // Limit results if provided
      if (limit) {
        events = events.slice(0, limit);
      }
      
      return events;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      const event = await fetchSingleEvent(id);
      console.log('Event data from API:', event);
      return event;
    } catch (error) {
      console.error('Error in getEventById:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const addEvent = createAsyncThunk(
  'events/addEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      // In a real app, you would make an API call here
      // For now, simulate adding an event
      const newEvent = {
        id: Date.now(),
        ...eventData, // Direct properties, no attributes wrapper
        createdAt: new Date().toISOString(),
      };
      return newEvent;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  featuredItems: [],
  currentEvent: null,
  loading: false,
  error: null,
  categories: ['Academic', 'Sports', 'Cultural', 'Other'],
  selectedCategory: 'All',
};

// Create slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    sortEventsByDate: (state, action) => {
      const { order = 'asc' } = action.payload;
      state.items.sort((a, b) => {
        // Direct access to date property, no attributes wrapper
        const dateA = a?.date ? new Date(a.date) : new Date(0);
        const dateB = b?.date ? new Date(b.date) : new Date(0);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Events
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        
        // Direct access to featured property, no attributes wrapper
        state.featuredItems = (action.payload || []).filter(
          (event) => event?.featured === true
        );
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch events';
        state.items = [];
        state.featuredItems = [];
      })
      
      // Get Event by ID
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch event';
      })
      
      // Add Event
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
          // Direct access to featured property
          if (action.payload?.featured) {
            state.featuredItems.unshift(action.payload);
          }
        }
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add event';
      });
  },
});

// Export actions
export const {
  setSelectedCategory,
  clearCurrentEvent,
  clearError,
  sortEventsByDate,
} = eventsSlice.actions;

// Selectors - Updated for direct property access
export const selectAllEvents = (state) => state.events.items || [];
export const selectFeaturedEvents = (state) => state.events.featuredItems || [];
export const selectEventById = (id) => (state) =>
  state.events.items.find((event) => event?.id === id);
export const selectCurrentEvent = (state) => state.events.currentEvent;
export const selectEventsLoading = (state) => state.events.loading;
export const selectEventsError = (state) => state.events.error;
export const selectEventsCategories = (state) => state.events.categories || [];
export const selectSelectedCategory = (state) => state.events.selectedCategory;

// Updated: Since events don't have category field, return all items or implement custom filtering
export const selectFilteredEvents = (state) => {
  const { items = [], selectedCategory } = state.events;
  
  // If no category filtering or "All" selected, return all items
  if (selectedCategory === 'All') return items;
  
  // Since events don't have category field, you have a few options:
  
  // Option 1: If you want to add category field later, use this:
  // return items.filter((event) => 
  //   event?.category === selectedCategory // Direct access, no attributes
  // );
  
  // Option 2: Filter by featured status if category is "Featured"
  if (selectedCategory === 'Featured') {
    return items.filter(event => event?.featured === true);
  }
  
  // Option 3: Filter by date range or other properties
  if (selectedCategory === 'Upcoming') {
    const today = new Date();
    return items.filter(event => {
      if (!event?.date) return false;
      try {
        const eventDate = new Date(event.date);
        return eventDate >= today;
      } catch {
        return false;
      }
    });
  }
  
  // Option 4: Filter by month or season
  if (selectedCategory === 'This Month') {
    const today = new Date();
    const currentMonth = today.getMonth();
    return items.filter(event => {
      if (!event?.date) return false;
      try {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentMonth;
      } catch {
        return false;
      }
    });
  }
  
  // Default: return all items if category doesn't match any filter
  return items;
};

// Optional: Add more specific selectors
export const selectUpcomingEvents = (state) => {
  const today = new Date();
  return (state.events.items || []).filter(event => {
    if (!event?.date) return false;
    try {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    } catch {
      return false;
    }
  });
};

export const selectPastEvents = (state) => {
  const today = new Date();
  return (state.events.items || []).filter(event => {
    if (!event?.date) return false;
    try {
      const eventDate = new Date(event.date);
      return eventDate < today;
    } catch {
      return false;
    }
  });
};

export default eventsSlice.reducer;