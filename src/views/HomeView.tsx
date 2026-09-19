import React from 'react';
import { 
  ShoppingBag, Flame, Users, Trophy, Code2, Disc as DiscordIcon, 
  ArrowRight, ShieldCheck, Zap, Layers, ChevronRight, Terminal 
} from 'lucide-react';
import { Logo } from '../components/Logo.tsx';

interface HomeViewProps {
  onNavigate: (route: string) => void;
  onOpenCreateListing: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenCreateListing }) => {
  const features = [
    {
      icon: <ShoppingBag className="w-6 h-6 text-[#FF6A00]" />,
      title: 'Marketplace',
      description: 'Discover and trade items with the community.',
      action: () => onNavigate('marketplace'),
      actionLabel: 'Browse Marketplace',
    },
    {
      icon: <Flame className="w-6 h-6 text-[#FF3D00]" />,
      title: 'Auctions',
      description: 'Create and participate in community auctions.',
      action: () => onNavigate('auctions'),
      actionLabel: 'View Active Auctions',
    },
    {
      icon: <Users className="w-6 h-6 text-[#FF6A00]" />,
      title: 'Developer Community',
      description: 'Connect with Roblox developers and creators.',
      action: () => onNavigate('developers'),
      actionLabel: 'Meet Developers',
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-500" />,
      title: 'Challenges',
      description: 'Build projects and participate in community challenges.',
      action: () => onNavigate('challenges'),
      actionLabel: 'Explore Challenges',
    },
    {
      icon: <Code2 className="w-6 h-6 text-[#FF7E1F]" />,
      title: 'Showcase',
      description: 'Share your Roblox projects with the community.',
      action: () => onNavigate('explore'),
      actionLabel: 'Explore Showcases',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      ),
      title: 'Discord',
      description: 'Connect your TradeForge account with Discord.',
      action: () => onNavigate('discord'),
      actionLabel: 'Join Server',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* 
        HERO SECTION:
        Subtle futuristic background using CSS effects only.
        NO AI images. NO stock photos.
      */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 border-b border-[#1E1E1E]">
        {/* Background CSS Grid & Glowing Radiance */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-radial-glow pointer-events-none"></div>
        
        {/* Abstract CSS shapes (No images) */}
        <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-[#FF6A00]/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#FF3D00]/5 blur-3xl pointer-events-none"></div>

        {/* Ambient subtle cyber horizon line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6A00]/40 to-transparent"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#242424] text-xs font-mono text-[#FF6A00] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse"></span>
            Roblox Developer & Gaming Community Platform
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
            TRADE<span className="text-[#FF6A00]">FORGE</span>
          </h1>

          {/* Tagline */}
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-200 mb-6 font-sans">
            &ldquo;Trade smarter. Build bigger.&rdquo;
          </div>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#999999] mb-10 leading-relaxed">
            A modern community for Roblox developers, creators and players. Discover verified assets, participate in transparent auctions, and collaborate with top builders.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-explore-btn"
              onClick={() => onNavigate('explore')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-sm hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-[#FF6A00]/25 flex items-center justify-center gap-2"
            >
              <span>Explore TradeForge</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-discord-btn"
              onClick={() => onNavigate('discord')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0D0D0D] border border-[#242424] hover:border-[#5865F2]/50 text-white font-semibold text-sm hover:bg-[#141414] active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Join Discord</span>
            </button>
          </div>

          {/* Minimalist Abstract Code/Terminal Graphic (Pure CSS/SVG, NO STOCK PHOTOS) */}
          <div className="mt-14 max-w-3xl mx-auto rounded-xl bg-[#0D0D0D] border border-[#242424] p-4 text-left shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E1E1E]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#333]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#333]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#333]"></span>
                <span className="text-xs font-mono text-[#999999] ml-2">tradeforge://protocol.luau</span>
              </div>
              <span className="text-[11px] font-mono text-[#FF6A00] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]"></span> active
              </span>
            </div>
            <pre className="text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">
              <code>
                <span className="text-[#999999]">-- Connect to TradeForge developer ecosystem</span><br />
                <span className="text-[#FF6A00]">local</span> TradeForge = <span className="text-[#FF7E1F]">require</span>(game.ReplicatedStorage.TradeForge)<br />
                <span className="text-[#FF6A00]">local</span> marketplace = TradeForge.Marketplace:Connect(&#123; verifiedOnly = <span className="text-white">true</span> &#125;)<br />
                <span className="text-[#999999]">-- Listing, auctions, and developer portfolios sync in real time</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* 
        FEATURES SECTION:
        Marketplace, Auctions, Developer Community, Challenges, Showcase, Discord
      */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase text-[#FF6A00] tracking-wider mb-2">
            Ecosystem Modules
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Built for Roblox Builders, Traders & Studios
          </h2>
          <p className="text-sm text-[#999999]">
            A dedicated hub engineered from the ground up for the next generation of Roblox creation and trade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="group relative p-6 rounded-2xl bg-[#111111] border border-[#242424] hover:border-[#FF6A00]/40 transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-[#FF6A00]/5 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 w-fit rounded-xl bg-[#161616] border border-[#262626] mb-4 group-hover:border-[#FF6A00]/30 transition-colors">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-[#999999] leading-relaxed mb-6">
                  {feat.description}
                </p>
              </div>

              <button
                onClick={feat.action}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6A00] hover:text-[#FF7E1F] transition-colors pt-2 border-t border-[#1C1C1C]"
              >
                <span>{feat.actionLabel}</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Pillars Banner */}
      <section className="py-16 bg-[#0D0D0D] border-y border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-[#242424] text-[#FF6A00]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Authentic Community</h4>
                <p className="text-xs text-[#999999] leading-relaxed">
                  No artificial bots, inflated stats, or fake volume. Every developer, project, and auction is real.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-[#242424] text-[#FF6A00]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Instant Luau Integration</h4>
                <p className="text-xs text-[#999999] leading-relaxed">
                  Engineered specifically for Roblox developers, supporting scripts, plugins, and game framework modules.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-[#242424] text-[#FF6A00]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Decentralized Trade Layer</h4>
                <p className="text-xs text-[#999999] leading-relaxed">
                  Structured schemas for peer-to-peer asset barter, timed open bidding, and developer reputation tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Footer Banner */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <div className="p-10 rounded-2xl bg-gradient-to-b from-[#111111] to-[#0A0A0A] border border-[#242424] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6A00]/10 rounded-full blur-2xl pointer-events-none"></div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to trade smarter and build bigger?
          </h3>
          <p className="text-sm text-[#999999] max-w-lg mx-auto mb-8">
            Create your TradeForge developer profile, publish your first listing or plugin, and link your Roblox handle.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md shadow-[#FF6A00]/25"
            >
              Create Free Account
            </button>
            <button
              onClick={onOpenCreateListing}
              className="px-6 py-3 rounded-xl bg-[#161616] text-[#999999] hover:text-white border border-[#282828] text-xs sm:text-sm font-medium transition-colors"
            >
              Create a Listing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
