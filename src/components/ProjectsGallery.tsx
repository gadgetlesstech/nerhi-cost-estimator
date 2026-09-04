import React, { useState } from "react";
import { PROJECTS_GALLERY, COMPANY_INFO } from "../data/roofingData";
import { MapPin, Check, Eye, Sparkles, ArrowLeftRight, ShieldCheck, Calendar } from "lucide-react";
import { ProjectItem } from "../types";

export const ProjectsGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [modalViewMode, setModalViewMode] = useState<"after" | "before">("after");
  const [cardViews, setCardViews] = useState<{ [projectId: string]: "after" | "before" }>({});

  const filterCategories = ["All", "Roof Replacement", "Architectural Shingles", "Roof & Gutters"];

  const filteredProjects =
    activeFilter === "All"
      ? PROJECTS_GALLERY
      : PROJECTS_GALLERY.filter((p) => p.tag === activeFilter);

  const toggleCardView = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setCardViews((prev) => ({
      ...prev,
      [projectId]: prev[projectId] === "before" ? "after" : "before",
    }));
  };

  return (
    <section id="projects-section" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (Matches Screenshot 3) */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#8f0907] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#8f0907]" />
            Fairfield County Transformations
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#022440] tracking-tight font-display">
            Check Out Our Work
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Real architectural shingle roof replacements and exterior improvements completed across
            Stamford, Greenwich, Fairfield, Westport, and Norwalk. Click to compare Before &amp; After!
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-3">
            {filterCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer ${
                  activeFilter === category
                    ? "bg-[#022440] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isShowingBefore = cardViews[project.id] === "before";
            const currentImg = isShowingBefore && project.beforeImageUrl ? project.beforeImageUrl : project.imageUrl;

            return (
              <div
                key={project.id}
                onClick={() => {
                  setActiveProject(project);
                  setModalViewMode("after");
                }}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col relative"
              >
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={currentImg}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />

                  {/* Location Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs z-10">
                    <MapPin className="w-3 h-3 text-[#8f0907]" />
                    <span>{project.town}</span>
                  </div>

                  {/* Before / After Toggle Pill */}
                  {project.beforeImageUrl && (
                    <button
                      type="button"
                      onClick={(e) => toggleCardView(e, project.id)}
                      className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1 z-10 transition-colors ${
                        isShowingBefore
                          ? "bg-[#8f0907] text-white"
                          : "bg-[#022440]/90 hover:bg-[#022440] text-white"
                      }`}
                      title="Click to toggle Before / After"
                    >
                      <ArrowLeftRight className="w-3 h-3 text-red-200" />
                      <span>{isShowingBefore ? "Showing: Before" : "Show: Before"}</span>
                    </button>
                  )}

                  {/* Status Indicator */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#022440]/85 text-white border border-slate-700/60 backdrop-blur-xs">
                      {isShowingBefore ? "Original Condition" : "Finished Replacement"}
                    </span>
                  </div>

                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/30 backdrop-blur-[2px] pointer-events-none">
                    <span className="bg-white text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                      <Eye className="w-3.5 h-3.5 text-[#8f0907]" />
                      Inspect Transformation
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 group-hover:text-[#8f0907] transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>System: {project.shingleType}</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      50-Yr Warranty
                    </span>
                    <span className="font-bold text-[#8f0907]">Northeast Roofing Installed</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Detail & Transformation Modal */}
        {activeProject && (
          <div
            className="fixed inset-0 z-50 bg-[#022440]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setActiveProject(null)}
          >
            <div
              className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image & Interactive Toggle Header */}
              <div className="relative h-72 sm:h-84 bg-slate-100">
                <img
                  src={
                    modalViewMode === "before" && activeProject.beforeImageUrl
                      ? activeProject.beforeImageUrl
                      : activeProject.imageUrl
                  }
                  alt={activeProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Top bar over image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                  {/* Before / After toggle button */}
                  {activeProject.beforeImageUrl ? (
                    <div className="bg-[#022440]/90 backdrop-blur-md p-1 rounded-lg border border-slate-700/80 flex items-center gap-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => setModalViewMode("before")}
                        className={`text-xs font-bold px-3 py-1 rounded-md transition-colors ${
                          modalViewMode === "before"
                            ? "bg-[#8f0907] text-white shadow-xs"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        Before Tear-Off
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalViewMode("after")}
                        className={`text-xs font-bold px-3 py-1 rounded-md transition-colors ${
                          modalViewMode === "after"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        After Completion
                      </button>
                    </div>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveProject(null)}
                    className="bg-[#022440]/90 hover:bg-[#022440] text-white rounded-full px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-md"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Bottom Image Caption */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-[#022440]/80 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                  <span className="font-semibold">
                    {modalViewMode === "before"
                      ? "⚠️ Weathered shingles with granule loss & flashing fatigue"
                      : "✨ Complete GAF Architectural installation with leak barriers"}
                  </span>
                  <span className="font-bold text-red-200">{activeProject.town}</span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8f0907] uppercase tracking-wider">
                    {activeProject.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8f0907]" />
                    {activeProject.town}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#022440] font-display">
                  {activeProject.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Full tear-off down to clean wood decking, replacement of compromised plywood, installation of
                  high-temperature ice and water shield on all critical eaves and valleys, followed by heavy-duty{" "}
                  <strong>{activeProject.shingleType}</strong> with ridge ventilation and lead chimney step-flashing.
                </p>

                {/* Specs Pill Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Scope</span>
                    <span className="font-bold text-slate-800">100% Complete Tear-Off</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Warranty</span>
                    <span className="font-bold text-slate-800">50-Year System Protection</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Clean-Up</span>
                    <span className="font-bold text-emerald-700">Magnetic Nail Sweep</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}`}
                    className="bg-[#8f0907] hover:bg-[#730705] text-white text-xs font-extrabold px-4 py-2.5 rounded-lg shadow-xs transition-all"
                  >
                    Call Dillon: {COMPANY_INFO.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProject(null);
                      const el = document.getElementById("calculator-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-slate-800 hover:text-[#8f0907] underline cursor-pointer"
                  >
                    Calculate Cost For A Similar Roof →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
