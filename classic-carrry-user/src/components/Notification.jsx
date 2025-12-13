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
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 400); // Wait for exit animation
  };

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'fa-check',
          color: 'text-green-500',
          bg: 'bg-green-500',
          border: 'border-green-500',
          lightBg: 'bg-green-50'
        };
      case 'error':
        return {
          icon: 'fa-exclamation',
          color: 'text-red-500',
          bg: 'bg-red-500',
          border: 'border-red-500',
          lightBg: 'bg-red-50'
        };
      case 'warning':
        return {
          icon: 'fa-exclamation-triangle',
          color: 'text-yellow-500',
          bg: 'bg-yellow-500',
          border: 'border-yellow-500',
          lightBg: 'bg-yellow-50'
        };
      default:
        return {
          icon: 'fa-info',
          color: 'text-primary',
          bg: 'bg-primary',
          border: 'border-primary',
          lightBg: 'bg-blue-50'
        };
    }
  };

  const config = getConfig();

  return (
    <div
      className={`
        fixed top-4 right-4 z-[9999] max-w-sm w-full
        transform transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}
      `}
    >
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Main Content */}
        <div className="p-4 flex items-start gap-4">
          {/* Icon Circle */}
          <div className={`w-10 h-10 rounded-full ${config.lightBg} flex items-center justify-center flex-shrink-0 animate-bounce-subtle`}>
            <i className={`fas ${config.icon} ${config.color} text-lg`}></i>
          </div>

          {/* Text Content */}
          <div className="flex-1 pt-1">
            <h4 className={`text-sm font-bold ${config.color} mb-0.5 capitalize`}>
              {type === 'info' ? 'Update' : type}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100/50">
          <div
            className={`h-full ${config.bg} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Decorative Glow */}
        <div className={`absolute -top-10 -right-10 w-20 h-20 ${config.bg} opacity-5 blur-2xl rounded-full pointer-events-none`}></div>
      </div>
    </div>
  );
};

export default Notification;