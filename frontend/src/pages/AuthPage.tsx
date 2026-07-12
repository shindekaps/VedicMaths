import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { MandalaDecor } from '../components/MandalaDecor';

interface AuthPageProps {
  onSuccess: () => void;
}

type AuthMode = 'login' | 'signup';

export const AuthPage = ({ onSuccess }: AuthPageProps) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { login, signup, googleLogin, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) onSuccess();
  }, [isAuthenticated, onSuccess]);

  useEffect(() => {
    clearError();
    setValidationError('');
  }, [mode, clearError]);

  const validate = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setValidationError('Email and password are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }
    if (mode === 'signup') {
      if (!name.trim()) {
        setValidationError('Name is required');
        return false;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return false;
      }
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'login') {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel (Desktop only) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden bg-gradient-to-br from-violet-900 via-[#4C1D95] to-navy flex-col items-center justify-center p-12">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 animate-float opacity-20">
          <MandalaDecor size={180} opacity={0.3} color="#a78bfa" />
        </div>
        <div className="absolute bottom-16 right-10 animate-float opacity-15" style={{ animationDelay: '3s' }}>
          <MandalaDecor size={140} opacity={0.25} color="#FF6B35" />
        </div>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 animate-spin-slow opacity-10">
          <MandalaDecor size={300} opacity={0.12} color="#FFD700" />
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-saffron/15 rounded-full blur-[60px]" />

        {/* Branding content */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="w-20 h-20 mx-auto mb-8 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-5xl border border-white/20 shadow-glow">
            🕉️
          </div>
          <h1 className="font-serif text-5xl font-black text-white mb-4 tracking-tight">
            VedicPath
          </h1>
          <p className="text-violet-200 text-lg max-w-xs mx-auto leading-relaxed">
            Master the ancient art of Vedic Mathematics through interactive learning
          </p>

          {/* Feature pills */}
          <div className="mt-10 flex flex-col gap-3">
            {[
              { icon: '🧮', text: '16 Vedic Sutras' },
              { icon: '🎯', text: 'Adaptive Practice' },
              { icon: '🏆', text: 'Gamified Learning' },
            ].map((f, i) => (
              <motion.div
                key={f.text}
                className="flex items-center gap-3 bg-white/8 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
              >
                <span className="text-xl">{f.icon}</span>
                <span className="text-white/80 font-medium text-sm">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-bg relative overflow-hidden">
        {/* Subtle background decoration on mobile */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-56 bg-gradient-to-b from-violet-600/5 to-transparent" />
        <div className="lg:hidden absolute -top-10 -right-10 opacity-[0.03]">
          <MandalaDecor size={200} opacity={1} color="#7C3AED" />
        </div>

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-violet to-violet-700 rounded-2xl flex items-center justify-center text-2xl shadow-glow">
              🕉️
            </div>
            <h1 className="font-serif text-2xl font-black text-ink">VedicPath</h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-ink font-serif">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sub mt-2">
              {mode === 'login'
                ? 'Sign in to continue your learning journey'
                : 'Start your Vedic Mathematics journey today'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-8">
            {(['login', 'signup'] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  mode === m
                    ? 'bg-white text-violet shadow-md'
                    : 'text-sub hover:text-ink'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-ink mb-2">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sub text-lg">👤</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-ink placeholder:text-gray-300 focus:outline-none focus:border-violet focus:ring-4 focus:ring-violet/10 transition-all duration-200"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sub text-lg">✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-ink placeholder:text-gray-300 focus:outline-none focus:border-violet focus:ring-4 focus:ring-violet/10 transition-all duration-200"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sub text-lg">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-ink placeholder:text-gray-300 focus:outline-none focus:border-violet focus:ring-4 focus:ring-violet/10 transition-all duration-200"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sub hover:text-ink transition-colors text-sm"
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="confirm-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-ink mb-2">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sub text-lg">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-ink placeholder:text-gray-300 focus:outline-none focus:border-violet focus:ring-4 focus:ring-violet/10 transition-all duration-200"
                      autoComplete="new-password"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error display */}
            <AnimatePresence>
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3"
                >
                  <span>⚠️</span>
                  <span>{displayError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-violet font-semibold hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-violet to-violet-700 text-white rounded-2xl font-bold text-base hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-sub font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google login */}
          <button
            type="button"
            onClick={googleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-semibold text-ink hover:border-gray-200 hover:shadow-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-sub mt-8">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-violet font-bold hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
