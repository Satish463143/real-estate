"use client";
import React, { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Home Buyer",
    location: "Kathmandu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
    text: "The team made our home buying journey incredibly smooth. They found us our dream home in Lalitpur within two weeks, and their negotiation skills saved us over $40,000. Truly exceptional service!",
  },
  {
    id: 2,
    name: "Rajesh Thapa",
    role: "Property Investor",
    location: "Pokhara",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80",
    rating: 5,
    text: "I've worked with several real estate agencies, but this platform stands apart. Their market insights and portfolio recommendations have delivered outstanding returns on my investments year after year.",
  },
  {
    id: 3,
    name: "Anita Gurung",
    role: "First-Time Buyer",
    location: "Bhaktapur",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
    rating: 5,
    text: "As a first-time buyer I was nervous, but the team walked me through every step with patience and clarity. They found me a beautiful home within my budget. I couldn't be happier with my decision!",
  },
];

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#C9A84C" : "none"} stroke="#C9A84C" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const Testimonal = () => {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="py-24 bg-[linear-gradient(135deg,#0A1628_0%,#1E3A5F_100%)] relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(201,168,76,0.08)_0%,transparent_70%)] blur-[60px]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent-light text-xs font-bold tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            Client Stories
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            What Our <span className="text-accent">Clients</span> Say
          </h2>
        </div>

        {/* Quote Mark */}
        <div className="flex justify-center mb-4">
          <svg width="56" height="40" viewBox="0 0 56 40" fill="rgba(201,168,76,0.25)">
            <path d="M0 40V22.4C0 9.6 6.4 2.4 19.2 0l3.2 4.8C16 6.4 12.8 10.4 12 16H24V40H0zm32 0V22.4C32 9.6 38.4 2.4 51.2 0l3.2 4.8C48 6.4 44.8 10.4 44 16H56V40H32z"/>
          </svg>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-[0_24px_64px_rgba(0,0,0,0.3)]">

          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={i < t.rating} />)}
          </div>

          {/* Quote */}
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
            "{t.text}"
          </p>

          {/* Author */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={t.avatar}
              alt={t.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/40"
            />
            <div>
              <div className="text-white font-bold">{t.name}</div>
              <div className="text-white/45 text-sm">{t.role} · {t.location}</div>
            </div>
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-8 mt-10">
          {/* Prev */}
          <button
            onClick={() => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-accent hover:text-accent transition-all duration-200 cursor-pointer"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer border-none ${
                  active === i ? "w-8 h-2.5 bg-accent" : "w-2.5 h-2.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => setActive((prev) => (prev + 1) % testimonials.length)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-accent hover:text-accent transition-all duration-200 cursor-pointer"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Client Thumbnails */}
        <div className="flex justify-center gap-4 mt-8">
          {testimonials.map((tm, i) => (
            <button
              key={tm.id}
              onClick={() => setActive(i)}
              className={`rounded-full overflow-hidden transition-all duration-300 cursor-pointer border-2 ${
                active === i ? "border-accent shadow-[0_0_0_3px_rgba(201,168,76,0.3)]" : "border-white/15 opacity-50"
              }`}
            >
              <img src={tm.avatar} alt={tm.name} className="w-10 h-10 object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonal;