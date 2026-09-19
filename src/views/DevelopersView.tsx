import React, { useState, useEffect } from 'react';
import { Users, Code, Award, ExternalLink, ShieldCheck, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import type { Profile } from '../types.ts';

interface DevelopersViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const DevelopersView: React.FC<DevelopersViewProps> = ({ onNavigate }) => {
  const [developers, setDevelopers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/developers')
      .then((res) => (res.ok ? res.json() : { developers: [] }))
      .then((data) => setDevelopers(data.developers || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00]"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF6A00]">Creator Index</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Roblox Developer Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#999999] mt-1">
            Discover verified scripters, 3D modelers, UI designers, and game studio directors.
          </p>
        </div>

        <button
          onClick={() => onNavigate('register')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 shadow-md shadow-[#FF6A00]/25 transition-all self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Join as Developer</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-[#999999] text-sm">
          <div className="inline-block w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mb-3"></div>
          <div>Loading developer directory...</div>
        </div>
      ) : developers.length === 0 ? (
        /* EXACT requested empty state */
        <div className="py-24 px-4 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424] max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-[#FF6A00]">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Developer directory will grow as creators join TradeForge.
          </h3>
          <p className="text-sm text-[#999999] max-w-md mx-auto mb-6">
            Register your profile, list your skills, link your Roblox username, and showcase your experience.
          </p>
          <button
            id="empty-join-developer-btn"
            onClick={() => onNavigate('register')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md shadow-[#FF6A00]/20 inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join as Developer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="p-6 rounded-2xl bg-[#111111] border border-[#242424] hover:border-[#FF6A00]/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#262626] text-[#FF6A00] flex items-center justify-center text-lg font-bold overflow-hidden">
                      {dev.avatarUrl ? (
                        <img src={dev.avatarUrl} alt={dev.username} className="w-full h-full object-cover" />
                      ) : (
                        dev.username[0]?.toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                        {dev.displayName}
                        {dev.verifiedBadge && (
                          <ShieldCheck className="w-4 h-4 text-[#FF6A00]" />
                        )}
                      </h3>
                      <p className="text-xs text-[#999999]">@{dev.username}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-[#777] block">Reputation</span>
                    <span className="text-sm font-mono font-bold text-[#FF6A00] flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {dev.reputationScore}
                    </span>
                  </div>
                </div>

                {/* Roblox Username Link */}
                {dev.robloxUsername && (
                  <div className="mb-3 px-3 py-1.5 rounded-lg bg-[#161616] border border-[#222] flex items-center justify-between text-xs">
                    <span className="text-[#999999]">Roblox User:</span>
                    <span className="text-white font-mono font-medium">@{dev.robloxUsername}</span>
                  </div>
                )}

                {/* Bio */}
                <p className="text-xs text-[#CCCCCC] leading-relaxed mb-4 line-clamp-3">
                  {dev.bio || 'Roblox builder, modeler, and Luau scripter on TradeForge.'}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <span className="text-[11px] font-mono text-[#888888] block mb-1.5">Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dev.skills && dev.skills.length > 0 ? (
                      dev.skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-[#181818] border border-[#262626] text-neutral-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#666]">Luau, Studio Building</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between">
                <button
                  onClick={() => onNavigate('profile', dev.username)}
                  className="text-xs font-semibold text-[#FF6A00] hover:text-[#FF7E1F] flex items-center gap-1 transition-colors"
                >
                  <span>View Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {dev.portfolioUrl && (
                  <a
                    href={dev.portfolioUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-1.5 rounded-lg bg-[#161616] border border-[#262626] text-[#999999] hover:text-white transition-colors"
                    title="External portfolio"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
