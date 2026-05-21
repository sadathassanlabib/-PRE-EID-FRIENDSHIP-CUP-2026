'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-3xl transition-all duration-300 group-hover:scale-110">
              🏆
            </span>
            <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              PRE-EID FRIENDSHIP <span className="text-orange-400">CUP 2026</span>
            </span>
          </Link>

          {/* Desktop Navigation Links - Right Side */}
          <div className="hidden md:flex space-x-8">
            <Link href="/players" className="relative text-gray-200 hover:text-white transition duration-300 group text-sm font-medium">
              Players
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link href="/teams" className="relative text-gray-200 hover:text-white transition duration-300 group text-sm font-medium">
              Teams
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link href="/fixtures" className="relative text-gray-200 hover:text-white transition duration-300 group text-sm font-medium">
              Fixtures
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link href="/result" className="relative text-gray-200 hover:text-white transition duration-300 group text-sm font-medium">
              Result
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link href="/about" className="relative text-gray-200 hover:text-white transition duration-300 group text-sm font-medium">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 border-t border-white/10 flex flex-col space-y-3">
            <Link href="/players" onClick={() => setIsOpen(false)} className="text-gray-200 hover:text-white transition duration-300 px-2 py-1 hover:pl-4">
              👕 Players
            </Link>
            <Link href="/teams" onClick={() => setIsOpen(false)} className="text-gray-200 hover:text-white transition duration-300 px-2 py-1 hover:pl-4">
              ⚽ Teams
            </Link>
            <Link href="/fixtures" onClick={() => setIsOpen(false)} className="text-gray-200 hover:text-white transition duration-300 px-2 py-1 hover:pl-4">
              📅 Fixtures
            </Link>
            <Link href="/result" onClick={() => setIsOpen(false)} className="text-gray-200 hover:text-white transition duration-300 px-2 py-1 hover:pl-4">
              📊 Result
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-gray-200 hover:text-white transition duration-300 px-2 py-1 hover:pl-4">
              ℹ️ About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar