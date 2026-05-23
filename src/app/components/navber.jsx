'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const Navbar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: '🏠 Home' },
    { href: '/teams1', label: '🏆 Teams' },
    { href: '/players1', label: '👕 Players' },
    { href: '/fixtures1', label: '📅 Fixtures' },
    { href: '/results1', label: '📊 Results' },
  ]

  const isActive = (path) => pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl group-hover:rotate-12 transition-transform">🏆</div>
            <div className="leading-tight">
              <p className="font-bold text-sm md:text-base">
                PRE-EID <span className="text-orange-400">FRIENDSHIP CUP</span> 2026
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-orange-500 text-black font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-xl px-3 py-2 rounded-lg bg-white/5 border border-white/10"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm transition-all ${
                  isActive(link.href)
                    ? 'bg-orange-500 text-black font-bold'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar