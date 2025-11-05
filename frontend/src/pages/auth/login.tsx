import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation, type LoginRequest } from '../../store/api/authApi';
import { toastService } from '../../utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await loginMutation(formData).unwrap();
      if (result.success) {
        // Store token in localStorage
        localStorage.setItem('token', result.token);
        toastService.success('Login successful!');
        navigate('/');
      }
    } catch (error: unknown) {
      const apiError = error as { data?: { error?: string } };
      toastService.error(apiError?.data?.error || 'Login failed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex bg-[#0A191F]">
      {/* Left Side - Privacy Animation */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364]">
        <div className="text-center text-white z-10 relative">
          {/* Privacy Animation */}
          <div className="mb-12 relative">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-lg border-2 border-white/20 animate-bounce">
                <div className="w-20 h-20 bg-gradient-to-br from-[#000000] to-[#434343] rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#a2e535]">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                  </svg>
                </div>
              </div>
              {/* Pulse rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full animate-ping"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full animate-ping animation-delay-500"></div>
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-shadow">Welcome Back</h1>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Sign in to your secure account and continue your journey with complete privacy and protection.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-2xl">⚡</div>
                <span className="font-medium">Lightning fast access</span>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-2xl">🔒</div>
                <span className="font-medium">Bank-level security</span>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-2xl">🌟</div>
                <span className="font-medium">Premium experience</span>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 text-3xl opacity-30 animate-pulse">🔑</div>
            <div className="absolute top-3/4 right-1/4 text-3xl opacity-30 animate-pulse animation-delay-1000">🛡️</div>
            <div className="absolute bottom-1/4 left-1/3 text-3xl opacity-30 animate-pulse animation-delay-2000">⚡</div>
            <div className="absolute top-1/3 right-1/3 text-3xl opacity-30 animate-pulse animation-delay-1500">✨</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0A191F]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-gray-400">Access your secure account</p>
          </div>



          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#a2e535] focus:ring-2 focus:ring-[#a2e535]/20 transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
                    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#a2e535] focus:ring-2 focus:ring-[#a2e535]/20 transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
                    <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#a2e535] transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    {showPassword ? (
                      <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,5A5,5 0 0,1 17,10C17,10.64 16.87,11.26 16.64,11.82L19.57,14.75C21.07,13.5 22.27,11.8 23,10C21.27,5.61 17,2.5 12,2.5C10.6,2.5 9.26,2.75 8,3.21L10.17,5.38C10.74,5.13 11.35,5 12,5Z" />
                    ) : (
                      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="sr-only" />
                <div className="w-4 h-4 border-2 border-gray-600 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#a2e535] rounded-sm opacity-0 transition-opacity"></div>
                </div>
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#a2e535] hover:text-[#7dd321] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoginLoading}
              className="w-full bg-gradient-to-r from-[#a2e535] to-[#7dd321] text-black font-semibold py-3 px-6 rounded-xl hover:from-[#7dd321] hover:to-[#a2e535] transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-[#a2e535]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-h-[48px]"
            >
              {isLoginLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400">
              Don't have an account? <Link to="/register" className="text-[#a2e535] hover:text-[#7dd321] font-semibold transition-colors">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;