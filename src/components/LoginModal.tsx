'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, Loader2, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import { login } from '../../lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ModalView = 'login' | 'forgotEmail' | 'forgotOTP' | 'forgotSuccess';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToPrompt?: () => void;
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onBackToPrompt,
  onSwitchToRegister,
  onLoginSuccess,
}: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [view, setView] = useState<ModalView>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const resetForgotState = () => {
    setView('login');
    setForgotEmail('');
    setOtp('');
    setForgotError('');
    setForgotLoading(false);
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);

      if (!data || data.message === 'Please check the credentials') {
        setError('Invalid email or password. Please try again.');
        return;
      }

      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (data.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

      onClose();
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    resetForgotState();
    onClose();
  };

  // Step 1: Check if email exists, then send OTP via backend
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');

    try {
      // First check if email exists
      const checkRes = await fetch(`${API_URL}/api/users/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (checkRes.status === 404) {
        setForgotError('This email is not found.');
        return;
      }

      if (checkRes.ok) {
        // Email exists — call get-credentials to send OTP via email
        const otpRes = await fetch(`${API_URL}/api/users/get-credentials`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail }),
        });

        if (otpRes.ok) {
          const data = await otpRes.json();
          // Store the OTP returned by backend
          localStorage.setItem('forgot_otp', data.otp);
          setView('forgotOTP');
        } else {
          setForgotError('Failed to send OTP. Please try again.');
        }
      }
    } catch (err) {
      setForgotError('Something went wrong. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP entered by user
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const storedOtp = localStorage.getItem('forgot_otp');
    if (otp !== storedOtp) {
      setForgotError('Invalid OTP. Please try again.');
      return;
    }

    setForgotLoading(true);

    try {
      // OTP matched — send password to user's email
      const res = await fetch(`${API_URL}/api/users/send-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (res.ok) {
        localStorage.removeItem('forgot_otp');
        setSuccessMessage('Your password has been sent to your email!');
        setView('forgotSuccess');
      } else {
        setForgotError('Failed to send password. Please try again.');
      }
    } catch (err) {
      setForgotError('Something went wrong. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleBackToLogin = () => {
    resetForgotState();
  };

  // Header title based on current view
  const getHeaderTitle = () => {
    switch (view) {
      case 'login': return 'Sign In';
      case 'forgotEmail': return 'Forgot Password';
      case 'forgotOTP': return 'Verify OTP';
      case 'forgotSuccess': return 'Verified!';
    }
  };

  // Back button handler based on view
  const getBackHandler = () => {
    switch (view) {
      case 'login': return onBackToPrompt;
      case 'forgotEmail': return handleBackToLogin;
      case 'forgotOTP': return () => { setView('forgotEmail'); setOtp(''); setForgotError(''); };
      case 'forgotSuccess': return undefined;
    }
  };

  const backHandler = getBackHandler();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {backHandler ? (
            <button
              onClick={backHandler}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="w-7" />
          )}
          <h2 className="text-lg font-semibold text-gray-900">{getHeaderTitle()}</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ============ LOGIN VIEW ============ */}
        {view === 'login' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Switch to Register */}
            {onSwitchToRegister && (
              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign up
                </button>
              </p>
            )}

            {/* Forgot Password */}
            <p className="text-center text-sm text-gray-600">
              Forgot password?{' '}
              <button
                type="button"
                onClick={() => { setError(''); setView('forgotEmail'); }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Click here
              </button>
            </p>
          </form>
        )}

        {/* ============ FORGOT EMAIL VIEW ============ */}
        {view === 'forgotEmail' && (
          <form onSubmit={handleCheckEmail} className="p-6 space-y-5">
            <p className="text-sm text-gray-600 text-center">
              Enter your registered email address and we&apos;ll send you a verification code.
            </p>

            {/* Email Field */}
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => { setForgotEmail(e.target.value); setForgotError(''); }}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Error Message */}
            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {forgotError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Checking...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        )}

        {/* ============ OTP VERIFICATION VIEW ============ */}
        {view === 'forgotOTP' && (
          <form onSubmit={handleVerifyOTP} className="p-6 space-y-5">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm text-center">
              OTP has been sent! 
              {/* Your OTP is: <span c//</div>lassName="font-bold">{generatedOtp}</span> */}
            </div>

            {/* OTP Field */}
            <div>
              <label
                htmlFor="forgot-otp"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Enter OTP
              </label>
              <div className="relative">
                <input
                  id="forgot-otp"
                  type="text"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value); setForgotError(''); }}
                  placeholder="Enter 7-digit OTP"
                  required
                  maxLength={7}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 tracking-widest text-center text-lg"
                />
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Error Message */}
            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {forgotError}
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        )}

        {/* ============ SUCCESS VIEW ============ */}
        {view === 'forgotSuccess' && (
          <div className="p-6 space-y-5 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <p className="text-lg font-semibold text-gray-900">{successMessage}</p>
            <p className="text-sm text-gray-600">
              You can now go back to the login screen and sign in.
            </p>

            {/* Go to Login Button */}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              Please go to the login screen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
