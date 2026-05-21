'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 text-white">

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition">
              🏆
            </span>

            <span className="font-bold text-sm md:text-lg tracking-wide">
              PRE-EID <span className="text-orange-400">FRIENDSHIP CUP 2026</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 text-sm">

            <Link className="hover:text-orange-400 transition" href="/players">
              Players
            </Link>

            <Link className="hover:text-orange-400 transition" href="/teams">
              Teams
            </Link>

            <Link className="hover:text-orange-400 transition" href="/fixtures">
              Fixtures
            </Link>

            <Link className="hover:text-orange-400 transition" href="/result">
              Results
            </Link>

            <Link className="hover:text-orange-400 transition" href="/about">
              About
            </Link>

          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? "✖" : "☰"}
          </button>

        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm">

            <Link onClick={() => setIsOpen(false)} href="/players">Players</Link>
            <Link onClick={() => setIsOpen(false)} href="/teams">Teams</Link>
            <Link onClick={() => setIsOpen(false)} href="/fixtures">Fixtures</Link>
            <Link onClick={() => setIsOpen(false)} href="/result">Results</Link>
            <Link onClick={() => setIsOpen(false)} href="/about">About</Link>

          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar