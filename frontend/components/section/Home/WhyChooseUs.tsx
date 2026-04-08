"use client";
import React from "react";

const reasons = [
  {
    title: "Verified Listings",
    desc: "Every property is thoroughly verified by our expert team to ensure authenticity and accuracy.",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    title: "Expert Guidance",
    desc: "Our seasoned real estate advisors guide you through every step of buying, selling, or renting.",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: "Best Price Guarantee",
    desc: "We negotiate the most competitive deals so you always get maximum value for your investment.",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    title: "Nationwide Network",
    desc: "Access properties across all major cities and regions through our extensive nationwide network.",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    title: "Transparent Process",
    desc: "No hidden fees or surprises. We maintain full transparency from first contact to final handover.",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    desc: "Our dedicated support team is always available around the clock whenever you need assistance.",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.92 17z"/>
      </svg>
    ),
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Image + floating card ── */}
          <div className="relative hidden lg:block">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden h-[520px]">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80"
                alt="Real estate professionals"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,22,40,0.3)_0%,transparent_60%)]" />
            </div>

            {/* Floating experience card */}
            <div className="absolute -bottom-8 -right-8 bg-[linear-gradient(135deg,#C9A84C,#A8883A)] rounded-2xl p-6 shadow-[0_16px_40px_rgba(201,168,76,0.35)]">
              <div className="font-display text-5xl font-extrabold text-primary mb-1">25+</div>
              <div className="text-primary/70 font-semibold text-sm">Years of Excellence<br/>in Real Estate</div>
            </div>

            {/* Floating success metric */}
            <div className="absolute top-6 -left-6 bg-primary/90 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-sm">98% Success Rate</div>
                <div className="text-white/45 text-xs">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* ── Right: Content ── */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 bg-accent/10 text-accent-dark text-xs font-bold tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Why Choose Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary leading-tight mb-4">
              Your Trusted <span className="text-accent">Real Estate</span> Partner
            </h2>
            <div className="w-12 h-0.5 bg-[linear-gradient(90deg,#C9A84C,#E2C270)] rounded-full mb-5" />
            <p className="text-gray-500 leading-relaxed mb-10 max-w-md">
              With over two decades of experience, we've helped thousands of families find their dream homes. Here's why our clients choose us again and again.
            </p>

            {/* Reason Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {reasons.map((r, i) => (
                <div
                  key={i}
                  className="group flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-primary transition-all duration-200">
                    {r.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm mb-1">{r.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/about"
              className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-full bg-[linear-gradient(135deg,#C9A84C,#A8883A)] text-primary font-bold text-sm shadow-[0_4px_20px_rgba(201,168,76,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.5)] transition-all duration-200"
            >
              Learn More About Us
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;