import React, { useState } from 'react';
import { 
  Bell, Flame, Users, LifeBuoy, ShieldCheck, Check, 
  ExternalLink, Sparkles, MessageSquare 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface DiscordViewProps {
  onNavigate: (route: string) => void;
}

export const DiscordView: React.FC<DiscordViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [discordTag, setDiscordTag] = useState(user?.discordTag || '');
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleLinkDiscord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordTag.trim()) return;
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  const sections = [
    {
      icon: <Bell className="w-5 h-5 text-[#FF6A00]" />,
      title: 'Trade Announcements',
      description:
        'Instant notifications when high-demand Roblox assets, limited edition models, and combat frameworks hit the TradeForge marketplace.',
    },
    {
      icon: <Flame className="w-5 h-5 text-[#FF3D00]" />,
      title: 'Live Auction Alerts',
      description:
        'Sub-second pings for closing auctions, outbid alerts, and final call countdowns so you never lose a rare asset bid.',
    },
    {
      icon: <Users className="w-5 h-5 text-[#5865F2]" />,
      title: 'Developer Collaboration',
      description:
        'Dedicated studios channels to hire scripters, find 3D modelers, form game jam teams, and review open-source Luau modules.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Roblox Verification',
      description:
        'Seamless integration linking your verified Roblox Developer ID to assign tiered roles, reputation badges, and trusted seller perms.',
    },
    {
      icon: <LifeBuoy className="w-5 h-5 text-amber-400" />,
      title: 'Direct Support',
      description:
        'Ticket system for dispute mediation, verification appeals, transaction assistance, and community bug reporting.',
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-neutral-300" />,
      title: 'General Game Lounge',
      description:
        'Chat with fellow Roblox builders, share work-in-progress game clips, playtest new releases, and exchange building techniques.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#111111] to-[#0A0A0A] border border-[#242424] p-8 sm:p-12 text-center overflow-hidden mb-12 shadow-2xl">
        {/* Glowing background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#5865F2]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Discord Logo SVG */}
        <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center mx-auto mb-6 text-[#5865F2]">
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#2B2B2B] text-xs font-mono text-[#5865F2] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5865F2] animate-pulse"></span>
          Official Community Server
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Connect with TradeForge on Discord
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#999999] mb-8 leading-relaxed">
          The central communications nerve of the TradeForge platform. Get real-time auction notifications, connect with verified Roblox builders, and take part in developer roundtables.
        </p>

        <a
          id="join-discord-btn"
          href="https://discord.gg"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-sm shadow-lg shadow-[#5865F2]/25 transition-all active:scale-98"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>Join TradeForge Discord</span>
          <ExternalLink className="w-4 h-4 opacity-75" />
        </a>
      </div>

      {/* Grid of Sections: Trade announcements, Live auction alerts, Developer collaboration, Support, Roblox verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-[#111111] border border-[#242424] hover:border-[#383838] transition-colors"
          >
            <div className="p-2.5 rounded-xl bg-[#161616] border border-[#262626] w-fit mb-4">
              {sec.icon}
            </div>
            <h3 className="text-base font-bold text-white mb-2">{sec.title}</h3>
            <p className="text-xs sm:text-sm text-[#999999] leading-relaxed">
              {sec.description}
            </p>
          </div>
        ))}
      </div>

      {/* Account Sync Card */}
      <div className="p-8 rounded-2xl bg-[#0D0D0D] border border-[#242424]">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-lg font-bold text-white mb-2">Sync Your Discord Handle</h3>
          <p className="text-xs text-[#999999] mb-5">
            Link your Discord tag to your TradeForge profile to unlock auction notifications and verified creator roles.
          </p>

          {syncSuccess ? (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Discord handle saved to your account!</span>
            </div>
          ) : (
            <form onSubmit={handleLinkDiscord} className="flex gap-2">
              <input
                type="text"
                value={discordTag}
                onChange={(e) => setDiscordTag(e.target.value)}
                placeholder="Your Discord Tag (e.g. builderman#0001)"
                className="flex-1 px-4 py-2.5 bg-[#111111] border border-[#242424] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#181818] hover:bg-[#202020] text-white border border-[#2E2E2E] rounded-xl text-xs font-semibold"
              >
                Sync Handle
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
