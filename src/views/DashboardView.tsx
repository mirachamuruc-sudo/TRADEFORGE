import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Flame, Hammer, Bookmark, Settings, User, 
  Plus, Trash2, Check, AlertCircle, ExternalLink, Save, Shield 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import type { MarketplaceListing, Project, Auction } from '../types.ts';

interface DashboardViewProps {
  initialTab?: 'listings' | 'bids' | 'projects' | 'saved' | 'settings';
  onOpenCreateListing: () => void;
  onOpenCreateProject: () => void;
  onNavigate: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  initialTab = 'listings',
  onOpenCreateListing,
  onOpenCreateProject,
  onNavigate,
}) => {
  const { user, token, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'bids' | 'projects' | 'saved' | 'settings'>(initialTab);

  // Data states
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile edit states
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [robloxUsername, setRobloxUsername] = useState(user?.robloxUsername || '');
  const [discordTag, setDiscordTag] = useState(user?.discordTag || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || '');
  const [skillsInput, setSkillsInput] = useState(user?.skills?.join(', ') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
      setRobloxUsername(user.robloxUsername || '');
      setDiscordTag(user.discordTag || '');
      setPortfolioUrl(user.portfolioUrl || '');
      setSkillsInput(user.skills?.join(', ') || '');
    }
  }, [user]);

  const loadData = () => {
    if (!token) return;
    setLoading(true);

    Promise.all([
      fetch('/api/marketplace').then((r) => (r.ok ? r.json() : { listings: [] })),
      fetch('/api/projects').then((r) => (r.ok ? r.json() : { projects: [] })),
      fetch('/api/auctions').then((r) => (r.ok ? r.json() : { auctions: [] })),
    ])
      .then(([mktData, projData, aucData]) => {
        const username = user?.username.toLowerCase() || '';
        const mineListings = (mktData.listings || []).filter(
          (l: MarketplaceListing) => l.sellerUsername.toLowerCase() === username
        );
        const mineProjects = (projData.projects || []).filter(
          (p: Project) => p.creatorUsername.toLowerCase() === username
        );
        setMyListings(mineListings);
        setMyProjects(mineProjects);
        setAuctions(aucData.auctions || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [token, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setSaveError('');

    try {
      const skillsArray = skillsInput.split(',').map((s: string) => s.trim()).filter(Boolean);
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName,
          bio,
          robloxUsername,
          discordTag,
          portfolioUrl,
          skills: skillsArray,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSaveError(data.error || 'Failed to update profile.');
      } else {
        await refreshProfile();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {
      setSaveError('Network error saving profile changes.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-12 h-12 text-[#FF6A00] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-xs text-[#999999] mb-6">
          You must log into TradeForge to view your personal dashboard and manage listings.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Developer Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#999999] mt-1">
          Manage your active marketplace listings, live auction bids, developer projects, and profile settings.
        </p>
      </div>

      {/* Main Grid: Sidebar Tabs + Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1.5">
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#242424] mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#2B2B2B] text-[#FF6A00] flex items-center justify-center font-bold text-sm">
              {user.username[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{user.displayName}</div>
              <div className="text-[11px] text-[#999999] font-mono truncate">@{user.username}</div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('listings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'listings'
                ? 'bg-[#181818] text-[#FF6A00] border border-[#FF6A00]/40'
                : 'text-[#999999] hover:text-white hover:bg-[#111111]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Listings ({myListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bids')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'bids'
                ? 'bg-[#181818] text-[#FF6A00] border border-[#FF6A00]/40'
                : 'text-[#999999] hover:text-white hover:bg-[#111111]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>My Bids</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-[#181818] text-[#FF6A00] border border-[#FF6A00]/40'
                : 'text-[#999999] hover:text-white hover:bg-[#111111]'
            }`}
          >
            <Hammer className="w-4 h-4" />
            <span>My Projects ({myProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-[#181818] text-[#FF6A00] border border-[#FF6A00]/40'
                : 'text-[#999999] hover:text-white hover:bg-[#111111]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Items</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#181818] text-[#FF6A00] border border-[#FF6A00]/40'
                : 'text-[#999999] hover:text-white hover:bg-[#111111]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Panel Content */}
        <div className="md:col-span-3">
          {/* MY LISTINGS */}
          {activeTab === 'listings' && (
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#242424]">
                <div>
                  <h3 className="text-lg font-bold text-white">My Marketplace Listings</h3>
                  <p className="text-xs text-[#999999]">Manage your active sell listings and assets</p>
                </div>
                <button
                  onClick={onOpenCreateListing}
                  className="px-4 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Listing</span>
                </button>
              </div>

              {myListings.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424]">
                  <ShoppingBag className="w-8 h-8 text-[#777] mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-white">You have no active listings</h4>
                  <p className="text-xs text-[#999999] mt-1 mb-5">
                    Publish your first Luau script, 3D asset, or UI pack to start earning Robux.
                  </p>
                  <button
                    onClick={onOpenCreateListing}
                    className="px-5 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg"
                  >
                    Create a Listing
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myListings.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#111111] border border-[#242424] flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{item.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1A1A] text-[#FF6A00] border border-[#333]">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-xs text-[#999999] mt-0.5">
                          Price:{' '}
                          <span className="text-[#FF6A00] font-mono font-bold">
                            R$ {item.priceRobux.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-400 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/40 font-mono">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MY BIDS */}
          {activeTab === 'bids' && (
            <div>
              <div className="pb-4 mb-6 border-b border-[#242424]">
                <h3 className="text-lg font-bold text-white">My Active Bids</h3>
                <p className="text-xs text-[#999999]">Auctions where you hold the current highest bid or placed an offer</p>
              </div>

              {auctions.filter((a) => a.highestBidderUsername?.toLowerCase() === user.username.toLowerCase()).length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424]">
                  <Flame className="w-8 h-8 text-[#777] mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-white">No active bids placed</h4>
                  <p className="text-xs text-[#999999] mt-1 mb-5">
                    Browse active community auctions and submit competitive bids.
                  </p>
                  <button
                    onClick={() => onNavigate('auctions')}
                    className="px-5 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg"
                  >
                    Explore Auctions
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {auctions
                    .filter((a) => a.highestBidderUsername?.toLowerCase() === user.username.toLowerCase())
                    .map((auc) => (
                      <div
                        key={auc.id}
                        className="p-4 rounded-xl bg-[#111111] border border-[#242424] flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-bold text-white">{auc.itemTitle}</div>
                          <div className="text-xs text-[#999999]">
                            Your Winning Bid:{' '}
                            <span className="text-[#FF6A00] font-mono font-bold">
                              R$ {auc.currentBid.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-amber-400 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 font-mono">
                          Highest Bidder
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* MY PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#242424]">
                <div>
                  <h3 className="text-lg font-bold text-white">My Showcased Projects</h3>
                  <p className="text-xs text-[#999999]">Roblox plugins, systems, and open-source models</p>
                </div>
                <button
                  onClick={onOpenCreateProject}
                  className="px-4 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>

              {myProjects.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424]">
                  <Hammer className="w-8 h-8 text-[#777] mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-white">No projects published yet</h4>
                  <p className="text-xs text-[#999999] mt-1 mb-5">
                    Showcase your developer frameworks or plugins to build your developer reputation score.
                  </p>
                  <button
                    onClick={onOpenCreateProject}
                    className="px-5 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg"
                  >
                    Create Project
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-[#111111] border border-[#242424] flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-bold text-white">{proj.title}</div>
                        <div className="text-xs text-[#999999]">{proj.category}</div>
                      </div>
                      <span className="text-xs text-neutral-400 font-mono">
                        {proj.viewsCount} views
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SAVED ITEMS */}
          {activeTab === 'saved' && (
            <div>
              <div className="pb-4 mb-6 border-b border-[#242424]">
                <h3 className="text-lg font-bold text-white">Saved Items</h3>
                <p className="text-xs text-[#999999]">Listings, auctions, and assets bookmarked for later</p>
              </div>

              <div className="p-12 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424]">
                <Bookmark className="w-8 h-8 text-[#777] mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-white">No bookmarked items yet</h4>
                <p className="text-xs text-[#999999] mt-1 mb-5">
                  Save marketplace listings and auctions to track prices and trade status.
                </p>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="px-5 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg"
                >
                  Browse Marketplace
                </button>
              </div>
            </div>
          )}

          {/* ACCOUNT SETTINGS / PROFILE EDITOR */}
          {activeTab === 'settings' && (
            <div className="bg-[#0D0D0D] border border-[#242424] rounded-2xl p-6">
              <div className="pb-4 mb-6 border-b border-[#242424]">
                <h3 className="text-lg font-bold text-white">Profile Editor & Settings</h3>
                <p className="text-xs text-[#999999]">
                  Update your developer bio, linked Roblox username, skills, and portfolio links.
                </p>
              </div>

              {savedSuccess && (
                <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {saveError && (
                <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
                  {saveError}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#999999] mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#999999] mb-1.5">
                      Roblox Username
                    </label>
                    <input
                      type="text"
                      value={robloxUsername}
                      onChange={(e) => setRobloxUsername(e.target.value)}
                      placeholder="e.g. Builderman"
                      className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#999999] mb-1.5">
                    Bio & Developer Statement
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell other builders about your specialty, games you've worked on, and commission availability..."
                    className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#999999] mb-1.5">
                      Discord Tag
                    </label>
                    <input
                      type="text"
                      value={discordTag}
                      onChange={(e) => setDiscordTag(e.target.value)}
                      placeholder="user#0000 or username"
                      className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#999999] mb-1.5">
                      Portfolio or Talent Hub URL
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://talent.roblox.com/..."
                      className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#999999] mb-1.5">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="Luau, Blender, UI/UX, Roact, Sound Design, Level Design"
                    className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>

                <div className="pt-4 border-t border-[#242424] flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-[#FF6A00]/25 hover:opacity-90 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
