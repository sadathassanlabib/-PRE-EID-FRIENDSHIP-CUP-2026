'use client'
import React, { useState, useEffect } from 'react'
import { Trophy, Calendar, Clock, MapPin, Award, Goal, Users, Crown, Shield } from 'lucide-react'

const PublicResultsPage = () => {
  const [fixtures, setFixtures] = useState([])
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRound, setSelectedRound] = useState('all')
  const [activeTab, setActiveTab] = useState('groups')
  const [selectedGroup, setSelectedGroup] = useState('all')

  const rounds = ['all', 'group', 'quarter-final', 'semi-final', 'final']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [fixturesRes, teamsRes, playersRes] = await Promise.all([
        fetch('/api/fixtures'),
        fetch('/api/teams'),
        fetch('/api/players')
      ])

      const fixturesData = await fixturesRes.json()
      const teamsData = await teamsRes.json()
      const playersData = await playersRes.json()

      if (fixturesData.success) setFixtures(fixturesData.data || [])
      if (teamsData.success) setTeams(teamsData.data || [])
      if (playersData.success) setPlayers(playersData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedMatches = fixtures.filter(f => f.status === 'completed')

  const filteredMatches = selectedRound === 'all'
    ? completedMatches
    : completedMatches.filter(f => f.round === selectedRound)

  const getTeamLogo = (teamName) => {
    const team = teams.find(t => t.name === teamName)
    return team?.logo || '⚽'
  }

  const getTeamShortName = (teamName) => {
    const team = teams.find(t => t.name === teamName)
    return team?.shortName || teamName?.slice(0, 3) || 'TBD'
  }

  const getPlayerName = (playerId) => {
    const player = players.find(p => p._id === playerId)
    return player?.name || ''
  }

  const calculateTeamStats = () => {
    const stats = {}

    teams.forEach(team => {
      stats[team.name] = {
        id: team._id,
        name: team.name,
        shortName: team.shortName,
        logo: team.logo || '⚽',
        color: team.color,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      }
    })

    completedMatches.forEach(match => {
      if (stats[match.team1]) {
        stats[match.team1].played++
        stats[match.team1].goalsFor += match.score1
        stats[match.team1].goalsAgainst += match.score2

        if (match.score1 > match.score2) {
          stats[match.team1].wins++
          stats[match.team1].points += 3
        } else if (match.score1 === match.score2) {
          stats[match.team1].draws++
          stats[match.team1].points += 1
        } else {
          stats[match.team1].losses++
        }
      }

      if (stats[match.team2]) {
        stats[match.team2].played++
        stats[match.team2].goalsFor += match.score2
        stats[match.team2].goalsAgainst += match.score1

        if (match.score2 > match.score1) {
          stats[match.team2].wins++
          stats[match.team2].points += 3
        } else if (match.score2 === match.score1) {
          stats[match.team2].draws++
          stats[match.team2].points += 1
        } else {
          stats[match.team2].losses++
        }
      }
    })

    Object.values(stats).forEach(team => {
      team.goalDifference = team.goalsFor - team.goalsAgainst
    })

    return stats
  }

  const getGroupAssignments = () => {
    const saved = typeof window !== 'undefined'
      ? localStorage.getItem('groupAssignments')
      : null

    if (saved) {
      return JSON.parse(saved)
    }

    const allTeams = [...teams]
    const groupSize = Math.ceil(allTeams.length / 2)

    return {
      'A': allTeams.slice(0, groupSize),
      'B': allTeams.slice(groupSize)
    }
  }

  const calculateGroupStandings = () => {
    const teamStats = calculateTeamStats()
    const groupAssignments = getGroupAssignments()
    const groups = {}

    Object.keys(groupAssignments).forEach(groupLetter => {
      const groupTeams = groupAssignments[groupLetter]
      const groupStandings = []

      groupTeams.forEach(team => {
        if (teamStats[team.name]) {
          groupStandings.push(teamStats[team.name])
        }
      })

      groupStandings.sort((a, b) => {
        if (a.points !== b.points) return b.points - a.points
        if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference
        return b.goalsFor - a.goalsFor
      })

      groups[groupLetter] = groupStandings
    })

    return groups
  }

  const getAdvancingTeams = () => {
    const groupStandings = calculateGroupStandings()
    const advancing = []

    Object.keys(groupStandings).forEach(group => {
      const topTeams = groupStandings[group].slice(0, 2)
      advancing.push(...topTeams)
    })

    return advancing
  }

  const getTopScorers = () => {
    // First, get goal scorers from match data
    const goalMap = new Map()

    completedMatches.forEach(match => {
      const homeScorers = match.goalScorers?.home || []
      const awayScorers = match.goalScorers?.away || []

      homeScorers.forEach(scorer => {
        if (scorer.playerId) {
          const existing = goalMap.get(scorer.playerId)
          if (existing) {
            existing.goals += 1
          } else {
            goalMap.set(scorer.playerId, {
              name: scorer.playerName || getPlayerName(scorer.playerId),
              goals: 1,
              team: match.team1
            })
          }
        }
      })

      awayScorers.forEach(scorer => {
        if (scorer.playerId) {
          const existing = goalMap.get(scorer.playerId)
          if (existing) {
            existing.goals += 1
          } else {
            goalMap.set(scorer.playerId, {
              name: scorer.playerName || getPlayerName(scorer.playerId),
              goals: 1,
              team: match.team2
            })
          }
        }
      })
    })

    // Also include players from players API
    players.forEach(p => {
      if (p.goals && p.goals > 0) {
        const existing = goalMap.get(p._id)
        if (existing) {
          existing.goals += p.goals
        } else {
          goalMap.set(p._id, {
            name: p.name,
            goals: p.goals,
            team: p.teamName
          })
        }
      }
    })

    return Array.from(goalMap.values())
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10)
  }

  const getTopAssisters = () => {
    return players
      .filter(p => (p.assists || 0) > 0)
      .sort((a, b) => (b.assists || 0) - (a.assists || 0))
      .slice(0, 10)
  }

  const getRoundColor = (round) => {
    switch (round) {
      case 'group': return 'bg-blue-500/20 text-blue-400'
      case 'quarter-final': return 'bg-purple-500/20 text-purple-400'
      case 'semi-final': return 'bg-orange-500/20 text-orange-400'
      case 'final': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const groupStandings = calculateGroupStandings()
  const advancingTeams = getAdvancingTeams()
  const topScorers = getTopScorers()
  const topAssisters = getTopAssisters()
  const hasResults = completedMatches.length > 0

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!hasResults) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8">
            <div className="text-5xl sm:text-6xl mb-4">🏆⚽</div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400">Results Coming Soon</h1>
            <p className="text-gray-400 mt-3 sm:mt-4 text-xs sm:text-sm">
              Match results for the Pre-Eid Friendship Cup 2026 will be published here after each game is completed.
            </p>
            <div className="mt-5 sm:mt-6 inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-300">
              📊 Awaiting Match Results
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-8 sm:py-14">
        
        {/* HERO */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-orange-300 text-[10px] sm:text-xs tracking-[4px] mb-3 sm:mb-4">
            <Trophy size={12} />
            <span className="hidden xs:inline">PRE-EID FRIENDSHIP CUP 2026</span>
            <span className="xs:hidden">CUP 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">Tournament Results</h1>
          <p className="text-gray-400 mt-2 sm:mt-3 text-xs sm:text-sm">Live scores, group standings, goal scorers and player statistics</p>
        </div>

        {/* TAB NAVIGATION - Responsive */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 border-b border-white/10 pb-3 sm:pb-4">
          {[
            { id: 'matches', label: '📅 Matches' },
            { id: 'groups', label: '📊 Groups' },
            { id: 'knockout', label: '🏆 Knockout' },
            { id: 'stats', label: '⚽ Stats' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── MATCH RESULTS ── */}
        {activeTab === 'matches' && (
          <div>
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center">
              {rounds.map(round => (
                <button
                  key={round}
                  onClick={() => setSelectedRound(round)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap ${
                    selectedRound === round
                      ? 'bg-orange-500 text-black'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:border-orange-400/40'
                  }`}
                >
                  {round === 'all' ? 'All' : round === 'group' ? 'Group' : round.split('-')[0]}
                </button>
              ))}
            </div>

            {filteredMatches.length === 0 ? (
              <div className="text-center py-12 sm:py-16 border border-white/10 rounded-2xl bg-white/[0.03]">
                <p className="text-gray-400 text-sm">No completed matches in this round.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredMatches.map(match => {
                  const homeScorers = match.goalScorers?.home || []
                  const awayScorers = match.goalScorers?.away || []
                  
                  return (
                    <div key={match._id} className="border border-white/10 rounded-xl sm:rounded-2xl bg-white/[0.03] p-3 sm:p-5 hover:border-orange-400/40 transition-all">
                      
                      {/* Match Header */}
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-2 sm:mb-3">
                        <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium ${getRoundColor(match.round)}`}>
                          {match.round === 'group' ? 'GROUP' : match.round?.toUpperCase()}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-400 text-[8px] sm:text-xs">
                          <span className="flex items-center gap-1"><Calendar size={10} />{match.date}</span>
                          <span className="flex items-center gap-1"><Clock size={10} />{match.time}</span>
                          <span className="flex items-center gap-1"><MapPin size={10} className="hidden sm:inline" /><span className="truncate max-w-[80px] sm:max-w-none">{match.venue}</span></span>
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className="flex items-center justify-between gap-2 sm:gap-4 py-2 sm:py-4">
                        
                        {/* Team 1 */}
                        <div className="flex-1 text-center min-w-0">
                          <div className="text-3xl sm:text-5xl mb-1 sm:mb-2">{getTeamLogo(match.team1)}</div>
                          <div className="font-bold text-white text-xs sm:text-base truncate">{getTeamShortName(match.team1)}</div>
                          <div className="hidden sm:block text-[10px] text-gray-500 truncate">{match.team1}</div>
                        </div>

                        {/* Score */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-xl sm:text-3xl font-bold">
                            <span className={match.score1 > match.score2 ? 'text-green-400' : match.score1 === match.score2 ? 'text-yellow-400' : 'text-red-400'}>
                              {match.score1}
                            </span>
                            <span className="text-gray-400 text-base sm:text-xl mx-0.5 sm:mx-2">-</span>
                            <span className={match.score2 > match.score1 ? 'text-green-400' : match.score1 === match.score2 ? 'text-yellow-400' : 'text-red-400'}>
                              {match.score2}
                            </span>
                          </div>
                          {match.penaltyShootout && (
                            <div className="text-[8px] sm:text-xs text-yellow-400 mt-0.5">
                              Pens: {match.penaltyScore1}-{match.penaltyScore2}
                            </div>
                          )}
                        </div>

                        {/* Team 2 */}
                        <div className="flex-1 text-center min-w-0">
                          <div className="text-3xl sm:text-5xl mb-1 sm:mb-2">{getTeamLogo(match.team2)}</div>
                          <div className="font-bold text-white text-xs sm:text-base truncate">{getTeamShortName(match.team2)}</div>
                          <div className="hidden sm:block text-[10px] text-gray-500 truncate">{match.team2}</div>
                        </div>
                      </div>

                      {/* Goal Scorers Section */}
                      {(homeScorers.length > 0 || awayScorers.length > 0) && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <div className="flex items-center gap-1 mb-2">
                            <Goal size={10} className="text-yellow-400" />
                            <span className="text-[9px] text-gray-400 font-medium">Goal Scorers</span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row justify-between gap-2">
                            {/* Home Team Scorers */}
                            <div className="flex-1">
                              {homeScorers.length > 0 ? (
                                <div className="space-y-0.5">
                                  <div className="text-[8px] text-orange-400 font-medium mb-1">🏠 {match.team1}</div>
                                  {homeScorers.map((scorer, i) => (
                                    <div key={`home-${i}`} className="flex items-center gap-1 text-[9px] sm:text-[10px]">
                                      <span className="text-orange-400">⚽</span>
                                      <span className="text-white">{scorer.playerName || getPlayerName(scorer.playerId)}</span>
                                      {scorer.time && <span className="text-gray-500">({scorer.time}')</span>}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-[8px] text-gray-600 italic">No goals</div>
                              )}
                            </div>

                            {/* VS Divider */}
                            <div className="hidden sm:flex items-center justify-center px-2">
                              <span className="text-[9px] text-gray-600">vs</span>
                            </div>

                            {/* Away Team Scorers */}
                            <div className="flex-1">
                              {awayScorers.length > 0 ? (
                                <div className="space-y-0.5">
                                  <div className="text-[8px] text-blue-400 font-medium mb-1">✈️ {match.team2}</div>
                                  {awayScorers.map((scorer, i) => (
                                    <div key={`away-${i}`} className="flex items-center gap-1 text-[9px] sm:text-[10px] sm:justify-end">
                                      {scorer.time && <span className="text-gray-500 order-1 sm:order-none">({scorer.time}')</span>}
                                      <span className="text-white order-2 sm:order-none">{scorer.playerName || getPlayerName(scorer.playerId)}</span>
                                      <span className="text-blue-400 order-3">⚽</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-[8px] text-gray-600 italic text-right">No goals</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Winner */}
                      {match.winner && (
                        <div className="text-center pt-2 sm:pt-3 border-t border-white/10 mt-2">
                          <div className="text-[10px] sm:text-xs text-green-400">🏆 Winner: {match.winner}</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── GROUP STANDINGS ── */}
        {activeTab === 'groups' && (
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {Object.entries(groupStandings).map(([groupName, groupTeams]) => (
              <div key={groupName} className="border border-white/10 rounded-xl sm:rounded-2xl bg-white/[0.03] overflow-hidden">
                
                <div className="p-3 sm:p-5 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Group {groupName}</h3>
                      <p className="text-[10px] sm:text-xs text-gray-400">Top 2 advance</p>
                    </div>
                  </div>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead className="border-b border-white/10 bg-white/5">
                      <tr>
                        {['#', 'Team', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map(h => (
                          <th key={h} className={`py-2 sm:py-3 px-2 sm:px-3 text-gray-400 text-[10px] sm:text-xs font-medium ${h === 'Team' ? 'text-left' : 'text-center'}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {groupTeams.map((team, idx) => (
                        <tr key={team.id} className={`border-b border-white/10 hover:bg-white/5 ${idx < 2 ? 'bg-green-500/5' : ''}`}>
                          <td className="py-2 sm:py-3 px-2 sm:px-3 text-center font-bold text-white text-xs sm:text-sm">{idx + 1}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span className="text-base sm:text-xl">{team.logo}</span>
                              <span className="text-white font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{team.shortName || team.name?.slice(0, 8)}</span>
                              {idx < 2 && (
                                <span className="hidden sm:inline ml-1 px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[8px] font-medium">Q</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3 text-center text-gray-300 text-xs sm:text-sm">{team.played}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3 text-center text-green-400 text-xs sm:text-sm">{team.wins}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3 text-center text-yellow-400 text-xs sm:text-sm">{team.draws}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3 text-center text-red-400 text-xs sm:text-sm">{team.losses}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3 text-center text-blue-400 text-xs sm:text-sm">
                            {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-3 text-center text-yellow-400 font-bold text-sm sm:text-lg">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Stats Footer */}
                <div className="p-2 sm:p-4 border-t border-white/10 bg-white/5">
                  <div className="flex justify-between text-[10px] sm:text-sm">
                    <div>
                      <p className="text-gray-400 text-[8px] sm:text-xs">Goals</p>
                      <p className="text-green-400 font-bold text-xs sm:text-base">{groupTeams.reduce((s, t) => s + t.goalsFor, 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[8px] sm:text-xs">Avg Pts</p>
                      <p className="text-yellow-400 font-bold text-xs sm:text-base">
                        {groupTeams.length ? (groupTeams.reduce((s, t) => s + t.points, 0) / groupTeams.length).toFixed(1) : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[8px] sm:text-xs">Matches</p>
                      <p className="text-blue-400 font-bold text-xs sm:text-base">{groupTeams.reduce((s, t) => s + t.played, 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── KNOCKOUT STAGE ── */}
        {activeTab === 'knockout' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="border border-white/10 rounded-xl sm:rounded-2xl bg-white/[0.03] p-4 sm:p-6">
              <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <Trophy size={16} className="sm:w-5 sm:h-5 text-yellow-400" />
                Qualified Teams
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {advancingTeams.map((team, idx) => (
                  <div key={idx} className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
                    <span className="text-lg sm:text-2xl">{team.logo}</span>
                    <span className="text-white font-medium text-xs sm:text-sm truncate max-w-[60px] sm:max-w-none">{team.shortName || team.name?.slice(0, 6)}</span>
                    <span className="text-[8px] sm:text-xs text-green-400">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {advancingTeams.length >= 4 && (
              <div className="border border-white/10 rounded-xl sm:rounded-2xl bg-white/[0.03] p-4 sm:p-6">
                <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <Shield size={16} className="sm:w-5 sm:h-5 text-orange-400" />
                  Semi Finals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-gray-400 text-[10px] sm:text-sm">Semi Final 1</p>
                    <p className="text-white font-bold text-xs sm:text-base mt-1 sm:mt-2">Group A Winner vs Group B Runner-up</p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-gray-400 text-[10px] sm:text-sm">Semi Final 2</p>
                    <p className="text-white font-bold text-xs sm:text-base mt-1 sm:mt-2">Group B Winner vs Group A Runner-up</p>
                  </div>
                </div>
              </div>
            )}

            {advancingTeams.length >= 2 && (
              <div className="border border-white/10 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 sm:p-6">
                <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <Trophy size={16} className="sm:w-5 sm:h-5 text-yellow-400" />
                  Final
                </h3>
                <div className="text-center">
                  <p className="text-white font-bold text-xs sm:text-base sm:text-lg">Winner SF1 vs Winner SF2</p>
                  <p className="text-gray-400 text-[10px] sm:text-sm mt-1 sm:mt-2">🏆 Championship Match</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PLAYER STATS ── */}
        {activeTab === 'stats' && (
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Top Scorers */}
            <div className="border border-white/10 rounded-xl sm:rounded-2xl bg-white/[0.03] overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-sm sm:text-lg font-bold flex items-center gap-2">
                  <Goal size={14} className="sm:w-5 sm:h-5 text-green-400" /> Top Scorers
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px]">
                  <thead className="border-b border-white/10">
                    <tr>
                      {['#', 'Player', 'Team', 'G'].map(h => (
                        <th key={h} className={`py-2 px-2 sm:px-3 text-gray-400 text-[10px] sm:text-xs ${h === 'Player' ? 'text-left' : 'text-center'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topScorers.length === 0 ? (
                      <tr><td colSpan="4" className="py-6 sm:py-8 text-center text-gray-400 text-xs">No goals yet</td></tr>
                    ) : (
                      topScorers.slice(0, 5).map((player, idx) => (
                        <tr key={idx} className="border-b border-white/10">
                          <td className="py-2 px-2 sm:px-3 text-center font-bold text-white text-xs sm:text-sm">{idx + 1}</td>
                          <td className="py-2 px-2 sm:px-3 text-white text-xs sm:text-sm">
                            {player.name.length > 15 ? player.name.slice(0, 12) + '..' : player.name}
                          </td>
                          <td className="py-2 px-2 sm:px-3 text-center text-gray-400 text-xs sm:text-sm truncate max-w-[60px]">{player.team || '—'}</td>
                          <td className="py-2 px-2 sm:px-3 text-center text-green-400 font-bold text-xs sm:text-sm">{player.goals}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Assisters */}
            <div className="border border-white/10 rounded-xl sm:rounded-2xl bg-white/[0.03] overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-sm sm:text-lg font-bold flex items-center gap-2">
                  <Award size={14} className="sm:w-5 sm:h-5 text-blue-400" /> Top Assisters
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px]">
                  <thead className="border-b border-white/10">
                    <tr>
                      {['#', 'Player', 'Team', 'A'].map(h => (
                        <th key={h} className={`py-2 px-2 sm:px-3 text-gray-400 text-[10px] sm:text-xs ${h === 'Player' ? 'text-left' : 'text-center'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topAssisters.length === 0 ? (
                      <tr><td colSpan="4" className="py-6 sm:py-8 text-center text-gray-400 text-xs">No assists yet</td></tr>
                    ) : (
                      topAssisters.slice(0, 5).map((player, idx) => (
                        <tr key={player._id} className="border-b border-white/10">
                          <td className="py-2 px-2 sm:px-3 text-center font-bold text-white text-xs sm:text-sm">{idx + 1}</td>
                          <td className="py-2 px-2 sm:px-3 text-white text-xs sm:text-sm">
                            {player.name.length > 15 ? player.name.slice(0, 12) + '..' : player.name}
                            {player.isCaptain && <Crown size={10} className="inline ml-1 text-yellow-400" />}
                          </td>
                          <td className="py-2 px-2 sm:px-3 text-center text-gray-400 text-xs sm:text-sm truncate max-w-[60px]">{player.teamName || '—'}</td>
                          <td className="py-2 px-2 sm:px-3 text-center text-blue-400 font-bold text-xs sm:text-sm">{player.assists}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-[8px] sm:text-xs">
            Friendship Cup 2026 • Top 2 teams from each group advance to Knockout Stage
          </p>
        </div>
      </div>
    </div>
  )
}

export default PublicResultsPage