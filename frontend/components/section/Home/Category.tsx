"use client";
import React, { useState } from "react";

const categories = [
  {
    label: "Houses",
    count: 320,
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
  },
  {
    label: "Apartments",
    count: 485,
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
  },
  {
    label: "Villas",
    count: 142,
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M1 22h22M4 22V8L12 2l8 6v14M18 22v-7H6v7M12 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80",
  },
  {
    label: "Commercial",
    count: 98,
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
  },
  {
    label: "Land & Plots",
    count: 76,
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M8 21v-4a4 4 0 0 1 8 0v4"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
  },
  {
    label: "Penthouses",
    count: 34,
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polygon points="12 2 15 9 22 9 16 14 18 21 12 17 6 21 8 14 2 9 9 9"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
  },
];

const Category = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 bg-accent/10 text-accent-dark text-xs font-bold tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Browse By Type
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary leading-tight mb-4">
            Property <span className="text-accent">Categories</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            Explore our wide range of property types and find the one that perfectly fits your lifestyle and needs.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative group rounded-2xl overflow-hidden h-48 cursor-pointer border-none p-0 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(10,22,40,0.2)]"
            >
              {/* Bg Image */}
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className={`absolute inset-0 transition-all duration-300 ${hovered === i
                ? "bg-[linear-gradient(135deg,rgba(10,22,40,0.88)_0%,rgba(201,168,76,0.6)_100%)]"
                : "bg-[linear-gradient(to_top,rgba(10,22,40,0.85)_0%,rgba(10,22,40,0.3)_100%)]"
              }`} />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2 p-4">
                <div className={`transition-colors duration-300 ${hovered === i ? "text-accent" : "text-white"}`}>
                  {cat.icon}
                </div>
                <span className="text-white font-bold text-sm text-center leading-tight">{cat.label}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-all duration-300 ${hovered === i
                  ? "bg-accent text-primary"
                  : "bg-white/15 text-white/80"
                }`}>
                  {cat.count} listings
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;