import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNews,
  selectAllNews,
  selectNewsLoading,
  selectNewsError,
  selectFilteredNews,
  selectSearchQuery,
  setSearchQuery,
} from '../store/slices/newsSlice';

const useNews = (params = {}) => {
  const dispatch = useDispatch();
  
  const news = useSelector(selectAllNews);
  const filteredNews = useSelector(selectFilteredNews);
  const loading = useSelector(selectNewsLoading);
  const error = useSelector(selectNewsError);
  const searchQuery = useSelector(selectSearchQuery);

  useEffect(() => {
    dispatch(getNews(params));
  }, [dispatch, JSON.stringify(params)]);

  const handleSearch = (query) => {
    dispatch(setSearchQuery(query));
  };

  const clearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  const refetchNews = () => {
    dispatch(getNews(params));
  };

  return {
    news,
    filteredNews,
    loading,
    error,
    searchQuery,
    handleSearch,
    clearSearch,
    refetchNews,
  };
};

export default useNews;