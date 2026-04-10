import Link from 'next/link'

const QUICK_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Blogs',      href: '/blogs' },
  { label: 'About Us',   href: '/about' },
  { label: 'Contact',    href: '/contact' },
]

const PROPERTY_TYPES = [
  'Residential Homes',
  'Luxury Villas',
  'Commercial Spaces',
  'Apartments',
  'Land & Plots',
]

const SOCIALS = [
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      {/* ── Top wave divider ── */}
      <div className="overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 rotate-180">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#ffffff"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 no-underline mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-light flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A1628">
                  <path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/>
                </svg>
              </div>
              <span className="font-display text-xl font-bold text-white">
                Luxe<span className="text-accent">Estate</span>
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-6">
              Your trusted partner in finding premium real estate. We connect buyers, sellers, and renters with their perfect home.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {SOCIALS.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="
                    w-9 h-9 rounded-lg bg-white/[0.06] border border-white/10
                    flex items-center justify-center text-white/50
                    hover:bg-accent/15 hover:border-accent/40 hover:text-accent
                    transition-all duration-200
                  "
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-accent text-[13px] font-bold uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="
                      text-white/60 text-sm no-underline
                      hover:text-accent hover:translate-x-1
                      transition-all duration-200 inline-flex items-center gap-1.5
                    "
                  >
                    <span className="w-1 h-1 rounded-full bg-accent/50 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-accent text-[13px] font-bold uppercase tracking-widest mb-5">
              Property Types
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {PROPERTY_TYPES.map(type => (
                <li key={type}>
                  <Link
                    href="/properties"
                    className="
                      text-white/60 text-sm no-underline
                      hover:text-accent hover:translate-x-1
                      transition-all duration-200 inline-flex items-center gap-1.5
                    "
                  >
                    <span className="w-1 h-1 rounded-full bg-accent/50 shrink-0" />
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-accent text-[13px] font-bold uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-4">
              {[
                {
                  icon: (
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  text: 'Kathmandu, Nepal',
                },
                {
                  icon: (
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 10.91A16 16 0 0 0 13 16.82l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 17z"/>
                    </svg>
                  ),
                  text: '+977 984-000-0000',
                },
                {
                  icon: (
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                  text: 'info@luxeestate.com',
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                  <span className="text-accent mt-0.5 shrink-0">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs text-center sm:text-left m-0">
            © {year} LuxeEstate. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <Link
                key={item}
                href="#"
                className="text-white/35 text-xs no-underline hover:text-accent transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}