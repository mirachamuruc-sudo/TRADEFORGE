import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { GlobalSearchModal } from './components/GlobalSearchModal.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';

// Modals
import { CreateListingModal } from './components/modals/CreateListingModal.tsx';
import { CreateAuctionModal } from './components/modals/CreateAuctionModal.tsx';
import { CreateProjectModal } from './components/modals/CreateProjectModal.tsx';
import { CreatePostModal } from './components/modals/CreatePostModal.tsx';

// Views
import { HomeView } from './views/HomeView.tsx';
import { ExploreView } from './views/ExploreView.tsx';
import { MarketplaceView } from './views/MarketplaceView.tsx';
import { AuctionsView } from './views/AuctionsView.tsx';
import { CommunityView } from './views/CommunityView.tsx';
import { DevelopersView } from './views/DevelopersView.tsx';
import { ChallengesView } from './views/ChallengesView.tsx';
import { DiscordView } from './views/DiscordView.tsx';
import { AuthView } from './views/AuthView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { DashboardView } from './views/DashboardView.tsx';

export function AppContent() {
  // Routing state
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string>('');

  // Modal open states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isCreateAuctionOpen, setIsCreateAuctionOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setCurrentRoute('home');
        setRouteParam('');
        return;
      }
      const parts = hash.split('/');
      setCurrentRoute(parts[0] || 'home');
      setRouteParam(parts[1] || '');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string, param: string = '') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (param) {
      window.location.hash = `#/${route}/${param}`;
    } else {
      window.location.hash = `#/${route}`;
    }
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#070707] text-[#FFFFFF] selection:bg-[#FF6A00]/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomeView
            onNavigate={navigate}
            onOpenCreateListing={() => setIsCreateListingOpen(true)}
          />
        )}

        {currentRoute === 'explore' && (
          <ExploreView
            onOpenCreateProject={() => setIsCreateProjectOpen(true)}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'marketplace' && (
          <MarketplaceView
            onOpenCreateListing={() => setIsCreateListingOpen(true)}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'auctions' && (
          <AuctionsView
            onOpenCreateAuction={() => setIsCreateAuctionOpen(true)}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'community' && (
          <CommunityView
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'developers' && (
          <DevelopersView onNavigate={navigate} />
        )}

        {currentRoute === 'challenges' && (
          <ChallengesView onNavigate={navigate} />
        )}

        {currentRoute === 'discord' && (
          <DiscordView onNavigate={navigate} />
        )}

        {/* Auth routes */}
        {currentRoute === 'login' && (
          <AuthView
            initialMode="login"
            onSuccess={() => navigate('dashboard')}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'register' && (
          <AuthView
            initialMode="register"
            onSuccess={() => navigate('dashboard')}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'forgot-password' && (
          <AuthView
            initialMode="forgot-password"
            onSuccess={() => navigate('login')}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'reset-password' && (
          <AuthView
            initialMode="reset-password"
            onSuccess={() => navigate('login')}
            onNavigate={navigate}
          />
        )}

        {/* Profile and Settings */}
        {currentRoute === 'profile' && (
          <ProfileView
            username={routeParam || 'me'}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'dashboard' && (
          <DashboardView
            initialTab="listings"
            onOpenCreateListing={() => setIsCreateListingOpen(true)}
            onOpenCreateProject={() => setIsCreateProjectOpen(true)}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'settings' && (
          <DashboardView
            initialTab="settings"
            onOpenCreateListing={() => setIsCreateListingOpen(true)}
            onOpenCreateProject={() => setIsCreateProjectOpen(true)}
            onNavigate={navigate}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={navigate}
      />

      {/* Creation Modals */}
      <CreateListingModal
        isOpen={isCreateListingOpen}
        onClose={() => setIsCreateListingOpen(false)}
        onSuccess={() => {
          setIsCreateListingOpen(false);
          navigate('marketplace');
        }}
        onNavigateAuth={() => navigate('login')}
      />

      <CreateAuctionModal
        isOpen={isCreateAuctionOpen}
        onClose={() => setIsCreateAuctionOpen(false)}
        onSuccess={() => {
          setIsCreateAuctionOpen(false);
          navigate('auctions');
        }}
        onNavigateAuth={() => navigate('login')}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onSuccess={() => {
          setIsCreateProjectOpen(false);
          navigate('explore');
        }}
        onNavigateAuth={() => navigate('login')}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSuccess={() => {
          setIsCreatePostOpen(false);
          navigate('community');
        }}
        onNavigateAuth={() => navigate('login')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
