'use client'
import React, { useState, useEffect } from 'react'

const C = {
  bg: "#06060f", surface: "#0c0c1d", card: "#101024", border: "#1c1c38",
  accent: "#00d4ff", green: "#00e676", red: "#ff3d6b", yellow: "#ffd740",
  text: "#e2e4f0", muted: "#4a4a6a",
}

const TEAM_COLORS = [
  { name: "Blue", value: "#00d4ff" },
  { name: "Red", value: "#ff3d6b" },
  { name: "Green", value: "#00e676" },
  { name: "Yellow", value: "#ffd740" },
  { name: "Purple", value: "#c084fc" },
  { name: "Orange", value: "#fb923c" },
]

function Toast({ msg, type, onClose }) {
  React.useEffect(() => {
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

const AddTeam = ({ onTeamAdded, editingTeam, onCloseEdit }) => {
  const [form, setForm] = useState({
    name: '',
    shortName: '',
    color: TEAM_COLORS[0].value,
    logo: '⚽',
    captainId: '',
    captainName: ''
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [availablePlayers, setAvailablePlayers] = useState([])
  const [loadingPlayers, setLoadingPlayers] = useState(true)

  // If editing, populate form with team data
  useEffect(() => {
    if (editingTeam) {
      setForm({
        name: editingTeam.name || '',
        shortName: editingTeam.shortName || '',
        color: editingTeam.color || TEAM_COLORS[0].value,
        logo: editingTeam.logo || '⚽',
        captainId: editingTeam.captainId || '',
        captainName: editingTeam.captainName || ''
      })
    }
  }, [editingTeam])

  // Fetch available players (not assigned to any team)
  useEffect(() => {
    fetchAvailablePlayers()
  }, [])

  const fetchAvailablePlayers = async () => {
    try {
      const response = await fetch('/api/players')
      const data = await response.json()
      if (data.success) {
        // Filter players not assigned to any team
        const unassignedPlayers = data.data.filter(p => !p.teamId || p.teamId === '')
        setAvailablePlayers(unassignedPlayers)
      }
    } catch (error) {
      console.error('Error fetching players:', error)
    } finally {
      setLoadingPlayers(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.name || !form.shortName) {
      setToast({ msg: "Team name and short name are required", type: "error" })
      return
    }

    setLoading(true)

    try {
      const teamData = {
        name: form.name,
        shortName: form.shortName,
        color: form.color,
        logo: form.logo,
        captainId: form.captainId,
        captainName: form.captainName,
        teamId: form.name.toLowerCase().replace(/\s+/g, ''),
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      }

      const url = editingTeam ? `/api/teams?id=${editingTeam._id}` : '/api/teams'
      const method = editingTeam ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTeam ? { id: editingTeam._id, ...teamData } : teamData),
      })

      const data = await response.json()

      if (data.success) {
        // If captain is selected, update the player
        if (form.captainId) {
          await fetch(`/api/players`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              id: form.captainId, 
              teamId: teamData.teamId,
              teamName: form.name,
              isCaptain: true 
            }),
          })
        }

        setToast({ msg: editingTeam ? `${form.name} updated successfully!` : `${form.name} added successfully!`, type: "success" })
        
        if (onTeamAdded) onTeamAdded(data.data)
        
        if (!editingTeam) {
          setForm({
            name: '',
            shortName: '',
            color: TEAM_COLORS[0].value,
            logo: '⚽',
            captainId: '',
            captainName: ''
          })
        }
        
        if (onCloseEdit) onCloseEdit()
        fetchAvailablePlayers()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      setToast({ msg: error.message || "Failed to save team", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 20, padding: 28, maxHeight: "90vh", overflow: "auto",
      }}>
        <h2 style={{ color: C.text, marginBottom: 20, fontSize: 24, fontFamily: "'Bebas Neue', sans-serif" }}>
          {editingTeam ? "✏️ Edit Team" : "🏆 Add New Team"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Team Name */}
          <div style={{ marginBottom: 15 }}>
            <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
              Team Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Team Muhammad Bin Qasim"
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

          {/* Short Name */}
          <div style={{ marginBottom: 15 }}>
            <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
              Short Name *
            </label>
            <input
              type="text"
              placeholder="e.g., TMQ"
              value={form.shortName}
              onChange={e => setForm({...form, shortName: e.target.value.toUpperCase()})}
              style={{
                width: "100%", padding: 10, background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.text,
              }}
              required
            />
          </div>

          {/* Team Color & Logo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
                Team Color
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <select
                  value={form.color}
                  onChange={e => setForm({...form, color: e.target.value})}
                  style={{
                    flex: 1, padding: 10, background: C.surface,
                    border: `1px solid ${C.border}`, borderRadius: 8,
                    color: C.text, cursor: "pointer",
                  }}
                >
                  {TEAM_COLORS.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: form.color,
                  border: `1px solid ${C.border}`
                }} />
              </div>
            </div>

            <div>
              <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
                Team Logo
              </label>
              <input
                type="text"
                placeholder="Emoji (e.g., ⚽, 🏆, ⭐)"
                value={form.logo}
                onChange={e => setForm({...form, logo: e.target.value})}
                style={{
                  width: "100%", padding: 10, background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text, fontSize: 20,
                }}
              />
            </div>
          </div>

          {/* Team Captain Selection */}
          <div style={{ marginBottom: 15 }}>
            <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
              <span style={{ color: C.yellow }}>👑</span> Team Captain
            </label>
            <select
              value={form.captainId}
              onChange={e => {
                const playerId = e.target.value
                const selectedPlayer = availablePlayers.find(p => p._id === playerId)
                setForm({
                  ...form, 
                  captainId: playerId, 
                  captainName: selectedPlayer?.name || ''
                })
              }}
              style={{
                width: "100%", padding: 10, background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.text, cursor: "pointer",
              }}
            >
              <option value="">-- Select Captain --</option>
              {loadingPlayers ? (
                <option disabled>Loading players...</option>
              ) : (
                availablePlayers.map(player => (
                  <option key={player._id} value={player._id}>
                    {player.name} ({player.position}) - ⚽ {player.goals} goals, 🎯 {player.assists} assists
                  </option>
                ))
              )}
            </select>
            
            {form.captainName && (
              <div style={{ 
                marginTop: 10, 
                padding: 10, 
                background: `${C.yellow}22`,
                borderRadius: 8,
                color: C.yellow,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span>👑</span>
                <span>Captain: <strong>{form.captainName}</strong></span>
              </div>
            )}
            
            {availablePlayers.length === 0 && !loadingPlayers && (
              <div style={{ 
                marginTop: 10, 
                color: C.red, 
                fontSize: 12,
                padding: 8,
                background: `${C.red}22`,
                borderRadius: 6
              }}>
                ⚠️ No players available. Please add players first in the Players section.
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
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
              {loading ? "⏳ Saving..." : (editingTeam ? "✓ Update Team" : "✓ Add Team")}
            </button>
            
            {onCloseEdit && (
              <button
                type="button"
                onClick={onCloseEdit}
                style={{
                  flex: 1, padding: 12, background: C.red,
                  border: "none", borderRadius: 8, color: "#fff",
                  fontWeight: "bold", fontSize: 14, cursor: "pointer",
                }}
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}

export default AddTeam