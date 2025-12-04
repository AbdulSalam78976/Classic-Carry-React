const BackendErrorPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-3xl text-[#8B7355] mb-2" style={{ fontFamily: 'Satisfy, cursive' }}>Classic Carrry</h1>
          <div className="w-20 h-1 bg-[#8B7355] mx-auto rounded-full"></div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Visual */}
            <div className="bg-gradient-to-br from-[#8B7355] to-[#6B5744] p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="mb-8">
                  <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <i className="fas fa-plug text-6xl text-white"></i>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">Connection Issue</h2>
                <p className="text-white/90 text-lg">
                  We're unable to reach our servers at the moment
                </p>
              </div>
            </div>

            {/* Right Side - Information */}
            <div className="p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What's happening?</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-server text-red-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Server Unavailable</h4>
                    <p className="text-gray-600 text-sm">Our backend service might be under maintenance or temporarily down</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-wifi text-orange-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Network Issue</h4>
                    <p className="text-gray-600 text-sm">Please check your internet connection</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-clock text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Temporary Outage</h4>
                    <p className="text-gray-600 text-sm">This is usually resolved quickly</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRefresh}
                  className="w-full bg-[#8B7355] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#6B5744] transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <i className="fas fa-sync-alt"></i>
                  Retry Connection
                </button>
                
                <p className="text-center text-sm text-gray-500">
                  We automatically check the connection every 30 seconds
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Need help? Contact us at <a href="mailto:classiccarrry@gmail.com" className="text-[#8B7355] hover:underline font-medium">classiccarrry@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackendErrorPage;
