import { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`notification ${bgColor} text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl`}></i>
          <span>{message}</span>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200 ml-4">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Notification;
