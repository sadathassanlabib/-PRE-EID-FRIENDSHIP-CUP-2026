'use client'
import React, { useState, useEffect } from 'react'
import { Calendar, Trophy, MapPin, Clock, Search, Crown, Goal } from 'lucide-react'

const PublicFixtures = () => {
  const [fixtures, setFixtures] = useState([])
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRound, setFilterRound] = useState('all')

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([fetchFixtures(), fetchTeams(), fetchPlayers()])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFixtures = async () => {
    try {
      const response = await fetch('/api/fixtures')
      const data = await response.json()
      if (data.success) {
        setFixtures(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching fixtures:', error)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      if (data.success) {
        setTeams(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players')
      const data = await response.json()
      if (data.success) {
        setPlayers(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching players:', error)
    }
  }

  const getTeamName = (teamId, teamName) => {
    if (teamId && teams.length > 0) {
      const team = teams.find(t => t._id === teamId || t.teamId === teamId)
      if (team) return team.name
    }
    return teamName || 'TBD'
  }

  const getTeamShort = (teamId, teamName) => {
    const name = getTeamName(teamId, teamName)
    if (name === 'TBD') return '?'
    return name.slice(0, 2).toUpperCase()
  }

  const getPlayerName = (playerId) => {
    const player = players.find(p => p._id === playerId)
    return player ? player.name : ''
  }

  const getMatchStatus = (fixture) => {
    if (fixture.status === 'live') {
      return 'live'
    }
    if (fixture.status === 'upcoming') {
      return 'upcoming'
    }
    
    if (fixture.status === 'completed' || 
        (fixture.score1 !== undefined && fixture.score1 !== null && 
         fixture.score2 !== undefined && fixture.score2 !== null)) {
      return 'completed'
    }
    
    if (fixture.date) {
      const matchDate = new Date(fixture.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (matchDate >= today) {
        return 'upcoming'
      }
    }
    
    if (fixture.date) {
      const matchDate = new Date(fixture.date)
      const today = new Date()
      if (matchDate < today) {
        return 'completed'
      }
    }
    
    return 'upcoming'
  }

  const getStatusBadge = (fixture) => {
    const status = getMatchStatus(fixture)
    
    switch(status) {
      case 'live':
        return { label: 'LIVE', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500' }
      case 'completed':
        return { label: 'COMPLETED', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500' }
      case 'upcoming':
        return { label: 'UPCOMING', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500' }
      default:
        return { label: 'SCHEDULED', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500' }
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }

  const rounds = ['all', ...new Set(fixtures.map(f => f.round).filter(Boolean))]

  const filteredFixtures = fixtures.filter(fixture => {
    const team1Name = getTeamName(fixture.team1Id, fixture.team1)
    const team2Name = getTeamName(fixture.team2Id, fixture.team2)
    const matchStatus = getMatchStatus(fixture)
    
    const matchesSearch = searchTerm === '' ||
      team1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team2Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fixture.venue?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || matchStatus === filterStatus
    const matchesRound = filterRound === 'all' || fixture.round === filterRound
    
    return matchesSearch && matchesStatus && matchesRound
  })

  const sortedFixtures = [...filteredFixtures].sort((a, b) => {
    const statusOrder = { 'live': 0, 'upcoming': 1, 'completed': 2 }
    const statusA = getMatchStatus(a)
    const statusB = getMatchStatus(b)
    
    if (statusA !== statusB) {
      return statusOrder[statusA] - statusOrder[statusB]
    }
    
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA - dateB
  })

  const stats = {
    total: fixtures.length,
    live: fixtures.filter(f => getMatchStatus(f) === 'live').length,
    upcoming: fixtures.filter(f => getMatchStatus(f) === 'upcoming').length,
    completed: fixtures.filter(f => getMatchStatus(f) === 'completed').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Loading fixtures...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-orange-400 text-xs mb-3 sm:mb-4">
              <Trophy size={12} />
              <span className="hidden xs:inline">PRE-EID FRIENDSHIP CUP 2026</span>
              <span className="xs:hidden">CUP 2026</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2">Fixtures</h1>
            <p className="text-gray-500 text-xs sm:text-sm">Match schedule, results & goal scorers</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg sm:text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Total</p>
          </div>
          <div className="p-2 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg sm:text-2xl font-bold text-red-400">{stats.live}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Live</p>
          </div>
          <div className="p-2 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg sm:text-2xl font-bold text-blue-400">{stats.upcoming}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Upcoming</p>
          </div>
          <div className="p-2 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg sm:text-2xl font-bold text-green-400">{stats.completed}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Completed</p>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              filterStatus === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setFilterStatus('live')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              filterStatus === 'live'
                ? 'bg-red-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Live
          </button>
          <button
            onClick={() => setFilterStatus('upcoming')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              filterStatus === 'upcoming'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              filterStatus === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Search & Round Filter */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search team or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400/50 focus:outline-none text-sm"
            />
          </div>
          
          {rounds.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {rounds.map(round => (
                <button
                  key={round}
                  onClick={() => setFilterRound(round)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex-shrink-0 ${
                    filterRound === round
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {round === 'all' ? 'All Rounds' : round === 'group' ? 'Group Stage' : round}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fixtures List */}
        {sortedFixtures.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-sm">
              {filterStatus !== 'all' 
                ? `No ${filterStatus} matches found`
                : 'No fixtures found'}
            </p>
            {(searchTerm || filterStatus !== 'all' || filterRound !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                  setFilterRound('all')
                }}
                className="mt-3 text-orange-400 text-xs hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sortedFixtures.map((fixture, idx) => {
              const matchStatus = getMatchStatus(fixture)
              const statusBadge = getStatusBadge(fixture)
              const completed = matchStatus === 'completed'
              const team1Name = getTeamName(fixture.team1Id, fixture.team1)
              const team2Name = getTeamName(fixture.team2Id, fixture.team2)
              const team1Short = getTeamShort(fixture.team1Id, fixture.team1)
              const team2Short = getTeamShort(fixture.team2Id, fixture.team2)
              const winner = fixture.winner
              const isWinnerTeam1 = winner === fixture.team1
              
              // Get goal scorers from fixture
              const homeScorers = fixture.goalScorers?.home || []
              const awayScorers = fixture.goalScorers?.away || []
              
              return (
                <div
                  key={fixture._id?.$oid || fixture._id || idx}
                  className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap justify-between items-center gap-1 px-3 py-1.5 bg-white/5 border-b border-white/10">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                      <span className="text-gray-500">#{fixture.matchNumber}</span>
                      <span className="text-gray-600 hidden sm:inline">|</span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar size={10} />
                        <span>{formatDate(fixture.date)}</span>
                      </div>
                      {fixture.time && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock size={9} />
                          <span className="hidden sm:inline">{fixture.time}</span>
                          <span className="sm:hidden">{fixture.time.slice(0,5)}</span>
                        </div>
                      )}
                    </div>
                    <span className={`text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-medium ${statusBadge.bg} ${statusBadge.color} border ${statusBadge.border}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Match Content */}
                  <div className="p-3 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      {/* Team 1 */}
                      <div className="flex-1 text-right min-w-0">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <span className={`text-xs sm:text-base font-semibold truncate ${completed && isWinnerTeam1 ? 'text-green-400' : 'text-white'}`}>
                            {team1Name}
                          </span>
                          <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 shadow-lg ${
                            completed && isWinnerTeam1 
                              ? 'bg-gradient-to-br from-green-500 to-green-700' 
                              : 'bg-gradient-to-br from-orange-500 to-red-600'
                          }`}>
                            {team1Short}
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-center flex-shrink-0 min-w-[50px] sm:min-w-[70px]">
                        {completed ? (
                          <div className="text-base sm:text-2xl font-bold">
                            <span className={completed && isWinnerTeam1 ? 'text-green-400' : 'text-white'}>
                              {fixture.score1 || 0}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-base mx-0.5 sm:mx-1">-</span>
                            <span className={completed && !isWinnerTeam1 && winner ? 'text-green-400' : 'text-white'}>
                              {fixture.score2 || 0}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[10px] sm:text-xs text-gray-500">VS</div>
                        )}
                        {completed && fixture.penaltyShootout && (
                          <div className="text-[7px] sm:text-[9px] text-gray-500 mt-0.5">
                            ({fixture.penaltyScore1}-{fixture.penaltyScore2})
                          </div>
                        )}
                      </div>

                      {/* Team 2 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 shadow-lg ${
                            completed && !isWinnerTeam1 && winner 
                              ? 'bg-gradient-to-br from-green-500 to-green-700' 
                              : 'bg-gradient-to-br from-blue-500 to-purple-600'
                          }`}>
                            {team2Short}
                          </div>
                          <span className={`text-xs sm:text-base font-semibold truncate ${completed && !isWinnerTeam1 && winner ? 'text-green-400' : 'text-white'}`}>
                            {team2Name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Goal Scorers Section */}
                    {completed && (homeScorers.length > 0 || awayScorers.length > 0) && (
  <div className="mt-3 pt-2 border-t border-white/10">
    <div className="flex items-center justify-between gap-2 mb-2">
      <div className="flex items-center gap-1">
        <Goal size={10} className="text-yellow-400" />
        <span className="text-[10px] text-gray-400 font-medium">Goal Scorers</span>
      </div>
      <div className="text-[9px] text-gray-500">
        {homeScorers.length + awayScorers.length} goals
      </div>
    </div>
    
    <div className="flex flex-col sm:flex-row justify-between gap-2">
      {/* Home Team Scorers - Left Side */}
      <div className="flex-1 text-left">
        {homeScorers.length > 0 ? (
          <div className="space-y-0.5">
            <div className="text-[9px] text-orange-400 font-medium mb-1">🏠 {team1Name}</div>
            {homeScorers.map((scorer, i) => (
              <div key={`home-${i}`} className="flex items-center gap-1 text-[9px] sm:text-[10px]">
                <span className="text-orange-400">⚽</span>
                <span className="text-white">{scorer.playerName || getPlayerName(scorer.playerId)}</span>
                {scorer.time && <span className="text-gray-500">({scorer.time}')</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[9px] text-gray-600 italic">No goals</div>
        )}
      </div>

      {/* VS Divider - Only visible on desktop */}
      <div className="hidden sm:flex items-center justify-center px-2">
        <span className="text-[10px] text-gray-600">vs</span>
      </div>

      {/* Away Team Scorers - Right Side */}
      <div className="flex-1 text-left sm:text-right">
        {awayScorers.length > 0 ? (
          <div className="space-y-0.5">
            <div className="text-[9px] text-blue-400 font-medium mb-1">✈️ {team2Name}</div>
            {awayScorers.map((scorer, i) => (
              <div key={`away-${i}`} className="flex items-center gap-1 text-[9px] sm:text-[10px] sm:justify-end">
                {scorer.time && <span className="text-gray-500 order-1 sm:order-none">({scorer.time}')</span>}
                <span className="text-white order-2 sm:order-none">{scorer.playerName || getPlayerName(scorer.playerId)}</span>
                <span className="text-blue-400 order-3">⚽</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[9px] text-gray-600 italic text-right">No goals</div>
        )}
      </div>
    </div>
  </div>
)}

                    {/* Bottom Info */}
                    <div className="mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-white/10 flex flex-wrap justify-between items-center gap-1 text-[10px] sm:text-xs">
                      {winner && completed && (
                        <div className="flex items-center gap-1 text-green-400">
                          <Crown size={10} />
                          <span className="truncate max-w-[120px] sm:max-w-none">Winner: {winner}</span>
                        </div>
                      )}
                      {fixture.venue && (
                        <div className="flex items-center gap-1 text-gray-500 ml-auto">
                          <MapPin size={10} />
                          <span className="truncate max-w-[100px] sm:max-w-none">{fixture.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-white/10 text-center">
          <p className="text-gray-600 text-[10px] sm:text-xs">
            Friendship Cup 2026 • Tournament Schedule
          </p>
        </div>
      </div>
    </div>
  )
}

export default PublicFixtures