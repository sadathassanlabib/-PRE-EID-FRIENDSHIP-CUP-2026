'use client'
import React, { useState, useEffect } from 'react'

const C = {
  bg: "#06060f", surface: "#0c0c1d", card: "#101024", border: "#1c1c38",
  accent: "#00d4ff", green: "#00e676", red: "#ff3d6b", yellow: "#ffd740",
  text: "#e2e4f0", muted: "#4a4a6a",
}

const FRIENDSHIP_TEAMS = [
  { _id: "team1", name: "Team Muhammad Bin Qasim", color: "#00d4ff" },
  { _id: "team2", name: "Team Badr 313", color: "#ff3d6b" },
  { _id: "team3", name: "Mohiesurer Bagh", color: "#00e676" },
  { _id: "team4", name: "Team Khalid Bin Walid", color: "#ffd740" },
  { _id: "team5", name: "Team Sultan Salahuddin", color: "#c084fc" },
  { _id: "team6", name: "Fatihler Sultani", color: "#fb923c" },
]

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

/* ══════════════════════════════════════════════════════════
   DELETE CONFIRMATION MODAL
══════════════════════════════════════════════════════════ */
function DeleteModal({ fixture, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

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
        {/* Warning Icon */}
        <div style={{
          width: 70, height: 70, borderRadius: "50%",
          background: C.redGlow || `${C.red}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <span style={{ fontSize: 40 }}>⚠️</span>
        </div>

        {/* Title */}
        <h2 style={{
          color: C.text, fontSize: 24, marginBottom: 12,
          fontFamily: "'Bebas Neue', sans-serif",
        }}>
          Delete Match?
        </h2>

        {/* Message */}
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 8 }}>
          Are you sure you want to delete
        </p>
        <p style={{
          color: C.yellow, fontSize: 16, fontWeight: "bold",
          marginBottom: 10,
        }}>
          Match #{fixture?.matchNumber}
        </p>
        <p style={{
          color: C.text, fontSize: 14,
          marginBottom: 20,
        }}>
          {fixture?.team1} vs {fixture?.team2}
        </p>

        <p style={{ color: C.muted, fontSize: 12, marginBottom: 24 }}>
          This action cannot be undone. All match data will be permanently removed.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              flex: 1, padding: 12, background: C.red,
              border: "none", borderRadius: 8, color: "#fff",
              fontWeight: "bold", fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "⏳ Deleting..." : "🗑️ Yes, Delete"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1, padding: 12, background: C.surface,
              border: `1px solid ${C.border}`, borderRadius: 8,
              color: C.text, fontWeight: "bold", fontSize: 14,
              cursor: "pointer", opacity: loading ? 0.7 : 1,
            }}
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   UPDATE SCORE MODAL
══════════════════════════════════════════════════════════ */
function UpdateScoreModal({ fixture, onClose, onUpdate }) {
  const [score1, setScore1] = useState(fixture.score1 || 0)
  const [score2, setScore2] = useState(fixture.score2 || 0)
  const [status, setStatus] = useState(fixture.status || 'upcoming')
  const [penaltyShootout, setPenaltyShootout] = useState(fixture.penaltyShootout || false)
  const [penaltyScore1, setPenaltyScore1] = useState(fixture.penaltyScore1 || 0)
  const [penaltyScore2, setPenaltyScore2] = useState(fixture.penaltyScore2 || 0)
  const [loading, setLoading] = useState(false)

  const calculateResult = () => {
    if (status !== 'completed') return null
    
    if (score1 === score2) {
      if (penaltyShootout) {
        return penaltyScore1 > penaltyScore2 ? `${fixture.team1} wins on penalties` : `${fixture.team2} wins on penalties`
      }
      return 'Match Drawn'
    }
    return score1 > score2 ? `${fixture.team1} wins` : `${fixture.team2} wins`
  }

  const getWinner = () => {
    if (status !== 'completed') return null
    
    if (score1 === score2) {
      if (penaltyShootout) {
        return penaltyScore1 > penaltyScore2 ? fixture.team1 : fixture.team2
      }
      return null
    }
    return score1 > score2 ? fixture.team1 : fixture.team2
  }

  const getWinnerId = () => {
    if (status !== 'completed') return null
    
    if (score1 === score2) {
      if (penaltyShootout) {
        return penaltyScore1 > penaltyScore2 ? fixture.team1Id : fixture.team2Id
      }
      return null
    }
    return score1 > score2 ? fixture.team1Id : fixture.team2Id
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const winner = getWinner()
      const winnerId = getWinnerId()
      const result = calculateResult()
      
      const updateData = {
        score1,
        score2,
        status,
        winner,
        winnerId,
        result,
        penaltyShootout: status === 'completed' && score1 === score2 ? penaltyShootout : false,
        penaltyScore1: status === 'completed' && score1 === score2 ? penaltyScore1 : 0,
        penaltyScore2: status === 'completed' && score1 === score2 ? penaltyScore2 : 0,
        updatedAt: new Date()
      }
      
      await onUpdate(fixture._id, updateData)
      onClose()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const result = calculateResult()

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.95)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", overflow: "auto",
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 20, padding: 32, maxWidth: 550, width: "100%",
        maxHeight: "90vh", overflow: "auto",
      }}>
        <h2 style={{ color: C.text, marginBottom: 20, fontSize: 24, fontFamily: "'Bebas Neue', sans-serif" }}>
          ⚽ Update Match Result
        </h2>
        
        <div style={{ 
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 30, padding: "20px 0", borderBottom: `1px solid ${C.border}`
        }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ color: C.text, fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
              {fixture.team1}
            </div>
            <input
              type="number"
              min="0"
              value={score1}
              onChange={e => setScore1(parseInt(e.target.value) || 0)}
              style={{
                width: 100, padding: 15, textAlign: "center", background: C.surface,
                border: `2px solid ${C.border}`, borderRadius: 12, color: C.text,
                fontSize: 28, fontWeight: "bold",
              }}
            />
          </div>
          
          <div style={{ fontSize: 24, fontWeight: "bold", color: C.accent, padding: "0 20px" }}>
            VS
          </div>
          
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ color: C.text, fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
              {fixture.team2}
            </div>
            <input
              type="number"
              min="0"
              value={score2}
              onChange={e => setScore2(parseInt(e.target.value) || 0)}
              style={{
                width: 100, padding: 15, textAlign: "center", background: C.surface,
                border: `2px solid ${C.border}`, borderRadius: 12, color: C.text,
                fontSize: 28, fontWeight: "bold",
              }}
            />
          </div>
        </div>

        {score1 === score2 && score1 > 0 && (
          <div style={{
            marginBottom: 20, padding: 20, background: C.surface,
            borderRadius: 12, border: `1px solid ${C.yellow}33`
          }}>
            <label style={{
              display: "flex", alignItems: "center", gap: 10,
              color: C.yellow, marginBottom: 15, cursor: "pointer"
            }}>
              <input
                type="checkbox"
                checked={penaltyShootout}
                onChange={e => setPenaltyShootout(e.target.checked)}
                style={{ width: 20, height: 20, cursor: "pointer" }}
              />
              <span style={{ fontWeight: "bold" }}>🎯 Penalty Shootout</span>
            </label>

            {penaltyShootout && (
              <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 15 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: C.text, fontSize: 12, marginBottom: 5 }}>Penalty Goals</div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={penaltyScore1}
                    onChange={e => setPenaltyScore1(parseInt(e.target.value) || 0)}
                    style={{
                      width: 80, padding: 10, textAlign: "center", background: C.card,
                      border: `1px solid ${C.yellow}`, borderRadius: 8, color: C.yellow,
                      fontSize: 20, fontWeight: "bold",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: C.text, fontSize: 12, marginBottom: 5 }}>Penalty Goals</div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={penaltyScore2}
                    onChange={e => setPenaltyScore2(parseInt(e.target.value) || 0)}
                    style={{
                      width: 80, padding: 10, textAlign: "center", background: C.card,
                      border: `1px solid ${C.yellow}`, borderRadius: 8, color: C.yellow,
                      fontSize: 20, fontWeight: "bold",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: C.text, display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Match Status
          </label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            style={{
              width: "100%", padding: 12, background: C.surface,
              border: `1px solid ${C.border}`, borderRadius: 8, color: C.text,
              cursor: "pointer", fontSize: 14,
            }}
          >
            <option value="upcoming">📅 Upcoming</option>
            <option value="live">🔥 Live</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        {status === 'completed' && (
          <div style={{
            marginBottom: 20, padding: 15, background: C.surface,
            borderRadius: 10, textAlign: "center", border: `1px solid ${C.green}33`
          }}>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 5 }}>Match Result</div>
            <div style={{ color: result?.includes('wins') ? C.green : (result === 'Match Drawn' ? C.yellow : C.text), fontWeight: "bold", fontSize: 16 }}>
              {result || 'Not decided yet'}
            </div>
            {penaltyShootout && score1 === score2 && (
              <div style={{ color: C.yellow, fontSize: 12, marginTop: 5 }}>
                Penalty: {penaltyScore1} - {penaltyScore2}
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1, padding: 14, background: C.green,
              border: "none", borderRadius: 10, color: "#000",
              fontWeight: "bold", fontSize: 14, cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "⏳ Saving..." : "💾 Save Result"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1, padding: 14, background: C.red,
              border: "none", borderRadius: 10, color: "#fff",
              fontWeight: "bold", fontSize: 14, cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   FIXTURES LIST COMPONENT
══════════════════════════════════════════════════════════ */
const FixturesList = () => {
  const [fixtures, setFixtures] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [updatingFixture, setUpdatingFixture] = useState(null)
  const [deletingFixture, setDeletingFixture] = useState(null)

  const fetchFixtures = async () => {
    try {
      const response = await fetch('/api/fixtures')
      const data = await response.json()
      if (data.success) setFixtures(data.data)
    } catch (error) {
      console.error('Error:', error)
      setToast({ msg: "Failed to load fixtures", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFixtures()
  }, [])

  const updateFixture = async (id, updateData) => {
    try {
      const response = await fetch('/api/fixtures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData }),
      })
      const data = await response.json()
      if (data.success) {
        setToast({ msg: "Fixture updated successfully!", type: "success" })
        fetchFixtures()
        return true
      }
    } catch (error) {
      console.error('Error:', error)
      setToast({ msg: "Failed to update fixture", type: "error" })
      return false
    }
  }

  const deleteFixture = async (id) => {
    try {
      const response = await fetch(`/api/fixtures?id=${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        setToast({ msg: "Fixture deleted successfully!", type: "success" })
        fetchFixtures()
        setDeletingFixture(null)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      setToast({ msg: "Failed to delete fixture", type: "error" })
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return C.yellow
      case 'live': return C.green
      case 'completed': return C.accent
      default: return C.muted
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'upcoming': return '📅 Upcoming'
      case 'live': return '🔥 Live'
      case 'completed': return '✅ Completed'
      default: return status
    }
  }

  if (loading) return <div style={{ color: C.text, textAlign: "center", padding: 40 }}>Loading fixtures...</div>

  return (
    <>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <th style={{ padding: 16, textAlign: "left", color: C.muted }}>Match</th>
              <th style={{ padding: 16, textAlign: "left", color: C.muted }}>Teams</th>
              <th style={{ padding: 16, textAlign: "left", color: C.muted }}>Date & Time</th>
              <th style={{ padding: 16, textAlign: "left", color: C.muted }}>Venue</th>
              <th style={{ padding: 16, textAlign: "center", color: C.muted }}>Score</th>
              <th style={{ padding: 16, textAlign: "center", color: C.muted }}>Result</th>
              <th style={{ padding: 16, textAlign: "center", color: C.muted }}>Status</th>
              <th style={{ padding: 16, textAlign: "center", color: C.muted }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fixtures.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: 60, textAlign: "center", color: C.muted }}>
                  No fixtures scheduled yet. Click "Schedule New Match" to add one.
                </td>
              </tr>
            ) : (
              fixtures.map((fixture) => (
                <tr key={fixture._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: 16, color: C.text, fontWeight: "bold" }}>
                    #{fixture.matchNumber}
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                      {fixture.round?.toUpperCase()}
                    </div>
                  </td>
                  <td style={{ padding: 16 }}>
                    <div style={{ fontWeight: "bold", color: C.text }}>
                      {fixture.team1} vs {fixture.team2}
                    </div>
                  </td>
                  <td style={{ padding: 16, color: C.text }}>
                    {fixture.date}
                    <div style={{ fontSize: 12, color: C.muted }}>{fixture.time}</div>
                   </td>
                  <td style={{ padding: 16, color: C.text }}>{fixture.venue}</td>
                  <td style={{ padding: 16, textAlign: "center" }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: "bold", color: C.green }}>
                        {fixture.score1} - {fixture.score2}
                      </span>
                      {fixture.penaltyShootout && fixture.status === 'completed' && fixture.score1 === fixture.score2 && (
                        <div style={{ fontSize: 10, color: C.yellow, marginTop: 2 }}>
                          Pen: {fixture.penaltyScore1}-{fixture.penaltyScore2}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: 16, textAlign: "center" }}>
                    {fixture.status === 'completed' ? (
                      <div>
                        {fixture.winner ? (
                          <span style={{ color: C.green, fontWeight: "bold", fontSize: 12 }}>
                            🏆 {fixture.winner}
                          </span>
                        ) : (
                          <span style={{ color: C.yellow, fontWeight: "bold", fontSize: 12 }}>
                            🤝 Match Drawn
                          </span>
                        )}
                        {fixture.penaltyShootout && fixture.score1 === fixture.score2 && (
                          <div style={{ fontSize: 10, color: C.yellow, marginTop: 2 }}>
                            (Penalties)
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: C.muted, fontSize: 12 }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: 16, textAlign: "center" }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: "bold",
                      background: `${getStatusColor(fixture.status)}22`,
                      color: getStatusColor(fixture.status)
                    }}>
                      {getStatusText(fixture.status)}
                    </span>
                  </td>
                  <td style={{ padding: 16, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <button
                        onClick={() => setUpdatingFixture(fixture)}
                        style={{
                          padding: "6px 12px", background: C.accent,
                          border: "none", borderRadius: 6,
                          color: "#000", fontWeight: "bold", cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        📊 Update
                      </button>
                      <button
                        onClick={() => setDeletingFixture(fixture)}
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
      
      {updatingFixture && (
        <UpdateScoreModal
          fixture={updatingFixture}
          onClose={() => setUpdatingFixture(null)}
          onUpdate={updateFixture}
        />
      )}
      
      {deletingFixture && (
        <DeleteModal
          fixture={deletingFixture}
          onClose={() => setDeletingFixture(null)}
          onConfirm={() => deleteFixture(deletingFixture._id)}
        />
      )}
    </>
  )
}

export default FixturesList