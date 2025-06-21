import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { PasswordResetRequest } from '../../types/auth';

interface ForgotPasswordFormProps {
  onSubmit: (data: PasswordResetRequest) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export function ForgotPasswordForm({ 
  onSubmit, 
  onBack, 
  isLoading, 
  error 
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) return;

    try {
      await onSubmit({ email });
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by parent component
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
          <p className="text-purple-200">
            We've sent password reset instructions to{' '}
            <span className="text-white font-medium">{email}</span>
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h3 className="text-white font-medium mb-3">What's next?</h3>
          <div className="text-purple-200 text-sm space-y-2 text-left">
            <p>1. Check your email inbox (and spam folder)</p>
            <p>2. Click the reset link in the email</p>
            <p>3. Create a new password</p>
            <p>4. Sign in with your new password</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back to Sign In</span>
          </button>

          <button
            onClick={() => setIsSubmitted(false)}
            className="text-purple-200 hover:text-white text-sm transition-colors"
          >
            Didn't receive the email? Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-purple-200">
          Enter your email address and we'll send you instructions to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 transition-all duration-200 ${
                emailError 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-white/20 focus:ring-purple-500'
              }`}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
          </div>
          {emailError && (
            <p className="text-red-400 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
          <p className="text-blue-200 text-sm">
            <strong>Note:</strong> This is a demo app. In a real application, 
            you would receive an actual email with reset instructions.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            isLoading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Send Reset Instructions</span>
            </>
          )}
        </button>

        {/* Back to Login */}
        <button
          type="button"
          onClick={onBack}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-200"
          disabled={isLoading}
        >
          <ArrowLeft size={20} />
          <span>Back to Sign In</span>
        </button>
      </form>
    </div>
  );
}