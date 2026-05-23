'use client'
import { Crown, Search, ShieldCheck, Trophy, Goal, Award, Calendar, MapPin } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const PlayersPage = () => {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [playersData, setPlayersData] = useState({ captains: [], categories: { A: [], B: [], C: [], D: [] } })
  const [fixtures, setFixtures] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [allPlayersList, setAllPlayersList] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [showPlayerModal, setShowPlayerModal] = useState(false)

  const categories = ['ALL', 'A', 'B', 'C', 'D']

  // Fetch players, fixtures and teams from API
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [playersRes, fixturesRes, teamsRes] = await Promise.all([
        fetch('/api/players'),
        fetch('/api/fixtures'),
        fetch('/api/teams')
      ])
      
      const playersData = await playersRes.json()
      const fixturesData = await fixturesRes.json()
      const teamsData = await teamsRes.json()
      
      let allPlayers = []
      const categorized = { A: [], B: [], C: [], D: [] }
      const captainsList = []
      
      if (playersData.success) {
        playersData.data.forEach(player => {
          // Calculate goals from fixtures
          let playerGoals = 0
          let playerAssists = 0
          
          if (fixturesData.success) {
            fixturesData.data.forEach(fixture => {
              if (fixture.status === 'completed') {
                // Check home team scorers
                if (fixture.goalScorers?.home) {
                  fixture.goalScorers.home.forEach(scorer => {
                    if (scorer.playerId === player._id || scorer.playerName === player.name) {
                      playerGoals++
                    }
                  })
                }
                // Check away team scorers
                if (fixture.goalScorers?.away) {
                  fixture.goalScorers.away.forEach(scorer => {
                    if (scorer.playerId === player._id || scorer.playerName === player.name) {
                      playerGoals++
                    }
                  })
                }
              }
            })
          }
          
          const updatedPlayer = {
            ...player,
            goals: playerGoals,
            assists: player.assists || 0
          }
          
          if (categorized[player.category]) {
            categorized[player.category].push(updatedPlayer)
          }
          
          if (player.isCaptain) {
            captainsList.push(updatedPlayer)
          }
        })
        
        allPlayers = [...categorized.A, ...categorized.B, ...categorized.C, ...categorized.D]
        
        setPlayersData({
          captains: captainsList,
          categories: categorized
        })
        setAllPlayersList(allPlayers)
      }
      
      if (fixturesData.success) {
        setFixtures(fixturesData.data || [])
      }
      
      if (teamsData.success) {
        setTeams(teamsData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
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

  const query = searchTerm.toLowerCase().trim()
  const filteredPlayers = basePlayers.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.position.toLowerCase().includes(query) ||
      (p.teamName && p.teamName.toLowerCase().includes(query))
  )

  const getSuggestions = (query) => {
    const q = query.toLowerCase()
    return allPlayersList
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q) ||
          (p.teamName && p.teamName.toLowerCase().includes(q))
      )
      .slice(0, 5)
  }

  const getPlayerCategory = (playerCategory) => {
    return playerCategory || 'Unlisted'
  }

  // Get player's goal details from fixtures
  const getPlayerGoals = (playerId, playerName) => {
    const playerGoals = []
    
    fixtures.forEach(fixture => {
      if (fixture.status === 'completed') {
        const homeScorers = fixture.goalScorers?.home || []
        const awayScorers = fixture.goalScorers?.away || []
        
        homeScorers.forEach(scorer => {
          if (scorer.playerId === playerId || scorer.playerName === playerName) {
            playerGoals.push({
              match: `${fixture.team1} vs ${fixture.team2}`,
              minute: scorer.time,
              date: fixture.date,
              venue: fixture.venue,
              team: fixture.team1,
              score: `${fixture.score1}-${fixture.score2}`
            })
          }
        })
        
        awayScorers.forEach(scorer => {
          if (scorer.playerId === playerId || scorer.playerName === playerName) {
            playerGoals.push({
              match: `${fixture.team1} vs ${fixture.team2}`,
              minute: scorer.time,
              date: fixture.date,
              venue: fixture.venue,
              team: fixture.team2,
              score: `${fixture.score1}-${fixture.score2}`
            })
          }
        })
      }
    })
    
    return playerGoals
  }

  const PlayerGoalsModal = ({ player, onClose }) => {
    const playerGoals = getPlayerGoals(player._id, player.name)
    
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
          
          <div className="p-4 sm:p-5 border-b border-white/10 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{player.name}</h2>
                {player.isCaptain && <Crown size={16} className="text-yellow-400" />}
              </div>
              <p className="text-sm text-gray-400">{player.position} • {player.teamName || 'Unassigned'}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition">
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 p-4 border-b border-white/10 bg-white/5">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{player.goals || 0}</p>
              <p className="text-xs text-gray-500">Total Goals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{player.assists || 0}</p>
              <p className="text-xs text-gray-500">Total Assists</p>
            </div>
          </div>
          
          <div className="p-4 sm:p-5">
            <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Goal size={14} className="text-green-400" />
              Goal Details ({playerGoals.length} goals)
            </h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {playerGoals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No goals scored yet</div>
              ) : (
                playerGoals.map((goal, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-orange-400">⚽</span>
                          <span className="text-white font-medium">{goal.match}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                          {goal.minute && <span>Minute: {goal.minute}'</span>}
                          {goal.date && (
                            <span className="flex items-center gap-1">
                              <Calendar size={10} /> {goal.date}
                            </span>
                          )}
                          {goal.score && <span>Score: {goal.score}</span>}
                        </div>
                      </div>
                      <span className="text-xs text-green-400 whitespace-nowrap">Scored for {goal.team}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
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
    <section className="min-h-screen bg-black text-white py-10 sm:py-14 px-4 sm:px-5">
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-300 text-[10px] sm:text-xs tracking-[4px]">
            <Trophy size={14} />
            Pre-Eid Friendship Cup 2026
          </div>
          <h1 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl font-black">
            Players Dashboard
          </h1>
          <p className="text-gray-400 mt-2 sm:mt-3 text-xs sm:text-sm">
            Squad management, stats tracking & goal scorers
          </p>
        </div>

        {/* CAPTAINS */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <Crown className="text-yellow-400" size={18} />
            <h2 className="text-lg sm:text-xl font-bold">Team Captains</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {playersData.captains.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-400">
                No captains assigned yet.
              </div>
            ) : (
              playersData.captains.map((c, i) => (
                <div
                  key={c._id || i}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/40 transition cursor-pointer"
                  onClick={() => {
                    setSelectedPlayer(c)
                    setShowPlayerModal(true)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-lg sm:text-xl">
                      👑
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{c.name}</h3>
                      <p className="text-[10px] sm:text-xs text-gray-400">
                        {c.position} • {c.teamName || 'Unassigned'}
                      </p>
                      <p className="text-[10px] text-green-400 mt-1">⚽ {c.goals || 0} goals</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6 sm:mb-8">

          {/* SEARCH */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              placeholder="Search player, position or team name..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value
                setSearchTerm(value)

                if (value.trim() === '') {
                  setSuggestions([])
                  setShowSuggestions(false)
                  return
                }

                const matches = getSuggestions(value)
                setSuggestions(matches)
                setShowSuggestions(true)
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150)
              }}
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-orange-500 outline-none text-white text-sm"
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
                    className="px-4 py-3 hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">{player.name}</span>
                      <span className="text-xs text-gray-400">
                        {player.position}
                      </span>
                    </div>
                    {player.teamName && (
                      <div className="text-xs text-gray-500 mt-1">
                        Team: {player.teamName}
                      </div>
                    )}
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
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm border transition ${
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

        {/* STATS SUMMARY */}
        {filteredPlayers.length > 0 && (
          <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div>
                <p className="text-gray-400 text-[10px] sm:text-xs">Total Players</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{filteredPlayers.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] sm:text-xs">Total Goals</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">
                  {filteredPlayers.reduce((sum, p) => sum + (p.goals || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] sm:text-xs">Total Assists</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-400">
                  {filteredPlayers.reduce((sum, p) => sum + (p.assists || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] sm:text-xs">Captains</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-400">
                  {filteredPlayers.filter(p => p.isCaptain).length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PLAYERS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-8 sm:pt-10">
          {filteredPlayers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No players found matching "{searchTerm}"
            </div>
          ) : (
            filteredPlayers.map((player, i) => (
              <div
                key={player._id || i}
                onClick={() => {
                  setSelectedPlayer(player)
                  setShowPlayerModal(true)
                }}
                className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:border-orange-400/40 transition cursor-pointer"
              >
                {/* TOP */}
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <ShieldCheck size={18} className="text-orange-400" />
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20">
                    Cat {getPlayerCategory(player.category)}
                  </span>
                </div>

                {/* NAME */}
                <h3 className="text-base sm:text-xl font-bold group-hover:text-orange-300 transition flex items-center gap-2">
                  {player.name}
                  {player.isCaptain && <Crown size={14} className="text-yellow-400" />}
                </h3>

                {/* POSITION */}
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Position: <span className="text-white">{player.position}</span>
                </p>

                {/* TEAM */}
                <p className="text-gray-500 text-[10px] sm:text-xs mt-2">
                  Team: <span className="text-gray-300">{player.teamName || 'Unassigned'}</span>
                </p>

                {/* STATS */}
                <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-3 text-center">
                  <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                    <Goal size={12} className="text-green-400 mx-auto mb-1" />
                    <p className="text-[10px] sm:text-xs text-gray-400">Goals</p>
                    <p className="text-green-400 font-bold text-base sm:text-lg">{player.goals || 0}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                    <Award size={12} className="text-blue-400 mx-auto mb-1" />
                    <p className="text-[10px] sm:text-xs text-gray-400">Assists</p>
                    <p className="text-blue-400 font-bold text-base sm:text-lg">{player.assists || 0}</p>
                  </div>
                </div>

                {/* CAPTAIN BADGE */}
                {player.isCaptain && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className="text-[10px] sm:text-xs px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400">
                      👑 Team Captain
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-gray-500 text-[10px] sm:text-xs">
            Friendship Cup 2026 • Player statistics from tournament matches
          </p>
        </div>
      </div>

      {/* Player Goals Modal */}
      {showPlayerModal && selectedPlayer && (
        <PlayerGoalsModal 
          player={selectedPlayer} 
          onClose={() => {
            setShowPlayerModal(false)
            setSelectedPlayer(null)
          }} 
        />
      )}
    </section>
  )
}

export default PlayersPage