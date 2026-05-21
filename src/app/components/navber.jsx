'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: 'Players', href: '/players', icon: '👕' },
    { name: 'Teams', href: '/teams', icon: '⚽' },
    { name: 'Fixtures', href: '/fixtures', icon: '📅' },
    { name: 'Results', href: '/result', icon: '📊' },
    { name: 'About', href: '/about', icon: 'ℹ️' }
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/70 backdrop-blur-2xl border-b border-white/10">

      {/* GLOW LINE */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl group-hover:rotate-12 transition">
              🏆
            </div>

            <div className="leading-tight">
              <p className="font-bold text-sm md:text-base">
                PRE-EID  FRIENDSHIP <span className="text-orange-400">CUP</span> 2026
              </p>
              
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2">

            {navItems.map((item) => {
              const active = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-full text-sm transition
                    flex items-center gap-2
                    border
                    ${active
                      ? 'bg-orange-500 text-black border-orange-400'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}

          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-xl px-3 py-1 rounded-lg bg-white/5 border border-white/10"
          >
            {isOpen ? '✕' : '☰'}
          </button>

        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-3 flex flex-col gap-2">

            {navItems.map((item) => {
              const active = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    px-4 py-2 rounded-xl text-sm
                    flex items-center gap-2
                    border transition
                    ${active
                      ? 'bg-orange-500 text-black border-orange-400'
                      : 'bg-white/5 border-white/10'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}

          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar