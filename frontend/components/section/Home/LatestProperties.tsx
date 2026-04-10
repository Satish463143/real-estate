"use client";
import React from "react";
import Link from "next/link";
import { useListForHomeQuery } from "@/components/api/properties.api";



const LatestProperties = () => {
  const { data, isLoading } = useListForHomeQuery({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 4,
  });

  const properties = data?.result || [];

  const getDaysAgo = (dateStr: string) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(dateStr).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
          <Link
            href="/all-properties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200 shrink-0"
          >
            All Listings
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Cards – horizontal layout */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((skeleton) => (
              <div key={skeleton} className="animate-pulse bg-white h-48 rounded-2xl w-full flex opacity-60" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((prop: any) => {
              const primaryImage = prop.images?.find((img: any) => img.isPrimary)?.image || prop.images?.[0]?.image || '/property-placeholder.jpg';
              const isRent = prop.listingType === 'for_rent';
              const daysAgo = getDaysAgo(prop.createdAt);
              
              return (
                <Link
                  href={`/property-details?id=${prop.id}`}
                  key={prop.id}
                  className="group flex bg-white rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(10,22,40,0.08)] overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(10,22,40,0.15)] transition-all duration-300 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative w-36 sm:w-48 shrink-0 overflow-hidden">
                    <img
                      src={primaryImage}
                      alt={prop.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_60%,rgba(10,22,40,0.15))]" />
                    {isRent && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-[0.65rem] font-bold tracking-wide uppercase">
                        For Rent
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-col justify-between p-4 sm:p-5 flex-1 min-w-0">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <svg width="11" height="11" fill="#C9A84C" viewBox="0 0 24 24" className="shrink-0">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                        </svg>
                        <span className="text-xs text-gray-400 truncate">{prop.location?.city}, {prop.location?.country}</span>
                      </div>
                      <h3 className="font-display font-bold text-primary text-base sm:text-lg leading-snug mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {prop.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 4v16M22 4v16M2 8h20M6 8v8"/></svg>
                          {prop.bedrooms} Beds
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6C9 3.8 7.2 2 5 2S1 3.8 1 6v7h22V9a3 3 0 0 0-3-3H9z"/></svg>
                          {prop.bathrooms} Baths
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs font-medium uppercase">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                          {prop.areaSize} {prop.areaSizeUnit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-3 mt-3 border-t border-gray-100">
                      <div className="truncate pr-2">
                        <span className="font-display font-bold text-primary text-lg sm:text-xl">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(prop.price)}
                        </span>
                        {isRent && (
                          <span className="text-gray-400 text-[10px] sm:text-xs ml-1">/mo rent</span>
                        )}
                      </div>
                      <span className="text-[0.68rem] text-gray-400 shrink-0">
                        {daysAgo === 0 ? "Today" : daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestProperties;