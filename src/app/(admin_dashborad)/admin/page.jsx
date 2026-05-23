'use client'

import React, { useState } from 'react'

import AddPlayerForm from '@/app/components/addPlayerForm'
import PlayersList from '@/app/components/playersList'
import AddFixture from '@/app/components/addFixture'
import FixturesList from '@/app/components/fixturesList'
import AddTeam from '@/app/components/addTeam'
import TeamsList from '@/app/components/teamsList'
import AddResult from '@/app/components/addResult'
import ResultsList from '@/app/components/resultsList'
import Navbar_Admin from '@/app/components/admin-navber'

const C = {
  bg: "#0a0a0f",
  surface: "#12121a",
  card: "#161625",
  border: "#26263a",
  accent: "#ff7a18",
  accent2: "#ffb347",
  text: "#f3f4f6",
  muted: "#8b8ba7",
}

export default function AdminDashboard() {

  const [activeModule, setActiveModule] = useState('teams')
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey(p => p + 1)

  const navItems = [
    { key: "teams",    icon: "🏆", label: "Teams"    },
    { key: "players",  icon: "👕", label: "Players"  },
    { key: "fixtures", icon: "📅", label: "Fixtures" },
    { key: "results",  icon: "📊", label: "Results"  },
  ]

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(circle at top, #1a0f05 0%, ${C.bg} 45%, #050508 100%)`,
      color: C.text,
      fontFamily: "sans-serif"
    }}>
    
      {/* HEADER */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "18px 24px",
        borderBottom: `1px solid ${C.border}`,
        background: `linear-gradient(135deg, ${C.card}, #1a1208)`,
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* TITLE */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${C.accent}, #ff3c00)`,
              boxShadow: "0 0 20px rgba(255,122,24,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              🔥
            </div>

            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                Admin Dashboard
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
                Friendship Cup 2026 · Tournament Control System
              </p>
            </div>
          </div>
         <Navbar_Admin/>
          {/* NAV */}
          <div style={{
            display: "flex",
            gap: 10,
            marginTop: 16,
            flexWrap: "wrap"
          }}>
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveModule(item.key)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: `1px solid ${activeModule === item.key ? C.accent : C.border}`,
                  background: activeModule === item.key
                    ? `linear-gradient(135deg, ${C.accent}, #ff3c00)`
                    : C.surface,
                  color: activeModule === item.key ? "#000" : C.text,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "0.2s",
                  boxShadow: activeModule === item.key
                    ? "0 0 15px rgba(255,122,24,0.3)"
                    : "none"
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: 24 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* TEAMS */}
          {activeModule === "teams" && (
            <div>
              <h2 style={{ color: C.accent2 }}>🏆 Teams Management</h2>
              <p style={{ color: C.muted }}>Add and manage tournament teams</p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginTop: 20
              }}>
                <AddTeam onTeamAdded={refresh} />
                <TeamsList key={refreshKey} />
              </div>
            </div>
          )}

          {/* PLAYERS */}
          {activeModule === "players" && (
            <div>
              <h2 style={{ color: C.accent2 }}>👕 Players Management</h2>
              <p style={{ color: C.muted }}>Add and track player stats</p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginTop: 20
              }}>
                <AddPlayerForm onPlayerAdded={refresh} />
                <PlayersList key={refreshKey} />
              </div>
            </div>
          )}

          {/* FIXTURES */}
          {activeModule === "fixtures" && (
            <div>
              <h2 style={{ color: C.accent2 }}>📅 Fixtures Management</h2>
              <p style={{ color: C.muted }}>Schedule matches and manage tournament flow</p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginTop: 20
              }}>
                <AddFixture onFixtureAdded={refresh} />
                <FixturesList key={refreshKey} />
              </div>
            </div>
          )}

          {/* RESULTS */}
          {activeModule === "results" && (
            <div>
              <h2 style={{ color: C.accent2 }}>📊 Results Management</h2>
              <p style={{ color: C.muted }}>Log match scores and track top scorers</p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginTop: 20
              }}>
                <AddResult onResultAdded={refresh} />
                <ResultsList key={refreshKey} />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}