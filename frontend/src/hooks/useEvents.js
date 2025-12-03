import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEvents,
  selectAllEvents,
  selectEventsLoading,
  selectEventsError,
  selectFilteredEvents,
  selectSelectedCategory,
  setSelectedCategory,
} from '../store/slices/eventsSlice';

const useEvents = (params = {}) => {
  const dispatch = useDispatch();
  
  const events = useSelector(selectAllEvents);
  const filteredEvents = useSelector(selectFilteredEvents);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);
  const selectedCategory = useSelector(selectSelectedCategory);

  useEffect(() => {
    dispatch(getEvents(params));
  }, [dispatch, JSON.stringify(params)]);

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  const refetchEvents = () => {
    dispatch(getEvents(params));
  };

  return {
    events,
    filteredEvents,
    loading,
    error,
    selectedCategory,
    handleCategoryChange,
    refetchEvents,
  };
};

export default useEvents;