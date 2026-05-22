'use client'
import React, { useState, useEffect } from 'react'

const C = {
  bg: "#06060f", surface: "#0c0c1d", card: "#101024", border: "#1c1c38",
  accent: "#00d4ff", green: "#00e676", red: "#ff3d6b", yellow: "#ffd740",
  text: "#e2e4f0", muted: "#4a4a6a",
}

const VENUES = [
  "Main Stadium",
  "Practice Ground", 
  "City Arena",
  "Sports Complex"
]

const ROUNDS = ["group", "quarter-final", "semi-final", "final"]

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

const AddFixture = ({ onFixtureAdded }) => {
  const [form, setForm] = useState({
    matchNumber: '',
    team1Id: '',
    team2Id: '',
    date: '',
    time: '',
    venue: VENUES[0],
    round: ROUNDS[0],
    status: 'upcoming'
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [availableTeams, setAvailableTeams] = useState([])
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
        setAvailableTeams(data.data)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
      setToast({ msg: "Failed to load teams", type: "error" })
    } finally {
      setLoadingTeams(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!form.matchNumber) {
      setToast({ msg: "Match number is required", type: "error" })
      return
    }
    if (!form.team1Id) {
      setToast({ msg: "Please select Team 1", type: "error" })
      return
    }
    if (!form.team2Id) {
      setToast({ msg: "Please select Team 2", type: "error" })
      return
    }
    if (form.team1Id === form.team2Id) {
      setToast({ msg: "Cannot schedule match with same team", type: "error" })
      return
    }
    if (!form.date) {
      setToast({ msg: "Please select date", type: "error" })
      return
    }
    if (!form.time) {
      setToast({ msg: "Please select time", type: "error" })
      return
    }

    setLoading(true)

    try {
      const team1 = availableTeams.find(t => t._id === form.team1Id)
      const team2 = availableTeams.find(t => t._id === form.team2Id)

      const fixtureData = {
        matchNumber: parseInt(form.matchNumber),
        team1: team1.name,
        team2: team2.name,
        team1Id: team1.teamId || form.team1Id,
        team2Id: team2.teamId || form.team2Id,
        date: form.date,
        time: form.time,
        venue: form.venue,
        round: form.round,
        status: form.status,
        score1: 0,
        score2: 0,
        winner: null
      }

      const response = await fetch('/api/fixtures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fixtureData),
      })

      const data = await response.json()

      if (data.success) {
        setToast({ msg: `Match ${form.matchNumber} scheduled successfully!`, type: "success" })
        if (onFixtureAdded) onFixtureAdded(data.data)
        
        // Reset form
        setForm({
          matchNumber: '',
          team1Id: '',
          team2Id: '',
          date: '',
          time: '',
          venue: VENUES[0],
          round: ROUNDS[0],
          status: 'upcoming'
        })
      } else {
        throw new Error(data.error || "Failed to add fixture")
      }
    } catch (error) {
      console.error('Error:', error)
      setToast({ msg: error.message || "Failed to add fixture", type: "error" })
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
        borderRadius: 20, padding: 28,
      }}>
        <h2 style={{ color: C.text, marginBottom: 20, fontSize: 24, fontFamily: "'Bebas Neue', sans-serif" }}>
          📅 Schedule New Match
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Match Number and Round */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
                Match Number *
              </label>
              <input
                type="number"
                placeholder="e.g., 1"
                value={form.matchNumber}
                onChange={e => setForm({...form, matchNumber: e.target.value})}
                style={{
                  width: "100%", padding: 10, background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text,
                }}
                required
              />
            </div>

            <div>
              <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
                Round
              </label>
              <select
                value={form.round}
                onChange={e => setForm({...form, round: e.target.value})}
                style={{
                  width: "100%", padding: 10, background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text, cursor: "pointer",
                }}
              >
                {ROUNDS.map(round => (
                  <option key={round} value={round}>{round.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Teams - Dynamic from Database */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
                Team 1 *
              </label>
              <select
                value={form.team1Id}
                onChange={e => setForm({...form, team1Id: e.target.value})}
                style={{
                  width: "100%", padding: 10, background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text, cursor: "pointer",
                }}
                required
              >
                <option value="">Select Team 1</option>
                {loadingTeams ? (
                  <option disabled>Loading teams...</option>
                ) : (
                  availableTeams.map(team => (
                    <option key={team._id} value={team._id}>
                      {team.logo || '⚽'} {team.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
                Team 2 *
              </label>
              <select
                value={form.team2Id}
                onChange={e => setForm({...form, team2Id: e.target.value})}
                style={{
                  width: "100%", padding: 10, background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text, cursor: "pointer",
                }}
                required
              >
                <option value="">Select Team 2</option>
                {loadingTeams ? (
                  <option disabled>Loading teams...</option>
                ) : (
                  availableTeams.map(team => (
                    <option key={team._id} value={team._id}>
                      {team.logo || '⚽'} {team.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
                Date *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
                style={{
                  width: "100%", padding: 10, background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text,
                }}
                required
              />
            </div>

            <div>
              <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
                Time *
              </label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm({...form, time: e.target.value})}
                style={{
                  width: "100%", padding: 10, background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.text,
                }}
                required
              />
            </div>
          </div>

          {/* Venue */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
              Venue
            </label>
            <select
              value={form.venue}
              onChange={e => setForm({...form, venue: e.target.value})}
              style={{
                width: "100%", padding: 10, background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.text, cursor: "pointer",
              }}
            >
              {VENUES.map(venue => (
                <option key={venue} value={venue}>{venue}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: C.text, display: "block", marginBottom: 5, fontSize: 14, fontWeight: 600 }}>
              Match Status
            </label>
            <select
              value={form.status}
              onChange={e => setForm({...form, status: e.target.value})}
              style={{
                width: "100%", padding: 10, background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.text, cursor: "pointer",
              }}
            >
              <option value="upcoming">📅 Upcoming</option>
              <option value="live">🔥 Live</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: 12, background: C.green,
              border: "none", borderRadius: 8, color: "#000",
              fontWeight: "bold", fontSize: 14, cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "⏳ Scheduling..." : "✓ Schedule Match"}
          </button>
        </form>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}

export default AddFixture