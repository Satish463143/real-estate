'use client'
import { useMemo} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname();

  const activeLink: string | "" = useMemo(() => {
    if (!pathname) return "";
    if (pathname === "/") return "";
    if (pathname.startsWith("/admin/dashboard")) return "Dashboard";
    if (pathname.startsWith("/admin/blog") || pathname.startsWith("/admin/edit_blog") || pathname.startsWith("/admin/add_blog")) return "Blogs";
    if (pathname.startsWith("/admin/case-study") || pathname.startsWith("/admin/edit_case_study") || pathname.startsWith("/admin/add_case_study")) return "Case Studies";
    if (pathname.startsWith("/admin/project") || pathname.startsWith("/admin/edit_project") || pathname.startsWith("/admin/add_project")) return "Projects";
    if (pathname.startsWith("/admin/service") || pathname.startsWith("/admin/edit_service") || pathname.startsWith("/admin/add_service")) return "Services";
    if (pathname.startsWith("/admin/team") || pathname.startsWith("/admin/edit_team") || pathname.startsWith("/admin/add_team")) return "Team";
    if (pathname.startsWith("/admin/testimonial") || pathname.startsWith("/admin/edit_testimonial") || pathname.startsWith("/admin/add_testimonial")) return "Testimonial";
    if (pathname.startsWith("/admin/contact")) return "Contact";
    if (pathname.startsWith("/packages")) return "Package";
    if (pathname.startsWith("/portfolio")) return "Portfolio";
    return "";
  }, [pathname]);

  return (
    <div className='admin_navbar'>
        <div className='logo'>
          <img src="../src/assets/images/logo.png" alt="" />
        </div>
        <div className='admin_box'>
          <div>
            <span>
              <svg height="24" version="1.1" width="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0 -1028.4)"><path d="m12 1039.4c-1.277 0-2.4943 0.2-3.5938 0.7 0.6485 1.3 2.0108 2.3 3.5938 2.3s2.945-1 3.594-2.3c-1.1-0.5-2.317-0.7-3.594-0.7z" fill="#95a5a6"/>
                  <path d="m8.4062 1041.1c-2.8856 1.3-4.9781 4-5.3437 7.3 0 1.1 0.8329 2 1.9375 2h14c1.105 0 1.938-0.9 1.938-2-0.366-3.3-2.459-6-5.344-7.3-0.649 1.3-2.011 2.3-3.594 2.3s-2.9453-1-3.5938-2.3z" fill="#d35400"/>
                  <path d="m8.4062 1040.1c-2.8856 1.3-4.9781 4-5.3437 7.3 0 1.1 0.8329 2 1.9375 2h14c1.105 0 1.938-0.9 1.938-2-0.366-3.3-2.459-6-5.344-7.3-0.649 1.3-2.011 2.3-3.594 2.3s-2.9453-1-3.5938-2.3z" fill="#e67e22"/>
                  <path d="m12 11c-1.147 0-2.2412 0.232-3.25 0.625 0.9405 0.616 2.047 1 3.25 1 1.206 0 2.308-0.381 3.25-1-1.009-0.393-2.103-0.625-3.25-0.625z" fill="#7f8c8d" transform="translate(0 1028.4)"/>
                  <path d="m17 4a5 5 0 1 1 -10 0 5 5 0 1 1 10 0z" fill="#060060" transform="translate(0 1031.4)"/>
                  <path d="m8.4062 1040.1c-0.3172 0.2-0.6094 0.3-0.9062 0.5 0.8153 1.6 2.541 2.8 4.5 2.8s3.685-1.2 4.5-2.8c-0.297-0.2-0.589-0.3-0.906-0.5-0.649 1.3-2.011 2.3-3.594 2.3s-2.9453-1-3.5938-2.3z" fill="#d35400" />
                </g>
              </svg>
            </span>
          </div>
          <div>
            <p>Admin Panel</p>
          </div>
        </div>
        <div className='menu' style={{height:'calc(100vh - 105px)', scrollbarWidth:'none', overflowY:'scroll'}}>
          <nav>
            <ul>
              <Link href="/admin/dashboard">
                <li className={activeLink === "Dashboard" ? "liActive" : ""}>
                  <span>
                    <svg  version="1.1" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <g id="info"/><g id="icons"><g id="dashboard">
                        <path d="M5,18H3c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2C7,18.9,6.1,18,5,18z"/>
                        <path d="M13,16h-2c-1.1,0-2,0.9-2,2v2c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-2C15,16.9,14.1,16,13,16z"/>
                        <path d="M21,12h-2c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-6C23,12.9,22.1,12,21,12z"/>
                        <path d="M22,2h-6.6c-0.9,0-1.3,1.1-0.7,1.7l1.9,1.9C12.9,9.8,7.6,13,2,13c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1    c6.7,0,12.9-1.9,17.4-6.6l1.8,1.8c0.6,0.6,1.7,0.2,1.7-0.7V3C23,2.4,22.6,2,22,2z"/>
                      </g></g>
                    </svg>
                  </span>
                  <p>Dashboard</p>
                  </li>
              </Link>
              <Link href='/admin/blog'>
                <li className={activeLink === "Blogs" ? "liActive" : ""}>
                  <span>
                    <svg height="25" viewBox="0 0 48 48" width="25" xmlns="http://www.w3.org/2000/svg">
                      <path d="M38 14h-16v12h16v-12zm4-8h-36c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 3.96 4 3.96h36c2.21 0 4-1.76 4-3.96v-28c0-2.21-1.79-4-4-4zm0 32.03h-36v-28.06h36v28.06z"/>
                      <path d="M0 0h48v48h-48z" fill="none"/>
                    </svg>
                  </span>
                  <p>Blogs</p>
                </li>
              </Link>              
              <Link href='/admin/case-study'>
                <li className={activeLink === "Case Studies" ? "liActive" : ""}>
                  <span>
                    <svg height="25" viewBox="0 0 48 48" width="25" xmlns="http://www.w3.org/2000/svg">
                      <path d="M38 14h-16v12h16v-12zm4-8h-36c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 3.96 4 3.96h36c2.21 0 4-1.76 4-3.96v-28c0-2.21-1.79-4-4-4zm0 32.03h-36v-28.06h36v28.06z"/>
                      <path d="M0 0h48v48h-48z" fill="none"/>
                    </svg>
                  </span>
                  <p>Case Studies</p>
                </li>
              </Link>              
              <Link href='/admin/project'>
                <li className={activeLink === "Projects" ? "liActive" : ""}>
                  <span>
                    <svg height="25" viewBox="0 0 48 48" width="25" xmlns="http://www.w3.org/2000/svg">
                      <path d="M38 14h-16v12h16v-12zm4-8h-36c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 3.96 4 3.96h36c2.21 0 4-1.76 4-3.96v-28c0-2.21-1.79-4-4-4zm0 32.03h-36v-28.06h36v28.06z"/>
                      <path d="M0 0h48v48h-48z" fill="none"/>
                    </svg>
                  </span>
                  <p>Projects</p>
                </li>
              </Link>              
              <Link href='/admin/testimonial'>
                <li className={activeLink === "Testimonial" ? "liActive" : ""}>
                  <span>
                    <svg height="25" viewBox="0 0 48 48" width="25" xmlns="http://www.w3.org/2000/svg">
                      <path d="M38 14h-16v12h16v-12zm4-8h-36c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 3.96 4 3.96h36c2.21 0 4-1.76 4-3.96v-28c0-2.21-1.79-4-4-4zm0 32.03h-36v-28.06h36v28.06z"/>
                      <path d="M0 0h48v48h-48z" fill="none"/>
                    </svg>
                  </span>
                  <p>Testimonial</p>
                </li>
              </Link>              
              <Link href='/admin/service'>
                <li className={activeLink === "Services" ? "liActive" : ""}>
                  <span>
                    <svg height="25" viewBox="0 0 48 48" width="25" xmlns="http://www.w3.org/2000/svg">
                      <path d="M38 14h-16v12h16v-12zm4-8h-36c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 3.96 4 3.96h36c2.21 0 4-1.76 4-3.96v-28c0-2.21-1.79-4-4-4zm0 32.03h-36v-28.06h36v28.06z"/>
                      <path d="M0 0h48v48h-48z" fill="none"/>
                    </svg>
                  </span>
                  <p>Services</p>
                </li>
              </Link>              
              <Link href='/admin/team'>
                <li className={activeLink === "Team" ? "liActive" : ""}>
                  <span>
                    <svg height="25" viewBox="0 0 48 48" width="25" xmlns="http://www.w3.org/2000/svg">
                      <path d="M38 14h-16v12h16v-12zm4-8h-36c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 3.96 4 3.96h36c2.21 0 4-1.76 4-3.96v-28c0-2.21-1.79-4-4-4zm0 32.03h-36v-28.06h36v28.06z"/>
                      <path d="M0 0h48v48h-48z" fill="none"/>
                    </svg>
                  </span>
                  <p>Team</p>
                </li>
              </Link>              
              <Link href='/admin/contact'>
                <li className={activeLink === "Contact" ? "liActive" : ""}>
                  <span>
                    <svg height="25" viewBox="0 0 48 48" width="25" xmlns="http://www.w3.org/2000/svg">
                      <path d="M38 14h-16v12h16v-12zm4-8h-36c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 3.96 4 3.96h36c2.21 0 4-1.76 4-3.96v-28c0-2.21-1.79-4-4-4zm0 32.03h-36v-28.06h36v28.06z"/>
                      <path d="M0 0h48v48h-48z" fill="none"/>
                    </svg>
                  </span>
                  <p>Contact</p>
                </li>
              </Link>              
                          
            </ul>
          </nav>
        </div>        
    </div>
  )
}

export default Navbar