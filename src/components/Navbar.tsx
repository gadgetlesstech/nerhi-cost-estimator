import React, { useState, useEffect } from "react";
import { BrandLogo } from "./BrandLogo";
import { COMPANY_INFO } from "../data/roofingData";
import { Phone, ShieldCheck, MapPin, Calendar, Menu, X, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenEstimator?: () => void;
  onOpenBooking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEstimator, onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* Top Notification / Urgency Bar */}
      <div className="bg-[#022440] text-white border-b border-[#011627] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left notice */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#8f0907] text-white font-extrabold px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3 h-3 text-white" />
              September Promotion
            </span>
            <span className="hidden sm:inline text-slate-200">
              Save <strong className="text-white font-bold underline decoration-[#8f0907] underline-offset-2">$1,000 Off</strong> Full Roof Replacements + Free Gutter Cleaning!
            </span>
            <span className="sm:hidden text-slate-200">
              Save <strong className="text-white font-bold">$1,000</strong> on new roofs this month!
            </span>
          </div>

          {/* Right contact details */}
          <div className="flex items-center gap-4 text-slate-200">
            <div className="hidden md:flex items-center gap-1.5 text-[11px]">
              <MapPin className="w-3 h-3 text-[#8f0907]" />
              <span>Stamford, CT • Serving all Fairfield County</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Licensed & Fully Insured CT Contractor</span>
            </div>
            <a
              href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
              className="flex items-center gap-1.5 text-white hover:text-red-200 font-extrabold"
            >
              <Phone className="w-3.5 h-3.5 text-[#8f0907] fill-[#8f0907]" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-slate-200 py-3"
            : "bg-white border-slate-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center focus:outline-none" aria-label="Home">
            <BrandLogo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#022440]">
            <button
              onClick={() => scrollToSection("calculator-section")}
              className="hover:text-[#8f0907] transition-colors flex items-center gap-1"
            >
              <span>Cost Estimator</span>
              <span className="bg-red-50 text-[#8f0907] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-red-200/80">
                Interactive
              </span>
            </button>
            <button
              onClick={() => scrollToSection("schedule-section")}
              className="hover:text-[#8f0907] transition-colors"
            >
              Schedule Directly
            </button>
            <button
              onClick={() => scrollToSection("services-section")}
              className="hover:text-[#8f0907] transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("about-section")}
              className="hover:text-[#8f0907] transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("projects-section")}
              className="hover:text-[#8f0907] transition-colors"
            >
              Our Work
            </button>
            <button
              onClick={() => scrollToSection("reviews-section")}
              className="hover:text-[#8f0907] transition-colors"
            >
              Reviews
            </button>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
              className="hidden xl:flex flex-col text-right pr-2"
            >
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Questions? Call Dillon
              </span>
              <span className="text-sm font-extrabold text-[#022440] tracking-tight">
                {COMPANY_INFO.phone}
              </span>
            </a>

            <button
              onClick={() => {
                if (onOpenEstimator) onOpenEstimator();
                else scrollToSection("calculator-section");
              }}
              className="bg-[#8f0907] hover:bg-[#730705] text-white font-extrabold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Get Free Estimate</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
              className="p-2 rounded-lg bg-red-50 text-[#8f0907] sm:hidden"
              aria-label="Call directly"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#022440] hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <button
              onClick={() => scrollToSection("calculator-section")}
              className="w-full text-left font-semibold py-2 text-[#022440] hover:text-[#8f0907]"
            >
              Roofing Cost Estimator
            </button>
            <button
              onClick={() => scrollToSection("schedule-section")}
              className="w-full text-left font-semibold py-2 text-[#022440] hover:text-[#8f0907]"
            >
              Direct Scheduling Form
            </button>
            <button
              onClick={() => scrollToSection("services-section")}
              className="w-full text-left font-semibold py-2 text-[#022440] hover:text-[#8f0907]"
            >
              Services & What We Do
            </button>
            <button
              onClick={() => scrollToSection("about-section")}
              className="w-full text-left font-semibold py-2 text-[#022440] hover:text-[#8f0907]"
            >
              About Dillon & Team
            </button>
            <button
              onClick={() => scrollToSection("projects-section")}
              className="w-full text-left font-semibold py-2 text-[#022440] hover:text-[#8f0907]"
            >
              Recent Completed Projects
            </button>
            <button
              onClick={() => scrollToSection("reviews-section")}
              className="w-full text-left font-semibold py-2 text-[#022440] hover:text-[#8f0907]"
            >
              Google Reviews (5.0 ★)
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
                className="w-full bg-[#022440] hover:bg-[#011627] text-white text-center py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-red-400" />
                <span>Call {COMPANY_INFO.phone}</span>
              </a>
              <button
                onClick={() => scrollToSection("calculator-section")}
                className="w-full bg-[#8f0907] hover:bg-[#730705] text-white text-center py-2.5 rounded-lg font-bold text-sm"
              >
                Start Instant Estimate
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
