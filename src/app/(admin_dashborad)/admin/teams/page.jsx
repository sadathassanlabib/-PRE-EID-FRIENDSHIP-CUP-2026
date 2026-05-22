'use client'
import React, { useState, useEffect } from 'react'
import AddTeam from '@/app/components/addTeam'

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

function DeleteTeamModal({ team, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.95)", zIndex: 2000,
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
          This will also remove all players associated with this team!
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={async () => {
              setLoading(true)
              await onConfirm()
              setLoading(false)
            }}
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

function TeamPlayersModal({ team, players, onClose }) {
  const teamPlayers = players.filter(p => p.teamId === team.teamId || p.teamName === team.name)

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.95)", zIndex: 2000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", overflow: "auto",
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 20, padding: 28, maxWidth: 600, width: "100%",
        maxHeight: "80vh", overflow: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: C.text, fontSize: 24, fontFamily: "'Bebas Neue', sans-serif" }}>
            {team.logo || '⚽'} {team.name} - Players
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px", background: C.red,
              border: "none", borderRadius: 8, color: "#fff",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        {teamPlayers.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: C.muted }}>
            No players assigned to this team yet.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: 12, textAlign: "left", color: C.muted }}>Player</th>
                <th style={{ padding: 12, textAlign: "left", color: C.muted }}>Position</th>
                <th style={{ padding: 12, textAlign: "center", color: C.muted }}>Goals</th>
                <th style={{ padding: 12, textAlign: "center", color: C.muted }}>Assists</th>
                <th style={{ padding: 12, textAlign: "center", color: C.muted }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {teamPlayers.map(player => (
                <tr key={player._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: 12, color: C.text }}>
                    {player.name}
                  </td>
                  <td style={{ padding: 12, color: C.text }}>
                    {player.position}
                  </td>
                  <td style={{ padding: 12, textAlign: "center", color: C.green, fontWeight: "bold" }}>
                    {player.goals || 0}
                  </td>
                  <td style={{ padding: 12, textAlign: "center", color: C.accent, fontWeight: "bold" }}>
                    {player.assists || 0}
                  </td>
                  <td style={{ padding: 12, textAlign: "center" }}>
                    {player.isCaptain ? (
                      <span style={{ color: C.yellow }}>👑 Captain</span>
                    ) : (
                      <span style={{ color: C.muted }}>Player</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: C.surface }}>
                <td style={{ padding: 12, fontWeight: "bold", color: C.text }}>Total</td>
                <td style={{ padding: 12 }}></td>
                <td style={{ padding: 12, textAlign: "center", fontWeight: "bold", color: C.green }}>
                  {teamPlayers.reduce((sum, p) => sum + (p.goals || 0), 0)}
                </td>
                <td style={{ padding: 12, textAlign: "center", fontWeight: "bold", color: C.accent }}>
                  {teamPlayers.reduce((sum, p) => sum + (p.assists || 0), 0)}
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {teamPlayers.filter(p => p.isCaptain).length} Captain
                </td>
               </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  )
}

const AdminTeamsPage = () => {
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [deletingTeam, setDeletingTeam] = useState(null)
  const [editingTeam, setEditingTeam] = useState(null)
  const [viewingPlayers, setViewingPlayers] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      if (data.success) setTeams(data.data)
    } catch (error) {
      console.error('Error:', error)
      setToast({ msg: "Failed to load teams", type: "error" })
    } finally {
      setLoading(false)
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

  useEffect(() => {
    Promise.all([fetchTeams(), fetchPlayers()])
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

  const getTeamPlayers = (team) => {
    return players.filter(p => p.teamId === team.teamId || p.teamName === team.name)
  }

  const getTeamStats = (team) => {
    const teamPlayers = getTeamPlayers(team)
    const totalGoals = teamPlayers.reduce((sum, p) => sum + (p.goals || 0), 0)
    const totalAssists = teamPlayers.reduce((sum, p) => sum + (p.assists || 0), 0)
    const captain = teamPlayers.find(p => p.isCaptain === true)
    return { totalGoals, totalAssists, squadSize: teamPlayers.length, captain: captain?.name }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.text, fontSize: 18 }}>Loading teams...</div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg, padding: "32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <h1 style={{ color: C.text, fontSize: 28, fontFamily: "'Bebas Neue', sans-serif", marginBottom: 8 }}>
                🏆 Teams Management
              </h1>
              <p style={{ color: C.muted }}>Manage all teams, view players, and update team information</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "12px 24px", background: C.green,
                border: "none", borderRadius: 8, color: "#000",
                fontWeight: "bold", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              ➕ Add New Team
            </button>
          </div>

          {/* Teams Grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: 20
          }}>
            {teams.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: C.muted }}>
                No teams added yet. Click "Add New Team" to create one.
              </div>
            ) : (
              teams.map((team) => {
                const stats = getTeamStats(team)
                
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
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setEditingTeam(team)}
                          style={{
                            padding: "8px 12px", background: `${C.accent}22`,
                            border: "none", borderRadius: 8, color: C.accent,
                            cursor: "pointer", fontSize: 12,
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeletingTeam(team)}
                          style={{
                            padding: "8px 12px", background: `${C.red}22`,
                            border: "none", borderRadius: 8, color: C.red,
                            cursor: "pointer", fontSize: 12,
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>

                    {/* Team Info */}
                    <div style={{ padding: 16 }}>
                      {/* Captain */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ color: C.muted, fontSize: 10 }}>TEAM CAPTAIN</div>
                        <div style={{ color: C.yellow, fontSize: 14, fontWeight: "bold" }}>
                          👑 {stats.captain || 'Not assigned'}
                        </div>
                      </div>

                      {/* Coach */}
                      {team.coach && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ color: C.muted, fontSize: 10 }}>HEAD COACH</div>
                          <div style={{ color: C.text, fontSize: 13 }}>{team.coach}</div>
                        </div>
                      )}

                      {/* Squad Info */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ color: C.muted, fontSize: 10 }}>SQUAD</div>
                        <div style={{ color: C.accent, fontSize: 13, fontWeight: "bold" }}>
                          {stats.squadSize} Players
                        </div>
                      </div>

                      {/* Stadium & Location */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        {team.stadium && (
                          <div>
                            <div style={{ color: C.muted, fontSize: 10 }}>STADIUM</div>
                            <div style={{ color: C.text, fontSize: 12 }}>{team.stadium}</div>
                          </div>
                        )}
                        {team.city && (
                          <div>
                            <div style={{ color: C.muted, fontSize: 10 }}>LOCATION</div>
                            <div style={{ color: C.text, fontSize: 12 }}>{team.city}, {team.country}</div>
                          </div>
                        )}
                      </div>

                      {/* View Players Button */}
                      <button
                        onClick={() => setViewingPlayers(team)}
                        style={{
                          width: "100%", padding: 10, background: C.surface,
                          border: `1px solid ${C.border}`, borderRadius: 8,
                          color: C.text, cursor: "pointer", marginTop: 8,
                        }}
                      >
                        👥 View All Players ({stats.squadSize})
                      </button>
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
                          {team.wins || 0}
                        </div>
                        <div style={{ color: C.muted, fontSize: 10 }}>Wins</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: C.accent, fontSize: 20, fontWeight: "bold" }}>
                          {team.points || 0}
                        </div>
                        <div style={{ color: C.muted, fontSize: 10 }}>Points</div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Add Team Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.95)", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", overflow: "auto",
        }}>
          <AddTeam
            onTeamAdded={() => {
              fetchTeams()
              fetchPlayers()
              setShowAddModal(false)
            }}
            onCloseEdit={() => setShowAddModal(false)}
          />
        </div>
      )}

      {/* Edit Team Modal */}
      {editingTeam && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.95)", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", overflow: "auto",
        }}>
          <AddTeam
            editingTeam={editingTeam}
            onTeamAdded={() => {
              fetchTeams()
              fetchPlayers()
              setEditingTeam(null)
            }}
            onCloseEdit={() => setEditingTeam(null)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTeam && (
        <DeleteTeamModal
          team={deletingTeam}
          onClose={() => setDeletingTeam(null)}
          onConfirm={() => deleteTeam(deletingTeam._id)}
        />
      )}

      {/* View Players Modal */}
      {viewingPlayers && (
        <TeamPlayersModal
          team={viewingPlayers}
          players={players}
          onClose={() => setViewingPlayers(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}

export default AdminTeamsPage