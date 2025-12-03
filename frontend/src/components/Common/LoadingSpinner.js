import React from 'react';
import { useSelector } from 'react-redux';

const LoadingSpinner = () => {
  const isLoading = useSelector((state) => state.ui.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;