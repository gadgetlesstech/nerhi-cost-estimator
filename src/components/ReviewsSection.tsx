import React, { useState } from "react";
import { REVIEWS_DATA, COMPANY_INFO } from "../data/roofingData";
import { Star, Sparkles, Quote, ExternalLink, CheckCircle } from "lucide-react";

export const ReviewsSection: React.FC = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  return (
    <section id="reviews-section" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: "What They Say" with big quote marks (Screenshot 4) */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs sm:text-sm font-bold text-[#8f0907] uppercase tracking-widest">
            Google Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#022440] tracking-tight">
            What They Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real feedback from verified homeowners across Fairfield County, Connecticut.
          </p>
        </div>

        {/* Featured Quote Cards (Screenshot 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {REVIEWS_DATA.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Brand Red Quote Mark */}
                <div className="text-[#8f0907] mb-3">
                  <Quote className="w-10 h-10 rotate-180 fill-[#8f0907]/15 stroke-[#8f0907]" />
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  {item.reviewText}
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full ${item.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs`}
                  >
                    {item.avatarText}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500">{item.town}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Google Reviews Badge Bar & AI Summary (Screenshot 5) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#022440] tracking-tight">
                What our clients say about us
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified ratings from Google Maps & Local Services
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-slate-900">5.00</span>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">7+ reviews</span>
                </div>
              </div>

              <a
                href={COMPANY_INFO.website}
                target="_blank"
                rel="noreferrer"
                className="bg-[#022440] hover:bg-[#011627] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Write a review</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Review Cards Grid with Google G Icon & AI Summary (Screenshot 5) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {/* AI Summary Card (Screenshot 5) */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[#022440] font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-[#8f0907]" />
                  <span>AI Summary</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consistently praised for high-quality craftsmanship, responsive and organized
                  communication, fair pricing, and efficient handling of small and large roofing &
                  exterior projects.
                </p>
              </div>
              <div className="pt-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Fairfield County Reviews
              </div>
            </div>

            {/* Individual Review Cards */}
            {REVIEWS_DATA.slice(0, 7).map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-5 border border-slate-200/90 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <span>5</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">{review.date}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed">
                    {review.reviewText}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full ${review.avatarBg} text-white font-bold text-[10px] flex items-center justify-center`}
                    >
                      {review.avatarText}
                    </div>
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[90px]">
                      {review.name}
                    </span>
                  </div>

                  {/* Google G Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-[11px] text-slate-400">
            Powered by verified customer reviews for Northeast Roofing and Home Improvement LLC
          </div>
        </div>
      </div>
    </section>
  );
};
