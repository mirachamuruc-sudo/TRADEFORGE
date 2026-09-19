import React, { useState } from 'react';
import { X, Flame, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import type { Auction } from '../../types.ts';

interface PlaceBidModalProps {
  auction: Auction | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onNavigateAuth: () => void;
}

export const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
  auction,
  isOpen,
  onClose,
  onSuccess,
  onNavigateAuth,
}) => {
  const { user, token } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !auction) return null;

  const minBidRequired =
    auction.bidsCount === 0
      ? auction.startingBid
      : auction.currentBid + auction.minBidIncrement;

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const bidVal = Number(amount);
    if (!bidVal || bidVal < minBidRequired) {
      setError(`Bid must be at least R$ ${minBidRequired.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/auctions/${auction.id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: bidVal }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to place bid');
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      setError('Network error placing bid.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-[#242424] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242424]">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF6A00]" />
            <h3 className="text-base font-bold text-white">Place Bid</h3>
          </div>
          <button onClick={onClose} className="text-[#999999] hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!user ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-[#FF6A00] mx-auto mb-3" />
            <h4 className="text-base font-semibold text-white">Authentication Required</h4>
            <p className="text-xs text-[#999999] max-w-sm mx-auto mt-1 mb-6">
              You must be signed in to submit competitive bids.
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
          <form onSubmit={handleBidSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/40 rounded-lg text-xs text-red-300">
                {error}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#111111] border border-[#242424]">
              <div className="text-xs text-[#999999]">Item on Auction</div>
              <div className="text-sm font-bold text-white mt-0.5">{auction.itemTitle}</div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1C1C1C] text-xs">
                <span className="text-[#999999]">Current Highest Bid:</span>
                <span className="font-mono font-bold text-[#FF6A00]">
                  R$ {auction.currentBid.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-[#999999]">Minimum Required:</span>
                <span className="font-mono font-bold text-white">
                  R$ {minBidRequired.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">
                Your Bid Amount (Robux R$)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={minBidRequired}
                  step={auction.minBidIncrement}
                  placeholder={`Min ${minBidRequired}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-base font-mono text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
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
                {isSubmitting ? 'Confirming...' : 'Submit Bid'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
