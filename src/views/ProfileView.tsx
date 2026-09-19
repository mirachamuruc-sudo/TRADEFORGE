import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Award, Calendar, ExternalLink, Edit, Package, 
  Flame, Hammer, MessageSquare, AlertCircle, ArrowLeft 
} from 'lucide-react';
import type { Profile, MarketplaceListing, Project } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface ProfileViewProps {
  username: string;
  onNavigate: (route: string, param?: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ username, onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userListings, setUserListings] = useState<MarketplaceListing[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'projects' | 'activity'>('inventory');

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    Promise.all([
      fetch(`/api/profile/${username}`).then((r) => (r.ok ? r.json() : { profile: null })),
      fetch('/api/marketplace').then((r) => (r.ok ? r.json() : { listings: [] })),
      fetch('/api/projects').then((r) => (r.ok ? r.json() : { projects: [] })),
    ])
      .then(([profData, marketData, projData]) => {
        setProfile(profData.profile || null);
        const myItems = (marketData.listings || []).filter(
          (l: MarketplaceListing) => l.sellerUsername.toLowerCase() === username.toLowerCase()
        );
        const myProjs = (projData.projects || []).filter(
          (p: Project) => p.creatorUsername.toLowerCase() === username.toLowerCase()
        );
        setUserListings(myItems);
        setUserProjects(myProjs);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="py-32 text-center text-[#999999]">
        <div className="inline-block w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mb-3"></div>
        <div>Loading user dossier...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-[#FF6A00]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">User Not Found</h2>
        <p className="text-sm text-[#999999] mb-6">
          The developer profile for &ldquo;{username}&rdquo; does not exist on TradeForge.
        </p>
        <button
          onClick={() => onNavigate('developers')}
          className="px-5 py-2.5 bg-[#161616] text-[#FF6A00] border border-[#FF6A00]/30 rounded-xl text-xs font-semibold"
        >
          Return to Developer Index
        </button>
      </div>
    );
  }

  const isOwnProfile = user?.username.toLowerCase() === username.toLowerCase();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('developers')}
        className="mb-4 text-xs text-[#999999] hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Developers</span>
      </button>

      {/* BANNER */}
      <div className="w-full h-44 sm:h-56 rounded-2xl bg-gradient-to-r from-[#1A0C00] via-[#111111] to-[#0D0D0D] border border-[#242424] relative overflow-hidden">
        {profile.bannerUrl && (
          <img
            src={profile.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
        <div className="absolute bottom-3 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#333] text-[11px] font-mono text-[#FF6A00] flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          <span>Reputation: {profile.reputationScore}</span>
        </div>
      </div>

      {/* PROFILE HEADER CARD */}
      <div className="relative px-6 pb-6 bg-[#0D0D0D] border border-[#242424] rounded-2xl -mt-16 pt-0 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -translate-y-8 mb-[-1.5rem]">
          {/* Avatar */}
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#141414] border-4 border-[#0D0D0D] text-[#FF6A00] flex items-center justify-center text-3xl font-extrabold shadow-2xl overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                profile.username[0]?.toUpperCase()
              )}
            </div>

            <div className="pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>{profile.displayName}</span>
                {profile.verifiedBadge && (
                  <span title="Verified Creator">
                    <ShieldCheck className="w-5 h-5 text-[#FF6A00]" />
                  </span>
                )}
              </h1>
              <div className="text-xs text-[#999999] font-mono mt-0.5">@{profile.username}</div>
            </div>
          </div>

          {/* Edit Profile button */}
          {isOwnProfile && (
            <button
              onClick={() => onNavigate('settings')}
              className="px-4 py-2 bg-[#161616] hover:bg-[#202020] border border-[#2D2D2D] rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Edit className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Info Grid */}
        <div className="mt-6 pt-6 border-t border-[#1C1C1C] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {/* Bio */}
            <div>
              <h4 className="text-xs font-mono uppercase text-[#777] mb-1">About Creator</h4>
              <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                {profile.bio || 'This developer has not written a public bio yet.'}
              </p>
            </div>

            {/* Badges */}
            {profile.badges && profile.badges.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase text-[#777] mb-2">Recognitions & Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((b: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#161616] border border-[#292929] text-[#FF6A00] flex items-center gap-1.5"
                    >
                      <Award className="w-3 h-3" />
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase text-[#777] mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md text-xs bg-[#121212] border border-[#242424] text-neutral-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-3 p-4 rounded-xl bg-[#111111] border border-[#1E1E1E]">
            <div>
              <span className="text-[11px] text-[#777] block font-mono">Roblox Handle</span>
              <span className="text-xs text-white font-mono font-medium">
                {profile.robloxUsername ? `@${profile.robloxUsername}` : 'Not linked'}
              </span>
            </div>

            {profile.discordTag && (
              <div>
                <span className="text-[11px] text-[#777] block font-mono">Discord Tag</span>
                <span className="text-xs text-white font-mono font-medium">{profile.discordTag}</span>
              </div>
            )}

            {profile.portfolioUrl && (
              <div>
                <span className="text-[11px] text-[#777] block font-mono">Portfolio</span>
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-[#FF6A00] hover:underline flex items-center gap-1 font-medium mt-0.5"
                >
                  <span>Visit Showcase</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="pt-2 border-t border-[#1C1C1C] text-[11px] text-[#777] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {new Date(profile.joinedAt || profile.joinDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS: Inventory, Projects, Activity */}
      <div className="border-b border-[#242424] flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-[#FF6A00] text-[#FF6A00]'
              : 'border-transparent text-[#999999] hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Active Inventory ({userListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'projects'
              ? 'border-[#FF6A00] text-[#FF6A00]'
              : 'border-transparent text-[#999999] hover:text-white'
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span>Projects ({userProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-[#FF6A00] text-[#FF6A00]'
              : 'border-transparent text-[#999999] hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Recent Activity</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'inventory' && (
        userListings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424]">
            <Package className="w-8 h-8 text-[#777] mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No active marketplace listings</p>
            <p className="text-xs text-[#999999] mt-1">This creator has no items listed for sale right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userListings.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl bg-[#111111] border border-[#242424]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#999999]">{item.category}</span>
                  <span className="text-[#FF6A00] font-mono font-bold">R$ {item.priceRobux.toLocaleString()}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-[#999999] line-clamp-2">{item.description}</p>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'projects' && (
        userProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424]">
            <Hammer className="w-8 h-8 text-[#777] mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No developer projects listed</p>
            <p className="text-xs text-[#999999] mt-1">This developer has not showcased any open projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {userProjects.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-[#111111] border border-[#242424]">
                <span className="text-[11px] text-[#FF6A00] font-mono block mb-1">{p.category}</span>
                <h4 className="text-base font-bold text-white mb-1.5">{p.title}</h4>
                <p className="text-xs text-[#999999] mb-3">{p.description}</p>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'activity' && (
        <div className="p-8 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-3">
          <div className="flex items-center gap-3 text-xs text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00]"></span>
            <span>Account initialized with verified TradeForge signature.</span>
            <span className="text-[#777] font-mono ml-auto">
              {new Date(profile.joinedAt || profile.joinDate).toLocaleDateString()}
            </span>
          </div>
          {userListings.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Published {userListings.length} marketplace listing(s).</span>
            </div>
          )}
          {userProjects.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Showcased {userProjects.length} developer project(s).</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
