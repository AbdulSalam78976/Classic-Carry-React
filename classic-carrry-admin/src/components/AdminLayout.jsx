import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { settings } = useSettings();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { path: '/', icon: 'fa-chart-pie', label: 'Dashboard' },
        { path: '/analytics', icon: 'fa-chart-bar', label: 'Analytics' },
      ]
    },
    {
      title: 'Store',
      items: [
        { path: '/orders', icon: 'fa-shopping-bag', label: 'Orders' },
        { path: '/products', icon: 'fa-box-open', label: 'Products' },
        { path: '/categories', icon: 'fa-layer-group', label: 'Categories' },
        { path: '/coupons', icon: 'fa-ticket-alt', label: 'Coupons' },
      ]
    },
    {
      title: 'Community',
      items: [
        { path: '/users', icon: 'fa-users', label: 'Users' },
        { path: '/reviews', icon: 'fa-star', label: 'Reviews' },
        { path: '/contacts', icon: 'fa-envelope', label: 'Contacts' },
      ]
    },
    {
      title: 'Content',
      items: [
        { path: '/hero-images', icon: 'fa-image', label: 'Hero Images' },
        { path: '/settings', icon: 'fa-cog', label: 'Settings' },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 flex flex-col
        transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        ${sidebarOpen ? 'w-72 translate-x-0' : isMobile ? '-translate-x-full w-0' : 'w-24 translate-x-0'}
        bg-[#020617]/90 backdrop-blur-2xl border-r border-white/5 shadow-2xl
      `}>
        {/* Logo Section */}
        <div className={`h-24 flex items-center px-6 border-b border-white/5 transition-all duration-300 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 text-slate-900">
                <i className="fas fa-crown text-xl text-[#D2C1B6]"></i>
              </div>
              <div className="overflow-hidden">
                <h1 className="text-xl font-bold font-display text-white truncate leading-tight">
                  {settings.appearance.siteName || 'dKart'}
                </h1>
                <p className="text-xs text-primary font-bold tracking-widest uppercase">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 text-slate-900 h-10 w-10 shrink-0">
              <i className="fas fa-crown text-xl text-[#D2C1B6]"></i>
            </div>
          )}

          {!isMobile && sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
            >
              <i className="fas fa-chevron-left text-xs text-[#D2C1B6]"></i>
            </button>
          )}
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar space-y-8">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {sidebarOpen && (
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2 animate-fade-in">
                  {group.title}
                </h3>
              )}
              {/* Separator for collapsed state if not the first group */}
              {!sidebarOpen && groupIndex > 0 && (
                <div className="w-8 h-[2px] bg-white/5 mx-auto mb-4 rounded-full"></div>
              )}

              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                       group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative
                       ${location.pathname === item.path
                        ? 'bg-primary text-slate-900 shadow-[0_0_20px_rgba(210,193,182,0.3)] font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'}
                       ${!sidebarOpen && 'justify-center px-0 py-3'}
                     `}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <div className={`
                       flex items-center justify-center transition-transform duration-200
                       ${!sidebarOpen ? 'w-full' : 'w-6'}
                       ${location.pathname === item.path ? 'transform scale-110' : 'group-hover:scale-110'}
                     `}>
                      <i className={`fas ${item.icon} ${!sidebarOpen ? 'text-xl' : 'text-lg'}`}></i>
                    </div>

                    {sidebarOpen && (
                      <span className="whitespace-nowrap flex-1">{item.label}</span>
                    )}

                    {/* Active Indicator Dot for Collapsed State */}
                    {!sidebarOpen && location.pathname === item.path && (
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                    )}

                    {location.pathname === item.path && sidebarOpen && (
                      <i className="fas fa-chevron-right text-xs opacity-50"></i>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!sidebarOpen && !isMobile && (
                      <div className="absolute left-full ml-4 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/10 shadow-xl translate-x-[-10px] group-hover:translate-x-0 transition-transform">
                        {item.label}
                        {/* Arrow */}
                        <div className="absolute top-1/2 right-100 -translate-y-1/2 border-8 border-transparent border-r-slate-800"></div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-xl">
          <div className={`flex items-center ${sidebarOpen ? 'gap-4' : 'justify-center flex-col gap-4'}`}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-white border border-white/10 overflow-hidden">
                {/* Placeholder Avatar or Initials */}
                <span className="font-bold text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>

            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors mt-1 flex items-center gap-1">
                  <i className="fas fa-sign-out-alt"></i> Sign Out
                </button>
              </div>
            )}

            {!sidebarOpen && (
              <button onClick={handleLogout} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 flex items-center justify-center transition-colors" title="Logout">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content & Mobile Header */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        {/* Mobile Header Stick */}
        {isMobile && !sidebarOpen && (
          <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white active:scale-95 transition-transform">
                <i className="fas fa-bars"></i>
              </button>
              <div>
                <h1 className="text-lg font-bold text-white font-display border-white/10">{settings.appearance.siteName}</h1>
                <p className="text-xs text-primary font-bold tracking-wide uppercase">Admin</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-slate-900 font-bold shadow-lg">
              {user?.name?.charAt(0)}
            </div>
          </header>
        )}

        {/* Desktop Toggle Button (when collapsed and not mobile) */}
        {!isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-6 left-6 z-40 w-10 h-10 rounded-xl bg-slate-800 text-white border border-white/10 hover:bg-slate-700 hover:scale-105 transition-all shadow-lg flex items-center justify-center"
            title="Expand Sidebar"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        )}

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 scroll-smooth">
          <div className={`max-w-7xl mx-auto transition-all duration-300 ${!sidebarOpen && !isMobile ? 'pl-8' : ''}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
