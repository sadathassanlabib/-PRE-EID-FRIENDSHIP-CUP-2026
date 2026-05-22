'use client'
import React, { useState, useEffect } from 'react'

const C = {
  bg: "#06060f", surface: "#0c0c1d", card: "#101024", border: "#1c1c38",
  accent: "#00d4ff", green: "#00e676", red: "#ff3d6b", yellow: "#ffd740",
  text: "#e2e4f0", muted: "#4a4a6a",
}

const CAT = {
  A: { fg: "#c084fc", bg: "#2e1065" },
  B: { fg: "#38bdf8", bg: "#0c2a3e" },
  C: { fg: "#fb923c", bg: "#431407" },
  D: { fg: "#4ade80", bg: "#052e16" },
}

const POS_ICON = {
  Striker: "⚡", Midfielder: "🔄", Defender: "🛡️", Goalkeeper: "🧤",
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

// Delete Modal Component
function DeleteModal({ player, onClose, onConfirm }) {
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

        <h2 style={{ color: C.text, fontSize: 24, marginBottom: 12 }}>
          Delete Player?
        </h2>

        <p style={{ color: C.muted, fontSize: 14, marginBottom: 8 }}>
          Are you sure you want to delete
        </p>
        <p style={{ color: C.yellow, fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
          {player?.name}
        </p>

        <p style={{ color: C.muted, fontSize: 12, marginBottom: 24 }}>
          This action cannot be undone. All player data will be permanently removed.
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

// Edit Modal Component with Dynamic Teams
function EditModal({ player, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: player?.name || '',
    position: player?.position || 'Striker',
    category: player?.category || 'A',
    teamId: player?.teamId || '',
    teamName: player?.teamName || '',
    goals: player?.goals || 0,
    assists: player?.assists || 0,
    isCaptain: player?.isCaptain || false,
  })
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState([])
  const [loadingTeams, setLoadingTeams] = useState(true)

  // Fetch teams from database
  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      if (data.success) {
        setTeams(data.data)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoadingTeams(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const selectedTeam = teams.find(t => t._id === form.teamId)
      
      const updateData = {
        name: form.name,
        position: form.position,
        category: form.category,
        teamId: selectedTeam?.teamId || form.teamId,
        teamName: selectedTeam?.name || null,
        goals: Number(form.goals),
        assists: Number(form.assists),
        isCaptain: form.isCaptain,
      }
      
      await onUpdate(player._id, updateData)
      onClose()
    } catch (error) {
      console.error('Error updating:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.95)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", overflow: "auto",
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 20, padding: 28, maxWidth: 500, width: "100%",
        maxHeight: "90vh", overflow: "auto",
      }}>
        <h2 style={{ color: C.text, marginBottom: 20, fontSize: 24, fontFamily: "'Bebas Neue', sans-serif" }}>
          ✏️ Edit Player
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: 15 }}>
            <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
              Player Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              style={{
                width: "100%", padding: 10, background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.text,
              }}
              required
            />
          </div>

          {/* Position */}
          <div style={{ marginBottom: 15 }}>
            <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
              Position
            </label>
            <select
              value={form.position}
              onChange={e => setForm({...form, position: e.target.value})}
              style={{
                width: "100%", padding: 10, background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.text, cursor: "pointer",
              }}
            >
              <option value="Striker">⚡ Striker</option>
              <option value="Midfielder">🔄 Midfielder</option>
              <option value="Defender">🛡️ Defender</option>
              <option value="Goalkeeper">🧤 Goalkeeper</option>
            </select>
          </div>

          {/* Category */}
          <div style={{ marginBottom: 15 }}>
            <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
              Category
            </label>
            <select
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
              style={{
                width: "100%", padding: 10, background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.text, cursor: "pointer",
              }}
            >
              <option value="A">Category A</option>
              <option value="B">Category B</option>
              <option value="C">Category C</option>
              <option value="D">Category D</option>
            </select>
          </div>

          {/* Team - Dynamic from Database */}
          <div style={{ marginBottom: 15 }}>
            <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
              Team
            </label>
            <select
              value={form.teamId}
              onChange={async (e) => {
                const teamId = e.target.value
                const selectedTeam = teams.find(t => t._id === teamId)
                setForm({...form, teamId, teamName: selectedTeam?.name || ''})
                
                // If this player is being marked as captain, handle captain change
                if (form.isCaptain && selectedTeam) {
                  const response = await fetch(`/api/players?teamId=${selectedTeam.teamId}`)
                  const data = await response.json()
                  const currentCaptain = data.data?.find(p => p.isCaptain === true && p._id !== player._id)
                  
                  if (currentCaptain) {
                    if (confirm(`${currentCaptain.name} is currently captain. Make ${form.name} captain instead?`)) {
                      await fetch('/api/players/update-captain', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          teamId: selectedTeam.teamId, 
                          oldCaptainId: currentCaptain._id,
                          newCaptainId: player._id 
                        })
                      })
                    } else {
                      setForm({...form, teamId, teamName: selectedTeam?.name || '', isCaptain: false})
                    }
                  }
                }
              }}
              style={{
                width: "100%", padding: 10, background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.text, cursor: "pointer",
              }}
            >
              <option value="">— Unassigned —</option>
              {loadingTeams ? (
                <option disabled>Loading teams...</option>
              ) : (
                teams.map(team => (
                  <option key={team._id} value={team._id}>
                    {team.logo || '⚽'} {team.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Goals & Assists */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
                Goals
              </label>
              <input
                type="number"
                min="0"
                value={form.goals}
                onChange={e => setForm({...form, goals: parseInt(e.target.value) || 0})}
                style={{
                  width: "100%", padding: 10, background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text,
                }}
              />
            </div>
            <div>
              <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
                Assists
              </label>
              <input
                type="number"
                min="0"
                value={form.assists}
                onChange={e => setForm({...form, assists: parseInt(e.target.value) || 0})}
                style={{
                  width: "100%", padding: 10, background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text,
                }}
              />
            </div>
          </div>

          {/* Captain Checkbox */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: C.text, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.isCaptain}
                onChange={e => setForm({...form, isCaptain: e.target.checked})}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
              <span>👑 Team Captain</span>
            </label>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, padding: 12, background: C.green,
                border: "none", borderRadius: 8, color: "#000",
                fontWeight: "bold", fontSize: 14, cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "⏳ Updating..." : "✓ Update Player"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1, padding: 12, background: C.red,
                border: "none", borderRadius: 8, color: "#fff",
                fontWeight: "bold", fontSize: 14, cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main PlayersList Component
const PlayersList = () => {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [deletingPlayer, setDeletingPlayer] = useState(null)

  // Fetch all players
  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players')
      const data = await response.json()
      if (data.success) {
        setPlayers(data.data)
      }
    } catch (error) {
      console.error('Error fetching players:', error)
      setToast({ msg: "Failed to load players", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  // Fetch teams
  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      if (data.success) {
        setTeams(data.data)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  useEffect(() => {
    Promise.all([fetchPlayers(), fetchTeams()])
  }, [])

  // Delete player
  const deletePlayer = async (id, name) => {
    try {
      const response = await fetch(`/api/players?id=${id}`, { method: 'DELETE' })
      const data = await response.json()
      
      if (data.success) {
        setToast({ msg: `${name} deleted successfully!`, type: "success" })
        fetchPlayers()
        setDeletingPlayer(null)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error deleting:', error)
      setToast({ msg: "Failed to delete player", type: "error" })
    }
  }

  // Update player
  const updatePlayer = async (id, updatedData) => {
    try {
      const response = await fetch('/api/players', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData }),
      })
      const data = await response.json()
      
      if (data.success) {
        setToast({ msg: "Player updated successfully!", type: "success" })
        fetchPlayers()
        return true
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error updating:', error)
      setToast({ msg: "Failed to update player", type: "error" })
      throw error
    }
  }

  // Get team name by ID
  const getTeamName = (teamId) => {
    const team = teams.find(t => t._id === teamId || t.teamId === teamId)
    return team ? team.name : 'Unassigned'
  }

  // Get team color
  const getTeamColor = (teamId) => {
    const team = teams.find(t => t._id === teamId || t.teamId === teamId)
    return team ? team.color : C.muted
  }

  // Get category color
  const getCategoryStyle = (category) => {
    const cat = CAT[category] || CAT.A
    return { color: cat.fg, background: cat.bg }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: C.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ color: C.text, fontSize: 18 }}>Loading players...</div>
      </div>
    )
  }

  return (
    <>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 20, overflow: "auto",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <th style={{ padding: 16, textAlign: "left", color: C.muted }}>Player</th>
              <th style={{ padding: 16, textAlign: "left", color: C.muted }}>Position</th>
              <th style={{ padding: 16, textAlign: "left", color: C.muted }}>Category</th>
              <th style={{ padding: 16, textAlign: "left", color: C.muted }}>Team</th>
              <th style={{ padding: 16, textAlign: "center", color: C.muted }}>Goals</th>
              <th style={{ padding: 16, textAlign: "center", color: C.muted }}>Assists</th>
              <th style={{ padding: 16, textAlign: "center", color: C.muted }}>Actions</th>
             </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: 40, textAlign: "center", color: C.muted }}>
                  No players yet. Add your first player!
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <tr key={player._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {player.isCaptain && <span style={{ fontSize: 18 }}>👑</span>}
                      <span style={{ color: C.text, fontWeight: 600 }}>{player.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 16, color: C.text }}>
                    {POS_ICON[player.position]} {player.position}
                  </td>
                  <td style={{ padding: 16 }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 12,
                      fontWeight: "bold", ...getCategoryStyle(player.category),
                    }}>
                      Cat {player.category}
                    </span>
                  </td>
                  <td style={{ padding: 16 }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 12,
                      fontWeight: "bold", color: getTeamColor(player.teamId),
                      background: `${getTeamColor(player.teamId)}22`,
                    }}>
                      {getTeamName(player.teamId)}
                    </span>
                  </td>
                  <td style={{ padding: 16, textAlign: "center", color: C.green, fontWeight: "bold" }}>
                    {player.goals}
                  </td>
                  <td style={{ padding: 16, textAlign: "center", color: C.accent, fontWeight: "bold" }}>
                    {player.assists}
                  </td>
                  <td style={{ padding: 16, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <button
                        onClick={() => setEditingPlayer(player)}
                        style={{
                          padding: "6px 12px", background: C.accent,
                          border: "none", borderRadius: 6,
                          color: "#000", fontWeight: "bold", cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeletingPlayer(player)}
                        style={{
                          padding: "6px 12px", background: C.red,
                          border: "none", borderRadius: 6,
                          color: "#fff", fontWeight: "bold", cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      {editingPlayer && (
        <EditModal
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onUpdate={updatePlayer}
        />
      )}
      
      {deletingPlayer && (
        <DeleteModal
          player={deletingPlayer}
          onClose={() => setDeletingPlayer(null)}
          onConfirm={() => deletePlayer(deletingPlayer._id, deletingPlayer.name)}
        />
      )}
    </>
  )
}

export default PlayersList