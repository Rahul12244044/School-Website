import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../../store/slices/uiSlice';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = () => {
  const dispatch = useDispatch();
  const { isVisible, message, type } = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${getBgColor()} border rounded-lg shadow-lg p-4 max-w-sm`}>
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1">
            <p className="text-gray-800 font-medium">{message}</p>
          </div>
          <button
            onClick={() => dispatch(hideToast())}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;