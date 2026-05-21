'use client'

import React, { useState } from 'react'
import { players } from '../data/players'

const Player = () => {
  const [activeCategory, setActiveCategory] = useState("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = ["ALL", "A", "B", "C", "D"]

  const getAllPlayers = () => [
    ...players.categories.A,
    ...players.categories.B,
    ...players.categories.C,
    ...players.categories.D
  ]

  const basePlayers =
    activeCategory === "ALL"
      ? getAllPlayers()
      : players.categories[activeCategory]

  // 🔍 SEARCH FILTER (ONLY NAME)
  const filteredPlayers = basePlayers.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">

      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">
          ⚽ Players Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Pre-Eid Friendship Cup 2026
        </p>
      </div>

      {/* 👑 CAPTAINS SECTION */}
<div className="mb-10">
  <h2 className="text-center text-2xl font-bold text-yellow-400 mb-5">
    👑 Team Captains
  </h2>

  <div className="flex flex-wrap justify-center gap-3">
    {players.captains.map((captain, i) => (
      <div
        key={i}
        className="px-5 py-3 rounded-full bg-yellow-500/10 border border-yellow-400/30 hover:scale-105 transition"
      >
        ⚽ {captain.name}
      </div>
    ))}
  </div>
</div>

      {/* SEARCH BAR */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search player..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-orange-500 text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PLAYERS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((p, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition hover:scale-[1.02]"
            >
              <h2 className="text-xl font-bold text-orange-400">
                ⚽ {p.name}
              </h2>

              <div className="mt-4">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
                  Category {activeCategory === "ALL"
                    ? Object.keys(players.categories).find(cat =>
                        players.categories[cat].some(pl => pl.name === p.name)
                      )
                    : activeCategory}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            No players found 😢
          </p>
        )}

      </div>

    </div>
  )
}

export default Player