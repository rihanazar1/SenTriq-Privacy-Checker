import React, { useState } from 'react';
import images from '../assets/';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const menuItems = ['Home', 'Features', 'Get Started', 'Login'];

  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-xl bg-slate-900/40 shadow-lg border-b border-b-gray-700">
      
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src={images.logo} alt="SenTriq" className="h-10 w-10" />
        <span className="text-2xl font-extrabold text-white tracking-wide">SenTriq</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <button onClick={() => navigate('/')} className="text-white cursor-pointer hover:text-[#9ee926] font-medium transition-colors" >Home</button>
        <button className="text-white cursor-pointer hover:text-[#9ee926] font-medium transition-colors">Features</button>
        <button className="bg-[#a2e535] cursor-pointer text-black px-6 py-2 rounded-full font-semibold hover:bg-[#c7e595] transition-all shadow-md">
          Get Started
        </button>
        <button className="bg-slate-800 text-white px-6 py-2 rounded-full font-semibold hover:bg-slate-700 transition-all shadow-md">
          Login
        </button>
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

      {/* Sliding Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64    rounded-l-3xl transform transition-transform duration-500 z-40 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-8 space-y-4">
          {menuItems.map((item, index) => (
            <button
              key={item}
              className="w-full text-left text-white text-lg font-semibold px-4 py-3 rounded-xl backdrop-blur-md bg-green-500/20 hover:bg-green-500/40 hover:shadow-lg transition-all duration-300"
              onClick={toggleMenu}
              style={{ transitionDelay: `${index * 50}ms` }} // subtle stagger effect
            >
              {item}
            </button>
          ))}
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
