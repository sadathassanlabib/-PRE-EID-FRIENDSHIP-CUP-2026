'use client'

import React from 'react'
import { teams } from '../data/teams' // adjust path if needed

const Teams = () => {
  return (
    <section className="min-h-screen bg-black text-white px-6 py-20">

      {/* HEADER */}
      <div className="text-center mb-14">
        <div className="text-5xl mb-4">🏆⚽</div>

        <h1 className="text-4xl md:text-5xl font-bold">
          Teams Formation
        </h1>

        <p className="text-gray-400 mt-3">
          Pre-Eid Friendship Cup 2026 — Official Squads
        </p>
      </div>

      {/* TEAMS GRID */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {teams.map((team, idx) => (
          <div
            key={idx}
            className="border border-white/10 bg-white/5 rounded-2xl p-5 hover:border-orange-400/40 transition"
          >

            {/* TEAM HEADER */}
            <h2 className="text-2xl font-bold text-orange-400">
              {team.teamName}
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Captain: <span className="text-white">{team.captain}</span>
            </p>

            {/* PLAYER LIST */}
            <div className="mt-4 space-y-2">
              {team.players.map((player, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-white/10 pb-2"
                >
                  <div>
                    <p className="font-medium">
                      {player.name}
                      {player.isCaptain && (
                        <span className="text-orange-400 ml-2 text-xs">
                          (C)
                        </span>
                      )}
                    </p>

                    <p className="text-xs text-gray-500">
                      {player.position}
                    </p>
                  </div>

                  {/* CATEGORY BADGE */}
                  <span className="text-xs px-2 py-1 rounded bg-white/10">
                    {player.category}
                  </span>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>

      {/* FOOTER */}
      <p className="text-center text-gray-500 text-xs mt-16">
        Pre-Eid Friendship Cup 2026 • Live Squad System
      </p>

    </section>
  )
}

export default Teams