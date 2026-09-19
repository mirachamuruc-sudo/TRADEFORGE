import React, { useState } from 'react';
import { Logo } from '../components/Logo.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Shield, KeyRound, Mail, User, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthViewProps {
  initialMode: 'login' | 'register' | 'forgot-password' | 'reset-password';
  onSuccess: () => void;
  onNavigate: (route: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode, onSuccess, onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>(initialMode);
  const { login, register } = useAuth();

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [robloxUsername, setRobloxUsername] = useState('');
  const [discordTag, setDiscordTag] = useState('');

  const [resetToken, setResetToken] = useState('demo-token-123');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(username, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Login failed.');
    } else {
      onSuccess();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await register({
      username,
      email,
      password,
      robloxUsername,
      discordTag,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Registration failed.');
    } else {
      onSuccess();
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);
      setInfoMessage(data.message || 'If an account exists, a reset link has been dispatched.');
    } catch {
      setLoading(false);
      setError('Failed to send reset instructions.');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok || !data.success) {
        setError(data.error || 'Password reset failed.');
      } else {
        setInfoMessage('Password reset successfully! You can now log in.');
        setTimeout(() => setMode('login'), 2000);
      }
    } catch {
      setLoading(false);
      setError('Network error resetting password.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glowing cyber effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6A00]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0D0D0D] border border-[#242424] rounded-2xl shadow-2xl p-7 relative z-10">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo />
          <p className="text-xs text-[#999999] mt-2 font-mono">
            {mode === 'login' && 'Sign in to access your TradeForge profile'}
            {mode === 'register' && 'Join the premier Roblox developer network'}
            {mode === 'forgot-password' && 'Recover your TradeForge credentials'}
            {mode === 'reset-password' && 'Enter your new account password'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
            {infoMessage}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Username or Email</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. NexusDeveloper"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#999999]">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-[11px] text-[#FF6A00] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs rounded-xl shadow-md shadow-[#FF6A00]/25 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="text-center pt-3 border-t border-[#1C1C1C] text-xs text-[#999999]">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#FF6A00] font-semibold hover:underline"
              >
                Register here
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1">Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="NexusDeveloper"
                className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@tradeforge.net"
                className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-[#999999] mb-1">Roblox User (optional)</label>
                <input
                  type="text"
                  value={robloxUsername}
                  onChange={(e) => setRobloxUsername(e.target.value)}
                  placeholder="Roblox_Handle"
                  className="w-full px-3 py-2 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#999999] mb-1">Discord Tag (optional)</label>
                <input
                  type="text"
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  placeholder="nexus#0001"
                  className="w-full px-3 py-2 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
            </div>

            <button
              id="auth-register-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs rounded-xl shadow-md shadow-[#FF6A00]/25 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <div className="text-center pt-3 border-t border-[#1C1C1C] text-xs text-[#999999]">
              Already a member?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#FF6A00] font-semibold hover:underline"
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot-password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs rounded-xl shadow-md shadow-[#FF6A00]/25 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Recovery Instructions'}
            </button>

            <div className="flex items-center justify-between pt-3 border-t border-[#1C1C1C] text-xs">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#999999] hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('reset-password')}
                className="text-[#FF6A00] hover:underline"
              >
                Have reset token?
              </button>
            </div>
          </form>
        )}

        {/* RESET PASSWORD */}
        {mode === 'reset-password' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Reset Token</label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste token from email"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs rounded-xl shadow-md shadow-[#FF6A00]/25 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Set New Password'}
            </button>

            <div className="text-center pt-3 border-t border-[#1C1C1C] text-xs">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#999999] hover:text-white flex items-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
