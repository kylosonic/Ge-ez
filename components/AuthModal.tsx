import React, { useState } from 'react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  
  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        role: 'customer',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff'
      };
      onLogin(mockUser);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate Admin Auth
    setTimeout(() => {
      if (adminEmail === 'admin@geezshirts.com' && adminPass === 'admin123') {
        const adminUser: User = {
          name: "Ge'ez Shirts Admin",
          email: 'admin@geezshirts.com',
          role: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff'
        };
        onLogin(adminUser);
        onClose();
      } else {
        setError('Invalid credentials. Try admin@geezshirts.com / admin123');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-stone-100">
          <h2 className="text-xl font-serif font-bold text-stone-900">Welcome to Ge'ez Shirts</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-stone-100">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'customer' ? 'text-stone-900 border-b-2 border-stone-900 bg-stone-50' : 'text-stone-500 hover:text-stone-700'}`}
            onClick={() => setActiveTab('customer')}
          >
            Customer
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'admin' ? 'text-stone-900 border-b-2 border-stone-900 bg-stone-50' : 'text-stone-500 hover:text-stone-700'}`}
            onClick={() => setActiveTab('admin')}
          >
            Store Manager
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'customer' ? (
            <div className="text-center space-y-6">
              <p className="text-stone-600">Sign in to save your order history and checkout faster.</p>
              
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium py-3 px-4 rounded-lg transition-all shadow-sm group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin text-stone-400" size={20} />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-stone-500">or</span>
                </div>
              </div>

              <div className="text-xs text-stone-400">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </div>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Admin Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-stone-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm py-2 border"
                    placeholder="admin@geezshirts.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
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
                    className="block w-full pl-10 rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm py-2 border"
                    placeholder="••••••••"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Login to Dashboard'}
                </button>
              </div>

              <div className="text-center">
                 <p className="text-xs text-stone-400">Use: <span className="font-mono">admin@geezshirts.com / admin123</span></p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};