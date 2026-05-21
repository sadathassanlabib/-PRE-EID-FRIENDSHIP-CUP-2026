'use client'

import React from 'react'

const Teams = () => {
  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-20">

      <div className="max-w-2xl text-center">

        {/* ICON */}
        <div className="text-6xl mb-6">⚽🏆</div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-bold">
          Teams Formation
        </h1>

        <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
          The official team list for{" "}
          <span className="text-white font-semibold">
            Pre-Eid Friendship Cup 2026
          </span>{" "}
          is currently being finalized.
        </p>

        <p className="text-gray-400 mt-3 text-sm md:text-base leading-relaxed">
          After player registration is completed, teams will be carefully balanced
          and published here for the tournament draw.
        </p>

        {/* STATUS BOX */}
        <div className="mt-10 border border-white/10 bg-white/5 rounded-2xl p-6">

          <p className="text-orange-400 font-semibold">
            🚧 Team Creation in Progress
          </p>

          <p className="text-gray-400 text-sm mt-2">
            Organizers are currently organizing balanced squads for fair competition
          </p>

        </div>

        {/* INFO GRID */}
        <div className="grid sm:grid-cols-2 gap-4 mt-10 text-left">

          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-gray-500 text-xs">Status</p>
            <p className="font-semibold mt-1">Not Published</p>
          </div>

          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-gray-500 text-xs">Expected Update</p>
            <p className="font-semibold mt-1">Before Tournament Day</p>
          </div>

        </div>

        {/* FOOT NOTE */}
        <p className="text-gray-500 text-xs mt-10 tracking-wide">
          Pre-Eid Friendship Cup 2026 • Organized by Sorob
        </p>

      </div>

    </section>
  )
}

export default Teams