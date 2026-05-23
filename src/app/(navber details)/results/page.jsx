'use client'

import React from 'react'

const Results = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black text-white px-4 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-orange-500/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-yellow-500/10 blur-[160px] rounded-full" />
      </div>

      {/* CARD */}
      <div className="relative w-full max-w-lg text-center">

        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-xl">

          {/* ICON */}
          <div className="text-6xl mb-4">
            🏆⚽
          </div>

          {/* TITLE */}
          <h1 className="text-2xl md:text-3xl font-bold text-orange-400">
            Results Coming Soon
          </h1>

          {/* SUBTEXT */}
          <p className="text-gray-400 mt-4 text-sm leading-relaxed">
            Match results for the <span className="text-white font-semibold">
            Pre-Eid Friendship Cup 2026</span> will be published here after each game is completed.
          </p>

          <p className="text-gray-400 mt-2 text-sm">
            Stay connected for live updates, goals, assists, and rankings.
          </p>

          {/* STATUS BADGE */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            📊 <span>Awaiting Match Results</span>
          </div>

          {/* FOOT NOTE */}
          <div className="mt-6 text-xs text-gray-500">
            Pre-Eid Friendship Cup 2026 • Organized by Sorob
          </div>

        </div>

      </div>

    </div>
  )
}

export default Results