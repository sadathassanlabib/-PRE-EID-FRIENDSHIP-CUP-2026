'use client'

import React from 'react'
import { teams } from '../data/teams'

// ⚡ Rating System
const getRating = (category) => {
  switch (category) {
    case 'A': return 2.5
    case 'B': return 2
    case 'C': return 1.5
    case 'D': return 1
    default: return 0
  }
}

const Teams = () => {

  // 🧠 Enhance teams with calculated power
  const enrichedTeams = teams.map(team => {

    const power = team.players.reduce(
      (sum, p) => sum + getRating(p.category),
      0
    )

    const goals = team.players.reduce(
      (sum, p) => sum + (p.goals || 0),
      0
    )

    const assists = team.players.reduce(
      (sum, p) => sum + (p.assists || 0),
      0
    )

    return { ...team, power, goals, assists }
  })

  // 🏆 SORT TEAMS BY POWER
  const sortedTeams = [...enrichedTeams].sort(
    (a, b) => b.power - a.power
  )

  return (
    <section className="min-h-screen bg-black text-white px-6 py-20">

      {/* HEADER */}
      <div className="text-center mb-14">
        <div className="text-5xl mb-4">🏆⚽</div>

        <h1 className="text-4xl font-bold">
          Tournament Dashboard
        </h1>

        <p className="text-gray-400 mt-3">
          Pre-Eid Friendship Cup 2026 • Live Stats Engine
        </p>
      </div>

      {/* TEAMS */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {sortedTeams.map((team, idx) => (

          <div
            key={idx}
            className="border border-white/10 bg-white/5 rounded-2xl p-5"
          >

            {/* TEAM HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-orange-400">
                #{idx + 1} {team.teamName}
              </h2>

              <span className="text-sm text-gray-400">
                ⚡ {team.power.toFixed(1)}
              </span>
            </div>

            <p className="text-sm text-gray-400 mt-1">
              Captain: <span className="text-white">{team.captain}</span>
            </p>

            {/* TEAM STATS */}
            <div className="flex gap-4 mt-3 text-sm text-gray-300">
              <span>⚽ Goals: {team.goals}</span>
              <span>🎯 Assists: {team.assists}</span>
            </div>

            {/* PLAYERS */}
            <div className="mt-4 space-y-2">

              {team.players.map((player, i) => {

                const rating = getRating(player.category)

                return (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-white/10 pb-2"
                  >

                    {/* LEFT */}
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

                    {/* RIGHT */}
                    <div className="text-right">

                      {/* CATEGORY + RATING */}
                      <p className="text-xs text-gray-300">
                        Cat: {player.category} • ⭐ {rating}
                      </p>

                      {/* STATS */}
                      <p className="text-xs text-gray-400">
                        ⚽ {player.goals} | 🎯 {player.assists}
                      </p>
                    </div>

                  </div>
                )
              })}

            </div>

          </div>
        ))}

      </div>

      {/* FOOTER */}
      <p className="text-center text-gray-500 text-xs mt-16">
        🏆 Live Ranking System • Powered by Team Engine ⚡
      </p>

    </section>
  )
}

export default Teams