import React from 'react'

const Footer = () => {
  return (
    <footer className="relative w-full bg-black text-white border-t border-white/10 mt-auto overflow-hidden">

      {/* GLOW BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[300px] h-[120px] bg-orange-500/10 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="text-center space-y-2">

          {/* TITLE */}
          <h2 className="text-lg md:text-xl font-bold text-orange-400 tracking-wide">
            🏆 Pre-Eid Friendship Cup 2026
          </h2>

          {/* TAGLINE */}
          <p className="text-sm text-gray-400">
            ⚽ Built with passion, friendship & football energy
          </p>

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            ⚡ Tournament System Active
          </div>

          {/* COPYRIGHT */}
          <p className="text-[11px] text-gray-600 mt-4">
            © {new Date().getFullYear()} All Rights Reserved • Organized by Sorob
          </p>

        </div>

      </div>
    </footer>
  )
}

export default Footer