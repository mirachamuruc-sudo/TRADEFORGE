import React, { useState, useEffect } from 'react';
import { Flame, Clock, Users, Plus, Tag, ArrowRight, Sparkles } from 'lucide-react';
import type { Auction } from '../types.ts';
import { PlaceBidModal } from '../components/modals/PlaceBidModal.tsx';

interface AuctionsViewProps {
  onOpenCreateAuction: () => void;
  onNavigate: (route: string, param?: string) => void;
}

export const AuctionsView: React.FC<AuctionsViewProps> = ({
  onOpenCreateAuction,
  onNavigate,
}) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [biddingAuction, setBiddingAuction] = useState<Auction | null>(null);

  const fetchAuctions = () => {
    setLoading(true);
    fetch('/api/auctions')
      .then((res) => (res.ok ? res.json() : { auctions: [] }))
      .then((data) => setAuctions(data.auctions || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const formatRemaining = (endsAt: string) => {
    const diff = new Date(endsAt).getTime() - Date.now();
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-[#FF3D00] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF3D00]">Timed Bidding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Asset Auctions
          </h1>
          <p className="text-xs sm:text-sm text-[#999999] mt-1">
            Participate in community auctions for rare models, high-tier scripts, and complete game frameworks.
          </p>
        </div>

        <button
          id="auctions-create-btn"
          onClick={onOpenCreateAuction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 shadow-md shadow-[#FF6A00]/25 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Auction</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-[#999999] text-sm">
          <div className="inline-block w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mb-3"></div>
          <div>Loading active auctions...</div>
        </div>
      ) : auctions.length === 0 ? (
        /* EXACT requested empty state */
        <div className="py-24 px-4 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424] max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-[#FF3D00]">
            <Flame className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No active auctions</h3>
          <p className="text-sm text-[#999999] max-w-md mx-auto mb-6">
            Create the first auction on TradeForge.
          </p>
          <button
            id="empty-create-auction-btn"
            onClick={onOpenCreateAuction}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md shadow-[#FF6A00]/20 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Auction</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="p-6 rounded-2xl bg-[#111111] border border-[#242424] hover:border-[#FF3D00]/50 transition-all flex flex-col justify-between shadow-md"
            >
              <div>
                {/* Status & Time Remaining */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181818] border border-[#2A2A2A] text-[11px] font-mono text-neutral-300">
                    <Clock className="w-3.5 h-3.5 text-[#FF3D00]" />
                    <span>{formatRemaining(auction.endsAt)}</span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/20">
                    {auction.itemRarity}
                  </span>
                </div>

                {/* Item Details */}
                <h3 className="text-lg font-bold text-white mb-1.5">{auction.itemTitle}</h3>
                <p className="text-xs text-[#999999] line-clamp-3 leading-relaxed mb-4">
                  {auction.description}
                </p>

                {/* Seller Row */}
                <div
                  onClick={() => onNavigate('profile', auction.sellerUsername)}
                  className="flex items-center gap-2 mb-5 p-2 rounded-xl bg-[#141414] border border-[#1F1F1F] cursor-pointer hover:border-[#333] transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#242424] text-[#FF6A00] flex items-center justify-center font-bold text-[10px]">
                    {auction.sellerAvatar ? (
                      <img src={auction.sellerAvatar} alt={auction.sellerUsername} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      auction.sellerUsername[0]?.toUpperCase()
                    )}
                  </div>
                  <div className="text-xs">
                    <span className="text-[#999999]">Seller:</span>{' '}
                    <span className="text-white font-medium">@{auction.sellerUsername}</span>
                  </div>
                </div>
              </div>

              {/* Bidding Summary Box */}
              <div className="p-3.5 rounded-xl bg-[#0B0B0B] border border-[#1E1E1E]">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#999999] block">Current Bid</span>
                    <span className="text-xl font-extrabold text-[#FF6A00] font-mono">
                      R$ {auction.currentBid.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right text-xs text-[#999999]">
                    <span className="font-semibold text-neutral-300">{auction.bidsCount}</span> bids
                  </div>
                </div>

                {auction.highestBidderUsername && (
                  <div className="text-[11px] text-[#888888] mb-3 truncate">
                    High Bidder: <span className="text-neutral-200">@{auction.highestBidderUsername}</span>
                  </div>
                )}

                <button
                  onClick={() => setBiddingAuction(auction)}
                  className="w-full py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] hover:opacity-95 text-white text-xs font-bold rounded-lg shadow-sm shadow-[#FF6A00]/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Place Bid</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Place Bid Modal */}
      <PlaceBidModal
        auction={biddingAuction}
        isOpen={Boolean(biddingAuction)}
        onClose={() => setBiddingAuction(null)}
        onSuccess={() => {
          setBiddingAuction(null);
          fetchAuctions();
        }}
        onNavigateAuth={() => onNavigate('login')}
      />
    </div>
  );
};
