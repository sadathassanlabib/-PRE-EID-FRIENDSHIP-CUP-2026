'use client'
import React, { useState, useEffect } from 'react'
import { Shield, Trophy, Users, Goal, MapPin, Award, Crown, Calendar } from 'lucide-react'

const TeamsPage = () => {
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewingTeam, setViewingTeam] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      if (data.success) setTeams(data.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players')
      const data = await response.json()
      if (data.success) setPlayers(data.data)
    } catch (error) {
      console.error('Error fetching players:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Promise.all([fetchTeams(), fetchPlayers()])
  }, [])

  const getTeamPlayers = (team) => {
    return players.filter(p => p.teamId === team.teamId || p.teamName === team.name)
  }

  const getTeamStats = (team) => {
    const teamPlayers = getTeamPlayers(team)
    const totalGoals = teamPlayers.reduce((sum, p) => sum + (p.goals || 0), 0)
    const totalAssists = teamPlayers.reduce((sum, p) => sum + (p.assists || 0), 0)
    const captain = teamPlayers.find(p => p.isCaptain === true)
    const topScorer = [...teamPlayers].sort((a, b) => b.goals - a.goals)[0]
    return { 
      totalGoals, 
      totalAssists, 
      squadSize: teamPlayers.length, 
      captain: captain?.name,
      topScorer: topScorer?.name,
      topScorerGoals: topScorer?.goals || 0
    }
  }

  // Filter teams by search
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Player Modal Component
  const TeamPlayersModal = ({ team, onClose }) => {
    const teamPlayers = getTeamPlayers(team)
    const stats = getTeamStats(team)

    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{team.logo || '⚽'}</div>
              <div>
                <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                <p className="text-gray-400 text-sm">{team.shortName} • {teamPlayers.length} Players</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              Close
            </button>
          </div>

          {/* Team Stats Summary */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10">
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <Goal className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Total Goals</p>
              <p className="text-2xl font-bold text-green-400">{stats.totalGoals}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <Award className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Total Assists</p>
              <p className="text-2xl font-bold text-blue-400">{stats.totalAssists}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <Users className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Squad Size</p>
              <p className="text-2xl font-bold text-orange-400">{stats.squadSize}</p>
            </div>
          </div>

          {/* Players Table */}
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users size={18} className="text-orange-400" />
              Player Roster
            </h3>
            
            {teamPlayers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No players assigned to this team yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Player</th>
                      <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Position</th>
                      <th className="text-center py-3 px-4 text-gray-400 text-sm font-medium">Goals</th>
                      <th className="text-center py-3 px-4 text-gray-400 text-sm font-medium">Assists</th>
                      <th className="text-center py-3 px-4 text-gray-400 text-sm font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamPlayers.map((player, idx) => (
                      <tr key={player._id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-3 px-4 font-medium text-white">
                          {player.name}
                          {player.isCaptain && <Crown size={14} className="inline ml-2 text-yellow-400" />}
                        </td>
                        <td className="py-3 px-4 text-gray-300">{player.position}</td>
                        <td className="py-3 px-4 text-center text-green-400 font-bold">{player.goals || 0}</td>
                        <td className="py-3 px-4 text-center text-blue-400 font-bold">{player.assists || 0}</td>
                        <td className="py-3 px-4 text-center">
                          {player.isCaptain ? (
                            <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-medium">Captain</span>
                          ) : (
                            <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-medium">Player</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-white/5">
                    <tr>
                      <td className="py-3 px-4 font-bold text-white">Total</td>
                      <td className="py-3 px-4"></td>
                      <td className="py-3 px-4 text-center font-bold text-green-400">{stats.totalGoals}</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-400">{stats.totalAssists}</td>
                      <td className="py-3 px-4 text-center text-gray-400">{teamPlayers.filter(p => p.isCaptain).length} Captain</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading teams...</div>
      </div>
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
            Teams Dashboard
          </h1>

          <p className="text-gray-400 mt-3 text-sm">
            Tournament teams, squad profiles & performance stats
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value
                setSearchTerm(value)
                
                if (value.trim() === '') {
                  setSuggestions([])
                  setShowSuggestions(false)
                  return
                }
                
                const matches = teams
                  .filter(t => t.name.toLowerCase().includes(value.toLowerCase()))
                  .slice(0, 5)
                
                setSuggestions(matches)
                setShowSuggestions(true)
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Autosuggest */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-black border border-white/10 rounded-xl overflow-hidden shadow-lg">
              {suggestions.map((team, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSearchTerm(team.name)
                    setShowSuggestions(false)
                  }}
                  className="px-4 py-3 hover:bg-white/10 cursor-pointer flex justify-between items-center"
                >
                  <span className="text-white">{team.name}</span>
                  <span className="text-xs text-gray-400">{team.shortName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teams Count */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-orange-400" />
            <p className="text-gray-400 text-sm">{filteredTeams.length} Teams</p>
          </div>
        </div>

        {/* TEAMS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No teams found.
            </div>
          ) : (
            filteredTeams.map((team, i) => {
              const stats = getTeamStats(team)
              
              return (
                <div
                  key={team._id}
                  onClick={() => setViewingTeam(team)}
                  className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-400/40 transition-all cursor-pointer"
                >
                  {/* TOP */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl">{team.logo || '⚽'}</div>
                    <span className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-400/20">
                      {team.shortName}
                    </span>
                  </div>

                  {/* NAME */}
                  <h3 className="text-xl font-bold group-hover:text-orange-300 transition">
                    {team.name}
                  </h3>

                  {/* COACH */}
                  {team.coach && (
                    <p className="text-sm text-gray-400 mt-1">
                      Coach: <span className="text-white">{team.coach}</span>
                    </p>
                  )}

                  {/* LOCATION */}
                  {team.city && (
                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                      <MapPin size={12} />
                      {team.city}, {team.country}
                    </p>
                  )}

                  {/* STATS GRID */}
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                      <p className="text-xs text-gray-400">Goals</p>
                      <p className="text-green-400 font-bold text-lg">{stats.totalGoals}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                      <p className="text-xs text-gray-400">Assists</p>
                      <p className="text-blue-400 font-bold text-lg">{stats.totalAssists}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                      <p className="text-xs text-gray-400">Players</p>
                      <p className="text-orange-400 font-bold text-lg">{stats.squadSize}</p>
                    </div>
                  </div>

                  {/* CAPTAIN */}
                  {stats.captain && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                      <Crown size={14} className="text-yellow-400" />
                      <p className="text-xs text-gray-400">
                        Captain: <span className="text-yellow-400">{stats.captain}</span>
                      </p>
                    </div>
                  )}

                  {/* TOP SCORER */}
                  {stats.topScorer && (
                    <div className="mt-2 flex items-center gap-2">
                      <Goal size={12} className="text-green-400" />
                      <p className="text-xs text-gray-400">
                        Top Scorer: <span className="text-green-400">{stats.topScorer}</span>
                        <span className="text-green-400 ml-1">({stats.topScorerGoals} goals)</span>
                      </p>
                    </div>
                  )}

                  {/* VIEW BUTTON */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-orange-400 text-xs font-medium text-center group-hover:opacity-100 opacity-70 transition">
                      Click to view full squad →
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
            <Calendar size={12} />
            Friendship Cup 2026 • Tournament Teams
          </div>
        </div>
      </div>

      {/* Player Modal */}
      {viewingTeam && (
        <TeamPlayersModal
          team={viewingTeam}
          onClose={() => setViewingTeam(null)}
        />
      )}
    </section>
  )
}

export default TeamsPage