import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNews, fetchSingleNews } from '../../services/api';

// Async thunks
export const getNews = createAsyncThunk(
  'news/fetchNews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { limit } = params;
      let news = await fetchNews();
      
      // Ensure news is an array
      news = news || [];
      
      // Sort by publish date (newest first) - Direct access, no attributes wrapper
      news.sort((a, b) => {
        const dateA = a?.publishDate ? new Date(a.publishDate) : new Date(0);
        const dateB = b?.publishDate ? new Date(b.publishDate) : new Date(0);
        return dateB - dateA; // Newest first
      });
      
      // Limit results if provided
      if (limit) {
        news = news.slice(0, limit);
      }
      
      return news;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getNewsById = createAsyncThunk(
  'news/fetchNewsById',
  async (id, { rejectWithValue }) => {
    try {
      const newsItem = await fetchSingleNews(id);
      return newsItem;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  filteredItems: [], // Added for search functionality
  currentNews: null,
  loading: false,
  error: null,
  searchQuery: '',
};

// Create slice
const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      
      // Filter items based on search query
      const query = action.payload.toLowerCase();
      if (!query) {
        state.filteredItems = state.items || [];
      } else {
        state.filteredItems = (state.items || []).filter((news) => {
          const title = news?.title || '';
          const content = news?.content || '';
          const author = news?.author || '';
          
          return title.toLowerCase().includes(query) ||
                 content.toLowerCase().includes(query) ||
                 author.toLowerCase().includes(query);
        });
      }
    },
    clearCurrentNews: (state) => {
      state.currentNews = null;
    },
    clearNewsError: (state) => {
      state.error = null;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.filteredItems = state.items || [];
    },
    sortByDate: (state, action) => {
      const { order = 'desc' } = action.payload; // 'desc' for newest first, 'asc' for oldest first
      state.items.sort((a, b) => {
        const dateA = a?.publishDate ? new Date(a.publishDate) : new Date(0);
        const dateB = b?.publishDate ? new Date(b.publishDate) : new Date(0);
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
      
      // Also sort filtered items
      if (state.searchQuery) {
        state.filteredItems.sort((a, b) => {
          const dateA = a?.publishDate ? new Date(a.publishDate) : new Date(0);
          const dateB = b?.publishDate ? new Date(b.publishDate) : new Date(0);
          return order === 'desc' ? dateB - dateA : dateA - dateB;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get News
      .addCase(getNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.filteredItems = action.payload || []; // Initialize filtered items
      })
      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch news';
        state.items = [];
        state.filteredItems = [];
      })
      
      // Get News by ID
      .addCase(getNewsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNewsById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNews = action.payload;
      })
      .addCase(getNewsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch news item';
      });
  },
});

// Export actions
export const {
  setSearchQuery,
  clearCurrentNews,
  clearNewsError,
  clearSearch,
  sortByDate,
} = newsSlice.actions;

// Selectors
export const selectAllNews = (state) => state.news.items || [];
export const selectFilteredNews = (state) => state.news.filteredItems || [];
export const selectNewsById = (id) => (state) =>
  state.news.items.find((news) => news?.id === id);
export const selectCurrentNews = (state) => state.news.currentNews;
export const selectNewsLoading = (state) => state.news.loading;
export const selectNewsError = (state) => state.news.error;
export const selectSearchQuery = (state) => state.news.searchQuery;

// Additional selectors for statistics
export const selectNewsStats = (state) => {
  const items = state.news.items || [];
  
  // Count by year
  const years = items.reduce((acc, news) => {
    if (news?.publishDate) {
      try {
        const year = new Date(news.publishDate).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
      } catch {
        // Skip invalid dates
      }
    }
    return acc;
  }, {});
  
  // Most recent publish date
  const mostRecent = items.length > 0 
    ? items[0]?.publishDate 
    : null;
  
  // Authors count
  const authors = [...new Set(
    items.map(news => news?.author).filter(author => author)
  )].length;
  
  return {
    total: items.length,
    years,
    mostRecent,
    authors,
  };
};

// Selector for featured news (if you add a featured field later)
export const selectFeaturedNews = (state) => {
  return (state.news.items || []).filter(news => 
    news?.featured === true
  );
};

// Selector for recent news (last 7 days)
export const selectRecentNews = (state) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return (state.news.items || []).filter(news => {
    if (!news?.publishDate) return false;
    try {
      const publishDate = new Date(news.publishDate);
      return publishDate >= sevenDaysAgo;
    } catch {
      return false;
    }
  });
};

export default newsSlice.reducer;