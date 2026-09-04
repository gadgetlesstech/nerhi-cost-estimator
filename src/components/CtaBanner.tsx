import React from "react";
import { COMPANY_INFO } from "../data/roofingData";
import { Phone, Calendar, ArrowUp } from "lucide-react";

export const CtaBanner: React.FC = () => {
  const scrollToEstimator = () => {
    const el = document.getElementById("calculator-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSchedule = () => {
    const el = document.getElementById("schedule-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left sm:text-center">
        {/* Title (Matches Screenshot 5) */}
        <h2 className="text-3xl sm:text-4xl font-black text-[#022440] tracking-tight leading-snug">
          Is Your Roof Showing Signs Of Age Or Damage?
        </h2>

        {/* Copy (Matches Screenshot 5) */}
        <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Many homeowners don't realize they need a roof replacement until water damage, leaks, or
          expensive interior repairs begin to appear. Let {COMPANY_INFO.name} inspect your roof and
          help you understand your options before small problems become major headaches.
        </p>

        {/* Action Buttons (Matches Screenshot 5) */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            type="button"
            onClick={scrollToSchedule}
            className="w-full sm:w-auto bg-[#8f0907] hover:bg-[#730705] text-white font-black text-sm sm:text-base px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Book My Free Inspection</span>
          </button>

          <button
            type="button"
            onClick={scrollToEstimator}
            className="w-full sm:w-auto bg-[#022440] hover:bg-[#011627] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowUp className="w-4 h-4 text-red-400" />
            <span>Calculate Roof Cost</span>
          </button>
        </div>
      </div>
    </section>
  );
};
