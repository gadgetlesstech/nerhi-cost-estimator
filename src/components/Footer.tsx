import React, { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { COMPANY_INFO } from "../data/roofingData";
import { Phone, Mail, MapPin, ShieldCheck, Clock, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <footer className="w-full">
      {/* Brand Red Contact Strip */}
      <div className="bg-[#8f0907] text-white py-4 px-4 sm:px-8 border-y border-[#730705] font-bold text-xs sm:text-sm shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-around gap-4 text-center">
          <a
            href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>
              Call: <span className="underline decoration-white/50">{COMPANY_INFO.phone}</span>
            </span>
          </a>

          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            <span>
              Email: <span className="underline decoration-white/50">{COMPANY_INFO.email}</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-2 text-white/90">
            <Clock className="w-4 h-4 text-red-200" />
            <span>Mon–Sat 7am–7pm • 24/7 Emergency Storm Response</span>
          </div>
        </div>
      </div>

      {/* Main Footer Body (Matches Screenshot 6) */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Centered Logo */}
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        {/* Address & License Details */}
        <div className="text-xs text-slate-500 max-w-lg mx-auto space-y-1">
          <p className="flex items-center justify-center gap-1 font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-[#8f0907]" />
            {COMPANY_INFO.address}
          </p>
          <p>
            Serving Stamford, Greenwich, Norwalk, Westport, Fairfield, Darien, New Canaan &
            Fairfield County, CT.
          </p>
          <p className="text-[11px] text-slate-400">
            Connecticut Home Improvement Contractor #{COMPANY_INFO.licenseNumber} • Fully Licensed &
            Insured
          </p>
        </div>

        {/* Legal Links (Matches Screenshot 6) */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="hover:text-[#8f0907] transition-colors underline cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="hover:text-[#8f0907] transition-colors underline cursor-pointer"
          >
            Terms of Service
          </button>
          <span>|</span>
          <a
            href={COMPANY_INFO.website}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#8f0907] transition-colors underline flex items-center gap-1"
          >
            <span>Official Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Copyright (Matches Screenshot 6) */}
        <div className="pt-2 text-xs text-slate-400 border-t border-slate-100 max-w-md mx-auto">
          <p>Copyright 2026. All rights reserved. Northeast Roofing and Home Improvement.</p>
          <p className="text-[10px] text-slate-400 mt-1">
            Estimates provided by this online cost estimator tool are for initial informational
            planning purposes and subject to on-site physical verification by an authorized technician.
          </p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div
          className="fixed inset-0 z-50 bg-[#022440]/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div
            className="bg-white max-w-lg w-full rounded-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-[#022440]">Privacy Policy</h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>{COMPANY_INFO.name}</strong> respects your privacy. Information submitted
                through our online roofing cost estimator and direct schedule forms is used solely to
                provide roofing quotes, schedule in-person roof inspections, and communicate project
                details.
              </p>
              <p>
                We do not sell, rent, or lease your personal contact information to any third parties
                or lead generation aggregators. All estimates are strictly confidential.
              </p>
              <p>
                For questions regarding your data or to request removal, please contact Dillon directly
                at {COMPANY_INFO.email} or call {COMPANY_INFO.phone}.
              </p>
            </div>
            <div className="pt-3 border-t text-right">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="bg-[#022440] hover:bg-[#011627] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-50 bg-[#022440]/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="bg-white max-w-lg w-full rounded-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-[#022440]">Terms of Service</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Estimates generated via the Northeast Roofing online cost calculator are good-faith
                preliminary ranges based on square footage, pitch, and shingle options provided by the
                homeowner.
              </p>
              <p>
                A certified on-site roof inspection is required to finalize measurements, examine
                underlying plywood deck condition, assess chimney flashing, and confirm town building
                code requirements in Connecticut.
              </p>
              <p>
                Special promotional vouchers ($1,000 September discount) apply to full roof
                replacement contracts signed during the qualifying promotional period.
              </p>
            </div>
            <div className="pt-3 border-t text-right">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-[#022440] hover:bg-[#011627] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
