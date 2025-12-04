import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setShow(true), 100);

    // Auto redirect after 4 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => navigate('/'), 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`transform transition-all duration-500 ${show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md mx-4 text-center relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 opacity-50"></div>
          
          {/* Emoji Confetti Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {['🎉', '✨', '🎊', '⭐', '💫', '🌟', '🎈'].map((emoji, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
          
          {/* Colorful Confetti Pieces */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => {
              const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-pink-400', 'bg-purple-400', 'bg-orange-400'];
              const shapes = ['rounded-full', 'rounded-sm'];
              return (
                <div
                  key={i}
                  className={`absolute w-3 h-3 ${colors[Math.floor(Math.random() * colors.length)]} ${shapes[Math.floor(Math.random() * shapes.length)]} animate-confetti`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                ></div>
              );
            })}
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Success Icon with Animation */}
            <div className="mb-6 animate-bounce">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <i className="fas fa-check text-white text-5xl"></i>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
              Order Confirmed! 🎉
            </h1>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Thank you for choosing <span className="font-semibold text-[#8B7355]">Classic Carrry</span>!
            </p>

            {/* Check Icon Animation */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-green-600">
                <i className="fas fa-check-circle"></i>
                <span className="text-sm font-medium">Order Placed</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <i className="fas fa-envelope"></i>
                <span className="text-sm font-medium">Email Sent</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
              <div className="bg-gradient-to-r from-[#8B7355] to-[#A68A6F] h-2 rounded-full animate-progress"></div>
            </div>

            <p className="text-sm text-gray-500">
              Redirecting to home page...
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;