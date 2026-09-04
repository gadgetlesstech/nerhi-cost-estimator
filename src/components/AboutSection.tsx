import React, { useState } from "react";
import { COMPANY_INFO } from "../data/roofingData";
import { ShieldCheck, Award, ThumbsUp, Wrench, CheckCircle, Maximize2, X, User } from "lucide-react";

export const AboutSection: React.FC = () => {
  const [photoError, setPhotoError] = useState(false);
  const [showFullPhoto, setShowFullPhoto] = useState(false);
  const founderPhotoSrc = COMPANY_INFO.founderPhoto || "/424639366_10160489814589081_5574873227719755200_n.jpg";
  return (
    <section id="about-section" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left / Main Text (Matches Screenshot 3) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#8f0907] block">
                | ABOUT US
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#022440] tracking-tight leading-tight">
                Roofing Solutions Built On Quality, Experience & Trust
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <p>
                At <strong>{COMPANY_INFO.name}</strong>, we understand that your roof is one of the
                most important investments protecting your family and your home.
              </p>
              <p>
                For over {COMPANY_INFO.experienceYears} years, owner <strong>{COMPANY_INFO.founder}</strong> and his
                dedicated team have helped Connecticut homeowners protect their properties with
                exceptional roofing solutions, honest recommendations, and workmanship built to
                withstand New England's snow, hail, wind, and heat.
              </p>
              <p>
                Whether you're dealing with storm damage, an aging roof, active leaks, or simply know
                it's time for a replacement, our team takes pride in delivering reliable service and
                results homeowners can feel confident about.
              </p>
              <p>
                With more than {COMPANY_INFO.completedProjects} completed projects throughout Stamford,
                Greenwich, Norwalk, Westport, Fairfield, Darien, New Canaan, and surrounding
                communities, we've built our reputation by treating every home as if it were our own.
              </p>
              <p className="font-semibold text-slate-900 italic border-l-3 border-[#8f0907] pl-4 py-1">
                "Our goal is simple: provide a stress-free experience, quality craftsmanship, and a roof
                that protects your family for years to come."
              </p>
            </div>

            {/* Founder Card (Matches User Request: Dillon Zaro Owner & Lead Contractor) */}
            <div className="pt-4 flex items-center gap-4">
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setShowFullPhoto(true)}
                  className="relative block rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#8f0907] focus:ring-offset-2 transition-transform hover:scale-105 cursor-pointer"
                  title="Click to view full photo"
                >
                  <img
                    src={photoError ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&h=250&q=80" : founderPhotoSrc}
                    alt={`${COMPANY_INFO.founder} - Northeast Roofing Owner`}
                    referrerPolicy="no-referrer"
                    onError={() => {
                      // Graceful fallback to avoid broken image if local file is still being cached
                      setPhotoError(true);
                    }}
                    className="w-18 h-18 sm:w-22 sm:h-22 rounded-full object-cover object-[74%_18%] border-2 border-[#8f0907] shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-colors">
                    <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                  </div>
                </button>
                <div 
                  className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-xs ring-2 ring-white"
                  title="Verified CT Licensed Contractor"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-black text-slate-900">
                    {COMPANY_INFO.founder}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#8f0907] border border-red-200">
                    Owner On Every Job
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#8f0907]">
                  {COMPANY_INFO.founderTitle}, {COMPANY_INFO.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fairfield County Native • Licensed CT Contractor #0658421
                </p>
                <button
                  type="button"
                  onClick={() => setShowFullPhoto(true)}
                  className="text-[11px] font-semibold text-[#022440] hover:text-[#8f0907] hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <User className="w-3 h-3" />
                  <span>View Full Photo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Key Trust Badges & Highlights */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md space-y-4">
              <h3 className="text-base font-black text-[#022440] border-b border-slate-100 pb-3">
                Why Connecticut Trusts Us
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-50 text-[#8f0907] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Fully Licensed & Insured</h5>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      CT Home Improvement Contractor (HIC). Full liability & worker's comp coverage.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-[#022440] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">GAF & CertainTeed Standards</h5>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Installed to strict manufacturer specifications for 50-year system warranties.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">5.0 Star Google Reputation</h5>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Consistently praised for spotless cleanup, fair pricing, and clear communication.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Magnetic Nail Sweep Guaranteed</h5>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      We sweep driveways and flowerbeds twice to protect tires and family pets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
                  className="w-full bg-[#022440] hover:bg-[#011627] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Speak Directly with Dillon</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Photo Modal / Lightbox */}
      {showFullPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowFullPhoto(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#022440] text-white">
              <div>
                <h3 className="font-bold text-sm sm:text-base">Dillon — Owner & Lead Contractor</h3>
                <p className="text-xs text-red-200">Northeast Roofing and Home Improvement</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFullPhoto(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-900 flex justify-center">
              <img
                src={photoError ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80" : founderPhotoSrc}
                alt="Dillon - Northeast Roofing"
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                <p className="font-semibold text-slate-800">Fairfield County Native • Licensed CT Contractor #0658421</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Dillon on-site ensuring quality on every New England roofing project.</p>
              </div>
              <a
                href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
                className="w-full sm:w-auto px-4 py-2 bg-[#8f0907] hover:bg-[#730705] text-white font-bold rounded-lg text-xs transition-colors shrink-0 text-center"
              >
                Call Dillon Directly
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
