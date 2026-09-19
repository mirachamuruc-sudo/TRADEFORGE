import React, { useState } from 'react';
import { X, ShoppingBag, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import type { RarityLevel } from '../../types.ts';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onNavigateAuth: () => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onNavigateAuth,
}) => {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Plugin');
  const [rarity, setRarity] = useState<RarityLevel>('Common');
  const [priceRobux, setPriceRobux] = useState('250');
  const [itemType, setItemType] = useState('Roblox Model');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!title.trim() || !description.trim()) {
      setError('Please fill in title and description.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          rarity,
          priceRobux: Number(priceRobux) || 0,
          itemType,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to publish listing.');
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      setError('Network error publishing listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0D0D0D] border border-[#242424] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242424]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[#FF6A00]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Marketplace Listing</h3>
              <p className="text-xs text-[#999999]">List your Roblox scripts, assets, or services</p>
            </div>
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
              You must be registered and logged into TradeForge to publish items to the marketplace.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onNavigateAuth();
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Log In or Sign Up
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#161616] text-[#999999] hover:text-white text-xs font-medium rounded-lg border border-[#242424]"
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
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Listing Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Advanced Combat Inventory System v2.0"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="Plugin">Plugin</option>
                  <option value="Model">3D Model / Asset</option>
                  <option value="Script/System">Script / System</option>
                  <option value="UI Pack">UI / Interface Pack</option>
                  <option value="Animation">Animation Pack</option>
                  <option value="Map">Map / Environment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">Rarity / Grade</label>
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value as RarityLevel)}
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                  <option value="Limited">Limited Edition</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">Price (Robux R$)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={priceRobux}
                  onChange={(e) => setPriceRobux(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">Asset Type</label>
                <input
                  type="text"
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  placeholder="rbxm, lua, ui pack..."
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Description & Specifications</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe features, setup instructions, dependencies, and license..."
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="combat, lua, rbxm, modular, fps"
                className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#242424]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#161616] text-[#999999] hover:text-white text-xs font-medium rounded-lg border border-[#242424]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg shadow-sm shadow-[#FF6A00]/30 hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
