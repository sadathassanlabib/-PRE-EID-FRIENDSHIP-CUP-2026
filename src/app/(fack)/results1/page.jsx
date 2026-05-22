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

  // Fetch all data
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

  // Get completed matches only
  const completedMatches = fixtures.filter(f => f.status === 'completed')
  
  // Filter by round
  const filteredMatches = selectedRound === 'all' 
    ? completedMatches 
    : completedMatches.filter(f => f.round === selectedRound)

  // Get team logo
  const getTeamLogo = (teamName) => {
    const team = teams.find(t => t.name === teamName)
    return team?.logo || '⚽'
  }

  // Calculate team stats (for groups)
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
      // Team 1 stats
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
      
      // Team 2 stats
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

  // Manual Group Assignments (you can change this based on actual group assignments)
  // Option 1: Automatic based on team names
  // Option 2: Fetch from localStorage or API
  const getGroupAssignments = () => {
    // Try to load saved group assignments
    const saved = localStorage.getItem('groupAssignments')
    if (saved) {
      return JSON.parse(saved)
    }
    
    // Fallback: Automatic grouping based on team order
    const allTeams = [...teams]
    const groupSize = Math.ceil(allTeams.length / 2)
    
    return {
      'A': allTeams.slice(0, groupSize),
      'B': allTeams.slice(groupSize)
    }
  }

  // Calculate group standings
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
      
      // Sort by points, then goal difference, then goals for
      groupStandings.sort((a, b) => {
        if (a.points !== b.points) return b.points - a.points
        if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference
        return b.goalsFor - a.goalsFor
      })
      
      groups[groupLetter] = groupStandings
    })
    
    return groups
  }

  // Get top 2 teams from each group (advancing to knockout)
  const getAdvancingTeams = () => {
    const groupStandings = calculateGroupStandings()
    const advancing = []
    
    Object.keys(groupStandings).forEach(group => {
      const topTeams = groupStandings[group].slice(0, 2)
      advancing.push(...topTeams)
    })
    
    return advancing
  }

  // Get top scorers
  const getTopScorers = () => {
    return players.filter(p => (p.goals || 0) > 0).sort((a, b) => (b.goals || 0) - (a.goals || 0)).slice(0, 10)
  }

  // Get top assisters
  const getTopAssisters = () => {
    return players.filter(p => (p.assists || 0) > 0).sort((a, b) => (b.assists || 0) - (a.assists || 0)).slice(0, 10)
  }

  const getRoundColor = (round) => {
    switch(round) {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!hasResults) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-black text-white px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-orange-500/10 blur-[160px] rounded-full" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-yellow-500/10 blur-[160px] rounded-full" />
        </div>
        <div className="relative w-full max-w-lg text-center">
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-xl">
            <div className="text-6xl mb-4">🏆⚽</div>
            <h1 className="text-2xl md:text-3xl font-bold text-orange-400">Results Coming Soon</h1>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              Match results for the <span className="text-white font-semibold">Pre-Eid Friendship Cup 2026</span> will be published here after each game is completed.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
              📊 <span>Awaiting Match Results</span>
            </div>
          </div>
        </div>
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
          <h1 className="mt-6 text-5xl font-black">Tournament Results</h1>
          <p className="text-gray-400 mt-3 text-sm">Live scores, group standings, and player statistics</p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'matches'
                ? 'bg-orange-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📅 Match Results
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'groups'
                ? 'bg-orange-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 Group Standings
          </button>
          <button
            onClick={() => setActiveTab('knockout')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'knockout'
                ? 'bg-orange-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🏆 Knockout Stage
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-orange-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚽ Player Stats
          </button>
        </div>

        {/* MATCH RESULTS TAB */}
        {activeTab === 'matches' && (
          <div>
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {rounds.map((round) => (
                <button
                  key={round}
                  onClick={() => setSelectedRound(round)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedRound === round
                      ? 'bg-orange-500 text-black'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:border-orange-400/40'
                  }`}
                >
                  {round === 'all' ? 'All Matches' : round.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>

            {filteredMatches.length === 0 ? (
              <div className="text-center py-16 border border-white/10 rounded-2xl bg-white/[0.03]">
                <p className="text-gray-400">No completed matches in this round.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMatches.map((match) => (
                  <div key={match._id} className="border border-white/10 rounded-2xl bg-white/[0.03] p-5 hover:border-orange-400/40 transition-all">
                    <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoundColor(match.round)}`}>
                        {match.round?.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <span className="flex items-center gap-1"><Calendar size={12} />{match.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{match.time}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} />{match.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-4">
                      <div className="flex-1 text-center">
                        <div className="text-5xl mb-2">{getTeamLogo(match.team1)}</div>
                        <div className="font-bold text-white">{match.team1}</div>
                      </div>

                      <div className="text-center min-w-[100px]">
                        <div className="text-3xl font-bold">
                          <span className={match.score1 > match.score2 ? 'text-green-400' : match.score1 === match.score2 ? 'text-yellow-400' : 'text-red-400'}>
                            {match.score1}
                          </span>
                          <span className="text-gray-400 mx-2">-</span>
                          <span className={match.score2 > match.score1 ? 'text-green-400' : match.score1 === match.score2 ? 'text-yellow-400' : 'text-red-400'}>
                            {match.score2}
                          </span>
                        </div>
                        {match.penaltyShootout && (
                          <div className="text-xs text-yellow-400 mt-1">Pen: {match.penaltyScore1} - {match.penaltyScore2}</div>
                        )}
                        {match.winner && (
                          <div className="text-xs text-green-400 mt-1">🏆 Winner: {match.winner}</div>
                        )}
                      </div>

                      <div className="flex-1 text-center">
                        <div className="text-5xl mb-2">{getTeamLogo(match.team2)}</div>
                        <div className="font-bold text-white">{match.team2}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GROUP STANDINGS TAB - For 2 Groups */}
        {activeTab === 'groups' && (
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(groupStandings).map(([groupName, teams]) => (
              <div key={groupName} className="border border-white/10 rounded-2xl bg-white/[0.03] overflow-auto">
                <div className="p-5 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-orange-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-white">Group {groupName}</h3>
                      <p className="text-xs text-gray-400">Top 2 advance to Knockout Stage</p>
                    </div>
                  </div>
                </div>
                
                <table className="w-full">
                  <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="py-3 px-3 text-left text-gray-400 text-xs font-medium">#</th>
                      <th className="py-3 px-3 text-left text-gray-400 text-xs font-medium">Team</th>
                      <th className="py-3 px-3 text-center text-gray-400 text-xs font-medium">P</th>
                      <th className="py-3 px-3 text-center text-gray-400 text-xs font-medium">W</th>
                      <th className="py-3 px-3 text-center text-gray-400 text-xs font-medium">D</th>
                      <th className="py-3 px-3 text-center text-gray-400 text-xs font-medium">L</th>
                      <th className="py-3 px-3 text-center text-gray-400 text-xs font-medium">GD</th>
                      <th className="py-3 px-3 text-center text-gray-400 text-xs font-medium">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, idx) => (
                      <tr key={team.id} className={`border-b border-white/10 hover:bg-white/5 ${
                        idx < 2 ? 'bg-green-500/5' : ''
                      }`}>
                        <td className="py-3 px-3 text-center font-bold text-white">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{team.logo}</span>
                            <span className="text-white font-medium">{team.name}</span>
                            {idx < 2 && (
                              <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                                Qualified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center text-gray-300">{team.played}</td>
                        <td className="py-3 px-3 text-center text-green-400">{team.wins}</td>
                        <td className="py-3 px-3 text-center text-yellow-400">{team.draws}</td>
                        <td className="py-3 px-3 text-center text-red-400">{team.losses}</td>
                        <td className="py-3 px-3 text-center text-blue-400">
                          {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                        </td>
                        <td className="py-3 px-3 text-center text-yellow-400 font-bold text-lg">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Group Summary */}
                <div className="p-4 border-t border-white/10 bg-white/5">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Total Goals</p>
                      <p className="text-green-400 font-bold">{teams.reduce((sum, t) => sum + t.goalsFor, 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Average Points</p>
                      <p className="text-yellow-400 font-bold">{(teams.reduce((sum, t) => sum + t.points, 0) / teams.length).toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Matches Played</p>
                      <p className="text-blue-400 font-bold">{teams.reduce((sum, t) => sum + t.played, 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KNOCKOUT STAGE TAB */}
        {activeTab === 'knockout' && (
          <div className="space-y-6">
            {/* Qualified Teams */}
            <div className="border border-white/10 rounded-2xl bg-white/[0.03] p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy size={20} className="text-yellow-400" />
                Teams Qualified for Knockout Stage
              </h3>
              <div className="flex flex-wrap gap-3">
                {advancingTeams.map((team, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl">{team.logo}</span>
                    <span className="text-white font-medium">{team.name}</span>
                    <span className="text-xs text-green-400">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Semi Finals Bracket */}
            {advancingTeams.length >= 4 && (
              <div className="border border-white/10 rounded-2xl bg-white/[0.03] p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-orange-400" />
                  Semi Finals
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-gray-400 text-sm">Semi Final 1</p>
                    <p className="text-white font-bold mt-2">Group A Winner vs Group B Runner-up</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-gray-400 text-sm">Semi Final 2</p>
                    <p className="text-white font-bold mt-2">Group B Winner vs Group A Runner-up</p>
                  </div>
                </div>
              </div>
            )}

            {/* Final */}
            {advancingTeams.length >= 2 && (
              <div className="border border-white/10 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-400" />
                  Final
                </h3>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">Winner SF1 vs Winner SF2</p>
                  <p className="text-gray-400 text-sm mt-2">🏆 Championship Match</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PLAYER STATS TAB */}
        {activeTab === 'stats' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Scorers */}
            <div className="border border-white/10 rounded-2xl bg-white/[0.03] overflow-auto">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Goal size={18} className="text-green-400" /> Top Scorers
                </h3>
              </div>
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="py-2 px-3 text-center text-gray-400 text-xs">#</th>
                    <th className="py-2 px-3 text-left text-gray-400 text-xs">Player</th>
                    <th className="py-2 px-3 text-center text-gray-400 text-xs">Team</th>
                    <th className="py-2 px-3 text-center text-gray-400 text-xs">Goals</th>
                  </tr>
                </thead>
                <tbody>
                  {topScorers.length === 0 ? (
                    <tr><td colSpan="4" className="py-8 text-center text-gray-400">No goals scored yet</td></tr>
                  ) : (
                    topScorers.map((player, idx) => (
                      <tr key={player._id} className="border-b border-white/10">
                        <td className="py-2 px-3 text-center font-bold text-white">{idx + 1}</td>
                        <td className="py-2 px-3 text-white">{player.name}{player.isCaptain && <Crown size={12} className="inline ml-1 text-yellow-400" />}</td>
                        <td className="py-2 px-3 text-center text-gray-400">{player.teamName || '-'}</td>
                        <td className="py-2 px-3 text-center text-green-400 font-bold">{player.goals}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Top Assisters */}
            <div className="border border-white/10 rounded-2xl bg-white/[0.03] overflow-auto">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Award size={18} className="text-blue-400" /> Top Assisters
                </h3>
              </div>
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="py-2 px-3 text-center text-gray-400 text-xs">#</th>
                    <th className="py-2 px-3 text-left text-gray-400 text-xs">Player</th>
                    <th className="py-2 px-3 text-center text-gray-400 text-xs">Team</th>
                    <th className="py-2 px-3 text-center text-gray-400 text-xs">Assists</th>
                  </tr>
                </thead>
                <tbody>
                  {topAssisters.length === 0 ? (
                    <tr><td colSpan="4" className="py-8 text-center text-gray-400">No assists recorded yet</td></tr>
                  ) : (
                    topAssisters.map((player, idx) => (
                      <tr key={player._id} className="border-b border-white/10">
                        <td className="py-2 px-3 text-center font-bold text-white">{idx + 1}</td>
                        <td className="py-2 px-3 text-white">{player.name}{player.isCaptain && <Crown size={12} className="inline ml-1 text-yellow-400" />}</td>
                        <td className="py-2 px-3 text-center text-gray-400">{player.teamName || '-'}</td>
                        <td className="py-2 px-3 text-center text-blue-400 font-bold">{player.assists}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-xs">⚽ Friendship Cup 2026 • Top 2 teams from each group advance to Knockout Stage</p>
        </div>
      </div>
    </section>
  )
}

export default PublicResultsPage