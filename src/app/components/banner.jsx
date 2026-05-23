'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, Calendar, Clock, MapPin, Users, Goal, Award, TrendingUp, ChevronRight, Flame } from 'lucide-react'

const Banner = () => {
  const [topScorers, setTopScorers] = useState([])
  const [latestMatches, setLatestMatches] = useState([])
  const [teamsCount, setTeamsCount] = useState(0)
  const [playersCount, setPlayersCount] = useState(0)
  const [totalGoals, setTotalGoals] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [teamsRes, playersRes, fixturesRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/players'),
        fetch('/api/fixtures')
      ])

      const teamsData = await teamsRes.json()
      const playersData = await playersRes.json()
      const fixturesData = await fixturesRes.json()

      let teams = []
      let players = []
      let fixtures = []

      if (teamsData.success) {
        teams = teamsData.data || []
        setTeamsCount(teams.length)
      }

      if (playersData.success) {
        players = playersData.data || []
        setPlayersCount(players.length)
      }

      if (fixturesData.success) {
        fixtures = fixturesData.data || []
        
        // Calculate total goals
        const completedMatches = fixtures.filter(f => f.status === 'completed')
        const goals = completedMatches.reduce((sum, f) => sum + (f.score1 || 0) + (f.score2 || 0), 0)
        setTotalGoals(goals)

        // Get latest 3 completed matches
        const latest = [...completedMatches]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
        setLatestMatches(latest)

        // Calculate top scorers from fixtures
        const goalMap = new Map()
        
        completedMatches.forEach(match => {
          const homeScorers = match.goalScorers?.home || []
          const awayScorers = match.goalScorers?.away || []
          
          homeScorers.forEach(scorer => {
            if (scorer.playerId || scorer.playerName) {
              const key = scorer.playerId || scorer.playerName
              const existing = goalMap.get(key)
              if (existing) {
                existing.goals += 1
              } else {
                goalMap.set(key, {
                  name: scorer.playerName,
                  goals: 1,
                  team: match.team1
                })
              }
            }
          })
          
          awayScorers.forEach(scorer => {
            if (scorer.playerId || scorer.playerName) {
              const key = scorer.playerId || scorer.playerName
              const existing = goalMap.get(key)
              if (existing) {
                existing.goals += 1
              } else {
                goalMap.set(key, {
                  name: scorer.playerName,
                  goals: 1,
                  team: match.team2
                })
              }
            }
          })
        })

        // Also include player goals from players API
        players.forEach(player => {
          if (player.goals && player.goals > 0) {
            const existing = goalMap.get(player._id)
            if (existing) {
              existing.goals += player.goals
            } else {
              goalMap.set(player._id, {
                name: player.name,
                goals: player.goals,
                team: player.teamName
              })
            }
          }
        })

        const topScorerList = Array.from(goalMap.values())
          .sort((a, b) => b.goals - a.goals)
          .slice(0, 3)
        
        setTopScorers(topScorerList)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative w-full min-h-screen flex items-center bg-black text-white overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-400/5 rounded-full blur-[80px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full relative z-10">

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs mb-6">
          <Trophy size={12} />
          <span>PRE-EID FRIENDSHIP CUP 2026</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
          Friendship Cup
          <span className="block text-orange-400 text-2xl sm:text-3xl md:text-4xl mt-2">
            Season 2026
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-xl text-gray-400 text-sm sm:text-base leading-relaxed">
          Organized to bring players together, fostering mutual respect and building stronger connections through the beautiful game.
        </p>

        {/* Tournament Info Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 border border-white/10 rounded-xl p-3 sm:p-4 bg-white/5 backdrop-blur">
            <Calendar size={20} className="text-orange-400" />
            <div>
              <p className="text-gray-400 text-xs">Date</p>
              <p className="font-semibold text-sm sm:text-base">23–24 May 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-white/10 rounded-xl p-3 sm:p-4 bg-white/5 backdrop-blur">
            <Clock size={20} className="text-orange-400" />
            <div>
              <p className="text-gray-400 text-xs">Time</p>
              <p className="font-semibold text-sm sm:text-base">After Fajr Prayer</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-white/10 rounded-xl p-3 sm:p-4 bg-white/5 backdrop-blur">
            <MapPin size={20} className="text-orange-400" />
            <div>
              <p className="text-gray-400 text-xs">Venue</p>
              <p className="font-semibold text-sm sm:text-base">Habildar Mor, 60 Feet</p>
            </div>
          </div>
        </div>

        {/* Live Stats Section */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <Users size={18} className="text-orange-400 mx-auto mb-1" />
            <p className="text-xl sm:text-2xl font-bold">{teamsCount}</p>
            <p className="text-gray-500 text-xs">Teams</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <Users size={18} className="text-orange-400 mx-auto mb-1" />
            <p className="text-xl sm:text-2xl font-bold">{playersCount}+</p>
            <p className="text-gray-500 text-xs">Players</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <Goal size={18} className="text-green-400 mx-auto mb-1" />
            <p className="text-xl sm:text-2xl font-bold text-green-400">{totalGoals}</p>
            <p className="text-gray-500 text-xs">Total Goals</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <Trophy size={18} className="text-yellow-400 mx-auto mb-1" />
            <p className="text-xl sm:text-2xl font-bold">{latestMatches.length}</p>
            <p className="text-gray-500 text-xs">Matches Played</p>
          </div>
        </div>

        {/* Top Scorers Section */}
        {topScorers.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={16} className="text-orange-400" />
              <h3 className="text-sm font-semibold text-gray-300">Top Scorers</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topScorers.map((scorer, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{scorer.name}</p>
                      <p className="text-gray-500 text-xs">{scorer.team || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold text-lg">{scorer.goals}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Matches Section */}
        {latestMatches.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-orange-400" />
              <h3 className="text-sm font-semibold text-gray-300">Latest Results</h3>
            </div>
            <div className="space-y-2">
              {latestMatches.map((match, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex-1 text-right">
                    <span className="text-white text-sm font-medium">{match.team1}</span>
                  </div>
                  <div className="mx-3 px-3 py-1 rounded-lg bg-white/10">
                    <span className="text-white font-bold">{match.score1}</span>
                    <span className="text-gray-500 mx-1">-</span>
                    <span className="text-white font-bold">{match.score2}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-white text-sm font-medium">{match.team2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link href="/players1">
            <button className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 transition-all duration-300 flex items-center justify-center gap-2 group">
              View Players
              <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
            </button>
          </Link>
          <Link href="/fixtures1">
            <button className="w-full sm:w-auto px-6 py-3 border border-white/20 rounded-xl hover:border-orange-400/50 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2">
              Match Fixtures
            </button>
          </Link>
          <Link href="/results1">
            <button className="w-full sm:w-auto px-6 py-3 border border-white/20 rounded-xl hover:border-orange-400/50 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2">
              View Results
            </button>
          </Link>
        </div>

      </div>
    </section>
  )
}

export default Banner