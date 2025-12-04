import { useEffect, useState } from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - 2; // Decrease by 2% every 100ms (5000ms / 50 steps = 100ms)
      });
    }, 100);

    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getStyles = () => {
    const baseStyles = `
      fixed top-4 right-4 z-50 max-w-md w-full
      transform transition-all duration-300 ease-out
      rounded-xl shadow-2xl overflow-hidden
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `;

    switch (type) {
      case 'success':
        return `${baseStyles} bg-white border border-green-200`;
      case 'error':
        return `${baseStyles} bg-white border border-red-200`;
      case 'warning':
        return `${baseStyles} bg-white border border-yellow-200`;
      case 'info':
        return `${baseStyles} bg-white border border-blue-200`;
      default:
        return `${baseStyles} bg-white border border-gray-200`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return 'fa-check-circle text-green-500';
      case 'error': return 'fa-exclamation-circle text-red-500';
      case 'warning': return 'fa-exclamation-triangle text-yellow-500';
      case 'info': return 'fa-info-circle text-blue-500';
      default: return 'fa-bell text-gray-500';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'error': return 'bg-red-50';
      case 'warning': return 'bg-yellow-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className={getStyles()}>
      <div className={`p-4 ${getBackgroundColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <i className={`fas ${getIcon()} text-2xl`}></i>
            </div>
            <span className="font-medium text-gray-800">{message}</span>
          </div>
          <button 
            onClick={handleClose}
            className="
              w-8 h-8 rounded-full 
              hover:bg-black/10 
              flex items-center justify-center
              transition-colors duration-200
              flex-shrink-0
              ml-2
            "
          >
            <i className="fas fa-times text-gray-600"></i>
          </button>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div 
          className={`h-full ${getProgressColor()} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Notification;