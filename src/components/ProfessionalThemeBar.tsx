import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { ThemeMode } from "../types";
import { Sparkles, ShieldCheck, FileText, Compass, X, Check, Award, Sliders, ExternalLink } from "lucide-react";
import { COMPANY_INFO } from "../data/roofingData";

export const ProfessionalThemeBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <>
      <aside aria-label="Theme mode switcher" className="bg-slate-950 border-b border-slate-800/80 text-xs text-slate-300 py-2 px-3 sm:px-4 transition-colors relative z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Left Indicator */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8f0907]/30 text-red-200 border border-[#8f0907]/50">
              <Sparkles className="w-3 h-3 text-red-400 animate-pulse" />
              Northeast Brand Palette Active: Red (#8f0907) • Navy (#022440) • White
            </span>
            <span className="hidden md:inline text-slate-400">
              Fairfield County CT Homeowner Edition
            </span>
          </div>

          {/* Center/Right: Interactive Theme Switcher Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-slate-400 hidden sm:inline text-[11px] font-medium">Style:</span>

            <button
              type="button"
              onClick={() => setTheme("professional")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                theme === "professional"
                  ? "bg-[#8f0907] text-white shadow-xs font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title="Northeast Roofing Brand Colors (Red #8f0907, Blue #022440, White #ffffff)"
            >
              <Sparkles className="w-3 h-3" />
              <span>Northeast Brand</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("classic")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                theme === "classic"
                  ? "bg-[#022440] text-white shadow-xs font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title="Navy Blue #022440 Accent Mode"
            >
              <span>Navy Accent</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("minimal")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                theme === "minimal"
                  ? "bg-white text-slate-950 shadow-xs font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title="Clean White & Architectural Slate"
            >
              <span>Clean Light</span>
            </button>

            {/* Polish Specs Trigger */}
            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="ml-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <Sliders className="w-3 h-3 text-red-400" />
              <span className="hidden xs:inline">Brand Specs</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Polish Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  Professional Polish Theme Highlights
                </h3>
                <p className="text-xs text-slate-400">
                  Engineered specifically for Northeast Roofing and Home Improvement
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              This theme brings executive craftsmanship to residential roofing in Fairfield County, CT.
              Every element is tailored to foster trust, high conversion, and clear homeowner education:
            </p>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Verified Contractor Credentials</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Real Connecticut License verification ({COMPANY_INFO.licenseNumber}), $2M General Liability,
                    full Worker&apos;s Compensation, and CertainTeed / GAF manufacturer certifications.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Interactive Pitch Visualizer</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Roof pitch selector provides visual degree guides for low (2/12 - 4/12), standard colonial (5/12 - 8/12),
                    and steep mansard/cape (9/12+) configurations with live cost multipliers.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Itemized Estimate Export & Print</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Calculated estimates include a formatted contractor scope of work with transparent line items
                    for tear-off, synthetic underlayment, ice/water barrier, ventilation, and gutters.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Interactive Before &amp; After Transformations</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Real Fairfield County residential transformations with instant Before/After comparison toggles
                    demonstrating architectural shingle upgrades.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Close &amp; Explore Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
