import { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <div className="flex items-center gap-3">
        <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl`}></i>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Notification;
