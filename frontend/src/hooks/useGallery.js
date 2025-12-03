import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGallery,
  selectAllGalleries,
  selectGalleryLoading,
  selectGalleryError,
  selectFilteredGalleries,
  selectFilterBy,
  setFilterBy,
  setSelectedGallery,
  clearSelectedGallery,
} from '../store/slices/gallerySlice';

const useGallery = () => {
  const dispatch = useDispatch();
  
  const galleries = useSelector(selectAllGalleries);
  const filteredGalleries = useSelector(selectFilteredGalleries);
  const loading = useSelector(selectGalleryLoading);
  const error = useSelector(selectGalleryError);
  const filterBy = useSelector(selectFilterBy);

  useEffect(() => {
    dispatch(getGallery());
  }, [dispatch]);

  const handleFilterChange = (filter) => {
    dispatch(setFilterBy(filter));
  };

  const handleSelectGallery = (gallery, index = 0) => {
    dispatch(setSelectedGallery({ gallery, index }));
  };

  const handleCloseGallery = () => {
    dispatch(clearSelectedGallery());
  };

  const refetchGallery = () => {
    dispatch(getGallery());
  };

  return {
    galleries,
    filteredGalleries,
    loading,
    error,
    filterBy,
    handleFilterChange,
    handleSelectGallery,
    handleCloseGallery,
    refetchGallery,
  };
};

export default useGallery;