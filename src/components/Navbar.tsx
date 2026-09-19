import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, Menu, X, ChevronDown, User, LayoutDashboard, 
  Settings, LogOut, Disc as DiscordIcon, ShieldAlert, Sparkles, ExternalLink 
} from 'lucide-react';
import { Logo } from './Logo.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
}) => {
  const { user, profile, unreadNotificationsCount, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'auctions', label: 'Auctions' },
    { id: 'community', label: 'Community' },
    { id: 'developers', label: 'Developers' },
    { id: 'challenges', label: 'Challenges' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#242424] bg-[#070707]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: TradeForge Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center focus:outline-none transition-transform active:scale-95"
            >
              <Logo size="md" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = currentRoute === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'text-white bg-[#141414] border border-[#2E2E2E] shadow-sm'
                        : 'text-[#999999] hover:text-white hover:bg-[#0D0D0D]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-2.5">
            {/* Search Button (triggers Ctrl + K) */}
            <button
              id="nav-search-button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0D0D] hover:bg-[#141414] border border-[#242424] text-xs text-[#999999] hover:text-white transition-colors"
              title="Search TradeForge (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#181818] rounded border border-[#282828] text-neutral-400">
                ⌘K
              </kbd>
            </button>

            {/* Discord Link */}
            <button
              onClick={() => onNavigate('discord')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                currentRoute === 'discord'
                  ? 'bg-[#5865F2]/20 border-[#5865F2]/50 text-white'
                  : 'bg-[#0D0D0D] border-[#242424] text-[#999999] hover:text-white hover:border-[#5865F2]/40'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span className="hidden sm:inline">Discord</span>
            </button>

            {/* Auth States */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Notifications Icon Button */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 rounded-lg bg-[#0D0D0D] hover:bg-[#141414] border border-[#242424] text-[#999999] hover:text-white transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3D00] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Dashboard Quick Link */}
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    currentRoute === 'dashboard'
                      ? 'bg-[#FF6A00]/15 border-[#FF6A00]/40 text-[#FF6A00]'
                      : 'bg-[#0D0D0D] border-[#242424] text-[#999999] hover:text-white hover:border-[#383838]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#FF6A00]" />
                  <span>Dashboard</span>
                </button>

                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-[#0D0D0D] hover:bg-[#141414] border border-[#242424] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#1F1F1F] border border-[#333] flex items-center justify-center font-bold text-[11px] text-[#FF6A00] overflow-hidden">
                      {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        user.username[0]?.toUpperCase()
                      )}
                    </div>
                    <span className="text-xs font-medium text-white max-w-[90px] truncate hidden sm:inline">
                      {user.displayName || user.username}
                    </span>
                    <ChevronDown className="w-3 h-3 text-[#999999]" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#0D0D0D] border border-[#242424] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2 border-b border-[#1E1E1E]">
                        <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                        <p className="text-[11px] font-mono text-[#999999] truncate">@{user.username}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('profile', user.username);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-[#161616] flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-[#FF6A00]" />
                        My Public Profile
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('dashboard');
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-[#161616] flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#FF6A00]" />
                        Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('settings');
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-[#161616] flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5 text-neutral-400" />
                        Settings
                      </button>

                      <div className="my-1 border-t border-[#1E1E1E]"></div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                          onNavigate('home');
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-red-400 hover:text-red-300 hover:bg-[#161616] flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-white hover:text-[#FF6A00] transition-colors"
                >
                  Login
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white hover:opacity-90 active:scale-95 transition-all shadow-sm shadow-[#FF6A00]/30"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-[#0D0D0D] border border-[#242424] text-[#999999] hover:text-white ml-1"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0D0D0D] border-b border-[#242424] px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'text-[#FF6A00] bg-[#141414]'
                    : 'text-[#999999] hover:text-white hover:bg-[#141414]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          {user && (
            <div className="pt-3 border-t border-[#1F1F1F] space-y-1">
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-[#141414] flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-[#FF6A00]" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigate('profile', user.username);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-[#141414] flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#FF6A00]" />
                My Profile
              </button>
              <button
                onClick={() => {
                  onNavigate('settings');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-[#141414] flex items-center gap-2"
              >
                <Settings className="w-4 h-4 text-[#999999]" />
                Settings
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
