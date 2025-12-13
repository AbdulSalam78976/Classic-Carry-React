import { useState, useEffect } from 'react';

const BackendErrorPage = ({ onRetry }) => {
  const [countdown, setCountdown] = useState(30);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRetry();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry();
    setIsRetrying(false);
    setCountdown(30);
  };

  return (
    <div className="min-h-screen bg-[#020617] relative flex items-center justify-center overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute top-[20%] left-[20%] w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-4xl w-full z-10 px-4">
        {/* Logo/Brand */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl text-[#D2C1B6] mb-2 font-logo flex items-center justify-center gap-3 drop-shadow-glow" style={{ fontFamily: 'Satisfy, cursive' }}>
            Classic Carrry <span className="text-2xl">🛍️</span>
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase font-bold">Admin Portal Unavailable</p>
        </div>

        {/* Main Content Card */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
          <div className="grid md:grid-cols-2 gap-0 relative">

            {/* Left Side - Visual */}
            <div className="relative p-12 flex items-center justify-center bg-gradient-to-br from-red-900/40 via-slate-900/60 to-slate-900/40 backdrop-blur-md">
              {/* Animated Circles */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-red-500/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-red-500/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
              </div>

              <div className="text-center text-white relative z-10">
                <div className="mb-8">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                      <i className="fas fa-plug text-6xl text-red-400/80 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]"></i>
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-3 font-display">Connection Lost</h2>
                <p className="text-gray-300 text-lg font-light leading-relaxed">
                  We cannot establish a secure link <br />to the backend server.
                </p>
              </div>
            </div>

            {/* Right Side - Information */}
            <div className="p-12 bg-black/40 backdrop-blur-sm border-l border-white/5">
              <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4">Diagnostics</h3>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-500/20 group-hover:border-red-500/40 transition-colors">
                    <i className="fas fa-server text-red-400 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 group-hover:text-red-400 transition-colors">Server Down</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">The API server is currently unresponsive or undergoing maintenance.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/20 group-hover:border-orange-500/40 transition-colors">
                    <i className="fas fa-wifi text-orange-400 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">Network Status</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Check your local internet connection and firewall settings.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="w-full bg-gradient-to-r from-[#D2C1B6] to-[#bca698] text-slate-900 px-6 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(210,193,182,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  {isRetrying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      Attempting Reconnect...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt opacity-70"></i>
                      Retry Connection
                    </>
                  )}
                </button>

                <div className="text-center">
                  <span className="text-xs text-gray-500 font-mono">
                    Auto-retry in <span className="text-white font-bold">{countdown}s</span>
                  </span>
                  <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-white/20 transition-all duration-1000 ease-linear"
                      style={{ width: `${(countdown / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendErrorPage;
