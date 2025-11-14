import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation, type RegisterRequest } from '../../store/api/authApi';
import { toastService } from '../../utils/toast';

const Register = () => {
  const navigate = useNavigate();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toastService.error('Passwords do not match');
      return;
    }

    try {
      const result = await registerMutation(formData).unwrap();
      if (result.success) {
        localStorage.setItem('token', result.token);
        toastService.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      const apiError = error as { data?: { error?: string } };
      toastService.error(apiError?.data?.error || 'Registration failed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0A191F]">

      {/* LEFT SIDE (Hides on mobile, shows on md+) */}
      <div className="hidden md:flex flex-1 items-center justify-center p-8 relative overflow-hidden
        bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364]">
        
        <div className="text-center text-white z-10 relative max-w-md px-4">
          
          {/* Animation Icon */}
          <div className="mb-10 flex justify-center">
            <div className="relative inline-block">
              <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center 
                backdrop-blur-lg border-2 border-white/20 animate-bounce">
                <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#a2e535]">
                    {/* Security Icon Path (Corrected for display) */}
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,17.4 15.4,18 14.8,18H9.2C8.6,18 8,17.4 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7Z" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"></div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">Your Privacy Matters</h1>
          <p className="text-base mb-6 opacity-90 leading-relaxed">
            Join thousands of users who trust our advanced security with their data.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-xl">🔒</div>
              <span>End-to-end encryption</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-xl">🛡️</div>
              <span>Zero data tracking</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-xl">🔐</div>
              <span>Secure authentication</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM (Always Visible) */}
      {/* Increased padding for smaller screens for better spacing */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-6">
            {/* Adjusted font size for mobile slightly using sm:text-4xl */}
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 text-sm mt-1">
              Join us today and experience secure communication
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700
                  rounded-xl text-white placeholder-gray-400 focus:border-[#a2e535]
                  focus:ring-2 focus:ring-[#a2e535]/20"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {/* User Icon Path - Placeholder */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
                    <path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700
                  rounded-xl text-white placeholder-gray-400 focus:border-[#a2e535]
                  focus:ring-2 focus:ring-[#a2e535]/20"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {/* Email Icon Path - Placeholder */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create password"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700
                  rounded-xl text-white placeholder-gray-400 focus:border-[#a2e535]
                  focus:ring-2 focus:ring-[#a2e535]/20"
                />
                {/* Lock Icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
                    </svg>
                </div>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2
                  text-gray-400 p-1" // Added padding to button for easy clicking
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {/* Eye Icon */}
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
                        <path d="M12 4.5c5.3 0 9.77 3.93 11.53 9.47-.53 1.4-1.3 2.68-2.26 3.82L19.4 16.2c.4-.9.7-1.8.8-2.8-.7-2.6-2.9-4.5-5.5-4.5s-4.8 1.9-5.5 4.5c.1 1 .4 1.9.8 2.8l-1.4 1.5c-.94-1.14-1.71-2.42-2.26-3.82C2.73 8.43 7.19 4.5 12 4.5zm0 14c-4.97 0-9.04-3.6-11.43-8.5C3.36 7.63 7.43 4 12 4c4.97 0 9.04 3.6 11.43 8.5-2.39 4.9-6.46 8.5-11.43 8.5zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
                        <path d="M12 6c-3.1 0-5.7 2.1-6.5 5.1-.3.9-.5 1.8-.5 2.7 0 2.8 1.9 5.1 4.5 5.7.5.1 1 .2 1.5.2 2.7 0 5-1.9 5.6-4.5.2-1.1-.1-2.2-.7-3.2L16.2 16c.1-.4.2-.7.2-1.1 0-2.6-2.2-4.7-4.8-4.7s-4.8 2.1-4.8 4.7c0 1.7.9 3.2 2.2 4.1L5.6 20.3C3.6 18.7 2 16.5 2 14c0-3.3 2.1-6.2 5-7.3V6c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v1.7c2.9 1.1 5 4 5 7.3 0 2.5-1.6 4.7-3.6 6.3L22 18.8c.8-.7 1.3-1.6 1.7-2.7C21.7 8.3 17.4 4 12 4c-3.1 0-5.7 2.1-6.5 5.1-.3.9-.5 1.8-.5 2.7 0 2.8 1.9 5.1 4.5 5.7.5.1 1 .2 1.5.2 2.7 0 5-1.9 5.6-4.5.2-1.1-.1-2.2-.7-3.2L16.2 16c.1-.4.2-.7.2-1.1 0-2.6-2.2-4.7-4.8-4.7s-4.8 2.1-4.8 4.7c0 1.7.9 3.2 2.2 4.1L5.6 20.3C3.6 18.7 2 16.5 2 14c0-3.3 2.1-6.2 5-7.3V6c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v1.7c2.9 1.1 5 4 5 7.3 0 2.5-1.6 4.7-3.6 6.3L22 18.8c.8-.7 1.3-1.6 1.7-2.7C21.7 8.3 17.4 4 12 4z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (Similar structure to Password) */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700
                  rounded-xl text-white placeholder-gray-400 focus:border-[#a2e535]
                  focus:ring-2 focus:ring-[#a2e535]/20"
                />
                {/* Lock Icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
                    </svg>
                </div>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2
                  text-gray-400 p-1" // Added padding to button for easy clicking
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {/* Eye Icon */}
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
                        <path d="M12 4.5c5.3 0 9.77 3.93 11.53 9.47-.53 1.4-1.3 2.68-2.26 3.82L19.4 16.2c.4-.9.7-1.8.8-2.8-.7-2.6-2.9-4.5-5.5-4.5s-4.8 1.9-5.5 4.5c.1 1 .4 1.9.8 2.8l-1.4 1.5c-.94-1.14-1.71-2.42-2.26-3.82C2.73 8.43 7.19 4.5 12 4.5zm0 14c-4.97 0-9.04-3.6-11.43-8.5C3.36 7.63 7.43 4 12 4c4.97 0 9.04 3.6 11.43 8.5-2.39 4.9-6.46 8.5-11.43 8.5zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
                        <path d="M12 6c-3.1 0-5.7 2.1-6.5 5.1-.3.9-.5 1.8-.5 2.7 0 2.8 1.9 5.1 4.5 5.7.5.1 1 .2 1.5.2 2.7 0 5-1.9 5.6-4.5.2-1.1-.1-2.2-.7-3.2L16.2 16c.1-.4.2-.7.2-1.1 0-2.6-2.2-4.7-4.8-4.7s-4.8 2.1-4.8 4.7c0 1.7.9 3.2 2.2 4.1L5.6 20.3C3.6 18.7 2 16.5 2 14c0-3.3 2.1-6.2 5-7.3V6c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v1.7c2.9 1.1 5 4 5 7.3 0 2.5-1.6 4.7-3.6 6.3L22 18.8c.8-.7 1.3-1.6 1.7-2.7C21.7 8.3 17.4 4 12 4c-3.1 0-5.7 2.1-6.5 5.1-.3.9-.5 1.8-.5 2.7 0 2.8 1.9 5.1 4.5 5.7.5.1 1 .2 1.5.2 2.7 0 5-1.9 5.6-4.5.2-1.1-.1-2.2-.7-3.2L16.2 16c.1-.4.2-.7.2-1.1 0-2.6-2.2-4.7-4.8-4.7s-4.8 2.1-4.8 4.7c0 1.7.9 3.2 2.2 4.1L5.6 20.3C3.6 18.7 2 16.5 2 14c0-3.3 2.1-6.2 5-7.3V6c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v1.7c2.9 1.1 5 4 5 7.3 0 2.5-1.6 4.7-3.6 6.3L22 18.8c.8-.7 1.3-1.6 1.7-2.7C21.7 8.3 17.4 4 12 4z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegisterLoading}
              className="w-full bg-gradient-to-r from-[#a2e535] to-[#7dd321]
              text-black font-semibold py-3 rounded-xl shadow-md
              hover:opacity-90 transition disabled:opacity-60"
            >
              {isRegisterLoading ? "Loading..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#a2e535] font-semibold hover:text-[#c7ff4d]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;