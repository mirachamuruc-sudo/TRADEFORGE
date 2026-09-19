import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ArrowUpDown, ShoppingBag, Plus, Tag, 
  ExternalLink, Sparkles, Check, ArrowRight 
} from 'lucide-react';
import type { MarketplaceListing, RarityLevel } from '../types.ts';

interface MarketplaceViewProps {
  onOpenCreateListing: () => void;
  onNavigate: (route: string, param?: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  onOpenCreateListing,
  onNavigate,
}) => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [creatorQuery, setCreatorQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'priceAsc' | 'priceDesc'>('newest');

  const fetchListings = () => {
    setLoading(true);
    fetch('/api/marketplace')
      .then((res) => (res.ok ? res.json() : { listings: [] }))
      .then((data) => setListings(data.listings || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const rarityColors: Record<RarityLevel, { badge: string; border: string }> = {
    Common: { badge: 'bg-neutral-800 text-neutral-300 border-neutral-700', border: 'border-neutral-800' },
    Uncommon: { badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60', border: 'border-emerald-900/40' },
    Rare: { badge: 'bg-blue-950/80 text-blue-400 border-blue-800/60', border: 'border-blue-900/40' },
    Epic: { badge: 'bg-purple-950/80 text-purple-400 border-purple-800/60', border: 'border-purple-900/40' },
    Legendary: { badge: 'bg-amber-950/80 text-amber-400 border-amber-800/60', border: 'border-amber-900/40' },
    Limited: { badge: 'bg-[#FF6A00]/20 text-[#FF6A00] border-[#FF6A00]/50', border: 'border-[#FF6A00]/40' },
  };

  const filteredListings = listings
    .filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchRarity = selectedRarity === 'All' || item.rarity === selectedRarity;
      const matchCreator =
        !creatorQuery.trim() || item.sellerUsername.toLowerCase().includes(creatorQuery.toLowerCase());
      return matchSearch && matchCat && matchRarity && matchCreator;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.priceRobux - b.priceRobux;
      if (sortBy === 'priceDesc') return b.priceRobux - a.priceRobux;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00]"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF6A00]">Peer-to-Peer Trading</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Roblox Asset Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-[#999999] mt-1">
            Discover, buy, and trade verified Luau scripts, UI interfaces, 3D assets, and studio plugins.
          </p>
        </div>

        <button
          id="marketplace-create-listing-btn"
          onClick={onOpenCreateListing}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 shadow-md shadow-[#FF6A00]/25 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Listing</span>
        </button>
      </div>

      {/* Filter Matrix */}
      <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#242424] mb-8 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings by title or keywords..."
              className="w-full pl-10 pr-4 py-2 bg-[#111111] border border-[#242424] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6A00]"
            />
          </div>

          {/* Category */}
          <div className="sm:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
            >
              <option value="All">All Categories</option>
              <option value="Plugin">Plugins</option>
              <option value="Model">3D Models</option>
              <option value="Script/System">Scripts & Systems</option>
              <option value="UI Pack">UI Packs</option>
              <option value="Animation">Animations</option>
              <option value="Map">Complete Maps</option>
            </select>
          </div>

          {/* Rarity */}
          <div className="sm:col-span-2">
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="w-full py-2 px-3 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
            >
              <option value="All">All Rarities</option>
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
              <option value="Limited">Limited Edition</option>
            </select>
          </div>

          {/* Creator Filter */}
          <div className="sm:col-span-2">
            <input
              type="text"
              value={creatorQuery}
              onChange={(e) => setCreatorQuery(e.target.value)}
              placeholder="Filter by creator..."
              className="w-full py-2 px-3 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
            />
          </div>

          {/* Sorting */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
            >
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Feed */}
      {loading ? (
        <div className="py-24 text-center text-[#999999] text-sm">
          <div className="inline-block w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mb-3"></div>
          <div>Querying marketplace catalog...</div>
        </div>
      ) : filteredListings.length === 0 ? (
        /* EXACT prompt required empty state when empty */
        <div className="py-24 px-4 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424] max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-[#FF6A00]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Marketplace is empty</h3>
          <p className="text-sm text-[#999999] max-w-md mx-auto mb-6">
            Listings will appear here when creators start selling items.
          </p>
          <button
            id="empty-create-listing-btn"
            onClick={onOpenCreateListing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md shadow-[#FF6A00]/20 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredListings.map((item) => {
            const rarityStyle = rarityColors[item.rarity] || rarityColors.Common;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-[#111111] border ${rarityStyle.border} hover:border-[#FF6A00] transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg hover:shadow-[#FF6A00]/5`}
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-[#999999] px-2 py-0.5 rounded bg-[#161616] border border-[#242424]">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rarityStyle.badge}`}>
                      {item.rarity}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#FF6A00] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#999999] line-clamp-3 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-[#161616] text-[#888888]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Pricing & Creator Row */}
                <div className="pt-3 border-t border-[#1E1E1E]">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[11px] text-[#999999]">Price</span>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#FF6A00] font-mono">
                        R$ {item.priceRobux.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]">
                    <div
                      onClick={() => onNavigate('profile', item.sellerUsername)}
                      className="flex items-center gap-1.5 cursor-pointer text-neutral-300 hover:text-white transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#242424] text-[#FF6A00] flex items-center justify-center text-[10px] font-bold overflow-hidden">
                        {item.sellerAvatar ? (
                          <img src={item.sellerAvatar} alt={item.sellerUsername} className="w-full h-full object-cover" />
                        ) : (
                          item.sellerUsername[0]?.toUpperCase()
                        )}
                      </div>
                      <span className="text-xs">@{item.sellerUsername}</span>
                    </div>

                    <button
                      onClick={() => alert(`Direct trade inquiry opened for "${item.title}". Contact seller @${item.sellerUsername} or join Discord.`)}
                      className="px-3 py-1 bg-[#181818] hover:bg-[#FF6A00] text-white text-[11px] font-semibold rounded-lg transition-colors border border-[#2E2E2E] hover:border-[#FF6A00]"
                    >
                      Trade
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
