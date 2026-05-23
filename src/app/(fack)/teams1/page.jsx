'use client'
import React, { useState, useEffect } from 'react'
import { Trophy, Users, Goal, Crown, ChevronRight, X, Search, Award } from 'lucide-react'

const TeamsPage = () => {
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [fixtures, setFixtures] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewingTeam, setViewingTeam] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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
      console.error('Error:', error)
    }
  }

  const fetchFixtures = async () => {
    try {
      const response = await fetch('/api/fixtures')
      const data = await response.json()
      if (data.success) setFixtures(data.data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Promise.all([fetchTeams(), fetchPlayers(), fetchFixtures()])
  }, [])

  // Calculate player goals from fixtures
  const getPlayerGoalsFromFixtures = (playerId, playerName) => {
    let goals = 0
    fixtures.forEach(fixture => {
      if (fixture.status === 'completed') {
        const homeScorers = fixture.goalScorers?.home || []
        const awayScorers = fixture.goalScorers?.away || []
        
        homeScorers.forEach(scorer => {
          if (scorer.playerId === playerId || scorer.playerName === playerName) {
            goals++
          }
        })
        awayScorers.forEach(scorer => {
          if (scorer.playerId === playerId || scorer.playerName === playerName) {
            goals++
          }
        })
      }
    })
    return goals
  }

  // Calculate player assists from fixtures
  const getPlayerAssistsFromFixtures = (playerId, playerName) => {
    let assists = 0
    fixtures.forEach(fixture => {
      if (fixture.status === 'completed') {
        const homeAssisters = fixture.assisters?.home || []
        const awayAssisters = fixture.assisters?.away || []
        
        homeAssisters.forEach(assister => {
          if (assister.playerId === playerId || assister.playerName === playerName) {
            assists++
          }
        })
        awayAssisters.forEach(assister => {
          if (assister.playerId === playerId || assister.playerName === playerName) {
            assists++
          }
        })
      }
    })
    return assists
  }

  const getTeamPlayers = (team) => {
    const teamPlayers = players.filter(p => p.teamId === team.teamId || p.teamName === team.name)
    
    // Update each player with actual goals from fixtures
    return teamPlayers.map(player => ({
      ...player,
      goals: getPlayerGoalsFromFixtures(player._id, player.name),
      assists: getPlayerAssistsFromFixtures(player._id, player.name)
    }))
  }

  const getTeamStats = (team) => {
    const teamPlayers = getTeamPlayers(team)
    const totalGoals = teamPlayers.reduce((sum, p) => sum + (p.goals || 0), 0)
    const totalAssists = teamPlayers.reduce((sum, p) => sum + (p.assists || 0), 0)
    const captain = teamPlayers.find(p => p.isCaptain === true)
    
    const topScorer = [...teamPlayers].sort((a, b) => (b.goals || 0) - (a.goals || 0))[0]
    const topAssister = [...teamPlayers].sort((a, b) => (b.assists || 0) - (a.assists || 0))[0]
    
    return { 
      totalGoals, 
      totalAssists, 
      squadSize: teamPlayers.length, 
      captain: captain?.name,
      topScorerName: topScorer?.name,
      topScorerGoals: topScorer?.goals || 0,
      topAssisterName: topAssister?.name,
      topAssisterAssists: topAssister?.assists || 0
    }
  }

  const filteredTeams = teams.filter(team => 
    team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.shortName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const TeamPlayersModal = ({ team, onClose }) => {
    const teamPlayers = getTeamPlayers(team)
    const stats = getTeamStats(team)

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden mx-2 sm:mx-0" onClick={e => e.stopPropagation()}>
          
          <div className="p-4 sm:p-5 border-b border-white/10 flex justify-between items-center gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{team.name}</h2>
              <p className="text-xs sm:text-sm text-gray-500">{team.shortName} • {teamPlayers.length} players</p>
            </div>
            <button onClick={onClose} className="p-2 sm:p-1 rounded-full hover:bg-white/10 transition flex-shrink-0">
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-5 border-b border-white/10 bg-white/5">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.totalGoals}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Goals</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-blue-400">{stats.totalAssists}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Assists</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-orange-400">{stats.squadSize}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Players</p>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <h3 className="font-semibold text-gray-300 mb-3 text-sm sm:text-base">Squad</h3>
            <div className="space-y-2 max-h-[50vh] sm:max-h-96 overflow-y-auto">
              {teamPlayers.map((player, idx) => (
                <div key={player._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-gray-500 text-xs sm:text-sm w-5 sm:w-6 flex-shrink-0">{idx + 1}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span className="text-white text-sm sm:text-base truncate">{player.name}</span>
                        {player.isCaptain && <Crown size={12} className="text-yellow-400 flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-gray-500">{player.position}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm sm:text-base ml-7 sm:ml-0">
                    <span className="text-green-400 font-medium">{player.goals || 0}G</span>
                    <span className="text-blue-400 font-medium">{player.assists || 0}A</span>
                  </div>
                </div>
              ))}
              {teamPlayers.length === 0 && (
                <div className="text-center py-8 sm:py-12 text-gray-500 text-sm">No players yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-orange-400 text-xs mb-3 sm:mb-4">
            <Trophy size={12} />
            Pre-Eid Friendship Cup 2026
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Teams</h1>
          <p className="text-gray-500 text-sm">{filteredTeams.length} teams competing</p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 sm:mb-10">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400/50 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredTeams.map((team) => {
            const stats = getTeamStats(team)
            return (
              <div
                key={team._id}
                onClick={() => setViewingTeam(team)}
                className="group p-4 sm:p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-orange-400/30 transition-all cursor-pointer"
              >
                {/* Team Name */}
                <h3 className="text-base sm:text-lg font-semibold group-hover:text-orange-400 transition">
                  {team.name}
                </h3>
                
                {/* Team Short Name */}
                {team.shortName && (
                  <p className="text-xs text-gray-500 mt-1">{team.shortName}</p>
                )}

                {/* Stats Row */}
                <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                  <div>
                    <p className="text-base sm:text-lg font-bold text-green-400">{stats.totalGoals}</p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500">GOALS</p>
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-blue-400">{stats.totalAssists}</p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500">ASSISTS</p>
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-orange-400">{stats.squadSize}</p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500">PLAYERS</p>
                  </div>
                </div>

                {/* Top Scorer */}
                {stats.topScorerName && stats.topScorerGoals > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] sm:text-xs">
                    <Goal size={10} className="text-green-400" />
                    <span className="text-gray-500">Top Scorer:</span>
                    <span className="text-green-400">{stats.topScorerName}</span>
                    <span className="text-green-400">({stats.topScorerGoals})</span>
                  </div>
                )}

                {/* Top Assister */}
                {stats.topAssisterName && stats.topAssisterAssists > 0 && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs">
                    <Award size={10} className="text-blue-400" />
                    <span className="text-gray-500">Top Assister:</span>
                    <span className="text-blue-400">{stats.topAssisterName}</span>
                    <span className="text-blue-400">({stats.topAssisterAssists})</span>
                  </div>
                )}

                {/* Captain */}
                {stats.captain && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs">
                    <Crown size={10} className="text-yellow-400" />
                    <span className="text-gray-500">Captain:</span>
                    <span className="text-yellow-400">{stats.captain}</span>
                  </div>
                )}

                {/* Action */}
                <div className="mt-3 flex justify-end">
                  <ChevronRight size={14} className="text-orange-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredTeams.length === 0 && (
          <div className="text-center py-16 text-gray-500">No teams found</div>
        )}
      </div>

      {/* Modal */}
      {viewingTeam && (
        <TeamPlayersModal team={viewingTeam} onClose={() => setViewingTeam(null)} />
      )}
    </div>
  )
}

export default TeamsPage