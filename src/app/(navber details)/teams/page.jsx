'use client'

import React from 'react'

const Teams = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-6">

      <div className="text-center max-w-md">

        {/* ICON */}
        <div className="text-6xl mb-4">
          ⚽🏆
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-orange-400">
          Teams Not Created Yet
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-300 mt-3 leading-relaxed">
          The tournament teams are currently not available.  
          After final team creation, we will inform you and update the system.
        </p>

        {/* STATUS BADGE */}
        <div className="mt-6 inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-gray-300">
          🚧 Under Preparation
        </div>

        {/* FOOT NOTE */}
        <p className="text-gray-500 text-xs mt-6">
          Pre-Eid Friendship Cup 2026
        </p>

      </div>

    </div>
  )
}

export default Teams