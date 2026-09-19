import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* High-tech Forge Emblem (SVG) */}
      <div className={`relative flex items-center justify-center rounded-lg bg-gradient-to-b from-[#1E1E1E] to-[#0D0D0D] border border-[#242424] p-1.5 shadow-sm shadow-[#FF6A00]/20 group-hover:border-[#FF6A00]/50 transition-colors ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Stylized Forge Anvil & Hammer geometric planes */}
          <path
            d="M5 9C5 7.89543 5.89543 7 7 7H25C26.1046 7 27 7.89543 27 9V12C27 13.1046 26.1046 14 25 14H22L20 22H24C24.5523 22 25 22.4477 25 23V25H7V23C7 22.4477 7.44772 22 8 22H12L10 14H7C5.89543 14 5 13.1046 5 12V9Z"
            fill="#181818"
            stroke="#383838"
            strokeWidth="1.5"
          />
          {/* Vibrant Forge Core Spark / Orange Accent */}
          <path
            d="M13 10L19 10L16 17L20 17L12 25L14 18L10 18L13 10Z"
            fill="url(#forgeOrangeGrad)"
          />
          <defs>
            <linearGradient id="forgeOrangeGrad" x1="10" y1="10" x2="20" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF7E1F" />
              <stop offset="1" stopColor="#FF3D00" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`font-black tracking-tight leading-none flex items-center font-sans ${textSizes[size]}`}>
          <span className="text-white">TRADE</span>
          <span className="text-[#FF6A00] ml-1">FORGE</span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase text-[#999999] font-mono mt-0.5">
            Trade smarter. Build bigger.
          </span>
        )}
      </div>
    </div>
  );
};
