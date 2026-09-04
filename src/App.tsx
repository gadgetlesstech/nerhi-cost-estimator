/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ProfessionalThemeBar } from "./components/ProfessionalThemeBar";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { DirectScheduleForm } from "./components/DirectScheduleForm";
import { ServicesSection } from "./components/ServicesSection";
import { AboutSection } from "./components/AboutSection";
import { ProjectsGallery } from "./components/ProjectsGallery";
import { ReviewsSection } from "./components/ReviewsSection";
import { CtaBanner } from "./components/CtaBanner";
import { Footer } from "./components/Footer";
import { COMPANY_INFO } from "./data/roofingData";
import { Phone, Calendar } from "lucide-react";

export default function App() {
  const scrollToEstimator = () => {
    const el = document.getElementById("calculator-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSchedule = () => {
    const el = document.getElementById("schedule-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-[#8f0907] selection:text-white">
        {/* Professional Theme Showcase Bar */}
        <ProfessionalThemeBar />

        {/* Top Banner and Navigation Bar */}
        <Navbar onOpenEstimator={scrollToEstimator} onOpenBooking={scrollToSchedule} />

        {/* Main Page Body */}
        <main className="flex-1">
          {/* 1. Hero Section with Headline, $1,000 Off Offer & Cost Estimator Tool */}
          <HeroSection />

          {/* 2. Direct Scheduling Form (Matches Screenshot 2, 11, 12) */}
          <DirectScheduleForm />

          {/* 3. Services: Complete Roofing Services for Fairfield County (Matches Screenshot 2) */}
          <ServicesSection />

          {/* 4. About Us: Quality, Experience & Trust - Dillon & Team (Matches Screenshot 3) */}
          <AboutSection />

          {/* 5. Our Work: Real CT Roof Replacement Projects with Before & After Comparisons (Matches Screenshot 3) */}
          <ProjectsGallery />

          {/* 6. Google Reviews: What They Say & Rating Card (Matches Screenshots 4 & 5) */}
          <ReviewsSection />

          {/* 7. Bottom CTA: Is Your Roof Showing Signs Of Age Or Damage? (Matches Screenshot 5) */}
          <CtaBanner />
        </main>

        {/* 8. Footer with Yellow Contact Strip & Brand Information (Matches Screenshot 6) */}
        <Footer />

        {/* Mobile Sticky Quick Action Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center gap-2 shadow-2xl">
          <a
            href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
            className="flex-1 bg-[#022440] hover:bg-[#011627] text-white font-bold text-xs py-3 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-red-400" />
            <span>Call ({COMPANY_INFO.phone})</span>
          </a>
          <button
            type="button"
            onClick={scrollToEstimator}
            className="flex-1 bg-[#8f0907] hover:bg-[#730705] text-white font-extrabold text-xs py-3 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Get Free Estimate</span>
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
}

