'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '@/src/reducer/user.reducer'

const NAV_LINKS = [
  { label: 'Home',        href: '/' },
  { label: 'Properties',  href: '/all-properties' },
  { label: 'Blogs',       href: '/blogs' },
  { label: 'About Us',    href: '/about-us' },
  { label: 'Contact',     href: '/contact-us' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()

  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [dropOpen,  setDropOpen]  = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  // ── Auth — read from global Redux state ──────────────────────────────────────
  const dispatch = useDispatch()
  const loggedInUser: any = useSelector((root: any)=>{
        return root.user.loggedInUser
  })

  const handleLogout = () => {
    dispatch(logoutUser())
    setDropOpen(false)
    router.push('/')
  }

  // ── Scroll listener ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Close profile dropdown on outside click ───────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          backdrop-blur-lg border-b
          ${scrolled
            ? 'bg-primary/95 border-accent/25 shadow-[0_4px_30px_rgba(0,0,0,0.35)]'
            : 'bg-primary/75 border-transparent'}
        `}
      >
        <div className={`
          max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between
          transition-all duration-300
          ${scrolled ? 'h-16' : 'h-20'}
        `}>

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-light flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A1628">
                <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-white tracking-wide">
              Luxe<span className="text-accent">Estate</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    px-3.5 py-2 rounded-lg text-sm font-medium no-underline
                    transition-all duration-200 border-b-2
                    ${isActive(href)
                      ? 'text-accent border-accent font-semibold'
                      : 'text-white/80 border-transparent hover:text-white hover:bg-white/[0.06]'}
                  `}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Auth Area (desktop) ── */}
          <div className="hidden lg:flex items-center gap-2.5">
            {loggedInUser ? (
              /* Profile Dropdown */
              <div ref={dropRef} className="relative">
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className="
                    flex items-center gap-2 rounded-full
                    bg-accent/10 border border-accent/50
                    pl-1.5 pr-3.5 py-1.5
                    hover:bg-accent/20 transition-colors duration-200 cursor-pointer
                  "
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-primary text-xs font-bold">
                    {(loggedInUser.firstName ?? loggedInUser.email ?? 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-white text-[13px] font-semibold">
                    {loggedInUser.firstName?.split(' ')[0] ?? 'Profile'}
                  </span>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={`transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M2 4l4 4 4-4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {dropOpen && (
                  <div className="
                    absolute top-[calc(100%+10px)] right-0 min-w-[180px]
                    bg-primary-light border border-accent/20 rounded-xl
                    shadow-[0_16px_40px_rgba(0,0,0,0.4)] overflow-hidden
                    animate-[fadeInDown_.2s_ease]
                  ">
                    <div className="px-4 py-3 border-b border-white/[0.07]">
                      <p className="text-white text-[13px] font-semibold m-0">{loggedInUser.firstName ?? 'User'}</p>
                      <p className="text-white/40 text-[11px] mt-0.5 m-0">{loggedInUser.email ?? ''}</p>
                    </div>
                    {[
                      { label: '🏡  My Favourites', href: '/favourites' },
                      { label: '⚙️  Settings',       href: '/settings'  },
                    ].map(item => (
                      <Link
                        key={item.href} href={item.href}
                        onClick={() => setDropOpen(false)}
                        className="
                          block px-4 py-2.5 text-[13px] font-medium
                          text-white/75 no-underline
                          hover:bg-accent/10 hover:text-accent transition-colors duration-150
                        "
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="
                        w-full text-left px-4 py-2.5 text-[13px] font-medium
                        text-red-400 bg-transparent border-none
                        border-t border-white/[0.07]
                        hover:bg-red-400/10 transition-colors duration-150 cursor-pointer
                      "
                    >
                      🚪  Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="
                    px-4 py-2 rounded-lg border border-white/25 text-white
                    text-[13px] font-semibold no-underline
                    hover:border-accent/60 hover:text-accent transition-all duration-200
                  "
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="
                    px-5 py-2 rounded-lg font-bold text-[13px] no-underline
                    bg-gradient-to-r from-accent to-accent-light text-primary
                    hover:shadow-[0_4px_20px_rgba(201,168,76,0.45)]
                    hover:-translate-y-px transition-all duration-200
                  "
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ── Hamburger (mobile) ── */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            className="lg:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
          >
            <span className={`block h-0.5 w-6 bg-accent rounded transition-all duration-250 origin-center ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-accent rounded transition-all duration-250 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-accent rounded transition-all duration-250 origin-center ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <div className={`
          lg:hidden overflow-hidden transition-all duration-300
          ${menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
          bg-primary/98 border-t border-accent/15
        `}>
          <div className="px-4 pb-6 pt-2">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`
                  block py-3 border-b border-white/[0.06] text-[15px] no-underline
                  transition-colors duration-150
                  ${isActive(href) ? 'text-accent font-semibold' : 'text-white/80 font-normal'}
                `}
              >
                {label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="flex gap-2.5 mt-4">
              {loggedInUser ? (
                <button
                  onClick={handleLogout}
                  className="
                    flex-1 py-2.5 rounded-lg bg-red-400/10 border border-red-400/30
                    text-red-400 text-sm font-semibold cursor-pointer
                  "
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="
                      flex-1 py-2.5 rounded-lg border border-white/20
                      text-white text-sm font-semibold text-center no-underline
                    "
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="
                      flex-1 py-2.5 rounded-lg
                      bg-gradient-to-r from-accent to-accent-light
                      text-primary text-sm font-bold text-center no-underline
                    "
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20" />
    </>
  )
}