import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { loginUser, registerUser } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
        let result;
        if (isLoginMode) {
            result = loginUser(email, password);
        } else {
            if (!name) {
                setError("Name is required");
                setIsLoading(false);
                return;
            }
            result = registerUser(name, email, password);
        }

        if (result.success && result.user) {
            onLogin(result.user);
            setEmail('');
            setPassword('');
            setName('');
            onClose();
        } else {
            setError(result.message || "An error occurred");
        }
        setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-stone-100">
          <h2 className="text-xl font-serif font-bold text-stone-900">
             {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              {!isLoginMode && (
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-4 w-4 text-stone-400" />
                        </div>
                        <input
                            type="text"
                            required={!isLoginMode}
                            className="block w-full pl-10 rounded-lg border-stone-300 shadow-sm focus:border-stone-900 focus:ring-stone-900 sm:text-sm py-2.5 border"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-stone-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 rounded-lg border-stone-300 shadow-sm focus:border-stone-900 focus:ring-stone-900 sm:text-sm py-2.5 border"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-stone-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 rounded-lg border-stone-300 shadow-sm focus:border-stone-900 focus:ring-stone-900 sm:text-sm py-2.5 border"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-70 transition-all"
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                      <>
                        {isLoginMode ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
                      </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-stone-500">
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }} className="font-semibold text-stone-900 hover:underline">
                        {isLoginMode ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};