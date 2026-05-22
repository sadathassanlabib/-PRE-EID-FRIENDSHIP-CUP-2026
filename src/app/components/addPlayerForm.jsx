'use client'
import React, { useState, useEffect } from 'react'

/* ══════════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════════ */
const C = {
  bg: "#06060f", surface: "#0c0c1d", card: "#101024", border: "#1c1c38",
  accent: "#00d4ff", accentGlow: "#00d4ff25", green: "#00e676", greenGlow: "#00e67625",
  red: "#ff3d6b", redGlow: "#ff3d6b25", yellow: "#ffd740", yellowGlow: "#ffd74025",
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

/* ══════════════════════════════════════════════════════════
   UI COMPONENTS
══════════════════════════════════════════════════════════ */
function Label({ children }) {
  return (
    <div style={{
      color: C.muted, fontSize: 11, fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6,
    }}>
      {children}
    </div>
  )
}

function Inp({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <Label>{label}</Label>}
      <input
        {...props}
        style={{
          width: "100%", boxSizing: "border-box", padding: "10px 13px",
          background: C.surface, border: `1px solid ${error ? C.red : C.border}`,
          borderRadius: 9, color: C.text, fontSize: 14, outline: "none",
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
      {error && (
        <div style={{ color: C.red, fontSize: 12, marginTop: 5, fontWeight: 600 }}>
          ⚠ {error}
        </div>
      )}
    </div>
  )
}

function Sel({ label, error, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <Label>{label}</Label>}
      <select
        {...props}
        style={{
          width: "100%", boxSizing: "border-box", padding: "10px 13px",
          background: C.surface, border: `1px solid ${error ? C.red : C.border}`,
          borderRadius: 9, color: C.text, fontSize: 14, outline: "none",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {children}
      </select>
      {error && (
        <div style={{ color: C.red, fontSize: 12, marginTop: 5, fontWeight: 600 }}>
          ⚠ {error}
        </div>
      )}
    </div>
  )
}

function Row2({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   PLAYER PREVIEW
══════════════════════════════════════════════════════════ */
function PlayerPreview({ form, teams }) {
  const cat = CAT[form.category] || CAT.A
  const icon = POS_ICON[form.position] || "⚡"
  const team = teams?.find(t => t._id === form.teamId || t.teamId === form.teamId)

  return (
    <div style={{
      background: C.surface, border: `1px solid ${team ? team.color + "55" : C.border}`,
      borderRadius: 14, padding: "16px 18px", display: "flex",
      alignItems: "center", gap: 14, marginBottom: 22,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 13, background: cat.bg,
        flexShrink: 0, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 26, border: `2px solid ${cat.fg}55`,
      }}>
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          color: form.name ? C.text : C.muted, fontWeight: 800, fontSize: 17,
          fontFamily: "'Bebas Neue', sans-serif", letterSpacing: .8, lineHeight: 1.1,
        }}>
          {form.isCaptain && <span style={{ color: C.yellow, marginRight: 6 }}>👑</span>}
          {form.name || "Player Name"}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 7 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 6,
            color: cat.fg, background: cat.bg,
          }}>
            Cat {form.category}
          </span>

          <span style={{
            fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 6,
            color: "#94a3b8", background: "#1e293b",
          }}>
            {form.position}
          </span>

          {team ? (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 6,
              color: team.color, background: team.color + "22",
              display: "inline-flex", alignItems: "center", gap: 5,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: team.color }} />
              {team.name}
            </span>
          ) : (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 6,
              color: C.red, background: C.redGlow,
            }}>
              Unassigned
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 22, fontWeight: 800, color: C.green,
            fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1,
          }}>
            {form.goals}
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Goals</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 22, fontWeight: 800, color: C.accent,
            fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1,
          }}>
            {form.assists}
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Assists</div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════════════════════════ */
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
      fontFamily: "'DM Sans', sans-serif", animation: "slideUp .3s ease",
    }}>
      {type === "success" ? "✓ " : "✕ "}{msg}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ADD PLAYER FORM - MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const DEFAULT_FORM = {
  name: "", position: "Striker", category: "A",
  teamId: "", isCaptain: false, goals: 0, assists: 0,
}

