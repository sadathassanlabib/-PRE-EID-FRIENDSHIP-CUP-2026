'use client'
import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Trophy, Users, Award } from 'lucide-react'

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRound, setSelectedRound] = useState('all')

  const rounds = ['all', 'group', 'quarter-final', 'semi-final', 'final']

  // Fetch fixtures from database
  useEffect(() => {
    fetchFixtures()
    fetchTeams()
  }, [])

  const fetchFixtures = async () => {
    try {
      const response = await fetch('/api/fixtures')
      const data = await response.json()
      
      if (data.success && Array.isArray(data.data)) {
        // Sort by date and time
        const sortedFixtures = data.data.sort((a, b) => {
          if (a.date !== b.date) return new Date(a.date) - new Date(b.date)
          return a.time?.localeCompare(b.time || '')
        })
        setFixtures(sortedFixtures)
      } else {
        setFixtures([])
      }
    } catch (error) {
      console.error('Error fetching fixtures:', error)
      setFixtures([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      
      if (data.success && Array.isArray(data.data)) {
        setTeams(data.data)
      } else {
        setTeams([])
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
      setTeams([])
    }
  }

  // Filter fixtures by round
  const filteredFixtures = selectedRound === 'all' 
    ? fixtures 
    : fixtures.filter(f => f.round === selectedRound)

  // Get team logo/color
  const getTeamInfo = (teamName) => {
    const team = teams.find(t => t.name === teamName)
    return {
      logo: team?.logo || '⚽',
      color: team?.color || '#ff3b30'
    }
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Completed' }
      case 'live':
        return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Live' }
      default:
        return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Upcoming' }
    }
  }

  // Get round badge color
  const getRoundBadge = (round) => {
    switch(round) {
      case 'group': return 'bg-blue-500/20 text-blue-400'
      case 'quarter-final': return 'bg-purple-500/20 text-purple-400'
      case 'semi-final': return 'bg-orange-500/20 text-orange-400'
      case 'final': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Group fixtures by date
  const groupedFixtures = filteredFixtures.reduce((groups, fixture) => {
    const date = fixture.date || 'TBD'
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(fixture)
    return groups
  }, {})

  // Sort dates
  const sortedDates = Object.keys(groupedFixtures).sort()

  if (loading) {
    return (
      <section className="min-h-screen bg-black text-white py-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading fixtures...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">
          <p className="text-xs tracking-[6px] text-gray-500 uppercase">
            Official Tournament Fixtures
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">
            Pre-Eid Friendship Cup 2026
          </h1>
          <p className="text-gray-400 mt-3 text-sm">
            Group Stage + Knockout Stage Schedule
          </p>
          <div className="w-24 h-[2px] bg-orange-500 mx-auto mt-6" />
        </div>

        {/* EVENT INFO CARD */}
        <div className="border border-white/10 rounded-2xl bg-white/[0.03] p-6 mb-10">
          <h2 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-2">
            <Calendar size={24} />
            Tournament Information
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-300">
            <div>
              <p className="text-gray-500 flex items-center gap-1"><Calendar size={14} /> Dates</p>
              <p className="text-white font-medium">23–24 May 2026</p>
            </div>
            <div>
              <p className="text-gray-500 flex items-center gap-1"><Clock size={14} /> Kickoff Time</p>
              <p className="text-white font-medium">From 6:00 AM (Daily)</p>
            </div>
            <div>
              <p className="text-gray-500 flex items-center gap-1"><MapPin size={14} /> Venue</p>
              <p className="text-white font-medium">Tin Tala Math, Habildar Mor, 60 Feet</p>
            </div>
            <div>
              <p className="text-gray-500">⚽ Match Format</p>
              <p className="text-white font-medium">15 min + 5 min break + 15 min (45 min total)</p>
            </div>
            <div>
              <p className="text-gray-500">🏆 Stage Format</p>
              <p className="text-white font-medium">Group Stage → Semi Final → 3rd Place → Final</p>
            </div>
            <div>
              <p className="text-gray-500">📊 Structure</p>
              <p className="text-white font-medium">Round Robin + Knockout System</p>
            </div>
          </div>
        </div>

        {/* ROUND FILTER */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {rounds.map((round) => (
            <button
              key={round}
              onClick={() => setSelectedRound(round)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRound === round
                  ? 'bg-orange-500 text-black'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:border-orange-400/40'
              }`}
            >
              {round === 'all' ? 'All Matches' : round.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* FIXTURES LIST */}
        {filteredFixtures.length === 0 ? (
          <div className="text-center py-16 border border-white/10 rounded-2xl bg-white/[0.03]">
            <p className="text-gray-400">No fixtures scheduled yet.</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="mb-8">
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={20} className="text-orange-400" />
                <h3 className="text-xl font-bold text-white">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent"></div>
              </div>

              {/* Matches for this date */}
              <div className="space-y-4">
                {groupedFixtures[date].map((fixture) => {
                  const team1Info = getTeamInfo(fixture.team1)
                  const team2Info = getTeamInfo(fixture.team2)
                  const statusBadge = getStatusBadge(fixture.status)
                  const isCompleted = fixture.status === 'completed'
                  
                  return (
                    <div
                      key={fixture._id}
                      className="border border-white/10 rounded-2xl bg-white/[0.03] p-5 hover:border-orange-400/40 transition-all"
                    >
                      {/* Match Header */}
                      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoundBadge(fixture.round)}`}>
                            {fixture.round?.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                          <span className="flex items-center gap-1"><Clock size={14} />{fixture.time}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} />{fixture.venue}</span>
                        </div>
                      </div>

                      {/* Teams and Score */}
                      <div className="flex items-center justify-between gap-4 py-4">
                        {/* Team 1 */}
                        <div className="flex-1 text-center">
                          <div className="text-5xl mb-2">{team1Info.logo}</div>
                          <div className="font-bold text-white">{fixture.team1}</div>
                        </div>

                        {/* Score */}
                        <div className="text-center min-w-[100px]">
                          {isCompleted ? (
                            <>
                              <div className="text-3xl font-bold">
                                <span className={fixture.score1 > fixture.score2 ? 'text-green-400' : fixture.score1 === fixture.score2 ? 'text-yellow-400' : 'text-red-400'}>
                                  {fixture.score1}
                                </span>
                                <span className="text-gray-400 mx-2">-</span>
                                <span className={fixture.score2 > fixture.score1 ? 'text-green-400' : fixture.score1 === fixture.score2 ? 'text-yellow-400' : 'text-red-400'}>
                                  {fixture.score2}
                                </span>
                              </div>
                              {fixture.penaltyShootout && (
                                <div className="text-xs text-yellow-400 mt-1">
                                  Pen: {fixture.penaltyScore1} - {fixture.penaltyScore2}
                                </div>
                              )}
                              {fixture.winner && (
                                <div className="text-xs text-green-400 mt-1">
                                  Winner: {fixture.winner}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-2xl font-bold text-gray-500">VS</div>
                          )}
                        </div>

                        {/* Team 2 */}
                        <div className="flex-1 text-center">
                          <div className="text-5xl mb-2">{team2Info.logo}</div>
                          <div className="font-bold text-white">{fixture.team2}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}

        {/* FOOTER */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
            <Trophy size={12} />
            Friendship Cup 2026 • All times are Bangladesh Standard Time (BST)
          </div>
        </div>

      </div>
    </section>
  )
}

export default Fixtures