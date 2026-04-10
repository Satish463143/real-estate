"use client";
import React, { useState } from "react";

const TABS = ["buy", "rent", "sell"] as const;
const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"];
const TYPES = ["All Types", "House", "Apartment", "Villa", "Commercial"];

const stats = [
  { number: "15K+", label: "Properties Listed" },
  { number: "8K+",  label: "Happy Clients" },
  { number: "98%",  label: "Satisfaction Rate" },
  { number: "25+",  label: "Years Experience" },
];

const Banner = () => {
  const [activeTab, setActiveTab]       = useState<"buy" | "rent" | "sell">("buy");
  const [propertyType, setPropertyType] = useState("All Types");
  const [location, setLocation]         = useState("");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[linear-gradient(135deg,#0A1628_0%,#1E3A5F_50%,#0A1628_100%)]">

      {/* ── Background Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.15)_0%,transparent_70%)] blur-[40px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(30,58,95,0.8)_0%,transparent_70%)] blur-[40px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-20">

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ── Left Content ── */}
          <div className="animate-[fadeInUp_0.7s_ease_both]">

            {/* Tag */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent-light text-xs font-bold tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              #1 Real Estate Platform
            </span>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mt-2 mb-6">
              Find Your{" "}
              <span className="bg-[linear-gradient(135deg,#C9A84C,#E2C270)] bg-clip-text text-transparent">
                Dream Home
              </span>
              <br />
              With Confidence
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-lg">
              Discover thousands of premium properties across the country. Your perfect home is just a search away — expertly curated, verified, and ready for you.
            </p>

            {/* ── Search Box ── */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 pb-5 shadow-[0_24px_64px_rgba(0,0,0,0.35)]">

              {/* Tabs */}
              <div className="flex gap-1 p-1 mb-4">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 cursor-pointer border-none
                      ${activeTab === tab
                        ? "bg-[linear-gradient(135deg,#C9A84C,#A8883A)] text-primary"
                        : "bg-transparent text-white/50 hover:text-white/80"
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-3 px-2">
                {/* Location */}
                <div>
                  <label className="block text-[0.7rem] text-white/40 mb-1.5 tracking-widest uppercase">Location</label>
                  <input
                    type="text"
                    placeholder="City, neighborhood..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm placeholder:text-white/30 outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                {/* Type */}
                <div>
                  <label className="block text-[0.7rem] text-white/40 mb-1.5 tracking-widest uppercase">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm outline-none cursor-pointer focus:border-accent/50 transition-colors"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t} className="text-primary bg-white">{t}</option>
                    ))}
                  </select>
                </div>
                {/* Button */}
                <div className="flex items-end">
                  <button className="flex items-center gap-2 bg-[linear-gradient(135deg,#C9A84C,#A8883A)] text-primary font-bold text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(201,168,76,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.55)] transition-all duration-200 cursor-pointer border-none whitespace-nowrap">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <span className="text-white/40 text-xs">Popular:</span>
              {CITIES.map((city) => (
                <button
                  key={city}
                  className="px-4 py-1 rounded-full bg-white/7 border border-white/10 text-white/65 text-xs cursor-pointer transition-all duration-200 hover:bg-accent/20 hover:border-accent/40 hover:text-accent-light"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Image Grid ── */}
          <div className="animate-[fadeInUp_0.7s_0.3s_ease_both] relative hidden lg:block">
            <div className="grid grid-cols-2 grid-rows-[260px_180px] gap-4">

              {/* Tall left image */}
              <div className="row-span-2 relative rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80"
                  alt="Luxury villa"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,22,40,0.65)_0%,transparent_55%)]" />
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-lg border border-white/15 rounded-xl px-3.5 py-2.5">
                  <div className="text-accent-light font-bold font-display text-lg">$2.4M</div>
                  <div className="text-white/70 text-xs">Modern Villa, Lalitpur</div>
                </div>
              </div>

              {/* Top right */}
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80"
                  alt="Apartment"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Bottom right */}
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80"
                  alt="Luxury home"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent text-primary text-[0.65rem] font-bold tracking-wide uppercase">
                    Featured
                  </span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            {/* <div className="absolute -bottom-5 -left-10 flex items-center gap-3 bg-white/8 backdrop-blur-2xl border border-white/10 rounded-2xl px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#C9A84C,#A8883A)] flex items-center justify-center shrink-0">
                <svg width="20" height="20" fill="none" stroke="#0A1628" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-sm">250+ Listings</div>
                <div className="text-white/45 text-xs">Added this week</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 mt-20 pt-10 border-t border-white/8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`text-center px-6 ${i < 3 ? "border-r border-white/8" : ""}`}
            >
              <div className="font-display text-4xl font-extrabold text-accent">{stat.number}</div>
              <div className="text-white/55 text-xs mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;