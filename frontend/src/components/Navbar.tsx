import React, { useState, useRef, useEffect } from 'react';
import images from '../assets/';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../store/api/authApi';
import { ChevronDown, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Check authentication status
  const token = localStorage.getItem('token');

  const { data: profileData} = useGetProfileQuery(undefined, {
    skip: !token
  });

  console.log(profileData)

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
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-xl bg-slate-900/40 shadow-lg border-b border-b-gray-700">

      {/* Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
        <img src={images.logo} alt="SenTriq" className="h-10 w-10" />
        <span className="text-2xl font-extrabold text-white tracking-wide">SenTriq</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <button
          onClick={() => navigate('/')}
          className="text-white cursor-pointer hover:text-[#A3E635] font-medium transition-colors"
        >
          Home
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
              className="text-white cursor-pointer hover:text-[#A3E635] font-medium transition-colors"
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

      {/* Mobile Hamburger */}
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

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-md rounded-l-3xl transform transition-transform duration-500 z-40 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col p-8 space-y-4 mt-16">
          <button
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }}
            className="w-full text-left text-white text-lg font-semibold px-4 py-3 rounded-xl backdrop-blur-md bg-green-500/20 hover:bg-green-500/40 hover:shadow-lg transition-all duration-300"
          >
            Home
          </button>

          {/* Mobile Features */}
          <div className="space-y-2">
            <div className="text-white text-lg font-semibold px-4 py-2">Features</div>
            {features.map((feature) => (
              <button
                key={feature.name}
                onClick={() => handleFeatureClick(feature.path)}
                className="w-full text-left text-gray-300 px-6 py-2 rounded-lg hover:bg-green-500/20 transition-all duration-300"
              >
                <div className="font-medium">{feature.name}</div>
                <div className="text-sm text-gray-400">{feature.description}</div>
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left text-white text-lg font-semibold px-4 py-3 rounded-xl backdrop-blur-md bg-green-500/20 hover:bg-green-500/40 hover:shadow-lg transition-all duration-300"
              >
                Dashboard
              </button>

              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-white text-lg font-semibold px-4 py-3 rounded-xl backdrop-blur-md bg-red-500/20 hover:bg-red-500/40 hover:shadow-lg transition-all duration-300"
                >
                  Admin Panel
                </button>
              )}

              <div className="border-t border-gray-600 pt-4">
                <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#A3E635] to-[#146536] text-black font-bold rounded-full">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </div>
                  <div>
                    <div className="text-white font-medium">{user?.name}</div>
                    <div className="text-gray-400 text-sm">{user?.email}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-white px-4 py-2 rounded-lg hover:bg-green-500/20 transition-all duration-300 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate('/register');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left text-black text-lg font-semibold px-4 py-3 rounded-xl backdrop-blur-md bg-[#A3E635]/80 hover:bg-[#A3E635] hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </button>
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left text-white text-lg font-semibold px-4 py-3 rounded-xl backdrop-blur-md bg-slate-800/80 hover:bg-slate-700 hover:shadow-lg transition-all duration-300"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
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
