import React, { useState } from "react";
import { COMPANY_INFO } from "../data/roofingData";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  lightMode?: boolean;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  size = "md",
  lightMode = false,
  showSubtitle = false,
}) => {
  const [hasError, setHasError] = useState(false);

  // Height mappings matching different contexts (Navbar, Form, Hero, Footer)
  const sizeMap = {
    sm: {
      img: "h-11 sm:h-12 max-w-[170px]",
      container: "h-11 sm:h-12",
      textMain: "text-sm",
      textSub: "text-[10px]",
    },
    md: {
      img: "h-14 sm:h-16 max-w-[220px]",
      container: "h-14 sm:h-16",
      textMain: "text-base sm:text-lg",
      textSub: "text-[11px]",
    },
    lg: {
      img: "h-22 sm:h-28 max-w-[340px]",
      container: "h-22 sm:h-28",
      textMain: "text-xl sm:text-2xl",
      textSub: "text-xs sm:text-sm",
    },
    xl: {
      img: "h-28 sm:h-36 max-w-[420px]",
      container: "h-28 sm:h-36",
      textMain: "text-2xl sm:text-3xl",
      textSub: "text-sm sm:text-base",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Mascot Logo (German Shepherd with Tool Belt & "ROOF! ROOF! ROOF!" Sign) */}
      <div 
        className={`relative shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-[1.02] ${
          lightMode 
            ? "p-1 rounded-xl bg-white/10 backdrop-blur-xs shadow-sm ring-1 ring-white/20" 
            : ""
        }`}
      >
        {!hasError ? (
          <picture>
            <source srcSet="/logo.svg" type="image/svg+xml" />
            <img
              src="/180x180.png"
              srcSet="/180x180.png 1x, /logo.png 2x, /logo.svg 3x"
              alt="North East Roofing & Home Improvement Logo"
              referrerPolicy="no-referrer"
              onError={() => setHasError(true)}
              className={`${currentSize.img} w-auto object-contain drop-shadow-md`}
            />
          </picture>
        ) : (
          /* High-Fidelity Inline Vector Fallback */
          <img
            src="/180x180.png"
            alt="North East Roofing & Home Improvement"
            className={`${currentSize.img} w-auto object-contain`}
          />
        )}
      </div>

      {/* Optional Companion Badge / Subtitle for Desktop Header & Letterheads */}
      {showSubtitle && (
        <div className="hidden sm:flex flex-col text-left border-l border-slate-200/80 pl-3">
          <span
            className={`font-black uppercase tracking-wider ${currentSize.textMain} leading-tight ${
              lightMode ? "text-white" : "text-[#022440]"
            }`}
          >
            FAIRFIELD COUNTY, CT
          </span>
          <span className={`font-bold tracking-wide ${currentSize.textSub} text-[#8f0907]`}>
            {COMPANY_INFO.licenseNumber}
          </span>
        </div>
      )}
    </div>
  );
};
