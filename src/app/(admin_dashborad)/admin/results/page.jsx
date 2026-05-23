'use client'
import React, { useState, useEffect } from 'react'
import GroupManager from '@/app/components/groupManager'

const C = {
  bg: "#000000",
  surface: "#0a0a0a",
  card: "#111111",
  border: "#222222",
  accent: "#f97316",
  accentHover: "#ea580c",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
  orange: "#f97316",
  text: "#ffffff",
  textMuted: "#6b7280",
  muted: "#4a4a4a",
}

const IS = {
  width: "100%", boxSizing: "border-box", padding: "10px 14px",
  background: "#0a0a0a", border: `1px solid #222222`,
  borderRadius: 10, color: "#ffffff", fontSize: 14, outline: "none",
  transition: "all 0.2s",
}

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 13,
  transition: "all 0.2s",
}

/* ══════════════════════════════════════════════════════════
   ADD RESULT COMPONENT
══════════════════════════════════════════════════════════ */
const AddResult = ({ fixtures, players, onResultAdded }) => {
  const [form, setForm] = useState({
    fixtureId: "", homeScore: 0, awayScore: 0,
    homeScorers: [], awayScorers: [],
    manualOverride: false, overrideResult: "", reason: ""
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const selectedFixture = fixtures.find(f => f._id === form.fixtureId)

  const getTeamName = (fixture, side) => {
    if (!fixture) return side === "home" ? "Home" : "Away"
    return side === "home" ? (fixture.homeTeam || fixture.team1 || "Home") : (fixture.awayTeam || fixture.team2 || "Away")
  }

  const getTeamPlayers = () => {
    if (!selectedFixture) return { home: [], away: [] }
    const homeTeamName = getTeamName(selectedFixture, "home")
    const awayTeamName = getTeamName(selectedFixture, "away")
    const homePlayers = players.filter(p => p.teamName === homeTeamName || p.teamId === selectedFixture.homeTeamId)
    const awayPlayers = players.filter(p => p.teamName === awayTeamName || p.teamId === selectedFixture.awayTeamId)
    return { home: homePlayers, away: awayPlayers }
  }

  const { home: homePlayers, away: awayPlayers } = getTeamPlayers()

  const addScorer = (team) => {
    if (team === 'home') {
      setForm(f => ({ ...f, homeScorers: [...f.homeScorers, { playerId: '', playerName: '', time: '' }], homeScore: f.homeScore + 1 }))
    } else {
      setForm(f => ({ ...f, awayScorers: [...f.awayScorers, { playerId: '', playerName: '', time: '' }], awayScore: f.awayScore + 1 }))
    }
  }

  const removeScorer = (team, index) => {
    if (team === 'home') {
      const newScorers = form.homeScorers.filter((_, i) => i !== index)
      setForm(f => ({ ...f, homeScorers: newScorers, homeScore: Math.max(0, f.homeScore - 1) }))
    } else {
      const newScorers = form.awayScorers.filter((_, i) => i !== index)
      setForm(f => ({ ...f, awayScorers: newScorers, awayScore: Math.max(0, f.awayScore - 1) }))
    }
  }

  const updateScorer = (team, index, field, value) => {
    if (team === 'home') {
      const newScorers = [...form.homeScorers]
      newScorers[index][field] = value
      if (field === 'playerId') {
        const player = homePlayers.find(p => p._id === value)
        if (player) newScorers[index].playerName = player.name
      }
      setForm(f => ({ ...f, homeScorers: newScorers }))
    } else {
      const newScorers = [...form.awayScorers]
      newScorers[index][field] = value
      if (field === 'playerId') {
        const player = awayPlayers.find(p => p._id === value)
        if (player) newScorers[index].playerName = player.name
      }
      setForm(f => ({ ...f, awayScorers: newScorers }))
    }
  }

  const updateScore = (team, newScore) => {
    if (team === 'home') {
      setForm(f => ({ ...f, homeScore: newScore }))
      if (newScore > form.homeScorers.length) {
        const toAdd = newScore - form.homeScorers.length
        for (let i = 0; i < toAdd; i++) {
          setForm(f => ({ ...f, homeScorers: [...f.homeScorers, { playerId: '', playerName: '', time: '' }] }))
        }
      } else if (newScore < form.homeScorers.length) {
        setForm(f => ({ ...f, homeScorers: f.homeScorers.slice(0, newScore) }))
      }
    } else {
      setForm(f => ({ ...f, awayScore: newScore }))
      if (newScore > form.awayScorers.length) {
        const toAdd = newScore - form.awayScorers.length
        for (let i = 0; i < toAdd; i++) {
          setForm(f => ({ ...f, awayScorers: [...f.awayScorers, { playerId: '', playerName: '', time: '' }] }))
        }
      } else if (newScore < form.awayScorers.length) {
        setForm(f => ({ ...f, awayScorers: f.awayScorers.slice(0, newScore) }))
      }
    }
  }

  const resetForm = () => {
    setForm({
      fixtureId: "", homeScore: 0, awayScore: 0,
      homeScorers: [], awayScorers: [],
      manualOverride: false, overrideResult: "", reason: ""
    })
  }

  const getWinnerLabel = () => {
    if (!selectedFixture) return "—"
    const home = getTeamName(selectedFixture, "home")
    const away = getTeamName(selectedFixture, "away")
    
    if (form.manualOverride && form.overrideResult) {
      if (form.overrideResult === "homeWin") return `⚠️ ${home} awarded win (${form.homeScore}-${form.awayScore})`
      if (form.overrideResult === "awayWin") return `⚠️ ${away} awarded win (${form.homeScore}-${form.awayScore})`
      if (form.overrideResult === "draw") return `⚠️ Match declared Draw (${form.homeScore}-${form.awayScore})`
    }
    
    if (form.homeScore > form.awayScore) return `🏆 ${home} wins`
    if (form.awayScore > form.homeScore) return `🏆 ${away} wins`
    if (form.homeScore === form.awayScore && form.homeScore > 0) return "🤝 Draw"
    return "—"
  }

  const handleSubmit = async () => {
    if (!form.fixtureId) return setMsg({ type: "error", text: "Select a fixture" })
    
    setLoading(true)
    try {
      let score1 = form.homeScore
      let score2 = form.awayScore
      let winner = null
      let notes = null
      let goalScorers = { home: form.homeScorers.filter(s => s.playerId), away: form.awayScorers.filter(s => s.playerId) }

      if (form.manualOverride && form.overrideResult) {
        const home = getTeamName(selectedFixture, "home")
        const away = getTeamName(selectedFixture, "away")
        
        if (form.overrideResult === "homeWin") {
          winner = home
          notes = `MANUAL: ${home} awarded win (${score1}-${score2}). Reason: ${form.reason || 'Official decision'}`
        } else if (form.overrideResult === "awayWin") {
          winner = away
          notes = `MANUAL: ${away} awarded win (${score1}-${score2}). Reason: ${form.reason || 'Official decision'}`
        } else if (form.overrideResult === "draw") {
          winner = null
          notes = `MANUAL: Match declared Draw (${score1}-${score2}). Reason: ${form.reason || 'Official decision'}`
        }
      } else {
        winner = form.homeScore > form.awayScore ? getTeamName(selectedFixture, "home") : 
                 form.awayScore > form.homeScore ? getTeamName(selectedFixture, "away") : null
      }

      const res = await fetch("/api/fixtures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.fixtureId,
          score1,
          score2,
          goalScorers,
          status: "completed",
          winner,
          notes,
          updatedAt: new Date(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Result saved!" })
        resetForm()
        if (onResultAdded) onResultAdded()
      } else {
        setMsg({ type: "error", text: data.message || "Failed to save result" })
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error" })
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const unresolved = fixtures.filter(f => f.status !== "completed" && f.status !== "cancelled")

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <h3 style={{ color: C.accent, fontSize: 16, fontWeight: 700, margin: 0 }}>📊 Add Result</h3>
        <button onClick={resetForm} style={{ ...buttonStyle, background: C.red, color: "#fff", padding: "6px 14px", fontSize: 12 }}>Reset</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Select Match</div>
        <select 
          value={form.fixtureId} 
          onChange={e => setField("fixtureId", e.target.value)} 
          style={{ ...IS, cursor: "pointer", background: C.surface }}
        >
          <option value="">— Pick a match —</option>
          {unresolved.map(f => (
            <option key={f._id} value={f._id}>
              {f.homeTeam || f.team1} vs {f.awayTeam || f.team2} · {f.round}
            </option>
          ))}
        </select>
      </div>

      {selectedFixture && (
        <>
          {/* Manual Override Toggle */}
          <div style={{ marginBottom: 14, padding: 12, background: `${C.accent}10`, borderRadius: 10, border: `1px solid ${C.accent}30` }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: form.manualOverride ? 12 : 0 }}>
              <input type="checkbox" checked={form.manualOverride} onChange={e => setField("manualOverride", e.target.checked)} />
              <span style={{ color: C.accent, fontWeight: 600, fontSize: 13 }}>⚠️ Manual Override</span>
            </label>
            
            {form.manualOverride && (
              <div>
                <select 
                  value={form.overrideResult} 
                  onChange={e => setField("overrideResult", e.target.value)} 
                  style={{ ...IS, fontSize: 13, marginBottom: 10, background: C.surface }}
                >
                  <option value="">— Select decision —</option>
                  <option value="homeWin">🏆 {getTeamName(selectedFixture, "home")} Wins</option>
                  <option value="awayWin">🏆 {getTeamName(selectedFixture, "away")} Wins</option>
                  <option value="draw">🤝 Draw</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Reason (optional)" 
                  value={form.reason} 
                  onChange={e => setField("reason", e.target.value)} 
                  style={{ ...IS, background: C.surface }} 
                />
              </div>
            )}
          </div>

          {/* Score Entry */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{getTeamName(selectedFixture, "home")}</div>
              <input 
                type="number" 
                min="0" 
                value={form.homeScore} 
                onChange={e => updateScore('home', +e.target.value)} 
                style={{ ...IS, fontSize: 28, fontWeight: 700, textAlign: "center", width: "90px", background: C.surface }} 
              />
            </div>
            <div style={{ fontSize: 24, color: C.textMuted, fontWeight: 700 }}>VS</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{getTeamName(selectedFixture, "away")}</div>
              <input 
                type="number" 
                min="0" 
                value={form.awayScore} 
                onChange={e => updateScore('away', +e.target.value)} 
                style={{ ...IS, fontSize: 28, fontWeight: 700, textAlign: "center", width: "90px", background: C.surface }} 
              />
            </div>
          </div>

          {/* Home Scorers */}
          {form.homeScore > 0 && (
            <div style={{ marginBottom: 12, padding: 12, background: C.surface, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                <div style={{ color: C.green, fontSize: 12, fontWeight: 600 }}>⚽ {getTeamName(selectedFixture, "home")} Scorers</div>
                <button onClick={() => addScorer('home')} style={{ ...buttonStyle, background: C.green, color: "#000", padding: "4px 12px", fontSize: 11 }}>+ Add</button>
              </div>
              {form.homeScorers.map((scorer, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <select 
                    value={scorer.playerId} 
                    onChange={e => updateScorer('home', idx, 'playerId', e.target.value)} 
                    style={{ ...IS, flex: 2, fontSize: 12, padding: "7px 10px", background: "#000" }}
                  >
                    <option value="">Select player</option>
                    {homePlayers.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Min" 
                    value={scorer.time} 
                    onChange={e => updateScorer('home', idx, 'time', e.target.value)} 
                    style={{ ...IS, flex: 1, fontSize: 12, padding: "7px 10px", textAlign: "center", background: "#000" }} 
                  />
                  <button onClick={() => removeScorer('home', idx)} style={{ background: C.red, border: "none", borderRadius: 8, color: "#fff", padding: "6px 12px", cursor: "pointer", fontSize: 11 }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Away Scorers */}
          {form.awayScore > 0 && (
            <div style={{ marginBottom: 12, padding: 12, background: C.surface, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                <div style={{ color: C.accent, fontSize: 12, fontWeight: 600 }}>⚽ {getTeamName(selectedFixture, "away")} Scorers</div>
                <button onClick={() => addScorer('away')} style={{ ...buttonStyle, background: C.accent, color: "#000", padding: "4px 12px", fontSize: 11 }}>+ Add</button>
              </div>
              {form.awayScorers.map((scorer, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <select 
                    value={scorer.playerId} 
                    onChange={e => updateScorer('away', idx, 'playerId', e.target.value)} 
                    style={{ ...IS, flex: 2, fontSize: 12, padding: "7px 10px", background: "#000" }}
                  >
                    <option value="">Select player</option>
                    {awayPlayers.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Min" 
                    value={scorer.time} 
                    onChange={e => updateScorer('away', idx, 'time', e.target.value)} 
                    style={{ ...IS, flex: 1, fontSize: 12, padding: "7px 10px", textAlign: "center", background: "#000" }} 
                  />
                  <button onClick={() => removeScorer('away', idx)} style={{ background: C.red, border: "none", borderRadius: 8, color: "#fff", padding: "6px 12px", cursor: "pointer", fontSize: 11 }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Winner Preview */}
          <div style={{ background: C.surface, borderRadius: 10, padding: "10px", marginBottom: 14, textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: getWinnerLabel().includes("Draw") ? C.yellow : (getWinnerLabel().includes("⚠️") ? C.orange : C.green) }}>
              {getWinnerLabel()}
            </div>
          </div>
        </>
      )}

      {msg && (
        <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 10, background: msg.type === "success" ? `${C.green}20` : `${C.red}20`, color: msg.type === "success" ? C.green : C.red, fontWeight: 500, fontSize: 13 }}>
          {msg.text}
        </div>
      )}

      <button 
        onClick={handleSubmit} 
        disabled={loading || !form.fixtureId} 
        style={{
          width: "100%", padding: 12, background: loading ? C.muted : (form.manualOverride ? C.accent : C.green),
          border: "none", borderRadius: 10, color: loading ? C.textMuted : "#000", fontWeight: 700, fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s"
        }}
      >
        {loading ? "Saving..." : (form.manualOverride ? "⚠️ Save Manual Result" : "✓ Save Result")}
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   RESULTS LIST COMPONENT
══════════════════════════════════════════════════════════ */
const ResultsList = ({ fixtures, players, onDelete, onEdit }) => {
  const completed = fixtures.filter(f => f.status === "completed")

  const getWinnerLabel = (f) => {
    const home = f.homeTeam || f.team1 || "Home"
    const away = f.awayTeam || f.team2 || "Away"
    
    if (f.notes && f.notes.includes("MANUAL")) {
      return { label: f.notes.replace("MANUAL: ", "").substring(0, 50), color: C.accent }
    }
    if (f.score1 > f.score2) return { label: `${home} wins`, color: C.green }
    if (f.score2 > f.score1) return { label: `${away} wins`, color: C.green }
    return { label: "Draw", color: C.yellow }
  }

  if (completed.length === 0) {
    return <div style={{ background: C.card, borderRadius: 16, padding: 40, textAlign: "center", color: C.textMuted }}>No results yet.</div>
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {completed.map(f => {
        const w = getWinnerLabel(f)
        const home = f.homeTeam || f.team1
        const away = f.awayTeam || f.team2
        const homeScorers = f.goalScorers?.home || []
        const awayScorers = f.goalScorers?.away || []
        
        return (
          <div key={f._id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: `${C.accent}20`, color: C.accent }}>{f.round}</span>
              <span style={{ fontSize: 11, color: C.textMuted }}>{f.date}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => onEdit(f)} style={{ ...buttonStyle, background: `${C.accent}20`, color: C.accent, padding: "4px 12px", fontSize: 11 }}>Edit</button>
                <button onClick={() => onDelete(f._id)} style={{ ...buttonStyle, background: `${C.red}20`, color: C.red, padding: "4px 12px", fontSize: 11 }}>Reset</button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 13, textAlign: "right", flex: 1 }}>{home}</span>
              <div style={{ background: C.surface, padding: "6px 14px", borderRadius: 10, display: "flex", gap: 8, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: f.score1 > f.score2 ? C.green : C.text }}>{f.score1}</span>
                <span style={{ color: C.textMuted, fontWeight: 600 }}>-</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: f.score2 > f.score1 ? C.green : C.text }}>{f.score2}</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{away}</span>
            </div>

            {(homeScorers.length > 0 || awayScorers.length > 0) && (
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 8, padding: "6px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                {homeScorers.length > 0 && <div>⚽ {home}: {homeScorers.map(s => `${s.playerName}${s.time ? ` (${s.time}')` : ''}`).join(', ')}</div>}
                {awayScorers.length > 0 && <div>⚽ {away}: {awayScorers.map(s => `${s.playerName}${s.time ? ` (${s.time}')` : ''}`).join(', ')}</div>}
              </div>
            )}

            <div style={{ fontSize: 11, color: w.color, fontWeight: 500 }}>{w.label}</div>
          </div>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   EDIT MATCH MODAL
══════════════════════════════════════════════════════════ */
const EditMatchModal = ({ match, players, onClose, onSave, onReset }) => {
  const [score1, setScore1] = useState(match.score1 || 0)
  const [score2, setScore2] = useState(match.score2 || 0)
  const [homeScorers, setHomeScorers] = useState(match.goalScorers?.home || [])
  const [awayScorers, setAwayScorers] = useState(match.goalScorers?.away || [])
  
  const home = match.homeTeam || match.team1
  const away = match.awayTeam || match.team2
  
  const homeTeamPlayers = players.filter(p => p.teamName === home || p.teamId === match.homeTeamId)
  const awayTeamPlayers = players.filter(p => p.teamName === away || p.teamId === match.awayTeamId)

  const addScorer = (team) => {
    if (team === 'home') {
      setHomeScorers([...homeScorers, { playerId: '', playerName: '', time: '' }])
      setScore1(score1 + 1)
    } else {
      setAwayScorers([...awayScorers, { playerId: '', playerName: '', time: '' }])
      setScore2(score2 + 1)
    }
  }

  const removeScorer = (team, idx) => {
    if (team === 'home') {
      setHomeScorers(homeScorers.filter((_, i) => i !== idx))
      setScore1(score1 - 1)
    } else {
      setAwayScorers(awayScorers.filter((_, i) => i !== idx))
      setScore2(score2 - 1)
    }
  }

  const updateScorer = (team, idx, field, value) => {
    if (team === 'home') {
      const newScorers = [...homeScorers]
      newScorers[idx][field] = value
      if (field === 'playerId') {
        const player = homeTeamPlayers.find(p => p._id === value)
        if (player) newScorers[idx].playerName = player.name
      }
      setHomeScorers(newScorers)
    } else {
      const newScorers = [...awayScorers]
      newScorers[idx][field] = value
      if (field === 'playerId') {
        const player = awayTeamPlayers.find(p => p._id === value)
        if (player) newScorers[idx].playerName = player.name
      }
      setAwayScorers(newScorers)
    }
  }

  const updateScore = (team, newScore) => {
    if (team === 'home') {
      setScore1(newScore)
      if (newScore > homeScorers.length) {
        const toAdd = newScore - homeScorers.length
        for (let i = 0; i < toAdd; i++) {
          setHomeScorers(prev => [...prev, { playerId: '', playerName: '', time: '' }])
        }
      } else if (newScore < homeScorers.length) {
        setHomeScorers(homeScorers.slice(0, newScore))
      }
    } else {
      setScore2(newScore)
      if (newScore > awayScorers.length) {
        const toAdd = newScore - awayScorers.length
        for (let i = 0; i < toAdd; i++) {
          setAwayScorers(prev => [...prev, { playerId: '', playerName: '', time: '' }])
        }
      } else if (newScore < awayScorers.length) {
        setAwayScorers(awayScorers.slice(0, newScore))
      }
    }
  }

  const handleReset = () => {
    if (onReset && confirm("Reset this match? All data will be lost.")) {
      onReset(match._id)
      onClose()
    }
  }

  const handleSave = () => {
    const winner = score1 > score2 ? home : score2 > score1 ? away : null
    onSave(match._id, score1, score2, { home: homeScorers.filter(s => s.playerId), away: awayScorers.filter(s => s.playerId) }, winner)
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflow: "auto" }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, maxWidth: 500, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0 }}>✏️ Edit: {home} vs {away}</h2>
          <button onClick={handleReset} style={{ ...buttonStyle, background: C.red, color: "#fff", padding: "6px 14px", fontSize: 12 }}>Reset Match</button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{home}</div>
            <input type="number" min="0" value={score1} onChange={e => updateScore('home', +e.target.value)} style={{ ...IS, fontSize: 28, fontWeight: 700, textAlign: "center", width: "80px", background: C.surface }} />
          </div>
          <div style={{ fontSize: 20, color: C.textMuted, fontWeight: 700 }}>VS</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{away}</div>
            <input type="number" min="0" value={score2} onChange={e => updateScore('away', +e.target.value)} style={{ ...IS, fontSize: 28, fontWeight: 700, textAlign: "center", width: "80px", background: C.surface }} />
          </div>
        </div>

        {score1 > 0 && (
          <div style={{ marginBottom: 14, padding: 12, background: C.surface, borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
              <div style={{ color: C.green, fontSize: 12, fontWeight: 600 }}>⚽ {home} Scorers</div>
              <button onClick={() => addScorer('home')} style={{ ...buttonStyle, background: C.green, color: "#000", padding: "4px 12px", fontSize: 11 }}>+ Add</button>
            </div>
            {homeScorers.map((scorer, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
                <select value={scorer.playerId} onChange={e => updateScorer('home', idx, 'playerId', e.target.value)} style={{ ...IS, flex: 2, fontSize: 12, padding: "7px 10px", background: "#000" }}>
                  <option value="">Select player</option>
                  {homeTeamPlayers.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Min" value={scorer.time} onChange={e => updateScorer('home', idx, 'time', e.target.value)} style={{ ...IS, flex: 1, fontSize: 12, padding: "7px 10px", textAlign: "center", background: "#000" }} />
                <button onClick={() => removeScorer('home', idx)} style={{ background: C.red, border: "none", borderRadius: 8, color: "#fff", padding: "6px 12px", cursor: "pointer", fontSize: 11 }}>✕</button>
              </div>
            ))}
          </div>
        )}

        {score2 > 0 && (
          <div style={{ marginBottom: 14, padding: 12, background: C.surface, borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
              <div style={{ color: C.accent, fontSize: 12, fontWeight: 600 }}>⚽ {away} Scorers</div>
              <button onClick={() => addScorer('away')} style={{ ...buttonStyle, background: C.accent, color: "#000", padding: "4px 12px", fontSize: 11 }}>+ Add</button>
            </div>
            {awayScorers.map((scorer, idx) => (
              <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
                <select value={scorer.playerId} onChange={e => updateScorer('away', idx, 'playerId', e.target.value)} style={{ ...IS, flex: 2, fontSize: 12, padding: "7px 10px", background: "#000" }}>
                  <option value="">Select player</option>
                  {awayTeamPlayers.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Min" value={scorer.time} onChange={e => updateScorer('away', idx, 'time', e.target.value)} style={{ ...IS, flex: 1, fontSize: 12, padding: "7px 10px", textAlign: "center", background: "#000" }} />
                <button onClick={() => removeScorer('away', idx)} style={{ background: C.red, border: "none", borderRadius: 8, color: "#fff", padding: "6px 12px", cursor: "pointer", fontSize: 11 }}>✕</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSave} style={{ ...buttonStyle, flex: 1, background: C.green, color: "#000" }}>Save</button>
          <button onClick={onClose} style={{ ...buttonStyle, flex: 1, background: C.red, color: "#fff" }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   STANDINGS COMPONENT
══════════════════════════════════════════════════════════ */
const StandingsTable = ({ standings, title, accentColor }) => {
  if (standings.length === 0) {
    return <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>No data available</div>
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "auto" }}>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <h3 style={{ color: accentColor, fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.surface }}>
              <th style={{ padding: "12px 8px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>#</th>
              <th style={{ padding: "12px 12px", textAlign: "left", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>Team</th>
              <th style={{ padding: "12px 8px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>P</th>
              <th style={{ padding: "12px 8px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>W</th>
              <th style={{ padding: "12px 8px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>D</th>
              <th style={{ padding: "12px 8px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>L</th>
              <th style={{ padding: "12px 8px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>GF</th>
              <th style={{ padding: "12px 8px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>GA</th>
              <th style={{ padding: "12px 8px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>GD</th>
              <th style={{ padding: "12px 8px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>Pts</th>
             </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => (
              <tr key={team.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 8px", textAlign: "center", fontWeight: 700, color: idx < 2 ? C.accent : C.text, fontSize: 12 }}>{idx + 1}</td>
                <td style={{ padding: "10px 12px", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{team.logo || '⚽'}</span>
                    <span style={{ color: C.text, fontWeight: 600, fontSize: 13 }}>{team.name}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 8px", textAlign: "center", color: C.text, fontSize: 12 }}>{team.played}</td>
                <td style={{ padding: "10px 8px", textAlign: "center", color: C.green, fontWeight: 600, fontSize: 12 }}>{team.wins}</td>
                <td style={{ padding: "10px 8px", textAlign: "center", color: C.yellow, fontWeight: 600, fontSize: 12 }}>{team.draws}</td>
                <td style={{ padding: "10px 8px", textAlign: "center", color: C.red, fontWeight: 600, fontSize: 12 }}>{team.losses}</td>
                <td style={{ padding: "10px 8px", textAlign: "center", color: C.green, fontSize: 12 }}>{team.goalsFor}</td>
                <td style={{ padding: "10px 8px", textAlign: "center", color: C.red, fontSize: 12 }}>{team.goalsAgainst}</td>
                <td style={{ padding: "10px 8px", textAlign: "center", color: C.accent, fontWeight: 600, fontSize: 12 }}>{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                <td style={{ padding: "10px 8px", textAlign: "center", color: C.accent, fontWeight: 700, fontSize: 14 }}>{team.points}</td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN RESULTS PAGE
══════════════════════════════════════════════════════════ */
const ResultsPage = () => {
  const [fixtures, setFixtures] = useState([])
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('add')
  const [showGroupManager, setShowGroupManager] = useState(false)
  const [customGroupAssignments, setCustomGroupAssignments] = useState(null)
  const [editingMatch, setEditingMatch] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [groupConfig, setGroupConfig] = useState({ groups: 2, teamsPerGroup: 4, teamsAdvancing: 2 })

  const groupPresets = {
    "2x3": { groups: 2, teamsPerGroup: 3, teamsAdvancing: 2, name: "2 Groups of 3" },
    "2x4": { groups: 2, teamsPerGroup: 4, teamsAdvancing: 2, name: "2 Groups of 4" },
    "2x5": { groups: 2, teamsPerGroup: 5, teamsAdvancing: 2, name: "2 Groups of 5" },
    "3x4": { groups: 3, teamsPerGroup: 4, teamsAdvancing: 2, name: "3 Groups of 4" },
    "4x4": { groups: 4, teamsPerGroup: 4, teamsAdvancing: 1, name: "4 Groups of 4" },
  }

  useEffect(() => {
    fetchData()
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("groupAssignments")
      if (saved) setCustomGroupAssignments(JSON.parse(saved))
    }
  }, [])

  const fetchData = async () => {
    try {
      const [fRes, tRes, pRes] = await Promise.all([
        fetch("/api/fixtures"),
        fetch("/api/teams"),
        fetch("/api/players"),
      ])
      const fData = await fRes.json()
      const tData = await tRes.json()
      const pData = await pRes.json()
      if (fData.success) setFixtures(fData.data || [])
      if (tData.success) setTeams(tData.data || [])
      if (pData.success) setPlayers(pData.data || [])
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGroupsAssigned = (assignedGroups) => {
    setCustomGroupAssignments(assignedGroups)
    setShowGroupManager(false)
    if (typeof window !== "undefined") {
      localStorage.setItem("groupAssignments", JSON.stringify(assignedGroups))
    }
  }

  const updateMatchScore = async (matchId, score1, score2, goalScorers, winner) => {
    try {
      const res = await fetch("/api/fixtures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: matchId, score1, score2, goalScorers, status: "completed", winner, updatedAt: new Date() 
        }),
      })
      const data = await res.json()
      if (data.success) { 
        fetchData() 
        setShowEditModal(false) 
        setEditingMatch(null)
      }
    } catch { 
      alert("Error updating match") 
    }
  }

  const resetResult = async (matchId) => {
    try {
      const res = await fetch("/api/fixtures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: matchId, score1: 0, score2: 0, status: "scheduled", winner: null, goalScorers: { home: [], away: [] }, notes: null }),
      })
      const data = await res.json()
      if (data.success) fetchData()
    } catch { alert("Error resetting") }
  }

  // Calculate Overall Standings
  const calculateOverallStandings = () => {
    const stats = {}
    
    teams.forEach(team => {
      stats[team.name] = {
        id: team._id,
        name: team.name,
        logo: team.logo || '⚽',
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

    const completedMatches = fixtures.filter(f => f.status === "completed")
    
    completedMatches.forEach(match => {
      const homeTeam = match.homeTeam || match.team1
      const awayTeam = match.awayTeam || match.team2
      const homeScore = match.score1 || 0
      const awayScore = match.score2 || 0

      if (stats[homeTeam]) {
        stats[homeTeam].played++
        stats[homeTeam].goalsFor += homeScore
        stats[homeTeam].goalsAgainst += awayScore
        
        if (homeScore > awayScore) {
          stats[homeTeam].wins++
          stats[homeTeam].points += 3
        } else if (homeScore === awayScore) {
          stats[homeTeam].draws++
          stats[homeTeam].points += 1
        } else {
          stats[homeTeam].losses++
        }
      }

      if (stats[awayTeam]) {
        stats[awayTeam].played++
        stats[awayTeam].goalsFor += awayScore
        stats[awayTeam].goalsAgainst += homeScore
        
        if (awayScore > homeScore) {
          stats[awayTeam].wins++
          stats[awayTeam].points += 3
        } else if (awayScore === homeScore) {
          stats[awayTeam].draws++
          stats[awayTeam].points += 1
        } else {
          stats[awayTeam].losses++
        }
      }
    })

    Object.values(stats).forEach(team => {
      team.goalDifference = team.goalsFor - team.goalsAgainst
    })

    return Object.values(stats)
      .filter(t => t.played > 0)
      .sort((a, b) => {
        if (a.points !== b.points) return b.points - a.points
        if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference
        return b.goalsFor - a.goalsFor
      })
  }

  // Calculate Group Standings
  const calculateGroupStandings = () => {
    const overall = calculateOverallStandings()
    
    if (customGroupAssignments) {
      const groups = {}
      Object.keys(customGroupAssignments).forEach(group => {
        groups[group] = customGroupAssignments[group]
          .map(team => overall.find(t => t.name === team.name))
          .filter(Boolean)
          .sort((a, b) => {
            if (a.points !== b.points) return b.points - a.points
            if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference
            return b.goalsFor - a.goalsFor
          })
      })
      return groups
    }

    // Auto-assign groups
    const groups = {}
    const groupLetters = ['A', 'B', 'C', 'D']
    for (let i = 0; i < groupConfig.groups; i++) {
      groups[groupLetters[i]] = []
    }
    
    overall.forEach((team, idx) => {
      const groupIndex = idx % groupConfig.groups
      groups[groupLetters[groupIndex]].push(team)
    })
    
    return groups
  }

  // Calculate Top Scorers
  const calculateTopScorers = () => {
    const goalMap = new Map()
    
    const completedMatches = fixtures.filter(f => f.status === "completed")
    
    completedMatches.forEach(match => {
      const homeScorers = match.goalScorers?.home || []
      const awayScorers = match.goalScorers?.away || []
      
      homeScorers.forEach(scorer => {
        if (scorer.playerId && scorer.playerName) {
          goalMap.set(scorer.playerId, {
            name: scorer.playerName,
            goals: (goalMap.get(scorer.playerId)?.goals || 0) + 1,
            team: match.homeTeam || match.team1
          })
        }
      })
      
      awayScorers.forEach(scorer => {
        if (scorer.playerId && scorer.playerName) {
          goalMap.set(scorer.playerId, {
            name: scorer.playerName,
            goals: (goalMap.get(scorer.playerId)?.goals || 0) + 1,
            team: match.awayTeam || match.team2
          })
        }
      })
    })
    
    // Also check players table for goals
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
    
    return Array.from(goalMap.values())
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10)
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.text }}>Loading...</div>
    </div>
  )

  const overallStandings = calculateOverallStandings()
  const groupStandings = calculateGroupStandings()
  const topScorers = calculateTopScorers()
  const completedMatches = fixtures.filter(f => f.status === "completed")
  const totalGoals = completedMatches.reduce((sum, f) => sum + (f.score1 || 0) + (f.score2 || 0), 0)

  const tabs = [
    { id: "add", label: "➕ Add Result" },
    { id: "matches", label: "📋 Match Results" },
    { id: "standings", label: "🏆 Overall Standings" },
    { id: "groups", label: "📊 Group Standings" },
    { id: "topscorers", label: "⚽ Top Scorers" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "16px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <h1 style={{ color: C.accent, fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Tournament Results</h1>
          <p style={{ color: C.textMuted, fontSize: 13 }}>Log scores, track standings, view top scorers</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          <div style={{ background: C.card, borderRadius: 12, padding: "12px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{fixtures.length}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Total Matches</div>
          </div>
          <div style={{ background: C.card, borderRadius: 12, padding: "12px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.green }}>{completedMatches.length}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Completed</div>
          </div>
          <div style={{ background: C.card, borderRadius: 12, padding: "12px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.accent }}>{totalGoals}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Total Goals</div>
          </div>
        </div>

        {/* Group Format */}
        {(activeTab === "groups" || activeTab === "standings") && (
          <div style={{ background: C.surface, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, border: `1px solid ${C.border}` }}>
            <span style={{ color: C.accent, fontWeight: 600, fontSize: 13 }}>📋 {groupConfig.groups} Groups · Top {groupConfig.teamsAdvancing} Advance</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select 
                value={Object.keys(groupPresets).find(k => groupPresets[k].groups === groupConfig.groups && groupPresets[k].teamsPerGroup === groupConfig.teamsPerGroup) || "2x4"} 
                onChange={e => setGroupConfig(groupPresets[e.target.value])} 
                style={{ ...IS, width: "auto", cursor: "pointer", fontSize: 12, padding: "6px 12px" }}
              >
                {Object.entries(groupPresets).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
              <button onClick={() => setShowGroupManager(true)} style={{ ...buttonStyle, background: C.accent, color: "#000", padding: "6px 14px", fontSize: 12 }}>Manual Groups</button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: `2px solid ${C.border}`, paddingBottom: 10, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)} 
              style={{
                padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
                background: activeTab === t.id ? C.accent : "transparent",
                color: activeTab === t.id ? "#000" : C.textMuted,
                transition: "all 0.2s"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Add Result Tab */}
        {activeTab === "add" && (
          <div>
            <AddResult fixtures={fixtures} players={players} onResultAdded={fetchData} />
            <div style={{ marginTop: 20 }}>
              <ResultsList 
                fixtures={fixtures} 
                players={players} 
                onDelete={resetResult} 
                onEdit={(match) => { setEditingMatch(match); setShowEditModal(true) }} 
              />
            </div>
          </div>
        )}

        {/* Match Results Tab */}
        {activeTab === "matches" && (
          <ResultsList 
            fixtures={fixtures} 
            players={players} 
            onDelete={resetResult} 
            onEdit={(match) => { setEditingMatch(match); setShowEditModal(true) }} 
          />
        )}

        {/* Overall Standings Tab */}
        {activeTab === "standings" && (
          <StandingsTable standings={overallStandings} title="🏆 Overall Tournament Standings" accentColor={C.accent} />
        )}

        {/* Group Standings Tab */}
        {activeTab === "groups" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {Object.entries(groupStandings).map(([groupName, groupTeams]) => (
              <StandingsTable 
                key={groupName} 
                standings={groupTeams} 
                title={`📊 Group ${groupName} Standings`} 
                accentColor={C.green}
              />
            ))}
          </div>
        )}

        {/* Top Scorers Tab */}
        {activeTab === "topscorers" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "auto" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
              <h3 style={{ color: C.accent, fontSize: 16, fontWeight: 700, margin: 0 }}>⚽ Top Goal Scorers</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 300 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                    <th style={{ padding: "12px 12px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>#</th>
                    <th style={{ padding: "12px 12px", textAlign: "left", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>Player</th>
                    <th style={{ padding: "12px 12px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>Team</th>
                    <th style={{ padding: "12px 12px", textAlign: "center", color: C.textMuted, fontSize: 11, fontWeight: 600 }}>Goals</th>
                   </tr>
                </thead>
                <tbody>
                  {topScorers.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: 60, textAlign: "center", color: C.textMuted }}>No goals scored yet</td>
                    </tr>
                  ) : (
                    topScorers.map((scorer, idx) => (
                      <tr key={idx} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: 700, color: idx < 3 ? C.accent : C.text, fontSize: 14 }}>{idx + 1}</td>
                        <td style={{ padding: "12px 12px", textAlign: "left", color: C.text, fontWeight: 600, fontSize: 13 }}>{scorer.name}</td>
                        <td style={{ padding: "12px 12px", textAlign: "center", color: C.textMuted, fontSize: 12 }}>{scorer.team || '—'}</td>
                        <td style={{ padding: "12px 12px", textAlign: "center", color: C.accent, fontWeight: 700, fontSize: 18 }}>{scorer.goals}</td>
                       </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Edit Modal */}
      {showEditModal && editingMatch && (
        <EditMatchModal 
          match={editingMatch} 
          players={players} 
          onClose={() => { setShowEditModal(false); setEditingMatch(null) }} 
          onSave={updateMatchScore}
          onReset={resetResult}
        />
      )}

      {/* Group Manager Modal */}
      {showGroupManager && teams.length > 0 && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ maxWidth: 500, width: "100%", background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: 12, borderBottom: `1px solid ${C.border}` }}>
              <button onClick={() => setShowGroupManager(false)} style={{ ...buttonStyle, background: C.red, color: "#fff", padding: "4px 16px", fontSize: 12 }}>Close</button>
            </div>
            <div style={{ padding: 16 }}>
              <GroupManager teams={teams} groupConfig={groupConfig} onGroupsAssigned={handleGroupsAssigned} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsPage