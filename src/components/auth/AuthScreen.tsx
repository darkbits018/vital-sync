import React, { useState } from 'react';
import { Heart, Zap } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { useAuth } from '../../hooks/useAuth';
import { AuthService } from '../../services/authService';

type AuthMode = 'login' | 'register' | 'forgot-password';

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const { login, register, isLoading, error, clearError } = useAuth();

  const handleModeChange = (newMode: AuthMode) => {
    clearError();
    setMode(newMode);
  };

  const handleForgotPassword = async (data: { email: string }) => {
    try {
      await AuthService.requestPasswordReset(data);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

      <div className="relative z-10 w-full max-w-md">
        {/* App Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">VitalSync</h1>
          <p className="text-purple-200">Your AI-powered fitness companion</p>
        </div>

        {/* Auth Forms */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
          {mode === 'login' && (
            <LoginForm
              onSubmit={login}
              onSwitchToRegister={() => handleModeChange('register')}
              onForgotPassword={() => handleModeChange('forgot-password')}
              isLoading={isLoading}
              error={error}
            />
          )}

          {mode === 'register' && (
            <RegisterForm
              onSubmit={register}
              onSwitchToLogin={() => handleModeChange('login')}
              isLoading={isLoading}
              error={error}
            />
          )}

          {mode === 'forgot-password' && (
            <ForgotPasswordForm
              onSubmit={handleForgotPassword}
              onBack={() => handleModeChange('login')}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-2 text-purple-200 text-sm">
            <Zap size={16} />
            <span>Powered by Bolt.new</span>
          </div>
          <p className="text-purple-300 text-xs mt-2">
            Secure authentication • Privacy protected
          </p>
        </div>
      </div>
    </div>
  );
}