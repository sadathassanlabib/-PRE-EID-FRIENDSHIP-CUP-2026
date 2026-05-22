'use client'
import React, { useState, useEffect } from 'react'

const C = {
  bg: "#06060f", surface: "#0c0c1d", card: "#101024", border: "#1c1c38",
  accent: "#00d4ff", green: "#00e676", red: "#ff3d6b", yellow: "#ffd740",
  text: "#e2e4f0", muted: "#4a4a6a",
}

const GroupManager = ({ teams = [], groupConfig = { groups: 2, teamsPerGroup: 4 }, onGroupsAssigned }) => {
  const [groups, setGroups] = useState({})
  const [selectedTeam, setSelectedTeam] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [unassignedTeams, setUnassignedTeams] = useState([])

  useEffect(() => {
    if (!groupConfig || !groupConfig.groups) return
    
    const initialGroups = {}
    for (let i = 0; i < groupConfig.groups; i++) {
      const groupLetter = String.fromCharCode(65 + i)
      initialGroups[groupLetter] = []
    }
    setGroups(initialGroups)
    setUnassignedTeams([...teams])
  }, [groupConfig, teams])

  const assignTeamToGroup = () => {
    if (!selectedTeam || !selectedGroup) return
    
    const team = unassignedTeams.find(t => t._id === selectedTeam)
    if (!team) return
    
    if (groups[selectedGroup] && groups[selectedGroup].length >= groupConfig.teamsPerGroup) {
      alert(`Group ${selectedGroup} is full! Max ${groupConfig.teamsPerGroup} teams.`)
      return
    }
    
    setGroups(prev => ({
      ...prev,
      [selectedGroup]: [...(prev[selectedGroup] || []), team]
    }))
    
    setUnassignedTeams(prev => prev.filter(t => t._id !== selectedTeam))
    setSelectedTeam('')
  }

  const removeTeamFromGroup = (groupLetter, teamId) => {
    setGroups(prev => ({
      ...prev,
      [groupLetter]: prev[groupLetter].filter(t => t._id !== teamId)
    }))
    
    const team = groups[groupLetter]?.find(t => t._id === teamId)
    if (team) {
      setUnassignedTeams(prev => [...prev, team].sort((a, b) => a.name.localeCompare(b.name)))
    }
  }

  const saveGroups = () => {
    if (unassignedTeams.length > 0) {
      alert(`Please assign all teams. ${unassignedTeams.length} teams remaining.`)
      return
    }
    
    const groupsIncomplete = Object.entries(groups).some(([letter, groupTeams]) => 
      groupTeams.length !== groupConfig.teamsPerGroup
    )
    
    if (groupsIncomplete) {
      alert(`Each group must have exactly ${groupConfig.teamsPerGroup} teams.`)
      return
    }
    
    if (onGroupsAssigned) onGroupsAssigned(groups)
  }

  const resetGroups = () => {
    const initialGroups = {}
    for (let i = 0; i < groupConfig.groups; i++) {
      const groupLetter = String.fromCharCode(65 + i)
      initialGroups[groupLetter] = []
    }
    setGroups(initialGroups)
    setUnassignedTeams([...teams])
    setSelectedTeam('')
    setSelectedGroup('')
  }

  if (!teams || teams.length === 0) {
    return (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, textAlign: "center" }}>
        <p style={{ color: C.muted }}>No teams available. Please add teams first.</p>
      </div>
    )
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
      <h3 style={{ color: C.accent, marginBottom: 20, fontSize: 20 }}>📋 Assign Teams to Groups</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 15, marginBottom: 24, alignItems: "flex-end" }}>
        <div>
          <label style={{ color: C.text, fontSize: 12, display: "block", marginBottom: 5 }}>Select Team</label>
          <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} style={{ width: "100%", padding: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }}>
            <option value="">-- Choose Team --</option>
            {unassignedTeams.map(team => (
              <option key={team._id} value={team._id}>{team.logo || '⚽'} {team.name}</option>
            ))}
          </select>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>Unassigned: {unassignedTeams.length} teams</div>
        </div>

        <div>
          <label style={{ color: C.text, fontSize: 12, display: "block", marginBottom: 5 }}>Select Group</label>
          <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} style={{ width: "100%", padding: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }}>
            <option value="">-- Choose Group --</option>
            {Object.keys(groups).map(letter => (
              <option key={letter} value={letter}>Group {letter} ({groups[letter]?.length || 0}/{groupConfig.teamsPerGroup})</option>
            ))}
          </select>
        </div>

        <button onClick={assignTeamToGroup} disabled={!selectedTeam || !selectedGroup} style={{ padding: "10px 20px", background: C.green, border: "none", borderRadius: 8, color: "#000", fontWeight: "bold", cursor: "pointer", opacity: (!selectedTeam || !selectedGroup) ? 0.5 : 1 }}>Assign →</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(groupConfig.groups, 3)}, 1fr)`, gap: 20, marginBottom: 24 }}>
        {Object.entries(groups).map(([letter, groupTeams]) => (
          <div key={letter} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: 12, background: `${C.accent}22`, borderBottom: `1px solid ${C.border}`, fontWeight: "bold", color: C.accent }}>Group {letter} ({groupTeams?.length || 0}/{groupConfig.teamsPerGroup})</div>
            <div style={{ padding: 12, minHeight: 200 }}>
              {!groupTeams || groupTeams.length === 0 ? (
                <div style={{ color: C.muted, fontSize: 12, textAlign: "center", padding: 20 }}>No teams assigned</div>
              ) : (
                groupTeams.map(team => (
                  <div key={team._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.text }}>{team.logo || '⚽'} {team.name}</span>
                    <button onClick={() => removeTeamFromGroup(letter, team._id)} style={{ padding: "2px 8px", background: C.red, border: "none", borderRadius: 4, color: "#fff", cursor: "pointer", fontSize: 11 }}>Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={saveGroups} style={{ flex: 1, padding: 12, background: C.green, border: "none", borderRadius: 8, color: "#000", fontWeight: "bold", cursor: "pointer" }}>✓ Save Group Assignments</button>
        <button onClick={resetGroups} style={{ flex: 1, padding: 12, background: C.red, border: "none", borderRadius: 8, color: "#fff", fontWeight: "bold", cursor: "pointer" }}>🔄 Reset All</button>
      </div>
    </div>
  )
}

export default GroupManager