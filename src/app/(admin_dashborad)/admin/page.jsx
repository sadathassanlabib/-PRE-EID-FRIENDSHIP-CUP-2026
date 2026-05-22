'use client'
import React, { useState } from 'react'
import AddPlayerForm from '@/app/components/addPlayerForm'
import PlayersList from '@/app/components/playersList'
import AddFixture from '@/app/components/addFixture'
import FixturesList from '@/app/components/fixturesList'
import AddTeam from '@/app/components/addTeam'
import TeamsList from '@/app/components/teamsList'

const C = {
  bg: "#06060f", surface: "#0c0c1d", card: "#101024", border: "#1c1c38",
  accent: "#00d4ff", text: "#e2e4f0", muted: "#4a4a6a",
}

const Admin = () => {
  const [activeModule, setActiveModule] = useState('teams')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      {/* Header */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: "20px 32px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: `linear-gradient(135deg,${C.accent},#005580)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>
              🎮
            </div>
            <div>
              <div style={{ color: C.text, fontWeight: 800, fontSize: 24, fontFamily: "'Bebas Neue', sans-serif" }}>
                Admin Dashboard
              </div>
              <div style={{ color: C.muted, fontSize: 13 }}>Friendship Cup 2026 · Complete Tournament Management</div>
            </div>
          </div>

          {/* Module Navigation */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveModule('teams')}
              style={{
                padding: "10px 24px", borderRadius: 8,
                background: activeModule === 'teams' ? C.accent : C.surface,
                border: `1px solid ${activeModule === 'teams' ? C.accent : C.border}`,
                color: activeModule === 'teams' ? "#000" : C.text,
                fontWeight: "bold", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              🏆 Teams
            </button>
            <button
              onClick={() => setActiveModule('players')}
              style={{
                padding: "10px 24px", borderRadius: 8,
                background: activeModule === 'players' ? C.accent : C.surface,
                border: `1px solid ${activeModule === 'players' ? C.accent : C.border}`,
                color: activeModule === 'players' ? "#000" : C.text,
                fontWeight: "bold", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              👕 Players
            </button>
            <button
              onClick={() => setActiveModule('fixtures')}
              style={{
                padding: "10px 24px", borderRadius: 8,
                background: activeModule === 'fixtures' ? C.accent : C.surface,
                border: `1px solid ${activeModule === 'fixtures' ? C.accent : C.border}`,
                color: activeModule === 'fixtures' ? "#000" : C.text,
                fontWeight: "bold", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              📅 Fixtures
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {activeModule === 'teams' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ color: C.text, fontSize: 20, marginBottom: 8 }}>Team Management</h2>
                <p style={{ color: C.muted }}>Add new teams, manage team details, and track tournament standings</p>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <AddTeam onTeamAdded={handleRefresh} />
                <TeamsList key={refreshKey} />
              </div>
            </div>
          )}

          {activeModule === 'players' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ color: C.text, fontSize: 20, marginBottom: 8 }}>Player Management</h2>
                <p style={{ color: C.muted }}>Add new players, edit existing ones, and manage player statistics</p>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <AddPlayerForm onPlayerAdded={handleRefresh} />
                <PlayersList key={refreshKey} />
              </div>
            </div>
          )}

          {activeModule === 'fixtures' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ color: C.text, fontSize: 20, marginBottom: 8 }}>Fixture Management</h2>
                <p style={{ color: C.muted }}>Schedule matches, update scores, and track tournament progress</p>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <AddFixture onFixtureAdded={handleRefresh} />
                <FixturesList key={refreshKey} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin