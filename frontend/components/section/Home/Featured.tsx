"use client";
import React from "react";

const properties = [
  {
    id: 1,
    title: "Luxury Penthouse Suite",
    location: "Lazimpat, Kathmandu",
    price: "$1,200,000",
    type: "Apartment",
    beds: 4, baths: 3, area: "3,200 sqft",
    badge: "Featured", badgeCls: "bg-accent text-primary",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
  {
    id: 2,
    title: "Contemporary Family Home",
    location: "Jhamsikhel, Lalitpur",
    price: "$845,000",
    type: "Villa",
    beds: 5, baths: 4, area: "4,500 sqft",
    badge: "New", badgeCls: "bg-emerald-500 text-white",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  },
  {
    id: 3,
    title: "Modern Garden Apartment",
    location: "Pulchowk, Lalitpur",
    price: "$420,000",
    type: "Apartment",
    beds: 3, baths: 2, area: "1,800 sqft",
    badge: "Hot Deal", badgeCls: "bg-red-500 text-white",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  },
];

const BedIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M2 4v16M22 4v16M2 8h20M2 16h20M6 8v8M10 8v8" />
  </svg>
);
const BathIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 6 C9 3.8 7.2 2 5 2S1 3.8 1 6v7h22V9a3 3 0 0 0-3-3H9z"/><path d="M1 13v3a5 5 0 0 0 5 5h12a5 5 0 0 0 5-5v-3"/>
  </svg>
);
const AreaIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
);

const Featured = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 bg-accent/10 text-accent-dark text-xs font-bold tracking-widest uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Premium Selection
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary leading-tight mb-3">
              Featured <span className="text-accent">Properties</span>
            </h2>
            <div className="w-12 h-0.5 bg-[linear-gradient(90deg,#C9A84C,#E2C270)] rounded-full mb-4" />
            <p className="text-gray-500 max-w-md leading-relaxed">
              Hand-picked premium properties offering exceptional value and unmatched luxury in prime locations.
            </p>
          </div>
          <a
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200 shrink-0"
          >
            View All
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {properties.map((prop) => (
            <article
              key={prop.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(10,22,40,0.09)] overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(10,22,40,0.16)] transition-all duration-300 cursor-pointer group"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,22,40,0.6)_0%,transparent_55%)]" />

                {/* Badge */}
                <span className={`absolute top-4 left-4 inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-bold tracking-wide uppercase ${prop.badgeCls}`}>
                  {prop.badge}
                </span>

                {/* Favourite */}
                <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-500/80 hover:border-red-400 transition-all duration-200 cursor-pointer">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l7.78 7.78 7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>

                {/* Price */}
                <div className="absolute bottom-4 left-4 font-display text-xl font-bold text-accent-light">
                  {prop.price}
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="11" height="11" fill="#C9A84C" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  </svg>
                  <span className="text-xs text-gray-400">{prop.location}</span>
                  <span className="ml-auto text-[0.68rem] bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-semibold">{prop.type}</span>
                </div>

                <h3 className="font-display text-lg font-bold text-primary mb-4 leading-snug">
                  {prop.title}
                </h3>

                <div className="flex items-center gap-5 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                    <BedIcon /> {prop.beds} Beds
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                    <BathIcon /> {prop.baths} Baths
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                    <AreaIcon /> {prop.area}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;