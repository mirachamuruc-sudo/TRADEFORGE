import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Hammer, ShoppingBag, Flame, MessageSquare, Terminal, ExternalLink, ArrowRight } from 'lucide-react';
import type { Profile, Project, MarketplaceListing, Auction, CommunityPost } from '../types.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, param?: string) => void;
}

type SearchCategory = 'All' | 'Users' | 'Developers' | 'Projects' | 'Marketplace' | 'Auctions' | 'Community';

export const GlobalSearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('All');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{
    users: Profile[];
    projects: Project[];
    listings: MarketplaceListing[];
    auctions: Auction[];
    posts: CommunityPost[];
  }>({
    users: [],
    projects: [],
    listings: [],
    auctions: [],
    posts: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], projects: [], listings: [], auctions: [], posts: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch {
        // silent fail
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories: SearchCategory[] = [
    'All',
    'Developers',
    'Projects',
    'Marketplace',
    'Auctions',
    'Community',
  ];

  const hasAnyResults =
    results.users.length > 0 ||
    results.projects.length > 0 ||
    results.listings.length > 0 ||
    results.auctions.length > 0 ||
    results.posts.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div
        id="global-search-container"
        className="w-full max-w-2xl bg-[#0D0D0D] border border-[#242424] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#242424] gap-3">
          <Search className="w-5 h-5 text-[#FF6A00]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search TradeForge (users, listings, auctions, scripts, projects)..."
            className="flex-1 bg-transparent text-white placeholder-[#999999] text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#999999] hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#999999] bg-[#161616] px-2 py-1 rounded border border-[#242424]">
            <span>ESC</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#1A1A1A] bg-[#0A0A0A] overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30'
                  : 'text-[#999999] hover:text-white hover:bg-[#161616]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {isSearching ? (
            <div className="py-12 text-center text-[#999999] text-sm">
              <div className="inline-block w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mb-3"></div>
              <div>Searching TradeForge database...</div>
            </div>
          ) : !query.trim() ? (
            <div className="py-8 text-center text-[#999999]">
              <p className="text-sm">Type keywords to search developers, marketplace items, auctions, and discussions.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <span className="px-2 py-1 bg-[#141414] border border-[#242424] rounded text-neutral-400">Ctrl + K anytime</span>
                <span className="px-2 py-1 bg-[#141414] border border-[#242424] rounded text-neutral-400">Roblox Plugins</span>
                <span className="px-2 py-1 bg-[#141414] border border-[#242424] rounded text-neutral-400">Marketplace Listings</span>
              </div>
            </div>
          ) : !hasAnyResults ? (
            <div className="py-12 text-center">
              <p className="text-white font-medium text-base mb-1">No matching results found</p>
              <p className="text-[#999999] text-xs max-w-sm mx-auto">
                No items matching &ldquo;{query}&rdquo; exist in the TradeForge database yet. Be the first to create one!
              </p>
            </div>
          ) : (
            <>
              {/* Developers / Users */}
              {(activeCategory === 'All' || activeCategory === 'Developers' || activeCategory === 'Users') &&
                results.users.length > 0 && (
                  <div>
                    <div className="text-xs font-mono uppercase text-[#999999] mb-2 px-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#FF6A00]" /> Developers & Creators
                    </div>
                    <div className="space-y-1.5">
                      {results.users.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => {
                            onNavigate('profile', user.username);
                            onClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111] hover:bg-[#181818] border border-[#242424] hover:border-[#383838] cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#242424] flex items-center justify-center font-bold text-xs text-[#FF6A00] overflow-hidden">
                              {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                              ) : (
                                user.username[0]?.toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{user.displayName}</div>
                              <div className="text-xs text-[#999999]">@{user.username}</div>
                            </div>
                          </div>
                          <span className="text-xs text-[#FF6A00] flex items-center gap-1">
                            View Profile <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Projects */}
              {(activeCategory === 'All' || activeCategory === 'Projects') && results.projects.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase text-[#999999] mb-2 px-1 flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5 text-[#FF6A00]" /> Developer Projects
                  </div>
                  <div className="space-y-1.5">
                    {results.projects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => {
                          onNavigate('explore');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111] hover:bg-[#181818] border border-[#242424] hover:border-[#383838] cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium text-white flex items-center gap-2">
                            {proj.title}
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#FF6A00] border border-[#333]">
                              {proj.category}
                            </span>
                          </div>
                          <div className="text-xs text-[#999999] line-clamp-1">{proj.description}</div>
                        </div>
                        <span className="text-xs text-neutral-400">by @{proj.creatorUsername}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Marketplace Listings */}
              {(activeCategory === 'All' || activeCategory === 'Marketplace') && results.listings.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase text-[#999999] mb-2 px-1 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#FF6A00]" /> Marketplace Items
                  </div>
                  <div className="space-y-1.5">
                    {results.listings.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onNavigate('marketplace');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111] hover:bg-[#181818] border border-[#242424] hover:border-[#383838] cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium text-white">{item.title}</div>
                          <div className="text-xs text-[#999999]">{item.category} • {item.rarity}</div>
                        </div>
                        <div className="text-sm font-bold text-[#FF6A00]">
                          R$ {item.priceRobux.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Auctions */}
              {(activeCategory === 'All' || activeCategory === 'Auctions') && results.auctions.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase text-[#999999] mb-2 px-1 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#FF6A00]" /> Live Auctions
                  </div>
                  <div className="space-y-1.5">
                    {results.auctions.map((auc) => (
                      <div
                        key={auc.id}
                        onClick={() => {
                          onNavigate('auctions');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111] hover:bg-[#181818] border border-[#242424] hover:border-[#383838] cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium text-white">{auc.itemTitle}</div>
                          <div className="text-xs text-[#999999]">{auc.bidsCount} bids placed</div>
                        </div>
                        <div className="text-sm font-bold text-[#FF6A00]">
                          Current: R$ {auc.currentBid.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Posts */}
              {(activeCategory === 'All' || activeCategory === 'Community') && results.posts.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase text-[#999999] mb-2 px-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#FF6A00]" /> Community Posts
                  </div>
                  <div className="space-y-1.5">
                    {results.posts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => {
                          onNavigate('community');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-[#111111] hover:bg-[#181818] border border-[#242424] hover:border-[#383838] cursor-pointer transition-colors"
                      >
                        <div className="text-sm font-medium text-white">{post.title}</div>
                        <div className="text-xs text-[#999999] line-clamp-1">{post.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
