'use client'
import { Crown, Search, ShieldCheck, Trophy, Goal, Award } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const PlayersPage = () => {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [playersData, setPlayersData] = useState({ captains: [], categories: { A: [], B: [], C: [], D: [] } })
  const [loading, setLoading] = useState(true)
  const [allPlayersList, setAllPlayersList] = useState([])

  const categories = ['ALL', 'A', 'B', 'C', 'D']

  // Fetch players from API
  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players')
      const data = await response.json()
      
      if (data.success) {
        // Organize players by category
        const categorized = {
          A: [],
          B: [],
          C: [],
          D: []
        }
        
        const captainsList = []
        
        data.data.forEach(player => {
          // Add to category
          if (categorized[player.category]) {
            categorized[player.category].push({
              ...player,
              goals: player.goals || 0,
              assists: player.assists || 0
            })
          }
          
          // Add to captains if isCaptain is true
          if (player.isCaptain) {
            captainsList.push(player)
          }
        })
        
        setPlayersData({
          captains: captainsList,
          categories: categorized
        })
        
        // Create flat list for search
        const allPlayers = [...categorized.A, ...categorized.B, ...categorized.C, ...categorized.D]
        setAllPlayersList(allPlayers)
      }
    } catch (error) {
      console.error('Error fetching players:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPlayersByCategory = (category) => {
    if (category === 'ALL') {
      return allPlayersList
    }
    return playersData.categories[category] || []
  }

  const basePlayers = getPlayersByCategory(activeCategory)

  // Search filter
  const query = searchTerm.toLowerCase().trim()
  const filteredPlayers = basePlayers.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.position.toLowerCase().includes(query)
  )

  // Get player category for display
  const getPlayerCategory = (playerCategory) => {
    return playerCategory || 'Unlisted'
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-black text-white py-14 px-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading players from database...</p>
        </div>
      </section>
    )
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
            {playersData.captains.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-400">
                No captains assigned yet.
              </div>
            ) : (
              playersData.captains.map((c, i) => (
                <div
                  key={c._id || i}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xl">
                      👑
                    </div>
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-xs text-gray-400">
                        {c.position} • {c.teamName || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">

          {/* SEARCH */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              placeholder="Search player or position..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value
                setSearchTerm(value)

                if (value.trim() === '') {
                  setSuggestions([])
                  setShowSuggestions(false)
                  return
                }

                const q = value.toLowerCase()
                const matches = allPlayersList
                  .filter(
                    (p) =>
                      p.name.toLowerCase().includes(q) ||
                      p.position.toLowerCase().includes(q)
                  )
                  .slice(0, 5)

                setSuggestions(matches)
                setShowSuggestions(true)
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150)
              }}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />

            {/* AUTOSUGGEST */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-black border border-white/10 rounded-xl overflow-hidden shadow-lg">
                {suggestions.map((player, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSearchTerm(player.name)
                      setShowSuggestions(false)
                    }}
                    className="px-4 py-3 hover:bg-white/10 cursor-pointer flex justify-between items-center"
                  >
                    <span className="text-white">{player.name}</span>
                    <span className="text-xs text-gray-400">
                      {player.position}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FILTER */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm border transition ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-black'
                    : 'bg-white/5 border-white/10 hover:border-orange-400/40 text-white'
                }`}
              >
                {cat === 'ALL' ? 'All Players' : `Category ${cat}`}
              </button>
            ))}
          </div>
        </div>

        {/* PLAYERS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlayers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No players found.
            </div>
          ) : (
            filteredPlayers.map((player, i) => (
              <div
                key={player._id || i}
                className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-400/40 transition"
              >
                {/* TOP */}
                <div className="flex justify-between items-start mb-4">
                  <ShieldCheck className="text-orange-400" />
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20">
                    Category {getPlayerCategory(player.category)}
                  </span>
                </div>

                {/* NAME */}
                <h3 className="text-xl font-bold group-hover:text-orange-300 transition flex items-center gap-2">
                  {player.name}
                  {player.isCaptain && <Crown size={16} className="text-yellow-400" />}
                </h3>

                {/* POSITION */}
                <p className="text-sm text-gray-400 mt-1">
                  Position: <span className="text-white">{player.position}</span>
                </p>

                {/* TEAM */}
                <p className="text-gray-500 text-xs mt-2">
                  Team: <span className="text-gray-300">{player.teamName || 'Unassigned'}</span>
                </p>

                {/* STATS */}
                <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                    <Goal size={14} className="text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Goals</p>
                    <p className="text-green-400 font-bold text-lg">{player.goals || 0}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                    <Award size={14} className="text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Assists</p>
                    <p className="text-blue-400 font-bold text-lg">{player.assists || 0}</p>
                  </div>
                </div>

                {/* CAPTAIN BADGE */}
                {player.isCaptain && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className="text-xs px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400">
                      👑 Team Captain
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* STATS SUMMARY */}
        {filteredPlayers.length > 0 && (
          <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-xs">Total Players</p>
                <p className="text-2xl font-bold text-white">{filteredPlayers.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Goals</p>
                <p className="text-2xl font-bold text-green-400">
                  {filteredPlayers.reduce((sum, p) => sum + (p.goals || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Assists</p>
                <p className="text-2xl font-bold text-blue-400">
                  {filteredPlayers.reduce((sum, p) => sum + (p.assists || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Captains</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {filteredPlayers.filter(p => p.isCaptain).length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            ⚽ Friendship Cup 2026 • Player statistics from tournament matches
          </p>
        </div>
      </div>
    </section>
  )
}

export default PlayersPage