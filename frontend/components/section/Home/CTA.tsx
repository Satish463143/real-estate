import Link from 'next/link'

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 sm:py-28">

      {/* ── Decorative background blobs ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary-mid/60 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-3xl" />
      </div>

      {/* ── Grid pattern overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-accent text-xs font-semibold tracking-wider uppercase">
            Find Your Dream Home Today
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Ready to Discover{' '}
          <span className="text-accent">Your Perfect</span>{' '}
          Property?
        </h2>

        {/* Subtext */}
        <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Explore thousands of curated listings across Nepal. Whether you're buying, renting, or investing — we make the journey effortless.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/properties"
            className="
              group inline-flex items-center gap-2.5
              bg-gradient-to-r from-accent to-accent-light
              text-primary font-bold text-sm sm:text-base
              px-8 py-3.5 rounded-full no-underline
              shadow-[0_0_0_0_rgba(201,168,76,0.4)]
              hover:shadow-[0_6px_28px_rgba(201,168,76,0.45)]
              hover:-translate-y-0.5
              transition-all duration-300
            "
          >
            Browse Properties
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform duration-200"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          <Link
            href="/contact"
            className="
              inline-flex items-center gap-2.5
              border border-white/25 text-white font-semibold text-sm sm:text-base
              px-8 py-3.5 rounded-full no-underline
              hover:border-accent/60 hover:text-accent hover:bg-accent/5
              transition-all duration-300
            "
          >
            Talk to an Agent
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-lg mx-auto">
          {[
            { value: '2,400+', label: 'Listed Properties' },
            { value: '1,800+', label: 'Happy Clients'     },
            { value: '12+',    label: 'Years Experience'  },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="font-display text-3xl font-bold text-accent">{stat.value}</span>
              <span className="text-white/45 text-xs mt-1 tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}