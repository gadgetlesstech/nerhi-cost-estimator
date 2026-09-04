import React, { useState } from "react";
import { EstimatorState, CalculationResult } from "../types";
import { COMPANY_INFO } from "../data/roofingData";
import { BrandLogo } from "./BrandLogo";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Phone,
  FileText,
  Sparkles,
  HelpCircle,
  Home,
  Layers,
  ArrowRight,
  ShieldAlert,
  Percent,
  RefreshCw,
  Printer,
  Compass,
  Copy,
  CheckCircle2,
  X,
  ShieldCheck,
} from "lucide-react";

interface EstimatorToolProps {
  onCalculationComplete?: (result: CalculationResult, state: EstimatorState) => void;
}

export const EstimatorTool: React.FC<EstimatorToolProps> = ({ onCalculationComplete }) => {
  // Step 1 to 6 (1: Size/Stories, 2: Slope, 3: Add-ons, 4: Shingle Grade, 5: Contact, 6: Result)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  const [formState, setFormState] = useState<EstimatorState>({
    squareFootage: 2400,
    stories: "2",
    slope: "normal",
    skylights: 0,
    chimneys: 1,
    roofVents: 2,
    replaceGutters: false,
    shingleGrade: "standard",
    fullName: "",
    email: "",
    phone: "",
  });

  const [contactErrors, setContactErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Client-side calculate fallback or direct helper
  const computeClientEstimate = (state: EstimatorState): CalculationResult => {
    const sqFt = state.squareFootage || 2000;
    const storiesNum = parseFloat(state.stories) || 2;
    const groundFootprint =
      sqFt / (storiesNum >= 3 ? 2.8 : storiesNum >= 2 ? 1.9 : storiesNum >= 1.5 ? 1.4 : 1.0);

    let pitchMultiplier = 1.18;
    let pitchDifficultyCostPerSq = 0;
    if (state.slope === "flat") {
      pitchMultiplier = 1.08;
    } else if (state.slope === "steep") {
      pitchMultiplier = 1.38;
      pitchDifficultyCostPerSq = 35;
    }

    const rawRoofArea = groundFootprint * pitchMultiplier * 1.12;
    const totalWithWaste = rawRoofArea * 1.12;
    const squares = Math.max(12, Math.ceil(totalWithWaste / 100));

    const standardLow = 420 + pitchDifficultyCostPerSq;
    const standardHigh = 510 + pitchDifficultyCostPerSq;
    const premiumLow = 620 + pitchDifficultyCostPerSq;
    const premiumHigh = 760 + pitchDifficultyCostPerSq;

    const baseRateLow = state.shingleGrade === "premium" ? premiumLow : standardLow;
    const baseRateHigh = state.shingleGrade === "premium" ? premiumHigh : standardHigh;

    const skylightCost = state.skylights * 350;
    const chimneyCost = state.chimneys * 450;
    const ventCost = state.roofVents * 95;
    const gutterLinearFeet = Math.round(Math.sqrt(groundFootprint) * 3.2);
    const gutterCost = state.replaceGutters ? gutterLinearFeet * 14 : 0;

    const promoDiscount = 1000;

    const subtotalLow = squares * baseRateLow + skylightCost + chimneyCost + ventCost + gutterCost;
    const subtotalHigh = squares * baseRateHigh + skylightCost + chimneyCost + ventCost + gutterCost;

    const finalLow = Math.max(3800, Math.round((subtotalLow - promoDiscount) / 50) * 50);
    const finalHigh = Math.max(4800, Math.round((subtotalHigh - promoDiscount) / 50) * 50);

    const premiumFinalLow = Math.round(
      (squares * premiumLow + skylightCost + chimneyCost + ventCost + gutterCost - promoDiscount) / 50
    ) * 50;
    const premiumFinalHigh = Math.round(
      (squares * premiumHigh + skylightCost + chimneyCost + ventCost + gutterCost - promoDiscount) / 50
    ) * 50;

    return {
      squares,
      approxRoofAreaSqFt: squares * 100,
      estimatedRange: {
        low: finalLow,
        high: finalHigh,
      },
      premiumRange: {
        low: premiumFinalLow,
        high: premiumFinalHigh,
      },
      promotionalDiscount: promoDiscount,
      monthlyPaymentEstimate: Math.round(finalLow * 0.0125),
      breakdown: {
        laborAndTearOff: Math.round(squares * 240),
        materialsAndUnderlayment: Math.round(squares * (state.shingleGrade === "premium" ? 420 : 200)),
        flashingAndPenetrations: skylightCost + chimneyCost + ventCost,
        guttersAndGuards: gutterCost,
      },
    };
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRevealEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formState.fullName.trim()) {
      errors.fullName = "Please enter your name";
    }
    if (!formState.email.trim() || !formState.email.includes("@")) {
      errors.email = "Please enter a valid email address";
    }
    if (!formState.phone.trim() || formState.phone.replace(/[^0-9]/g, "").length < 7) {
      errors.phone = "Please enter a valid phone number";
    }

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }

    setContactErrors({});
    setIsSubmitting(true);

    const localResult = computeClientEstimate(formState);

    try {
      // Send estimate and lead payload to server endpoint
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.data) {
          setCalculationResult(json.data);
          if (onCalculationComplete) onCalculationComplete(json.data, formState);
        } else {
          setCalculationResult(localResult);
          if (onCalculationComplete) onCalculationComplete(localResult, formState);
        }
      } else {
        setCalculationResult(localResult);
        if (onCalculationComplete) onCalculationComplete(localResult, formState);
      }

      // Record lead
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formState.fullName,
          email: formState.email,
          phone: formState.phone,
          serviceNeeded: "Roof Replacement (Calculator)",
          estimateDetails: {
            squareFootage: formState.squareFootage,
            stories: formState.stories,
            slope: formState.slope,
            shingleGrade: formState.shingleGrade,
            skylights: formState.skylights,
            chimneys: formState.chimneys,
            roofVents: formState.roofVents,
            replaceGutters: formState.replaceGutters,
            estimatedSquares: localResult.squares,
            lowEstimate: localResult.estimatedRange.low,
            highEstimate: localResult.estimatedRange.high,
          },
        }),
      });
    } catch {
      setCalculationResult(localResult);
      if (onCalculationComplete) onCalculationComplete(localResult, formState);
    } finally {
      setIsSubmitting(false);
      setCurrentStep(6);
    }
  };

  const resetEstimator = () => {
    setCurrentStep(1);
    setCalculationResult(null);
  };

  const progressPercentage = Math.min(100, Math.round(((currentStep - 1) / (totalSteps - 1)) * 100));

  return (
    <div
      id="estimator-tool-card"
      className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-800 transition-all duration-300 relative"
    >
      {/* Progress Bar (Matches Screenshot orange/red bar) */}
      {currentStep <= totalSteps && (
        <div className="w-full bg-slate-100 h-2 relative">
          <div
            className="bg-[#8f0907] h-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(12, progressPercentage)}%` }}
          />
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* STEP 1: Home Square Footage & Stories (Screenshot 1) */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                What's your home's total square footage?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Check a real estate listing, your tax bill, or mortgage paperwork. A rough number is fine.
              </p>
            </div>

            {/* Slider Container */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
                  Slide to your home's size
                </span>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs">
                  <span className="text-lg sm:text-xl font-extrabold text-[#022440]">
                    {formState.squareFootage.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">sq ft</span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="relative pt-1 pb-1">
                <input
                  type="range"
                  min="800"
                  max="8000"
                  step="50"
                  value={formState.squareFootage}
                  onChange={(e) =>
                    setFormState({ ...formState, squareFootage: parseInt(e.target.value) || 2000 })
                  }
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8f0907] focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-2">
                  <span>800 sq ft</span>
                  <span>4,000 sq ft</span>
                  <span>8,000+ sq ft</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium self-center">Popular:</span>
                {[1500, 2200, 2800, 3500, 4500].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFormState({ ...formState, squareFootage: size })}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                      formState.squareFootage === size
                        ? "bg-[#8f0907] text-white font-bold"
                        : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {size.toLocaleString()} sq ft
                  </button>
                ))}
              </div>
            </div>

            {/* How many stories? */}
            <div className="space-y-2.5">
              <label className="block text-sm sm:text-base font-bold text-slate-900">
                How many stories is the house?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: "1 Story", value: "1" },
                  { label: "1.5 Stories", value: "1.5" },
                  { label: "2 Stories", value: "2" },
                  { label: "3+ Stories", value: "3" },
                ].map((item) => {
                  const isSelected = formState.stories === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFormState({ ...formState, stories: item.value })}
                      className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                        isSelected
                          ? "border-[#8f0907] bg-red-50/70 text-[#8f0907] shadow-xs ring-1 ring-[#8f0907]"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled
                className="text-slate-300 text-sm font-semibold flex items-center gap-1 cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#8f0907] hover:bg-[#730705] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Roof Slope / Pitch (Screenshot 7) */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                How would you describe your roof's slope?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Not sure? Most colonial, cape, and garrison homes in Connecticut are moderate.
              </p>
            </div>

            {/* 3 Slope Cards with Visual Angles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "flat",
                  title: "Pretty Flat",
                  desc: "You could walk on it comfortably.",
                  pitchLabel: "Low Pitch (2/12 - 4/12)",
                  angleDeg: "~15° Slope",
                  svgPoints: "4,20 28,14 52,20",
                },
                {
                  id: "normal",
                  title: "Normal Angle",
                  desc: "A noticeable, typical pitched roof.",
                  pitchLabel: "Standard Pitch (5/12 - 8/12)",
                  angleDeg: "~26° Slope",
                  svgPoints: "4,20 28,8 52,20",
                },
                {
                  id: "steep",
                  title: "Steep",
                  desc: "You'd need rope and harness to work on it.",
                  pitchLabel: "High Pitch (9/12+)",
                  angleDeg: "~45° Slope",
                  svgPoints: "6,20 28,2 50,20",
                },
              ].map((item) => {
                const isSelected = formState.slope === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormState({ ...formState, slope: item.id as any })}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "border-[#8f0907] bg-red-50/70 text-slate-900 shadow-xs ring-1 ring-[#8f0907]"
                        : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      {/* Slope silhouette SVG */}
                      <div className="h-10 w-full mb-2.5 flex items-center justify-between px-1 bg-slate-50/80 rounded-lg border border-slate-100">
                        <svg className="w-16 h-8 text-[#8f0907]" viewBox="0 0 56 24" fill="none">
                          <polyline
                            points={item.svgPoints}
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line x1="2" y1="21" x2="54" y2="21" stroke="#cbd5e1" strokeWidth="2" />
                        </svg>
                        <span className="text-[10px] font-extrabold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {item.angleDeg}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900">
                          {item.title}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#8f0907] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="mt-3 inline-block text-[10px] font-semibold text-slate-400">
                      {item.pitchLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#8f0907] hover:bg-[#730705] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Skylights, Chimneys, Vents & Gutters (Screenshot 8) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  Any skylights, chimneys, or vents?
                </h3>
                <span className="text-xs text-slate-400 font-medium">(optional)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                These require specialized lead/copper flashing and ice-and-water detailing.
              </p>
            </div>

            {/* 3 Counter Steppers */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {[
                {
                  label: "Skylights",
                  value: formState.skylights,
                  field: "skylights" as const,
                },
                {
                  label: "Chimneys",
                  value: formState.chimneys,
                  field: "chimneys" as const,
                },
                {
                  label: "Roof Vents",
                  value: formState.roofVents,
                  field: "roofVents" as const,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-center flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-slate-700 truncate">{item.label}</span>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormState({
                          ...formState,
                          [item.field]: Math.max(0, item.value - 1),
                        })
                      }
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-slate-300 text-slate-600 font-extrabold flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-extrabold text-base sm:text-lg text-slate-900">
                      {item.value}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormState({
                          ...formState,
                          [item.field]: item.value + 1,
                        })
                      }
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#8f0907] text-white font-extrabold flex items-center justify-center hover:bg-[#730705] transition-colors cursor-pointer text-sm shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Replace Gutters Toggle (Matches Screenshot 8) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  Replace gutters at the same time?
                </span>
                <span className="text-xs text-slate-500">Includes gutters + leaf guards.</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, replaceGutters: true })}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    formState.replaceGutters
                      ? "bg-[#022440] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, replaceGutters: false })}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    !formState.replaceGutters
                      ? "bg-[#022440] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#8f0907] hover:bg-[#730705] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Shingle Grade (Screenshot 9) */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                Which shingle grade are you considering?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Not sure? We'll show you both ranges.
              </p>
            </div>

            {/* 3 Shingle Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "standard",
                  title: "Standard",
                  desc: "Architectural shingles, the typical replacement.",
                  brands: "GAF Timberline HDZ / CertainTeed Landmark",
                  badge: "Most Popular",
                },
                {
                  id: "premium",
                  title: "Premium",
                  desc: "Designer / high-wind shingles (GAF, CertainTeed).",
                  brands: "CertainTeed Grand Manor / GAF Camelot",
                  badge: "Max Durability",
                },
                {
                  id: "both",
                  title: "Not Sure",
                  desc: "Show me both ranges to compare.",
                  brands: "Compare Side-by-Side",
                  badge: "Comparison",
                },
              ].map((item) => {
                const isSelected = formState.shingleGrade === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormState({ ...formState, shingleGrade: item.id as any })}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "border-[#8f0907] bg-red-50/70 text-slate-900 shadow-xs ring-1 ring-[#8f0907]"
                        : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900">
                          {item.title}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#8f0907] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/50">
                      <span className="text-[10px] font-semibold text-slate-500 block truncate">
                        {item.brands}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#8f0907] hover:bg-[#730705] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Where should we send your estimate? (Screenshot 10) */}
        {currentStep === 5 && (
          <form onSubmit={handleRevealEstimate} className="space-y-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                Where should we send your estimate?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Enter your name, email, and phone number to instantly reveal your roof replacement
                estimate. We'll only reach out if you ask us to.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-[#8f0907]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none transition-colors ${
                    contactErrors.fullName
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-slate-300 focus:border-[#8f0907] focus:ring-1 focus:ring-[#8f0907]"
                  }`}
                />
                {contactErrors.fullName && (
                  <span className="text-[11px] text-red-500 font-semibold mt-1 block">
                    {contactErrors.fullName}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email <span className="text-[#8f0907]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="john@email.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none transition-colors ${
                    contactErrors.email
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-slate-300 focus:border-[#8f0907] focus:ring-1 focus:ring-[#8f0907]"
                  }`}
                />
                {contactErrors.email && (
                  <span className="text-[11px] text-red-500 font-semibold mt-1 block">
                    {contactErrors.email}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number <span className="text-[#8f0907]">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="(203) 000-0000"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none transition-colors ${
                    contactErrors.phone
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-slate-300 focus:border-[#8f0907] focus:ring-1 focus:ring-[#8f0907]"
                  }`}
                />
                {contactErrors.phone && (
                  <span className="text-[11px] text-red-500 font-semibold mt-1 block">
                    {contactErrors.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#8f0907] hover:bg-[#730705] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <span>See My Estimate</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 6: Instant Calculation Result & Detailed Breakdown! */}
        {currentStep === 6 && calculationResult && (
          <div className="space-y-6 text-slate-800">
            {/* Header with success badge */}
            <div className="text-center pb-2 border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#8f0907] font-bold px-3 py-1 rounded-full text-xs mb-2 border border-red-200">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Estimate Prepared for {formState.fullName || "You"}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#022440] tracking-tight">
                Your Estimated Roof Cost
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Based on {formState.squareFootage.toLocaleString()} sq ft • {formState.stories} Story •{" "}
                {calculationResult.squares} Roof Squares
              </p>
            </div>

            {/* Big Price Display Box */}
            <div className="bg-gradient-to-br from-[#022440] to-[#011627] text-white p-5 sm:p-6 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8f0907]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between text-xs text-slate-200 font-semibold uppercase tracking-wider">
                <span>Estimated Cost Range</span>
                <span className="text-white bg-[#8f0907] px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  $1,000 Off Applied
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  ${calculationResult.estimatedRange.low.toLocaleString()} - $
                  {calculationResult.estimatedRange.high.toLocaleString()}
                </span>
              </div>

              {/* Monthly Financing Callout */}
              <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-red-400" />
                  <span>
                    Low monthly financing from:{" "}
                    <strong className="text-white font-bold">
                      ${calculationResult.monthlyPaymentEstimate}/mo
                    </strong>
                  </span>
                </div>
                <span className="text-[10px] text-slate-300">0% options available</span>
              </div>
            </div>

            {/* If user selected "Not Sure (Both)", show Premium Designer Range */}
            {formState.shingleGrade === "both" && (
              <div className="bg-red-50/70 border border-red-200 p-4 rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center font-bold text-[#022440]">
                  <span>Designer / Premium Shingle Upgrade:</span>
                  <span className="text-sm font-black text-[#8f0907]">
                    ${calculationResult.premiumRange.low.toLocaleString()} - $
                    {calculationResult.premiumRange.high.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Includes CertainTeed Grand Manor / GAF Camelot with 130 MPH wind rating & 50-year warranty.
                </p>
              </div>
            )}

            {/* Itemized Materials & Labor Details */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#022440] uppercase tracking-wider text-[11px]">
                Itemized Cost Breakdown:
              </span>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 divide-y divide-slate-200/60">
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">
                    Tear-Off, Deck Prep & Professional Labor ({calculationResult.squares} Squares)
                  </span>
                  <span className="font-semibold text-slate-900">
                    ~${calculationResult.breakdown.laborAndTearOff.toLocaleString()}
                  </span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">
                    Architectural Shingles, Synthetic Underlayment, Starter & Ridge Caps
                  </span>
                  <span className="font-semibold text-slate-900">
                    ~${calculationResult.breakdown.materialsAndUnderlayment.toLocaleString()}
                  </span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">
                    Lead Chimney Flashing, Skylights & Vent Seals
                  </span>
                  <span className="font-semibold text-slate-900">
                    ${calculationResult.breakdown.flashingAndPenetrations.toLocaleString()}
                  </span>
                </div>
                {formState.replaceGutters && (
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-600">
                      Seamless Aluminum Gutters + Micro-Mesh Guards
                    </span>
                    <span className="font-semibold text-slate-900">
                      ${calculationResult.breakdown.guttersAndGuards.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="py-1.5 flex justify-between text-[#8f0907] font-bold">
                  <span>September Promotion Voucher</span>
                  <span>-${calculationResult.promotionalDiscount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* CT Free In-Person Inspection CTA */}
            <div className="space-y-2.5 pt-2">
              <a
                href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
                className="w-full bg-[#8f0907] hover:bg-[#730705] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Call Dillon to Confirm Price: {COMPANY_INFO.phone}</span>
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("schedule-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 bg-[#022440] hover:bg-[#011627] text-white text-xs font-bold py-2.5 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-red-400" />
                  <span>Book Free Inspection</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="px-3 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[#022440] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="View formatted printable contractor estimate"
                >
                  <Printer className="w-3.5 h-3.5 text-[#8f0907]" />
                  <span className="hidden xs:inline">Print / Save Quote</span>
                </button>
                <button
                  type="button"
                  onClick={resetEstimator}
                  className="px-3 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Recalculate</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Disclaimer (Matches all screenshots) */}
      <div className="bg-slate-50/90 border-t border-slate-100 px-6 py-3 text-[10px] text-slate-500 leading-normal text-center">
        Estimates are for planning only and subject to a free in-person inspection. Final pricing may
        vary based on pitch, accessibility, and deck condition.
      </div>

      {/* Printable / Itemized Quote Modal (Professional Polish) */}
      {showQuoteModal && calculationResult && (
        <div className="fixed inset-0 z-50 bg-[#022440]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            {/* Modal Action Bar */}
            <div className="bg-[#022440] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-400" />
                <span className="font-extrabold text-sm">Official Contractor Estimate Sheet</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const quoteText = `NORTHEAST ROOFING AND HOME IMPROVEMENT - ESTIMATE SUMMARY\n` +
                      `Customer: ${formState.fullName || "Fairfield County Homeowner"}\n` +
                      `Size: ${formState.squareFootage} sq ft (${calculationResult.squares} Squares)\n` +
                      `Stories: ${formState.stories} | Slope: ${formState.slope}\n` +
                      `Shingle Grade: ${formState.shingleGrade}\n` +
                      `Estimated Range: $${calculationResult.estimatedRange.low.toLocaleString()} - $${calculationResult.estimatedRange.high.toLocaleString()}\n` +
                      `Financing: ~$${calculationResult.monthlyPaymentEstimate}/month\n` +
                      `Discount: $${calculationResult.promotionalDiscount.toLocaleString()} September Promo\n` +
                      `License: ${COMPANY_INFO.licenseNumber} | Phone: ${COMPANY_INFO.phone}`;
                    navigator.clipboard.writeText(quoteText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  className="px-2.5 py-1 rounded bg-[#011627] hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 text-slate-200 transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded bg-[#8f0907] hover:bg-[#730705] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 bg-white">
              {/* Contractor Letterhead */}
              <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-5 gap-4">
                <div className="flex items-center gap-3.5">
                  <BrandLogo size="sm" />
                  <div className="border-l border-slate-200 pl-3">
                    <p className="text-xs text-slate-600">{COMPANY_INFO.address}</p>
                    <p className="text-xs text-slate-600">
                      Phone: <strong className="text-[#022440]">{COMPANY_INFO.phone}</strong> • License:{" "}
                      <strong className="text-[#022440]">{COMPANY_INFO.licenseNumber}</strong>
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded bg-red-50 text-[#8f0907] border border-red-200 font-bold text-xs">
                    Fairfield County, CT
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Estimate Scope Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Client</span>
                  <span className="font-extrabold text-[#022440]">{formState.fullName || "Homeowner"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Square Footage</span>
                  <span className="font-extrabold text-[#022440]">{formState.squareFootage.toLocaleString()} sq ft</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Roof Size</span>
                  <span className="font-extrabold text-[#022440]">~{calculationResult.squares} Squares</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Stories & Slope</span>
                  <span className="font-extrabold text-[#022440]">{formState.stories} Story / {formState.slope}</span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 font-bold text-slate-700 grid grid-cols-12 px-3 py-2 border-b border-slate-200">
                  <span className="col-span-8">Description of Materials & Labor</span>
                  <span className="col-span-4 text-right">Approximate Allocation</span>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="grid grid-cols-12 px-3 py-2.5">
                    <div className="col-span-8">
                      <strong className="text-slate-900 block">Complete Tear-Off & Surface Prep</strong>
                      <span className="text-slate-500 text-[11px]">
                        Removal of old shingles down to decking, disposal, and 100% magnetic nail yard sweep.
                      </span>
                    </div>
                    <div className="col-span-4 text-right font-semibold text-slate-800">
                      ~${calculationResult.breakdown.laborAndTearOff.toLocaleString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 px-3 py-2.5">
                    <div className="col-span-8">
                      <strong className="text-slate-900 block">Architectural Roofing System & Underlayment</strong>
                      <span className="text-slate-500 text-[11px]">
                        High-temp ice & water barrier at eaves/valleys, synthetic underlayment, starter shingles, and ridge caps.
                      </span>
                    </div>
                    <div className="col-span-4 text-right font-semibold text-slate-800">
                      ~${calculationResult.breakdown.materialsAndUnderlayment.toLocaleString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 px-3 py-2.5">
                    <div className="col-span-8">
                      <strong className="text-slate-900 block">Penetrations, Chimney Lead Flashing & Venting</strong>
                      <span className="text-slate-500 text-[11px]">
                        New pipe boots, chimney step flashing, and continuous ridge ventilation.
                      </span>
                    </div>
                    <div className="col-span-4 text-right font-semibold text-slate-800">
                      ${calculationResult.breakdown.flashingAndPenetrations.toLocaleString()}
                    </div>
                  </div>
                  {formState.replaceGutters && (
                    <div className="grid grid-cols-12 px-3 py-2.5">
                      <div className="col-span-8">
                        <strong className="text-slate-900 block">Seamless Aluminum Gutters & Leaf Protection</strong>
                        <span className="text-slate-500 text-[11px]">Heavy-gauge seamless gutters custom extruded on-site.</span>
                      </div>
                      <div className="col-span-4 text-right font-semibold text-slate-800">
                        ${calculationResult.breakdown.guttersAndGuards.toLocaleString()}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-12 px-3 py-2.5 bg-red-50/70 text-[#8f0907] font-bold">
                    <span className="col-span-8">September Promotional Discount</span>
                    <span className="col-span-4 text-right">-${calculationResult.promotionalDiscount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Price Summary Banner */}
              <div className="bg-[#022440] text-white p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-xs text-slate-300 block font-semibold uppercase tracking-wider">
                    Total Estimated Investment Range:
                  </span>
                  <span className="text-2xl font-black text-white font-display">
                    ${calculationResult.estimatedRange.low.toLocaleString()} - ${calculationResult.estimatedRange.high.toLocaleString()}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-300 block">Low Monthly Payment Option:</span>
                  <span className="text-base font-bold text-white">
                    ~${calculationResult.monthlyPaymentEstimate}/month
                  </span>
                </div>
              </div>

              {/* Warranty Guarantee Footer */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Northeast Roofing Assurance:</strong> All full replacements come with our 10-Year Workmanship
                  Warranty and eligible 50-Year Non-Prorated Manufacturer Warranty. Free inspection required to confirm exact
                  measurements, deck conditions, and pitch.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-between items-center">
              <span className="text-xs text-slate-500">CT HIC #0658421 • Fully Insured</span>
              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="px-4 py-2 bg-[#022440] text-white hover:bg-[#011627] text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
