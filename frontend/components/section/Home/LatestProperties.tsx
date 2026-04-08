"use client";
import React from "react";

const properties = [
  {
    id: 1,
    title: "Panoramic City View Flat",
    location: "Thamel, Kathmandu",
    price: "$320,000",
    priceUnit: "/mo rent",
    isRent: true,
    beds: 3, baths: 2, area: "1,450 sqft",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&q=80",
    daysAgo: 1,
  },
  {
    id: 2,
    title: "Elegant Townhouse",
    location: "Sanepa, Lalitpur",
    price: "$680,000",
    priceUnit: "",
    isRent: false,
    beds: 4, baths: 3, area: "2,800 sqft",
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&q=80",
    daysAgo: 2,
  },
  {
    id: 3,
    title: "Garden Bungalow",
    location: "Bhaktapur Old Town",
    price: "$545,000",
    priceUnit: "",
    isRent: false,
    beds: 4, baths: 2, area: "3,100 sqft",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    daysAgo: 3,
  },
  {
    id: 4,
    title: "Smart Studio Loft",
    location: "Baneswor, Kathmandu",
    price: "$1,200",
    priceUnit: "/mo rent",
    isRent: true,
    beds: 1, baths: 1, area: "620 sqft",
    image: "https://images.unsplash.com/photo-1585128792020-803d29415281?w=500&q=80",
    daysAgo: 4,
  },
];

const LatestProperties = () => {
  return (
    <section className="py-24 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 bg-accent/10 text-accent-dark text-xs font-bold tracking-widest uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Fresh on Market
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary leading-tight mb-3">
              Latest <span className="text-accent">Properties</span>
            </h2>
            <div className="w-12 h-0.5 bg-[linear-gradient(90deg,#C9A84C,#E2C270)] rounded-full mb-4" />
            <p className="text-gray-500 max-w-md leading-relaxed">
              The newest additions to our portfolio, freshly listed and ready for you to explore.
            </p>
          </div>
          <a
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200 shrink-0"
          >
            All Listings
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* Cards – horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((prop) => (
            <article
              key={prop.id}
              className="group flex bg-white rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(10,22,40,0.08)] overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(10,22,40,0.15)] transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-48 shrink-0 overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_60%,rgba(10,22,40,0.15))]" />
                {prop.isRent && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-[0.65rem] font-bold tracking-wide uppercase">
                    For Rent
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col justify-between p-5 flex-1">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg width="11" height="11" fill="#C9A84C" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                    <span className="text-xs text-gray-400">{prop.location}</span>
                  </div>
                  <h3 className="font-display font-bold text-primary text-base leading-snug mb-3">
                    {prop.title}
                  </h3>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 4v16M22 4v16M2 8h20M6 8v8"/></svg>
                      {prop.beds} Beds
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6C9 3.8 7.2 2 5 2S1 3.8 1 6v7h22V9a3 3 0 0 0-3-3H9z"/></svg>
                      {prop.baths} Baths
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                      {prop.area}
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between pt-3 mt-3 border-t border-gray-100">
                  <div>
                    <span className="font-display font-bold text-primary text-xl">{prop.price}</span>
                    {prop.priceUnit && (
                      <span className="text-gray-400 text-xs ml-1">{prop.priceUnit}</span>
                    )}
                  </div>
                  <span className="text-[0.68rem] text-gray-400">
                    {prop.daysAgo === 1 ? "Today" : `${prop.daysAgo} days ago`}
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

export default LatestProperties;