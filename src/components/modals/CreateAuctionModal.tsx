import React, { useState } from 'react';
import { X, Flame, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import type { RarityLevel } from '../../types.ts';

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onNavigateAuth: () => void;
}

export const CreateAuctionModal: React.FC<CreateAuctionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onNavigateAuth,
}) => {
  const { user, token } = useAuth();
  const [itemTitle, setItemTitle] = useState('');
  const [itemCategory, setItemCategory] = useState('Rare Asset');
  const [itemRarity, setItemRarity] = useState<RarityLevel>('Rare');
  const [startingBid, setStartingBid] = useState('500');
  const [minBidIncrement, setMinBidIncrement] = useState('25');
  const [durationHours, setDurationHours] = useState('24');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!itemTitle.trim() || !description.trim()) {
      setError('Item title and description are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemTitle,
          itemCategory,
          itemRarity,
          startingBid: Number(startingBid) || 100,
          minBidIncrement: Number(minBidIncrement) || 10,
          durationHours: Number(durationHours) || 24,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to start auction.');
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      setError('Network error creating auction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0D0D0D] border border-[#242424] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242424]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Auction</h3>
              <p className="text-xs text-[#999999]">Host a timed bidding auction for your asset</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#999999] hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!user ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-[#FF3D00] mx-auto mb-3" />
            <h4 className="text-base font-semibold text-white">Authentication Required</h4>
            <p className="text-xs text-[#999999] max-w-sm mx-auto mt-1 mb-6">
              You must be registered and logged in to launch a public auction.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onNavigateAuth();
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg"
              >
                Log In or Sign Up
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#161616] text-[#999999] text-xs font-medium rounded-lg border border-[#242424]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/40 rounded-lg text-xs text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Auction Item Title</label>
              <input
                type="text"
                required
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                placeholder="e.g., Cyberpunk City Map + Custom Vehicles Pack"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">Category</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="Rare Asset">Rare Asset</option>
                  <option value="Complete Map">Complete Map</option>
                  <option value="Unique Script">Unique Script</option>
                  <option value="Limited Model">Limited Model</option>
                  <option value="Game Framework">Game Framework</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">Rarity</label>
                <select
                  value={itemRarity}
                  onChange={(e) => setItemRarity(e.target.value as RarityLevel)}
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">Starting Bid (R$)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={startingBid}
                  onChange={(e) => setStartingBid(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">Min Increment (R$)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={minBidIncrement}
                  onChange={(e) => setMinBidIncrement(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">Duration (Hours)</label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="48">48 Hours</option>
                  <option value="72">3 Days</option>
                  <option value="168">7 Days</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Auction Details</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include proof of ownership, transfer conditions, asset format..."
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#242424]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#161616] text-[#999999] text-xs font-medium rounded-lg border border-[#242424]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg shadow-sm shadow-[#FF6A00]/30 hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Starting...' : 'Start Auction'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
