'use client'

import { Crown, Search, ShieldCheck, Trophy } from 'lucide-react'
import React, { useState } from 'react'
import { players } from '../data/players'

const Player = () => {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['ALL', 'A', 'B', 'C', 'D']

  const allPlayers = [
    ...players.categories.A,
    ...players.categories.B,
    ...players.categories.C,
    ...players.categories.D
  ]

  const basePlayers =
    activeCategory === 'ALL'
      ? allPlayers
      : players.categories[activeCategory]

  const filteredPlayers = basePlayers.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPlayerCategory = (name) => {
    return Object.keys(players.categories).find((cat) =>
      players.categories[cat].some((p) => p.name === name)
    ) || 'Unlisted'
  }

  return (
    <section className="min-h-screen bg-black text-white py-14 px-5">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-300 text-xs tracking-[4px]">
            <Trophy size={14} />
            Pre-Eid Friendship Cup 2026
          </div>

          <h1 className="mt-6 text-5xl font-black">
            Players Dashboard
          </h1>

          <p className="text-gray-400 mt-3 text-sm">
            Squad management, stats tracking & tournament overview
          </p>
        </div>

        {/* CAPTAINS */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Crown className="text-yellow-400" />
            <h2 className="text-xl font-bold">Team Captains</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {players.captains.map((c, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/40 transition"
              >
                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    👑
                  </div>

                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-xs text-gray-400">Captain</p>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">

          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              placeholder="Search player..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm border transition ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-black'
                    : 'bg-white/5 border-white/10 hover:border-orange-400/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* PLAYERS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredPlayers.map((player, i) => (
            <div
              key={i}
              className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-400/40 transition"
            >

              {/* TOP */}
              <div className="flex justify-between items-start mb-4">

                <ShieldCheck className="text-orange-400" />

                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20">
                  {getPlayerCategory(player.name)}
                </span>

              </div>

              {/* NAME */}
              <h3 className="text-xl font-bold group-hover:text-orange-300 transition">
                {player.name}
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Tournament Player
              </p>

              {/* STATS */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-center">

                <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                  <p className="text-xs text-gray-400">Goals</p>
                  <p className="text-green-400 font-bold">0</p>
                </div>

                <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                  <p className="text-xs text-gray-400">Assists</p>
                  <p className="text-blue-400 font-bold">0</p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}

export default Player