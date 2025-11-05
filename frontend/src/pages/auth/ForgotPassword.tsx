import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toastService } from '../../utils/toast';
import {
  useSendResetCodeMutation,
  useVerifyResetCodeMutation,
  useResetPasswordWithCodeMutation
} from '../../store/api/authApi';
import { ArrowLeft, Mail, Shield, Key, Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [sendResetCode, { isLoading: isSendingCode }] = useSendResetCodeMutation();
  const [verifyResetCode, { isLoading: isVerifyingCode }] = useVerifyResetCodeMutation();
  const [resetPasswordWithCode, { isLoading: isResettingPassword }] = useResetPasswordWithCodeMutation();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toastService.error('Please enter your email address');
      return;
    }

    try {
      const result = await sendResetCode({ email: email.trim() }).unwrap();
      toastService.success(result.message);
      setStep('code');
    } catch (error: any) {
      toastService.error(error?.data?.error || 'Failed to send verification code');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || code.length !== 6) {
      toastService.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      const result = await verifyResetCode({ email, code: code.trim() }).unwrap();
      toastService.success(result.message);
      setStep('password');
    } catch (error: any) {
      toastService.error(error?.data?.error || 'Invalid verification code');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toastService.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toastService.error('Passwords do not match');
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      toastService.error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    try {
      const result = await resetPasswordWithCode({
        email,
        code,
        password
      }).unwrap();

      // Store the token
      localStorage.setItem('token', result.token);

      toastService.success(result.message);
      navigate('/dashboard');
    } catch (error: any) {
      toastService.error(error?.data?.error || 'Failed to reset password');
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSendCode} className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Mail className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-400">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/20 transition-all"
          placeholder="Enter your email address"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSendingCode}
        className="w-full py-3 bg-gradient-to-r from-[#A3E635] via-[#8BC34A] to-[#146536] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#A3E635]/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSendingCode ? 'Sending Code...' : 'Send Verification Code'}
      </button>
    </form>
  );

  const renderCodeStep = () => (
    <form onSubmit={handleVerifyCode} className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Shield className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent mb-2">
          Enter Verification Code
        </h2>
        <p className="text-gray-400">
          We've sent a 6-digit verification code to <span className="text-[#A3E635]">{email}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Verification Code
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-center text-2xl font-mono tracking-widest placeholder-gray-400 focus:outline-none focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/20 transition-all"
          placeholder="000000"
          maxLength={6}
          required
        />
        <p className="text-sm text-gray-500 mt-2">
          Code expires in 10 minutes
        </p>
      </div>

      <button
        type="submit"
        disabled={isVerifyingCode || code.length !== 6}
        className="w-full py-3 bg-gradient-to-r from-[#A3E635] via-[#8BC34A] to-[#146536] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#A3E635]/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isVerifyingCode ? 'Verifying...' : 'Verify Code'}
      </button>

      <button
        type="button"
        onClick={() => setStep('email')}
        className="w-full py-2 text-[#A3E635] hover:text-[#8BC34A] transition-colors"
      >
        Didn't receive the code? Try again
      </button>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Key className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent mb-2">
          Create New Password
        </h2>
        <p className="text-gray-400">
          Enter your new password below
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/20 transition-all"
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/20 transition-all"
            placeholder="Confirm new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400 bg-gray-800/50 p-3 rounded-lg">
        <p className="font-medium text-gray-300 mb-1">Password requirements:</p>
        <ul className="space-y-1">
          <li className={password.length >= 6 ? 'text-green-400' : 'text-gray-400'}>
            • At least 6 characters long
          </li>
          <li className={/[A-Z]/.test(password) ? 'text-green-400' : 'text-gray-400'}>
            • One uppercase letter
          </li>
          <li className={/[a-z]/.test(password) ? 'text-green-400' : 'text-gray-400'}>
            • One lowercase letter
          </li>
          <li className={/\d/.test(password) ? 'text-green-400' : 'text-gray-400'}>
            • One number
          </li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={isResettingPassword}
        className="w-full py-3 bg-gradient-to-r from-[#A3E635] via-[#8BC34A] to-[#146536] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#A3E635]/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isResettingPassword ? 'Resetting Password...' : 'Reset Password'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#0A191F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          to="/login"
          className=" cursor-pointer inline-flex items-center text-[#A3E635] hover:text-[#8BC34A] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
          {step === 'email' && renderEmailStep()}
          {step === 'code' && renderCodeStep()}
          {step === 'password' && renderPasswordStep()}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-[#A3E635] hover:text-[#8BC34A] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;