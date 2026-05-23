'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const Navbar_Admin = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { href: '/', label: '🏠 Home' },

    // ADMIN PANEL ROUTES
    { href: '/admin/teams', label: '🏆 Teams' },
    { href: '/admin/players', label: '👕 Players' },
    { href: '/admin/fixtures', label: '📅 Fixtures' },
    { href: '/admin/results', label: '📊 Results' },
  ]

  const isActive = (href) => pathname === href

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP BAR */}
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl group-hover:rotate-12 transition-transform">
              🏆
            </div>

            <div className="font-bold text-sm md:text-base text-white">
              PRE-EID <span className="text-orange-400">FRIENDSHIP CUP</span> 2026
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-2">

            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-orange-500 text-black font-bold shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}

          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-xl px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            {open ? '✕' : '☰'}
          </button>

        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-2">

            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm transition-all ${
                  isActive(item.href)
                    ? 'bg-orange-500 text-black font-bold'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}

          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar_Admin