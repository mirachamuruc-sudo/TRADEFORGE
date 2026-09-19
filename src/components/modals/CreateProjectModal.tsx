import React, { useState } from 'react';
import { X, Hammer, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onNavigateAuth: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onNavigateAuth,
}) => {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Plugin' | 'Model' | 'Framework' | 'UI Library' | 'System' | 'Tool'>('Plugin');
  const [description, setDescription] = useState('');
  const [robloxAssetUrl, setRobloxAssetUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          description,
          robloxAssetUrl,
          githubUrl,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to submit project.');
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      setError('Network error submitting project.');
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
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Showcase New Project</h3>
              <p className="text-xs text-[#999999]">Present your Roblox framework, plugin, or system</p>
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
              Create an account or sign in to publish your work in the TradeForge developer index.
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
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Project Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Knit-Style Modular Game Engine for Roblox"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              >
                <option value="Plugin">Roblox Studio Plugin</option>
                <option value="Framework">Developer Framework</option>
                <option value="UI Library">UI / Roact / Fusion Library</option>
                <option value="System">Core Game System</option>
                <option value="Model">Open Source 3D Model</option>
                <option value="Tool">Developer Tooling / CLI</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Project Overview & Docs</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what problem this solves, how to install, and its performance characteristics..."
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">Roblox Asset Link</label>
                <input
                  type="url"
                  value={robloxAssetUrl}
                  onChange={(e) => setRobloxAssetUrl(e.target.value)}
                  placeholder="https://roblox.com/library/..."
                  className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#999999] mb-1.5">GitHub Repository</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="luau, oop, open-source, replication"
                className="w-full px-3.5 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              />
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
                {isSubmitting ? 'Publishing...' : 'Create Project'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
