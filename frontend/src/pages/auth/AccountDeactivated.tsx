import React from 'react';
import { useNavigate } from 'react-router-dom';
import images from '../../assets/';

const AccountDeactivated: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleContactSupport = () => {
    // You can add contact support logic here
    window.open('mailto:support@sentriq.com?subject=Account Reactivation Request', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a191f] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={images.logo} alt="SenTriq" className="h-12 w-12" />
            <span className="text-2xl font-extrabold text-white tracking-wide ml-3">SenTriq</span>
          </div>
        </div>

        {/* Deactivated Message Card */}
        <div className="bg-gray-800 rounded-lg border border-red-500/30 p-8 text-center">
          {/* Warning Icon */}
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">Account Deactivated</h1>

          {/* Message */}
          <div className="text-gray-300 mb-6 space-y-3">
            <p className="leading-relaxed">
              Your account has been temporarily deactivated by an administrator.
            </p>
            <p className="text-sm text-gray-400">
              This may be due to a policy violation or security concern. If you believe this is an error, please contact our support team.
            </p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 mb-6">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
            Account Inactive
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleContactSupport}
              className="w-full bg-[#A3E635] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#8BC34A] transition-colors"
            >
              Contact Support
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full bg-gray-700 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              For immediate assistance, email us at{' '}
              <a href="mailto:support@sentriq.com" className="text-[#A3E635] hover:text-[#8BC34A]">
                support@sentriq.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 SenTriq. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountDeactivated;