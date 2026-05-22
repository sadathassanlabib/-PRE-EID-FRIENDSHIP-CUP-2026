'use client'
import React, { useState, useEffect } from 'react'

const C = {
  bg: "#06060f", surface: "#0c0c1d", card: "#101024", border: "#1c1c38",
  accent: "#00d4ff", green: "#00e676", red: "#ff3d6b", yellow: "#ffd740",
  text: "#e2e4f0", muted: "#4a4a6a",
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800)
    return () => clearTimeout(t)
  }, [onClose])
  const bg = type === "success" ? C.green : C.red
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: bg, color: "#000", padding: "11px 22px", borderRadius: 12,
      fontWeight: 700, fontSize: 13, boxShadow: `0 8px 32px ${bg}66`,
      animation: "slideUp .3s ease",
    }}>
      {type === "success" ? "✓ " : "✕ "}{msg}
    </div>
  )
}

function DeleteModal({ team, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.95)", zIndex: 1001,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 20, padding: 32, maxWidth: 450, width: "100%",
        textAlign: "center",
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: "50%",
          background: `${C.red}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <span style={{ fontSize: 40 }}>⚠️</span>
        </div>

        <h2 style={{ color: C.text, fontSize: 24, marginBottom: 12, fontFamily: "'Bebas Neue', sans-serif" }}>
          Delete Team?
        </h2>

        <p style={{ color: C.muted, fontSize: 14, marginBottom: 8 }}>
          Are you sure you want to delete
        </p>
        <p style={{ color: C.yellow, fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
          {team?.name}
        </p>

        <p style={{ color: C.muted, fontSize: 12, marginBottom: 24 }}>
          This will also remove all players and fixtures associated with this team!
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => onConfirm()}
            disabled={loading}
            style={{
              flex: 1, padding: 12, background: C.red,
              border: "none", borderRadius: 8, color: "#fff",
              fontWeight: "bold", fontSize: 14, cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "⏳ Deleting..." : "🗑️ Yes, Delete"}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: 12, background: C.surface,
              border: `1px solid ${C.border}`, borderRadius: 8,
              color: C.text, fontWeight: "bold", fontSize: 14, cursor: "pointer",
            }}
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const TeamsList = () => {
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [fixtures, setFixtures] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [deletingTeam, setDeletingTeam] = useState(null)

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      if (data.success) setTeams(data.data)
    } catch (error) {
      console.error('Error:', error)
      setToast({ msg: "Failed to load teams", type: "error" })
    }
  }

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players')
      const data = await response.json()
      if (data.success) setPlayers(data.data)
    } catch (error) {
      console.error('Error fetching players:', error)
    }
  }

  const fetchFixtures = async () => {
    try {
      const response = await fetch('/api/fixtures')
      const data = await response.json()
      if (data.success) setFixtures(data.data)
    } catch (error) {
      console.error('Error fetching fixtures:', error)
    }
  }

  useEffect(() => {
    Promise.all([fetchTeams(), fetchPlayers(), fetchFixtures()])
      .finally(() => setLoading(false))
  }, [])

  const deleteTeam = async (id) => {
    try {
      const response = await fetch(`/api/teams?id=${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        setToast({ msg: "Team deleted successfully!", type: "success" })
        fetchTeams()
        setDeletingTeam(null)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      setToast({ msg: "Failed to delete team", type: "error" })
    }
  }

  // Get players for a specific team
  const getTeamPlayers = (teamId, teamName) => {
    return players.filter(player => player.teamId === teamId || player.teamName === teamName)
  }

  // Get team captain from players
  const getTeamCaptain = (teamId, teamName) => {
    const teamPlayers = getTeamPlayers(teamId, teamName)
    const captain = teamPlayers.find(player => player.isCaptain === true)
    return captain ? captain.name : 'Not assigned'
  }

  // Get team stats from players
  const getTeamStats = (teamId, teamName) => {
    const teamPlayers = getTeamPlayers(teamId, teamName)
    const totalGoals = teamPlayers.reduce((sum, player) => sum + (player.goals || 0), 0)
    const totalAssists = teamPlayers.reduce((sum, player) => sum + (player.assists || 0), 0)
    return { totalGoals, totalAssists, squadSize: teamPlayers.length }
  }

  // Get team fixtures
  const getTeamFixtures = (teamName) => {
    return fixtures.filter(f => f.team1 === teamName || f.team2 === teamName)
  }

  // Get team performance
  const getTeamPerformance = (teamName) => {
    const teamFixtures = getTeamFixtures(teamName)
    let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0
    
    teamFixtures.forEach(fixture => {
      if (fixture.status === 'completed') {
        const isTeam1 = fixture.team1 === teamName
        const teamScore = isTeam1 ? fixture.score1 : fixture.score2
        const opponentScore = isTeam1 ? fixture.score2 : fixture.score1
        
        goalsFor += teamScore
        goalsAgainst += opponentScore
        
        if (teamScore > opponentScore) wins++
        else if (teamScore === opponentScore) draws++
        else losses++
      }
    })
    
    const points = (wins * 3) + draws
    const goalDifference = goalsFor - goalsAgainst
    
    return { wins, draws, losses, points, goalsFor, goalsAgainst, goalDifference, played: teamFixtures.length }
  }

  if (loading) return <div style={{ color: C.text, textAlign: "center", padding: 40 }}>Loading teams...</div>

  return (
    <>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
        gap: 20
      }}>
        {teams.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: C.muted }}>
            No teams added yet. Click "Add New Team" to create one.
          </div>
        ) : (
          teams.map((team) => {
            const teamPlayers = getTeamPlayers(team.teamId, team.name)
            const captain = getTeamCaptain(team.teamId, team.name)
            const stats = getTeamStats(team.teamId, team.name)
            const performance = getTeamPerformance(team.name)
            const teamFixtures = getTeamFixtures(team.name)
            const nextFixture = teamFixtures.find(f => f.status === 'upcoming')
            const lastFixture = teamFixtures.find(f => f.status === 'completed')
            
            return (
              <div key={team._id} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 16, overflow: "hidden",
              }}>
                {/* Team Header */}
                <div style={{
                  padding: 20, background: `${team.color}15`,
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    fontSize: 48, width: 60, height: 60,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: C.surface, borderRadius: 12,
                  }}>
                    {team.logo || '⚽'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: C.text, fontSize: 18, fontWeight: "bold" }}>
                      {team.name}
                    </h3>
                    <p style={{ color: team.color, fontSize: 12, fontWeight: "bold" }}>
                      {team.shortName}
                    </p>
                  </div>
                  <button
                    onClick={() => setDeletingTeam(team)}
                    style={{
                      padding: "8px 12px", background: `${C.red}22`,
                      border: "none", borderRadius: 8, color: C.red,
                      cursor: "pointer", fontSize: 12,
                    }}
                  >
                    🗑️
                  </button>
                </div>

                {/* Performance Stats */}
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 1, background: C.border,
                }}>
                  <div style={{ background: C.card, padding: 12, textAlign: "center" }}>
                    <div style={{ color: C.green, fontSize: 20, fontWeight: "bold" }}>
                      {performance.played}
                    </div>
                    <div style={{ color: C.muted, fontSize: 10 }}>Played</div>
                  </div>
                  <div style={{ background: C.card, padding: 12, textAlign: "center" }}>
                    <div style={{ color: C.green, fontSize: 20, fontWeight: "bold" }}>
                      {performance.wins}
                    </div>
                    <div style={{ color: C.muted, fontSize: 10 }}>Wins</div>
                  </div>
                  <div style={{ background: C.card, padding: 12, textAlign: "center" }}>
                    <div style={{ color: C.yellow, fontSize: 20, fontWeight: "bold" }}>
                      {performance.draws}
                    </div>
                    <div style={{ color: C.muted, fontSize: 10 }}>Draws</div>
                  </div>
                  <div style={{ background: C.card, padding: 12, textAlign: "center" }}>
                    <div style={{ color: C.accent, fontSize: 20, fontWeight: "bold" }}>
                      {performance.points}
                    </div>
                    <div style={{ color: C.muted, fontSize: 10 }}>Points</div>
                  </div>
                </div>

                {/* Team Details */}
                <div style={{ padding: 16 }}>
                  {/* Captain */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ color: C.muted, fontSize: 10 }}>TEAM CAPTAIN</div>
                    <div style={{ color: C.yellow, fontSize: 14, fontWeight: "bold" }}>
                      👑 {captain}
                    </div>
                  </div>

                  {/* Goal Difference */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ color: C.muted, fontSize: 10 }}>GOAL DIFFERENCE</div>
                    <div style={{ 
                      color: performance.goalDifference >= 0 ? C.green : C.red, 
                      fontSize: 16, fontWeight: "bold" 
                    }}>
                      {performance.goalsFor} - {performance.goalsAgainst} 
                      ({performance.goalDifference > 0 ? `+${performance.goalDifference}` : performance.goalDifference})
                    </div>
                  </div>

                  {/* Next Match */}
                  {nextFixture && (
                    <div style={{ marginBottom: 12, padding: 8, background: C.surface, borderRadius: 8 }}>
                      <div style={{ color: C.accent, fontSize: 10 }}>NEXT MATCH</div>
                      <div style={{ color: C.text, fontSize: 13 }}>
                        vs {nextFixture.team1 === team.name ? nextFixture.team2 : nextFixture.team1}
                      </div>
                      <div style={{ color: C.muted, fontSize: 11 }}>
                        {nextFixture.date} at {nextFixture.time}
                      </div>
                    </div>
                  )}

                  {/* Last Result */}
                  {lastFixture && (
                    <div style={{ marginBottom: 12, padding: 8, background: C.surface, borderRadius: 8 }}>
                      <div style={{ color: C.muted, fontSize: 10 }}>LAST MATCH</div>
                      <div style={{ color: C.text, fontSize: 13 }}>
                        vs {lastFixture.team1 === team.name ? lastFixture.team2 : lastFixture.team1}
                      </div>
                      <div style={{ 
                        color: lastFixture.winner === team.name ? C.green : (lastFixture.winner ? C.red : C.yellow),
                        fontWeight: "bold", fontSize: 14 
                      }}>
                        {lastFixture.score1} - {lastFixture.score2}
                        {lastFixture.winner === team.name ? ' ✓' : (lastFixture.winner ? ' ✗' : ' 🤝')}
                      </div>
                    </div>
                  )}

                  {/* Squad Info */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ color: C.muted, fontSize: 10 }}>SQUAD</div>
                    <div style={{ color: C.accent, fontSize: 13, fontWeight: "bold" }}>
                      {stats.squadSize} Players
                    </div>
                  </div>

                  {/* Stadium & Founded */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {team.stadium && (
                      <div>
                        <div style={{ color: C.muted, fontSize: 10 }}>STADIUM</div>
                        <div style={{ color: C.text, fontSize: 12 }}>{team.stadium}</div>
                      </div>
                    )}
                    {team.founded && (
                      <div>
                        <div style={{ color: C.muted, fontSize: 10 }}>FOUNDED</div>
                        <div style={{ color: C.text, fontSize: 12 }}>{team.founded}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Stats */}
                <div style={{
                  display: "flex", justifyContent: "space-around",
                  padding: 16, background: C.surface, borderTop: `1px solid ${C.border}`,
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: C.green, fontSize: 20, fontWeight: "bold" }}>
                      {stats.totalGoals}
                    </div>
                    <div style={{ color: C.muted, fontSize: 10 }}>Total Goals</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: C.accent, fontSize: 20, fontWeight: "bold" }}>
                      {stats.totalAssists}
                    </div>
                    <div style={{ color: C.muted, fontSize: 10 }}>Total Assists</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: C.yellow, fontSize: 20, fontWeight: "bold" }}>
                      {performance.goalsFor}
                    </div>
                    <div style={{ color: C.muted, fontSize: 10 }}>Goals Scored</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: C.red, fontSize: 20, fontWeight: "bold" }}>
                      {performance.goalsAgainst}
                    </div>
                    <div style={{ color: C.muted, fontSize: 10 }}>Goals Conceded</div>
                  </div>
                </div>

                {/* Players List Preview */}
                {teamPlayers.length > 0 && (
                  <div style={{
                    padding: 12, borderTop: `1px solid ${C.border}`,
                    background: `${C.surface}80`,
                  }}>
                    <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>SQUAD MEMBERS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {teamPlayers.slice(0, 6).map((player, idx) => (
                        <span key={idx} style={{
                          padding: "2px 8px", background: C.card,
                          borderRadius: 12, fontSize: 11, color: C.text,
                        }}>
                          {player.name} {player.isCaptain && '👑'} ({player.goals}g, {player.assists}a)
                        </span>
                      ))}
                      {teamPlayers.length > 6 && (
                        <span style={{
                          padding: "2px 8px", background: C.card,
                          borderRadius: 12, fontSize: 11, color: C.muted,
                        }}>
                          +{teamPlayers.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      {deletingTeam && (
        <DeleteModal
          team={deletingTeam}
          onClose={() => setDeletingTeam(null)}
          onConfirm={() => deleteTeam(deletingTeam._id)}
        />
      )}
    </>
  )
}

export default TeamsList