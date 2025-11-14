import React, { useState, useRef, useEffect } from 'react';
import images from '../assets/';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../store/api/authApi';
import { ChevronDown, User, LogOut, Home, Grid, Users } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Check authentication status
  const token = localStorage.getItem('token');

  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !token
  });

  // Simple token-based authentication check
  const isAuthenticated = !!token;
  const user = profileData?.data;

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleFeatures = () => setIsFeaturesOpen(prev => !prev);
  const toggleProfile = () => setIsProfileOpen(prev => !prev);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setIsFeaturesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const features = [
    { name: 'Data Vault', path: '/data-vault', description: 'Secure password storage' },
    { name: 'Email Scan', path: '/email-checker', description: 'Check email breaches' },
    { name: 'App Tracker', path: '/apps-tracker', description: 'Monitor app security' },
    { name: 'Fake Data Generator', path: '/fake-data-generator', description: 'Generate test data' }
  ];

  const handleFeatureClick = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/register');
    }
    setIsFeaturesOpen(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-xl bg-slate-900/40 shadow-lg border-b border-b-gray-700">

      {/* Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
        <img src={images.logo} alt="SenTriq" className="h-10 w-10" />
        <span className="text-2xl font-extrabold text-white tracking-wide">SenTriq</span>
      </div>

      {/* Desktop Menu (NO CHANGES) */}
      <div className="hidden md:flex items-center space-x-6">
        <button
          onClick={() => navigate('/')}
          className="text-white cursor-pointer hover:text-[#A3E635] font-medium transition-colors"
        >
          Home
        </button>

        <button
          onClick={() => navigate('/blog')}
          className="text-white cursor-pointer hover:text-[#A3E635] font-medium transition-colors"
        >
          Blog
        </button>

        {/* Features Dropdown */}
        <div className="relative" ref={featuresRef}>
          <button
            onClick={toggleFeatures}
            className="flex items-center space-x-1 text-white cursor-pointer hover:text-[#A3E635] font-medium transition-colors"
          >
            <span>Features</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isFeaturesOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFeaturesOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600 py-2">
              {features.map((feature) => (
                <button
                  key={feature.name}
                  onClick={() => handleFeatureClick(feature.path)}
                  className="w-full text-left cursor-pointer px-4 py-3 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="text-white font-medium">{feature.name}</div>
                  <div className="text-gray-400 text-sm">{feature.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white border-[1px] border-[#A3E635] hover:bg-[#A3E635] rounded-md px-3 py-2 cursor-pointer hover:text-black font-medium transition-colors"
            >
              Dashboard
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="text-white cursor-pointer hover:text-[#A3E635] font-medium transition-colors"
              >
                Admin
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center cursor-pointer justify-center w-10 h-10 bg-gradient-to-r from-[#A3E635] to-[#146536] text-black font-bold rounded-full hover:shadow-lg transition-all"
              >
                {user?.name ? getInitials(user.name) : 'U'}
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600 py-2">
                  <div className="px-4 py-2 border-b border-gray-600">
                    <div className="text-white font-medium">{user?.name}</div>
                    <div className="text-gray-400 text-sm">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full cursor-pointer text-left px-4 py-2 text-white hover:bg-gray-700/50 transition-colors flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer text-left px-4 py-2 text-red-400 hover:bg-gray-700/50 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/register')}
              className="bg-[#A3E635] cursor-pointer text-black px-6 py-2 rounded-full font-semibold hover:bg-[#8BC34A] transition-all shadow-md"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-slate-800 text-white px-6 py-2 rounded-full font-semibold hover:bg-slate-700 transition-all shadow-md"
            >
              Login
            </button>
          </>
        )}
      </div>

      {/* Mobile Hamburger (NO CHANGES) */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className="flex flex-col justify-between w-8 h-6 focus:outline-none z-50"
        >
          <span className={`h-0.5 w-full bg-white rounded transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`h-0.5 w-full bg-white rounded transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`h-0.5 w-full bg-white rounded transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu (UPDATED - Scrollable) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-transparent transform transition-transform duration-300 z-40 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col p-4 space-y-4 mt-20 bg-[#001a05] rounded-l-xl h-[600px] overflow-y-auto pb-24">

          {/* Primary Navigation Buttons */}
          <button
            onClick={() => handleMobileNavigation('/')}
            className="w-full text-left text-white text-lg font-semibold px-4 py-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-all duration-200 flex items-center space-x-3"
          >
            <Home className="w-5 h-5 text-[#A3E635] " />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleMobileNavigation('/blog')}
            className="w-full text-left text-white text-lg font-semibold px-4 py-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-all duration-200 flex items-center space-x-3"
          >
            <Grid className="w-5 h-5 text-[#A3E635]" />
            <span>Blog</span>
          </button>

          {/* Mobile Features Section */}
          <div className="space-y-2 border-t border-b border-gray-700 py-3 mt-4">
            <div className="text-[#A3E635] text-sm font-bold px-4 pt-2 tracking-wider uppercase">Features</div>
            {features.map((feature) => (
              <button
                key={feature.name}
                onClick={() => handleFeatureClick(feature.path)}
                className="w-full text-left text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200"
              >
                <div className="font-medium text-white">{feature.name}</div>
                <div className="text-xs text-gray-400">{feature.description}</div>
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleMobileNavigation('/dashboard')}
                className="w-full text-left text-white text-lg font-semibold px-4 py-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-all duration-200 flex items-center space-x-3"
              >
                <Grid className="w-5 h-5 text-[#A3E635]" />
                <span>Dashboard</span>
              </button>

              {user?.role === 'admin' && (
                <button
                  onClick={() => handleMobileNavigation('/admin')}
                  className="w-full text-left text-white text-lg font-semibold px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-200 flex items-center space-x-3"
                >
                  <Users className="w-5 h-5 text-red-400" />
                  <span>Admin Panel</span>
                </button>
              )}

              {/* Mobile Profile Section */}
              <div className="border-t-2 border-gray-700 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#A3E635] to-[#146536] text-black font-bold rounded-full text-sm">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </div>
                  <div className="truncate">
                    <div className="text-white font-medium truncate">{user?.name}</div>
                    <div className="text-gray-400 text-sm truncate">{user?.email}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleMobileNavigation('/profile')}
                  className="w-full text-left text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center space-x-3"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all duration-200 flex items-center space-x-3 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Auth Buttons for Mobile */}
              <button
                onClick={() => handleMobileNavigation('/register')}
                className="w-full text-center text-black font-bold px-4 py-3 rounded-lg bg-[#A3E635] hover:bg-[#8BC34A] transition-all duration-200 mt-4"
              >
                Get Started
              </button>
              <button
                onClick={() => handleMobileNavigation('/login')}
                className="w-full text-center text-white font-bold px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all duration-200"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Overlay (NO CHANGES) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity"
          onClick={toggleMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;