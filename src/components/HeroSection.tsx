import React from "react";
import { BrandLogo } from "./BrandLogo";
import { EstimatorTool } from "./EstimatorTool";
import { COMPANY_INFO } from "../data/roofingData";
import { ShieldCheck, Sparkles, Clock, Check, Phone, ArrowDown } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="calculator-section"
      className="relative min-h-[85vh] bg-[#022440] text-white overflow-hidden flex items-center py-12 lg:py-16"
    >
      {/* High-Resolution Aerial Suburban CT Roof Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=80"
          alt="Aerial view of suburban Fairfield County Connecticut home"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-105"
        />
        {/* Deep Navy Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#022440]/95 via-[#022440]/85 to-[#011627]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#8f0907]/25 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (Matches Screenshot 1) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Logo Emblem Header (Matches Screenshot 1) */}
            <div className="inline-block pb-2">
              <BrandLogo size="lg" lightMode={true} />
            </div>

            {/* Target Audience Pill (Matches Screenshot 1) */}
            <div>
              <span className="inline-block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white bg-[#8f0907] px-3 py-1 rounded-md mb-2 shadow-xs">
                Fairfield County & Surrounding CT Homeowners:
              </span>

              {/* Main Headline (Matches Screenshot 1) */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Get{" "}
                <span className="text-white bg-[#8f0907] px-2 py-0.5 rounded-lg shadow-sm">
                  $1,000 Off
                </span>{" "}
                Your New Roof This September
              </h1>
            </div>

            {/* Sub-headline (Matches Screenshot 1) */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
              Plus, free gutter cleaning included with every roof replacement booked this month. Offer
              ends September 30th.
            </p>

            {/* Why Choose Northeast Roofing Highlights */}
            <div className="pt-2 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Why Choose Northeast Roofing?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#8f0907] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>100% Free In-Person Inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#8f0907] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>GAF & CertainTeed Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#8f0907] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>50-Year Warranty Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#8f0907] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>0% Interest Financing Available</span>
                </div>
              </div>
            </div>

            {/* Direct Phone / Contact Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
                className="bg-[#8f0907] hover:bg-[#730705] text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Call Directly: {COMPANY_INFO.phone}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("schedule-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs sm:text-sm text-slate-200 hover:text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Or schedule directly below</span>
                <ArrowDown className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Cost Estimator (Matches Screenshot 1) */}
          <div className="lg:col-span-6 w-full">
            <EstimatorTool />
          </div>
        </div>
      </div>
    </section>
  );
};