const AddPlayerForm = ({ onPlayerAdded }) => {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState([]) // Dynamic teams from database
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
      setToast({ msg: "Failed to load teams", type: "error" })
    } finally {
      setLoadingTeams(false)
    }
  }

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: "" }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = "Player name is required"
    if (form.goals < 0) e.goals = "Cannot be negative"
    if (form.assists < 0) e.assists = "Cannot be negative"
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      const selectedTeam = teams.find(t => t._id === form.teamId || t.teamId === form.teamId)
      
      const playerData = {
        name: form.name.trim(),
        position: form.position,
        category: form.category,
        teamId: selectedTeam?.teamId || form.teamId,
        teamName: selectedTeam?.name || null,
        isCaptain: form.isCaptain,
        goals: Number(form.goals),
        assists: Number(form.assists),
      }

      // If player is captain, remove captain status from previous captain of that team
      if (form.isCaptain && selectedTeam) {
        const response = await fetch(`/api/players?teamId=${selectedTeam.teamId}`)
        const data = await response.json()
        const currentCaptain = data.data?.find(p => p.isCaptain === true)
        
        if (currentCaptain) {
          await fetch('/api/players/update-captain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              teamId: selectedTeam.teamId, 
              oldCaptainId: currentCaptain._id 
            }),
          })
        }
      }

      const response = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData),
      })

      const data = await response.json()

      if (data.success) {
        setToast({ msg: `✅ ${form.name} added successfully!`, type: "success" })
        
        if (onPlayerAdded) {
          onPlayerAdded(data.data)
        }
        
        setForm(DEFAULT_FORM)
        setErrors({})
      } else {
        throw new Error(data.error || "Failed to add player")
      }
      
    } catch (error) {
      console.error("Error adding player:", error)
      setToast({ msg: error.message || "Failed to add player.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(DEFAULT_FORM)
    setErrors({})
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
        input::placeholder { color: ${C.muted}; }
        option { background: ${C.card}; color: ${C.text}; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "36px 16px",
      }}>
        <div style={{ width: "100%", maxWidth: 540 }}>
          
          {/* Page header */}
          <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 28 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(135deg,${C.accent},#005580)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>
              👕
            </div>
            <div>
              <div style={{
                color: C.text, fontWeight: 800, fontSize: 20,
                fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5,
              }}>
                Add New Player
              </div>
              <div style={{ color: C.muted, fontSize: 12 }}>
                Friendship Cup 2026 · Admin
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: 28, boxShadow: "0 16px 60px #000a",
          }}>
            
            {/* Live preview */}
            <Label>Preview</Label>
            <PlayerPreview form={form} teams={teams} />

            <form onSubmit={handleSubmit}>
              <Inp
                label="Full Name"
                placeholder="Enter player name"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                error={errors.name}
              />

              <Row2>
                <Sel
                  label="Position"
                  value={form.position}
                  onChange={e => set("position", e.target.value)}
                >
                  {Object.keys(POS_ICON).map(p => (
                    <option key={p} value={p}>{POS_ICON[p]} {p}</option>
                  ))}
                </Sel>

                <Sel
                  label="Category"
                  value={form.category}
                  onChange={e => set("category", e.target.value)}
                >
                  {Object.keys(CAT).map(c => (
                    <option key={c} value={c}>Category {c}</option>
                  ))}
                </Sel>
              </Row2>

              <Sel
                label="Assign to Team"
                value={form.teamId}
                onChange={e => set("teamId", e.target.value)}
              >
                <option value="">— Unassigned —</option>
                {loadingTeams ? (
                  <option disabled>Loading teams...</option>
                ) : (
                  teams.map(t => (
                    <option key={t._id} value={t._id}>
                      {t.logo || '⚽'} {t.name}
                    </option>
                  ))
                )}
              </Sel>

              <Row2>
                <Inp
                  label="Goals"
                  type="number" min="0"
                  value={form.goals}
                  onChange={e => set("goals", +e.target.value)}
                  error={errors.goals}
                />
                <Inp
                  label="Assists"
                  type="number" min="0"
                  value={form.assists}
                  onChange={e => set("assists", +e.target.value)}
                  error={errors.assists}
                />
              </Row2>

              {/* Captain toggle */}
              <div
                onClick={() => set("isCaptain", !form.isCaptain)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "13px 16px", borderRadius: 11, marginBottom: 24,
                  border: `1px solid ${form.isCaptain ? C.yellow : C.border}`,
                  background: form.isCaptain ? C.yellowGlow : C.surface,
                  cursor: "pointer", transition: "all .2s",
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `2px solid ${form.isCaptain ? C.yellow : C.muted}`,
                  background: form.isCaptain ? C.yellow : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, flexShrink: 0, transition: "all .2s",
                }}>
                  {form.isCaptain && "✓"}
                </div>
                <div>
                  <div style={{
                    color: form.isCaptain ? C.yellow : C.muted,
                    fontWeight: 700, fontSize: 14,
                  }}>
                    👑 Mark as Team Captain
                  </div>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                    This player will be shown as captain in the roster
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "13px",
                  background: `linear-gradient(135deg,${C.green},#009944)`,
                  border: "none", borderRadius: 11, color: "#000",
                  fontWeight: 800, fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: `0 4px 20px ${C.greenGlow}`,
                  letterSpacing: .3,
                }}
              >
                {loading ? "⏳ Adding..." : "✓ Add Player"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                style={{
                  width: "100%", padding: "12px", background: "transparent",
                  border: `1px solid ${C.border}`, borderRadius: 11,
                  color: C.muted, fontWeight: 600, fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1, marginTop: 10,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ✕ Reset Form
              </button>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default AddPlayerForm