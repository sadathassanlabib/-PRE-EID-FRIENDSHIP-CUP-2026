import React from 'react'
import Link from 'next/link'

const Banner = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-black text-white">

      {/* subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-950" />

      <div className="max-w-6xl mx-auto px-6 py-20 w-full relative">

        {/* header line */}
        <p className="text-sm tracking-[6px] text-gray-400 uppercase">
          Pre-Eid Football Tournament 2026
        </p>

        {/* title */}
        <h1 className="mt-4 text-5xl md:text-7xl font-bold leading-tight">
          Friendship Cup
          <span className="block text-gray-400 font-medium text-2xl md:text-3xl mt-2">
            Season 2026
          </span>
        </h1>

        {/* description */}
        <p className="mt-6 max-w-xl text-gray-400 text-base leading-relaxed">
          A local football tournament built on competition, discipline, and friendship.
          Organized for players who love the game and respect the spirit of football.
        </p>

        {/* info grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-gray-400">Date</p>
            <p className="font-semibold mt-1">23–24 May 2026</p>
          </div>

          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-gray-400">Time</p>
            <p className="font-semibold mt-1">After Fajr Prayer</p>
          </div>

          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-gray-400">Venue</p>
            <p className="font-semibold mt-1">
              Habildar Mor, 60 Feet
            </p>
          </div>

        </div>

        {/* buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">

          <Link href="/players">
            <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
              View Players
            </button>
          </Link>

          <Link href="/fixtures">
            <button className="px-6 py-3 border border-white/20 rounded-lg hover:border-white/40 transition">
              Match Fixtures
            </button>
          </Link>

        </div>

        {/* stats */}
        <div className="mt-16 flex gap-10 text-center">

          <div>
            <p className="text-3xl font-bold">6</p>
            <p className="text-gray-500 text-sm mt-1">Teams</p>
          </div>

          <div>
            <p className="text-3xl font-bold">30+</p>
            <p className="text-gray-500 text-sm mt-1">Players</p>
          </div>

          <div>
            <p className="text-3xl font-bold">2</p>
            <p className="text-gray-500 text-sm mt-1">Days</p>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Banner