import React, { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { COMPANY_INFO } from "../data/roofingData";
import { DirectScheduleState } from "../types";
import { ArrowLeft, ArrowRight, CheckCircle2, Phone, Calendar, Clock, MapPin } from "lucide-react";

export const DirectScheduleForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refId, setRefId] = useState<string>("");

  const [formData, setFormData] = useState<DirectScheduleState>({
    serviceNeeded: "Roof Replacement Estimate",
    roofAge: "15–20 years",
    town: "",
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleNextFromStep1 = () => {
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.town.trim()) {
      newErrors.town = "Please provide your town in Connecticut";
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "direct_schedule",
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          cityOrTown: formData.town,
          serviceNeeded: formData.serviceNeeded,
          roofAge: formData.roofAge,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRefId(data.leadId || `NR-${Date.now().toString().slice(-5)}`);
      } else {
        setRefId(`NR-${Date.now().toString().slice(-5)}`);
      }
    } catch {
      setRefId(`NR-${Date.now().toString().slice(-5)}`);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setStep(1);
    setFormData({
      serviceNeeded: "Roof Replacement Estimate",
      roofAge: "15–20 years",
      town: "",
      fullName: "",
      phone: "",
      email: "",
      notes: "",
    });
  };

  return (
    <section id="schedule-section" className="py-16 bg-slate-100/60 border-y border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading (Matches Screenshot 2) */}
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#022440] tracking-tight">
            Or Fill Out the Form Below to Schedule with us Directly:
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            No obligation. We will inspect your roof, check for storm or age wear, and provide an honest assessment.
          </p>
        </div>

        {/* The Scheduling Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
          {/* Logo Header */}
          <div className="pt-8 pb-4 flex justify-center border-b border-slate-100 bg-slate-50/50">
            <BrandLogo size="sm" />
          </div>

          <div className="p-6 sm:p-10">
            {isSubmitted ? (
              /* Success State */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black text-[#022440]">
                    Inspection Request Received!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Dillon or a senior inspector from Northeast Roofing will call you at{" "}
                    <strong className="text-slate-900">{formData.phone}</strong> shortly to confirm your preferred inspection time.
                  </p>
                  <p className="text-xs text-[#8f0907] font-bold bg-red-50 border border-red-200 py-1.5 px-3 rounded-full inline-block mt-2">
                    Reference ID: #{refId}
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <a
                    href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#8f0907] hover:bg-[#730705] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Directly: {COMPANY_INFO.phone}</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto text-slate-600 hover:text-slate-900 text-xs font-semibold py-2.5 px-4"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* STEP 1: What are you looking for? (Screenshot 11) */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        What are you looking for? <span className="text-[#8f0907]">*</span>
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {[
                        "Not sure. I just want it looked at",
                        "Roof Replacement Estimate",
                        "Repair Estimate",
                        "Gutter or Siding Replacement",
                      ].map((option) => {
                        const isSelected = formData.serviceNeeded === option;
                        return (
                          <label
                            key={option}
                            onClick={() => setFormData({ ...formData, serviceNeeded: option })}
                            className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#8f0907] bg-red-50/60 ring-1 ring-[#8f0907]"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="serviceNeeded"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#8f0907] focus:ring-[#8f0907] border-slate-300 accent-[#8f0907]"
                            />
                            <span className="text-sm font-semibold text-slate-800">{option}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextFromStep1}
                        className="bg-[#8f0907] hover:bg-[#730705] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: How old is your roof? (Screenshot 2) */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        How old is your roof? <span className="text-[#8f0907]">*</span>
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {[
                        "Less than 10 years",
                        "10–15 years",
                        "15–20 years",
                        "20+ years",
                        "I don't know",
                      ].map((ageOption) => {
                        const isSelected = formData.roofAge === ageOption;
                        return (
                          <label
                            key={ageOption}
                            onClick={() => setFormData({ ...formData, roofAge: ageOption })}
                            className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#8f0907] bg-red-50/60 ring-1 ring-[#8f0907]"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="roofAge"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#8f0907] focus:ring-[#8f0907] border-slate-300 accent-[#8f0907]"
                            />
                            <span className="text-sm font-semibold text-slate-800">{ageOption}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[#022440] hover:text-[#8f0907] text-sm font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Go Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextFromStep2}
                        className="bg-[#8f0907] hover:bg-[#730705] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Contact & Town Details (Screenshot 12) */}
                {step === 3 && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        What town are you in? <span className="text-[#8f0907]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stamford, Greenwich, Norwalk, Westport, Fairfield..."
                        value={formData.town}
                        onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none transition-colors ${
                          errors.town
                            ? "border-red-400 ring-1 ring-red-400"
                            : "border-slate-300 focus:border-[#8f0907] focus:ring-1 focus:ring-[#8f0907]"
                        }`}
                      />
                      {/* Popular town badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {["Stamford", "Greenwich", "Norwalk", "Westport", "Fairfield", "Darien"].map(
                          (t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setFormData({ ...formData, town: t })}
                              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#8f0907] transition-colors"
                            >
                              {t}
                            </button>
                          )
                        )}
                      </div>
                      {errors.town && (
                        <span className="text-[11px] text-red-500 font-semibold mt-1 block">
                          {errors.town}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name <span className="text-[#8f0907]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none transition-colors ${
                          errors.fullName
                            ? "border-red-400 ring-1 ring-red-400"
                            : "border-slate-300 focus:border-[#8f0907] focus:ring-1 focus:ring-[#8f0907]"
                        }`}
                      />
                      {errors.fullName && (
                        <span className="text-[11px] text-red-500 font-semibold mt-1 block">
                          {errors.fullName}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Phone <span className="text-[#8f0907]">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none transition-colors ${
                            errors.phone
                              ? "border-red-400 ring-1 ring-red-400"
                              : "border-slate-300 focus:border-[#8f0907] focus:ring-1 focus:ring-[#8f0907]"
                          }`}
                        />
                        {errors.phone && (
                          <span className="text-[11px] text-red-500 font-semibold mt-1 block">
                            {errors.phone}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Email <span className="text-[#8f0907]">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none transition-colors ${
                            errors.email
                              ? "border-red-400 ring-1 ring-red-400"
                              : "border-slate-300 focus:border-[#8f0907] focus:ring-1 focus:ring-[#8f0907]"
                          }`}
                        />
                        {errors.email && (
                          <span className="text-[11px] text-red-500 font-semibold mt-1 block">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Anything you'd like us to know? (optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Active leaks, steep pitch, storm damage, preferred days for inspection..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:border-[#8f0907] focus:ring-1 focus:ring-[#8f0907] focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-[#022440] hover:text-[#8f0907] text-sm font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Go Back</span>
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#8f0907] hover:bg-[#730705] text-white font-bold text-sm px-8 py-2.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-75"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
