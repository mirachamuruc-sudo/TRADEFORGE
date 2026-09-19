import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ArrowUpDown, Hammer, Users, Gamepad2, 
  Package, MessageSquare, Plus, ExternalLink, Heart, Eye, ArrowRight 
} from 'lucide-react';
import type { Project, Profile } from '../types.ts';

interface ExploreViewProps {
  onOpenCreateProject: () => void;
  onNavigate: (route: string, param?: string) => void;
}

type ExploreTab = 'Projects' | 'Developers' | 'Games' | 'Items' | 'Community';

export const ExploreView: React.FC<ExploreViewProps> = ({ onOpenCreateProject, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<ExploreTab>('Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/projects').then((res) => (res.ok ? res.json() : { projects: [] })),
      fetch('/api/developers').then((res) => (res.ok ? res.json() : { developers: [] })),
    ])
      .then(([projData, devData]) => {
        setProjects(projData.projects || []);
        setDevelopers(devData.developers || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const tabs: { id: ExploreTab; label: string; icon: React.ReactNode }[] = [
    { id: 'Projects', label: 'Projects', icon: <Hammer className="w-4 h-4" /> },
    { id: 'Developers', label: 'Developers', icon: <Users className="w-4 h-4" /> },
    { id: 'Games', label: 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'Items', label: 'Items', icon: <Package className="w-4 h-4" /> },
    { id: 'Community', label: 'Community', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  // Filtering for projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'All' || p.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore TradeForge
          </h1>
          <p className="text-xs sm:text-sm text-[#999999] mt-1">
            Discover community projects, game creators, custom tools, and discussions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateProject}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 shadow-md shadow-[#FF6A00]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#242424] pb-3 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#181818] text-[#FF6A00] border border-[#FF6A00]/40'
                  : 'text-[#999999] hover:text-white hover:bg-[#111111] border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search, Filter, and Sorting Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-8">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search within ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D0D0D] border border-[#242424] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6A00]"
          />
        </div>

        <div className="sm:col-span-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#999999] flex-shrink-0" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full py-2.5 px-3 bg-[#0D0D0D] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
          >
            <option value="All">All Categories</option>
            <option value="Plugin">Roblox Plugin</option>
            <option value="Framework">Framework</option>
            <option value="UI Library">UI Library</option>
            <option value="System">Game System</option>
            <option value="Model">3D Asset/Model</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[#999999] flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full py-2.5 px-3 bg-[#0D0D0D] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-20 text-center text-[#999999] text-sm">
          <div className="inline-block w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mb-3"></div>
          <div>Loading explore feed...</div>
        </div>
      ) : activeTab === 'Projects' ? (
        filteredProjects.length === 0 ? (
          /* Exact requested empty state */
          <div className="py-24 px-4 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424] max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-[#FF6A00]">
              <Hammer className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No projects available yet.</h3>
            <p className="text-sm text-[#999999] max-w-md mx-auto mb-6">
              Be one of the first creators to showcase your work.
            </p>
            <button
              id="empty-create-project-btn"
              onClick={onOpenCreateProject}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md shadow-[#FF6A00]/20 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-2xl bg-[#111111] border border-[#242424] hover:border-[#FF6A00]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#1A1A1A] text-[#FF6A00] border border-[#333]">
                      {project.category}
                    </span>
                    <span className="text-[11px] text-[#777777] font-mono">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-xs text-[#999999] line-clamp-3 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#161616] text-[#888888] border border-[#262626]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
                  <div
                    onClick={() => onNavigate('profile', project.creatorUsername)}
                    className="flex items-center gap-2 cursor-pointer hover:text-[#FF6A00] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#242424] text-[#FF6A00] flex items-center justify-center font-bold text-[10px]">
                      {project.creatorAvatar ? (
                        <img src={project.creatorAvatar} alt={project.creatorUsername} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        project.creatorUsername[0]?.toUpperCase()
                      )}
                    </div>
                    <span className="text-xs text-neutral-300 font-medium">@{project.creatorUsername}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#777]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {project.viewsCount}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Heart className="w-3.5 h-3.5" /> {project.likesCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'Developers' ? (
        developers.length === 0 ? (
          <div className="py-24 px-4 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424] max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-[#FF6A00]">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No developer profiles listed yet.</h3>
            <p className="text-sm text-[#999999] max-w-md mx-auto mb-6">
              Create your TradeForge developer account to establish your reputation and showcase games.
            </p>
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm"
            >
              Join as a Developer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <div
                key={dev.id}
                onClick={() => onNavigate('profile', dev.username)}
                className="p-5 rounded-2xl bg-[#111111] border border-[#242424] hover:border-[#FF6A00]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#262626] flex items-center justify-center text-base font-bold text-[#FF6A00] overflow-hidden">
                    {dev.avatarUrl ? (
                      <img src={dev.avatarUrl} alt={dev.username} className="w-full h-full object-cover" />
                    ) : (
                      dev.username[0]?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FF6A00] transition-colors">{dev.displayName}</h4>
                    <p className="text-xs text-[#999999]">@{dev.username}</p>
                  </div>
                </div>
                <p className="text-xs text-[#999999] line-clamp-2 mb-4">
                  {dev.bio || 'Roblox developer and creator building on TradeForge.'}
                </p>
                <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-xs text-[#777]">
                  <span>Rep: {dev.reputationScore}</span>
                  <span className="text-[#FF6A00] flex items-center gap-1 font-medium">
                    View Portfolio <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'Games' ? (
        <div className="py-24 px-4 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424] max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-[#FF6A00]">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Roblox games showcased yet.</h3>
          <p className="text-sm text-[#999999] max-w-md mx-auto mb-6">
            Link your Roblox game universe ID in your profile or create a showcase to appear in this directory.
          </p>
          <button
            onClick={() => onNavigate('settings')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm"
          >
            Connect Roblox Profile
          </button>
        </div>
      ) : activeTab === 'Items' ? (
        <div className="py-24 px-4 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424] max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-[#FF6A00]">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No inventory assets indexed yet.</h3>
          <p className="text-sm text-[#999999] max-w-md mx-auto mb-6">
            Browse our dedicated peer-to-peer Marketplace to discover scripts, models, and UI packs.
          </p>
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm"
          >
            Go to Marketplace
          </button>
        </div>
      ) : (
        <div className="py-24 px-4 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424] max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-[#FF6A00]">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Explore Community Discussions</h3>
          <p className="text-sm text-[#999999] max-w-md mx-auto mb-6">
            Join Roblox developer forums, ask scripting questions, or browse project announcements.
          </p>
          <button
            onClick={() => onNavigate('community')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm"
          >
            Open Community Hub
          </button>
        </div>
      )}
    </div>
  );
};
