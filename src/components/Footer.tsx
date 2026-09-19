import React from 'react';
import { Logo } from './Logo.tsx';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#070707] border-t border-[#1C1C1C] pt-14 pb-10 text-xs text-[#999999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <Logo size="md" />
            <p className="text-xs text-[#888888] max-w-sm leading-relaxed">
              &ldquo;Trade smarter. Build bigger.&rdquo; The dedicated ecosystem and peer-to-peer asset marketplace for Roblox builders, Luau scripters, and game studios.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-[#777]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All systems operational • TradeForge Protocol</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase text-white font-bold tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">
                  Explore Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors">
                  Asset Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('auctions')} className="hover:text-white transition-colors">
                  Live Auctions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('developers')} className="hover:text-white transition-colors">
                  Developer Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Community */}
          <div>
            <h4 className="text-xs font-mono uppercase text-white font-bold tracking-wider mb-3">Community</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('community')} className="hover:text-white transition-colors">
                  Developer Forums
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('challenges')} className="hover:text-white transition-colors">
                  Creator Challenges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('discord')} className="hover:text-white transition-colors">
                  Discord Server
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div>
            <h4 className="text-xs font-mono uppercase text-white font-bold tracking-wider mb-3">Account</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  My Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-white transition-colors">
                  Profile Settings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition-colors">
                  Join TradeForge
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-[#191919] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#666666]">
          <p>© {new Date().getFullYear()} TRADEFORGE. All rights reserved.</p>
          <p className="max-w-lg text-center sm:text-right">
            TradeForge is an independent community and developer utility. Not affiliated with, sponsored, or endorsed by Roblox Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
};
