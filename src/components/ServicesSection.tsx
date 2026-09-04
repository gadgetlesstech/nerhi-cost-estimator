import React, { useState } from "react";
import { SERVICES_DATA, COMPANY_INFO } from "../data/roofingData";
import { Check, Phone, ArrowRight, ShieldCheck } from "lucide-react";

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <section id="services-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matches Screenshot 2) */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2.5">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#8f0907]">
            What We Do:
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#022440] tracking-tight leading-tight">
            Complete Roofing Services for Fairfield County Homeowners
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From emergency repairs and high-wind storm mitigation to full architectural shingle
            replacements, Northeast Roofing & Home Improvement delivers unmatched Connecticut
            craftsmanship.
          </p>
        </div>

        {/* 3 Main Service Cards (Screenshot 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES_DATA.slice(0, 3).map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Container */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-[#022440]/90 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  Fairfield County, CT
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#8f0907] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-1.5 pt-2">
                    {service.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-[#8f0907] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("calculator-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-[#8f0907] hover:text-[#730705] flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer"
                  >
                    <span>Get Cost Estimate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Free Consultation
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supplementary Services: Gutters & Chimney Flashing */}
        <div className="mt-12 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/90 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8f0907]">
              Exterior Home Improvement
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-[#022440]">
              Seamless Gutters, Siding & Chimney Flashing
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In addition to roofing, we install custom seamless 5" and 6" aluminum gutters with
              micro-mesh leaf guards, lead & copper chimney flashing, and James Hardie siding.
              Schedule your full exterior inspection to bundle and save.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Custom On-Site Extrusion</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Lifetime Clog-Free Warranties</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <a
              href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
              className="bg-[#022440] hover:bg-[#011627] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Phone className="w-4 h-4 text-red-400" />
              <span>Call For Quick Quote: {COMPANY_INFO.phone}</span>
            </a>
            <button
              onClick={() => {
                const el = document.getElementById("schedule-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#8f0907] hover:bg-[#730705] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Schedule Inspection</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
