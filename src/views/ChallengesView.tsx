import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Gift, Users, Send, Sparkles, Plus, AlertCircle } from 'lucide-react';
import type { Challenge } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface ChallengesViewProps {
  onNavigate: (route: string) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestTitle, setSuggestTitle] = useState('');
  const [suggestDesc, setSuggestDesc] = useState('');
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/challenges')
      .then((res) => (res.ok ? res.json() : { challenges: [] }))
      .then((data) => setChallenges(data.challenges || []))
      .finally(() => setLoading(false));
  }, []);

  const handleSuggest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestTitle.trim()) return;
    setSuggestSuccess(true);
    setTimeout(() => {
      setSuggestSuccess(false);
      setSuggestOpen(false);
      setSuggestTitle('');
      setSuggestDesc('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500">Developer Competitions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Roblox Developer Challenges
          </h1>
          <p className="text-xs sm:text-sm text-[#999999] mt-1">
            Compete in timed building, scripting, and optimization jams with community prize pools.
          </p>
        </div>

        <button
          onClick={() => setSuggestOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#282828] text-neutral-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FF6A00]" />
          <span>Suggest a Challenge</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-[#999999] text-sm">
          <div className="inline-block w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mb-3"></div>
          <div>Querying active developer challenges...</div>
        </div>
      ) : challenges.length === 0 ? (
        /* EXACT requested empty state */
        <div className="py-24 px-4 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424] max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-amber-500">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No active challenges right now.</h3>
          <p className="text-sm text-[#999999] max-w-md mx-auto mb-6">
            Check back soon for developer challenges and events.
          </p>
          <button
            id="empty-suggest-challenge-btn"
            onClick={() => setSuggestOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md shadow-[#FF6A00]/20 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Suggest a Challenge</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((chal) => (
            <div
              key={chal.id}
              className="p-6 rounded-2xl bg-[#111111] border border-[#242424] hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Active Challenge
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#999999] font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ends: {new Date(chal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{chal.title}</h3>
                <p className="text-xs sm:text-sm text-[#999999] leading-relaxed mb-6">
                  {chal.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F]">
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-[#FF6A00]" />
                    <div>
                      <span className="text-[10px] text-[#777] uppercase font-mono block">Prize Pool</span>
                      <span className="text-xs font-bold text-white">{chal.prize || chal.rewards}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <div>
                      <span className="text-[10px] text-[#777] uppercase font-mono block">Participants</span>
                      <span className="text-xs font-bold text-white">{chal.participantsCount} developers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
                <span className="text-xs text-[#777]">Free entry for registered builders</span>
                <button
                  onClick={() => alert(`Submissions for "${chal.title}" opened. Link your Roblox project or model file.`)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Project</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggest Modal */}
      {suggestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D0D0D] border border-[#242424] rounded-2xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-white mb-1">Suggest a Developer Challenge</h3>
            <p className="text-xs text-[#999999] mb-4">
              Have an idea for a 48-hour Luau game jam or procedural asset challenge? Let the community know.
            </p>

            {suggestSuccess ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300">
                Challenge proposal received! Our community staff will review it.
              </div>
            ) : (
              <form onSubmit={handleSuggest} className="space-y-3">
                <div>
                  <label className="block text-xs text-[#999999] mb-1">Challenge Name</label>
                  <input
                    type="text"
                    required
                    value={suggestTitle}
                    onChange={(e) => setSuggestTitle(e.target.value)}
                    placeholder="e.g. 100-Part Micro Game Jam"
                    className="w-full px-3 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#999999] mb-1">Rules & Guidelines</label>
                  <textarea
                    rows={3}
                    required
                    value={suggestDesc}
                    onChange={(e) => setSuggestDesc(e.target.value)}
                    placeholder="Explain constraints, scoring criteria, and suggested prizes..."
                    className="w-full px-3 py-2 bg-[#111111] border border-[#242424] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setSuggestOpen(false)}
                    className="px-4 py-2 bg-[#161616] text-[#999999] text-xs font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white text-xs font-semibold rounded-lg"
                  >
                    Submit Idea
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
