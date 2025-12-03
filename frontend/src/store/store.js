import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';
import newsReducer from './slices/newsSlice';
import galleryReducer from './slices/gallerySlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    news: newsReducer,
    gallery: galleryReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['events/fetchEvents/fulfilled', 'news/fetchNews/fulfilled', 'gallery/fetchGallery/fulfilled'],
        ignoredPaths: ['events.items', 'news.items', 'gallery.items'],
      },
    }),
});