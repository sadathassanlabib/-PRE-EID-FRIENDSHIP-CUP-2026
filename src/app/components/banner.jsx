import React from 'react'
import Link from 'next/link'

const Banner = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* GLOW BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative text-center px-6">

        {/* ICON */}
        <div className="text-7xl mb-6 animate-bounce">
          🏆⚽
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide">
          Pre-Eid <span className="text-orange-400">Friendship Cup</span> 2026
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-300 mt-5 max-w-2xl mx-auto text-sm md:text-base">
          A battlefield of passion, friendship, and football glory.  
          Only one team will rise as champion.
        </p>

        {/* STATUS BADGE */}
        <div className="mt-8 inline-block px-6 py-2 rounded-full bg-white/10 border border-white/20 text-sm backdrop-blur-md">
          ⚽ Tournament System Active
        </div>

        {/* CTA BUTTONS */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">

          <Link href="/teams">
            <button className="px-6 py-3 rounded-xl bg-orange-500 text-black font-bold hover:bg-orange-400 transition">
              View Teams
            </button>
          </Link>

          <Link href="/fixtures">
            <button className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition">
              Match Fixtures
            </button>
          </Link>

        </div>

        {/* STATS DASHBOARD */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">

          {/* TEAMS */}
          <Link href="/teams">
            <div className="cursor-pointer bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-xl p-5 text-center group">

              <p className="text-3xl font-bold text-orange-400 group-hover:scale-110 transition">
                ⚽ 6
              </p>

              <p className="text-gray-300 mt-1 font-medium">
                Teams
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Click to explore squads
              </p>

            </div>
          </Link>

          {/* PLAYERS */}
          <Link href="/players">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">

            <p className="text-3xl font-bold text-blue-400">
              👥 30+
            </p>

            <p className="text-gray-300 mt-1 font-medium">
              Players
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Registered participants
            </p>

          </div>
          </Link>

          {/* FIXTURES */}
          <Link href="/fixtures">
            <div className="cursor-pointer bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-xl p-5 text-center group">

              <p className="text-3xl font-bold text-green-400 group-hover:scale-110 transition">
                📅 View
              </p>

              <p className="text-gray-300 mt-1 font-medium">
                Fixtures
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Match schedule
              </p>

            </div>
          </Link>

        </div>

      </div>
    </div>
  )
}

export default Banner