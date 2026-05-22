'use client'
import React, { useState, useEffect } from 'react'
import GroupManager from '@/app/components/groupManager'

const C = {
  bg: "#06060f", surface: "#0c0c1d", card: "#101024", border: "#1c1c38",
  accent: "#00d4ff", green: "#00e676", red: "#ff3d6b", yellow: "#ffd740",
  text: "#e2e4f0", muted: "#4a4a6a",
}

const ResultsPage = () => {
  const [fixtures, setFixtures] = useState([])
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRound, setSelectedRound] = useState('all')
  const [activeTab, setActiveTab] = useState('matches')
  const [showGroupManager, setShowGroupManager] = useState(false)
  const [customGroupAssignments, setCustomGroupAssignments] = useState(null)
  const [editingMatch, setEditingMatch] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [groupConfig, setGroupConfig] = useState({
    groups: 2,
    teamsPerGroup: 4,
    teamsAdvancing: 2
  })

  // Group configuration presets
  const groupPresets = {
    "2x3": { groups: 2, teamsPerGroup: 3, teamsAdvancing: 2, name: "2 Groups of 3 (6 teams)" },
    "2x4": { groups: 2, teamsPerGroup: 4, teamsAdvancing: 2, name: "2 Groups of 4 (8 teams)" },
    "2x5": { groups: 2, teamsPerGroup: 5, teamsAdvancing: 2, name: "2 Groups of 5 (10 teams)" },
    "2x6": { groups: 2, teamsPerGroup: 6, teamsAdvancing: 2, name: "2 Groups of 6 (12 teams)" },
    "3x4": { groups: 3, teamsPerGroup: 4, teamsAdvancing: 2, name: "3 Groups of 4 (12 teams)" },
    "4x4": { groups: 4, teamsPerGroup: 4, teamsAdvancing: 1, name: "4 Groups of 4 (16 teams)" },
    "4x3": { groups: 4, teamsPerGroup: 3, teamsAdvancing: 1, name: "4 Groups of 3 (12 teams)" },
    "6x3": { groups: 6, teamsPerGroup: 3, teamsAdvancing: 1, name: "6 Groups of 3 (18 teams)" },
  }

  // Fetch all data
  useEffect(() => {
    fetchData()
    loadSavedGroupAssignments()
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

  const loadSavedGroupAssignments = () => {
    const saved = localStorage.getItem('groupAssignments')
    if (saved) {
      setCustomGroupAssignments(JSON.parse(saved))
    }
  }

  const handleGroupsAssigned = (assignedGroups) => {
    setCustomGroupAssignments(assignedGroups)
    setShowGroupManager(false)
    localStorage.setItem('groupAssignments', JSON.stringify(assignedGroups))
  }

  // Update match score
  const updateMatchScore = async (matchId, score1, score2, penaltyScore1, penaltyScore2, penaltyShootout, status) => {
    try {
      const match = fixtures.find(f => f._id === matchId)
      const winner = score1 > score2 ? match.team1 : (score2 > score1 ? match.team2 : null)
      
      const response = await fetch('/api/fixtures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: matchId,
          score1,
          score2,
          penaltyScore1: penaltyShootout ? penaltyScore1 : 0,
          penaltyScore2: penaltyShootout ? penaltyScore2 : 0,
          penaltyShootout,
          status,
          winner,
          updatedAt: new Date()
        })
      })
      
      const data = await response.json()
      if (data.success) {
        fetchData()
        setShowEditModal(false)
        setEditingMatch(null)
        alert('Match updated successfully!')
      } else {
        alert('Failed to update match')
      }
    } catch (error) {
      console.error('Error updating match:', error)
      alert('Error updating match')
    }
  }

  // Delete match
  const deleteMatch = async (matchId) => {
    if (!confirm('Are you sure you want to delete this match?')) return
    
    try {
      const response = await fetch(`/api/fixtures?id=${matchId}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        fetchData()
        alert('Match deleted successfully!')
      } else {
        alert('Failed to delete match')
      }
    } catch (error) {
      console.error('Error deleting match:', error)
      alert('Error deleting match')
    }
  }

  // Get completed matches only
  const completedMatches = fixtures.filter(f => f.status === 'completed')
  
  // Filter by round
  const filteredMatches = selectedRound === 'all' 
    ? fixtures 
    : fixtures.filter(f => f.round === selectedRound)

  // Calculate team standings (overall)
  const calculateOverallStandings = () => {
    const standings = {}
    
    teams.forEach(team => {
      standings[team.name] = {
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
      if (standings[match.team1]) {
        standings[match.team1].played++
        standings[match.team1].goalsFor += match.score1
        standings[match.team1].goalsAgainst += match.score2
        
        if (match.score1 > match.score2) {
          standings[match.team1].wins++
          standings[match.team1].points += 3
        } else if (match.score1 === match.score2) {
          standings[match.team1].draws++
          standings[match.team1].points += 1
        } else {
          standings[match.team1].losses++
        }
      }
      
      if (standings[match.team2]) {
        standings[match.team2].played++
        standings[match.team2].goalsFor += match.score2
        standings[match.team2].goalsAgainst += match.score1
        
        if (match.score2 > match.score1) {
          standings[match.team2].wins++
          standings[match.team2].points += 3
        } else if (match.score2 === match.score1) {
          standings[match.team2].draws++
          standings[match.team2].points += 1
        } else {
          standings[match.team2].losses++
        }
      }
    })
    
    Object.values(standings).forEach(team => {
      team.goalDifference = team.goalsFor - team.goalsAgainst
    })
    
    return Object.values(standings).sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points
      if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })
  }

  // Calculate standings by group
  const calculateGroupStandings = () => {
    const overallStandings = calculateOverallStandings()
    
    if (customGroupAssignments) {
      const groups = {}
      Object.keys(customGroupAssignments).forEach(groupLetter => {
        const groupTeams = customGroupAssignments[groupLetter]
        const teamStandings = []
        
        groupTeams.forEach(team => {
          const stats = overallStandings.find(s => s.name === team.name)
          if (stats) {
            teamStandings.push(stats)
          }
        })
        
        teamStandings.sort((a, b) => {
          if (a.points !== b.points) return b.points - a.points
          if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference
          return b.goalsFor - a.goalsFor
        })
        
        groups[groupLetter] = teamStandings
      })
      return groups
    }
    
    const groups = {}
    for (let i = 0; i < groupConfig.groups; i++) {
      groups[String.fromCharCode(65 + i)] = []
    }
    
    overallStandings.forEach((team, index) => {
      const groupIndex = index % groupConfig.groups
      const groupLetter = String.fromCharCode(65 + groupIndex)
      groups[groupLetter].push(team)
    })
    
    return groups
  }

  // Get advancing teams
  const getAdvancingTeams = () => {
    const groups = calculateGroupStandings()
    const advancing = []
    
    Object.keys(groups).forEach(group => {
      const advancingTeams = groups[group].slice(0, groupConfig.teamsAdvancing)
      advancing.push(...advancingTeams)
    })
    
    return advancing
  }

  // Get top scorers
  const getTopScorers = () => {
    return players.filter(p => p.goals > 0).sort((a, b) => b.goals - a.goals).slice(0, 10)
  }

  // Get top assisters
  const getTopAssisters = () => {
    return players.filter(p => p.assists > 0).sort((a, b) => b.assists - a.assists).slice(0, 10)
  }

  const getRoundColor = (round) => {
    switch(round) {
      case 'group': return C.accent
      case 'quarter-final': return C.green
      case 'semi-final': return C.yellow
      case 'final': return C.red
      default: return C.muted
    }
  }

  const overallStandings = calculateOverallStandings()
  const groupStandings = calculateGroupStandings()
  const advancingTeams = getAdvancingTeams()
  const topScorers = getTopScorers()
  const topAssisters = getTopAssisters()
  const rounds = ['all', 'group', 'quarter-final', 'semi-final', 'final']

  // Edit Match Modal Component
  const EditMatchModal = ({ match, onClose, onSave }) => {
    const [score1, setScore1] = useState(match.score1 || 0)
    const [score2, setScore2] = useState(match.score2 || 0)
    const [penaltyShootout, setPenaltyShootout] = useState(match.penaltyShootout || false)
    const [penaltyScore1, setPenaltyScore1] = useState(match.penaltyScore1 || 0)
    const [penaltyScore2, setPenaltyScore2] = useState(match.penaltyScore2 || 0)
    const [status, setStatus] = useState(match.status || 'upcoming')

    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.95)", zIndex: 3000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}>
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: 28, maxWidth: 500, width: "100%",
        }}>
          <h2 style={{ color: C.text, marginBottom: 20 }}>Edit Match: {match.team1} vs {match.team2}</h2>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ color: C.text, display: "block", marginBottom: 5 }}>Match Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{ width: "100%", padding: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }}
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ color: C.text }}>{match.team1}</label>
              <input type="number" value={score1} onChange={e => setScore1(parseInt(e.target.value) || 0)} style={{ width: "100%", padding: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 24, textAlign: "center" }} />
            </div>
            <div style={{ fontSize: 24, alignSelf: "flex-end", color: C.text }}>VS</div>
            <div>
              <label style={{ color: C.text }}>{match.team2}</label>
              <input type="number" value={score2} onChange={e => setScore2(parseInt(e.target.value) || 0)} style={{ width: "100%", padding: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 24, textAlign: "center" }} />
            </div>
          </div>

          {score1 === score2 && score1 > 0 && (
            <div style={{ marginBottom: 15, padding: 15, background: C.surface, borderRadius: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <input type="checkbox" checked={penaltyShootout} onChange={e => setPenaltyShootout(e.target.checked)} />
                Penalty Shootout
              </label>
              {penaltyShootout && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                  <input type="number" placeholder="Penalty 1" value={penaltyScore1} onChange={e => setPenaltyScore1(parseInt(e.target.value) || 0)} style={{ padding: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, textAlign: "center" }} />
                  <input type="number" placeholder="Penalty 2" value={penaltyScore2} onChange={e => setPenaltyScore2(parseInt(e.target.value) || 0)} style={{ padding: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, textAlign: "center" }} />
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onSave(match._id, score1, score2, penaltyScore1, penaltyScore2, penaltyShootout, status)} style={{ flex: 1, padding: 12, background: C.green, border: "none", borderRadius: 8, color: "#000", fontWeight: "bold", cursor: "pointer" }}>Save Changes</button>
            <button onClick={onClose} style={{ flex: 1, padding: 12, background: C.red, border: "none", borderRadius: 8, color: "#fff", fontWeight: "bold", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.text, fontSize: 18 }}>Loading results...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "32px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ color: C.text, fontSize: 28, fontFamily: "'Bebas Neue', sans-serif", marginBottom: 8 }}>
            📊 Tournament Results
          </h1>
          <p style={{ color: C.muted }}>View and edit match results, group standings, and player statistics</p>
        </div>

        {/* Group Configuration */}
        <div style={{
          background: `${C.accent}15`, border: `1px solid ${C.accent}`,
          borderRadius: 12, padding: 16, marginBottom: 24,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10
        }}>
          <div>
            <span style={{ color: C.accent, fontWeight: "bold" }}>📋 Tournament Format:</span>
            <span style={{ color: C.text, marginLeft: 10 }}>
              {groupConfig.groups} Groups · {groupConfig.teamsPerGroup} Teams per Group · 
              Top {groupConfig.teamsAdvancing} Advance
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={Object.keys(groupPresets).find(key => 
                groupPresets[key].groups === groupConfig.groups && 
                groupPresets[key].teamsPerGroup === groupConfig.teamsPerGroup
              ) || "2x4"}
              onChange={(e) => setGroupConfig(groupPresets[e.target.value])}
              style={{ padding: "8px 16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, cursor: "pointer" }}
            >
              {Object.entries(groupPresets).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
            <button onClick={() => setShowGroupManager(true)} style={{ padding: "8px 16px", background: C.accent, border: "none", borderRadius: 8, color: "#000", fontWeight: "bold", cursor: "pointer" }}>📋 Manual Group Assignment</button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 12, flexWrap: "wrap" }}>
          <button onClick={() => setActiveTab('matches')} style={{ padding: "10px 24px", borderRadius: 8, background: activeTab === 'matches' ? C.accent : 'transparent', color: activeTab === 'matches' ? "#000" : C.text, fontWeight: "bold", cursor: "pointer", border: "none" }}>📅 Match Results</button>
          <button onClick={() => setActiveTab('standings')} style={{ padding: "10px 24px", borderRadius: 8, background: activeTab === 'standings' ? C.accent : 'transparent', color: activeTab === 'standings' ? "#000" : C.text, fontWeight: "bold", cursor: "pointer", border: "none" }}>🏆 Overall Standings</button>
          <button onClick={() => setActiveTab('groups')} style={{ padding: "10px 24px", borderRadius: 8, background: activeTab === 'groups' ? C.accent : 'transparent', color: activeTab === 'groups' ? "#000" : C.text, fontWeight: "bold", cursor: "pointer", border: "none" }}>📋 Group Standings</button>
          <button onClick={() => setActiveTab('knockout')} style={{ padding: "10px 24px", borderRadius: 8, background: activeTab === 'knockout' ? C.accent : 'transparent', color: activeTab === 'knockout' ? "#000" : C.text, fontWeight: "bold", cursor: "pointer", border: "none" }}>🏆 Knockout Stage</button>
          <button onClick={() => setActiveTab('stats')} style={{ padding: "10px 24px", borderRadius: 8, background: activeTab === 'stats' ? C.accent : 'transparent', color: activeTab === 'stats' ? "#000" : C.text, fontWeight: "bold", cursor: "pointer", border: "none" }}>⚽ Player Stats</button>
        </div>

        {/* Match Results Tab with Edit Buttons */}
        {activeTab === 'matches' && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              {rounds.map(round => (
                <button key={round} onClick={() => setSelectedRound(round)} style={{ padding: "6px 16px", borderRadius: 20, background: selectedRound === round ? getRoundColor(round) : C.surface, color: selectedRound === round ? "#000" : C.text, border: `1px solid ${selectedRound === round ? 'transparent' : C.border}`, cursor: "pointer", fontSize: 12 }}>
                  {round === 'all' ? 'All Matches' : round.toUpperCase()}
                </button>
              ))}
            </div>

            {filteredMatches.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: C.muted }}>No matches found.</div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {filteredMatches.map((match) => (
                  <div key={match._id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                      <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, background: `${getRoundColor(match.round)}22`, color: getRoundColor(match.round) }}>{match.round?.toUpperCase()}</span>
                      <span style={{ color: C.muted, fontSize: 12 }}>📅 {match.date} | ⏰ {match.time} | 📍 {match.venue}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => { setEditingMatch(match); setShowEditModal(true); }} style={{ padding: "4px 12px", background: C.accent, border: "none", borderRadius: 6, color: "#000", cursor: "pointer", fontSize: 12 }}>✏️ Edit</button>
                        <button onClick={() => deleteMatch(match._id)} style={{ padding: "4px 12px", background: C.red, border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: 12 }}>🗑️ Delete</button>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 48, marginBottom: 8 }}>⚽</div><div style={{ color: C.text, fontWeight: "bold", fontSize: 16 }}>{match.team1}</div></div>
                      <div style={{ textAlign: "center", minWidth: 100 }}>
                        <div style={{ fontSize: 36, fontWeight: "bold", color: match.score1 > match.score2 ? C.green : (match.score1 === match.score2 ? C.yellow : C.red) }}>{match.score1} - {match.score2}</div>
                        {match.penaltyShootout && <div style={{ fontSize: 12, color: C.yellow, marginTop: 5 }}>Penalty: {match.penaltyScore1} - {match.penaltyScore2}</div>}
                        {match.winner && <div style={{ fontSize: 12, color: C.green, marginTop: 5 }}>Winner: {match.winner}</div>}
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 48, marginBottom: 8 }}>⚽</div><div style={{ color: C.text, fontWeight: "bold", fontSize: 16 }}>{match.team2}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Overall Standings Tab - Add Edit Points Option */}
        {activeTab === 'standings' && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "auto" }}>
            <div style={{ padding: 20, borderBottom: `1px solid ${C.border}`, background: C.surface }}>
              <h3 style={{ color: C.accent, fontSize: 18 }}>🏆 Overall Tournament Standings</h3>
              <p style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>All teams combined ranking (auto-calculated from match results)</p>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                  <th style={{ padding: 16, textAlign: "center", color: C.muted, width: 50 }}>#</th>
                  <th style={{ padding: 16, textAlign: "left", color: C.muted }}>Team</th>
                  <th style={{ padding: 16, textAlign: "center", color: C.muted }}>P</th><th style={{ padding: 16, textAlign: "center", color: C.muted }}>W</th>
                  <th style={{ padding: 16, textAlign: "center", color: C.muted }}>D</th><th style={{ padding: 16, textAlign: "center", color: C.muted }}>L</th>
                  <th style={{ padding: 16, textAlign: "center", color: C.muted }}>GF</th><th style={{ padding: 16, textAlign: "center", color: C.muted }}>GA</th>
                  <th style={{ padding: 16, textAlign: "center", color: C.muted }}>GD</th><th style={{ padding: 16, textAlign: "center", color: C.muted }}>Pts</th>
                 </tr>
              </thead>
              <tbody>
                {overallStandings.map((team, index) => (
                  <tr key={team.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: 16, textAlign: "center", fontWeight: "bold", color: C.text }}>{index + 1}</td>
                    <td style={{ padding: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 24 }}>{team.logo}</span><span style={{ color: C.text, fontWeight: "bold" }}>{team.name}</span></div></td>
                    <td style={{ padding: 16, textAlign: "center", color: C.text }}>{team.played}</td>
                    <td style={{ padding: 16, textAlign: "center", color: C.green }}>{team.wins}</td>
                    <td style={{ padding: 16, textAlign: "center", color: C.yellow }}>{team.draws}</td>
                    <td style={{ padding: 16, textAlign: "center", color: C.red }}>{team.losses}</td>
                    <td style={{ padding: 16, textAlign: "center", color: C.green }}>{team.goalsFor}</td>
                    <td style={{ padding: 16, textAlign: "center", color: C.red }}>{team.goalsAgainst}</td>
                    <td style={{ padding: 16, textAlign: "center", color: C.accent }}>{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                    <td style={{ padding: 16, textAlign: "center", color: C.yellow, fontWeight: "bold", fontSize: 18 }}>{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: 16, textAlign: "center", borderTop: `1px solid ${C.border}`, color: C.muted, fontSize: 12 }}>
              💡 Standings are automatically calculated from match results. Edit matches to update standings.
            </div>
          </div>
        )}

        {/* Group Standings Tab */}
        {activeTab === 'groups' && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(groupConfig.groups, 2)}, 1fr)`, gap: 24 }}>
            {Object.entries(groupStandings).map(([groupName, teams]) => (
              <div key={groupName} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "auto" }}>
                <div style={{ padding: 20, borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                  <h3 style={{ color: getRoundColor('group'), fontSize: 20 }}>Group {groupName}</h3>
                  <p style={{ color: C.muted, fontSize: 12 }}>Top {groupConfig.teamsAdvancing} advance to knockout</p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ padding: 12, textAlign: "left", color: C.muted }}>Team</th>
                    <th style={{ padding: 12, textAlign: "center", color: C.muted }}>P</th><th style={{ padding: 12, textAlign: "center", color: C.muted }}>W</th>
                    <th style={{ padding: 12, textAlign: "center", color: C.muted }}>D</th><th style={{ padding: 12, textAlign: "center", color: C.muted }}>L</th>
                    <th style={{ padding: 12, textAlign: "center", color: C.muted }}>GD</th><th style={{ padding: 12, textAlign: "center", color: C.muted }}>Pts</th>
                  </tr></thead>
                  <tbody>
                    {teams.map((team, idx) => (
                      <tr key={team.id} style={{ borderBottom: `1px solid ${C.border}`, background: idx < groupConfig.teamsAdvancing ? `${C.green}10` : 'transparent' }}>
                        <td style={{ padding: 12 }}><span>{team.logo}</span> <span style={{ color: C.text }}>{team.name}</span> {idx < groupConfig.teamsAdvancing && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 10, background: C.green, color: "#000", marginLeft: 8 }}>Qualified</span>}</td>
                        <td style={{ padding: 12, textAlign: "center", color: C.text }}>{team.played}</td>
                        <td style={{ padding: 12, textAlign: "center", color: C.green }}>{team.wins}</td>
                        <td style={{ padding: 12, textAlign: "center", color: C.yellow }}>{team.draws}</td>
                        <td style={{ padding: 12, textAlign: "center", color: C.red }}>{team.losses}</td>
                        <td style={{ padding: 12, textAlign: "center", color: C.accent }}>{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                        <td style={{ padding: 12, textAlign: "center", color: C.yellow, fontWeight: "bold" }}>{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Knockout Stage Tab */}
        {activeTab === 'knockout' && (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <h3 style={{ color: C.accent, fontSize: 18, marginBottom: 16 }}>🏆 Teams Qualified for Knockout Stage</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {advancingTeams.map((team, idx) => (
                  <span key={idx} style={{ padding: "8px 16px", background: C.surface, border: `1px solid ${team.color}`, borderRadius: 20, color: team.color, display: "flex", alignItems: "center", gap: 8 }}>{team.logo} {team.name}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Player Stats Tab */}
        {activeTab === 'stats' && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "auto" }}>
              <div style={{ padding: 20, borderBottom: `1px solid ${C.border}`, background: C.surface }}><h3 style={{ color: C.green, fontSize: 20 }}>⚡ Top Scorers</h3></div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th style={{ padding: 12, textAlign: "center", color: C.muted, width: 50 }}>#</th>
                  <th style={{ padding: 12, textAlign: "left", color: C.muted }}>Player</th>
                  <th style={{ padding: 12, textAlign: "center", color: C.muted }}>Team</th>
                  <th style={{ padding: 12, textAlign: "center", color: C.muted }}>Goals</th>
                </tr></thead>
                <tbody>
                  {topScorers.map((player, index) => (
                    <tr key={player._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: 12, textAlign: "center", fontWeight: "bold", color: C.text }}>{index + 1}</td>
                      <td style={{ padding: 12, color: C.text }}>{player.name} {player.isCaptain && '👑'}</td>
                      <td style={{ padding: 12, textAlign: "center", color: C.text }}>{player.teamName || 'Unassigned'}</td>
                      <td style={{ padding: 12, textAlign: "center", color: C.green, fontWeight: "bold", fontSize: 18 }}>{player.goals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "auto" }}>
              <div style={{ padding: 20, borderBottom: `1px solid ${C.border}`, background: C.surface }}><h3 style={{ color: C.accent, fontSize: 20 }}>🎯 Top Assisters</h3></div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th style={{ padding: 12, textAlign: "center", color: C.muted, width: 50 }}>#</th>
                  <th style={{ padding: 12, textAlign: "left", color: C.muted }}>Player</th>
                  <th style={{ padding: 12, textAlign: "center", color: C.muted }}>Team</th>
                  <th style={{ padding: 12, textAlign: "center", color: C.muted }}>Assists</th>
                </tr></thead>
                <tbody>
                  {topAssisters.map((player, index) => (
                    <tr key={player._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: 12, textAlign: "center", fontWeight: "bold", color: C.text }}>{index + 1}</td>
                      <td style={{ padding: 12, color: C.text }}>{player.name} {player.isCaptain && '👑'}</td>
                      <td style={{ padding: 12, textAlign: "center", color: C.text }}>{player.teamName || 'Unassigned'}</td>
                      <td style={{ padding: 12, textAlign: "center", color: C.accent, fontWeight: "bold", fontSize: 18 }}>{player.assists}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Match Modal */}
      {showEditModal && editingMatch && (
        <EditMatchModal
          match={editingMatch}
          onClose={() => { setShowEditModal(false); setEditingMatch(null); }}
          onSave={updateMatchScore}
        />
      )}

      {/* Group Manager Modal */}
      {showGroupManager && teams.length > 0 && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.95)", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", overflow: "auto",
        }}>
          <div style={{ maxWidth: 900, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <button onClick={() => setShowGroupManager(false)} style={{ padding: "8px 16px", background: C.red, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer" }}>Close</button>
            </div>
            <GroupManager teams={teams} groupConfig={groupConfig} onGroupsAssigned={handleGroupsAssigned} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsPage