'use client'
import React, { useState } from 'react'
import AddFixture from '@/app/components/addFixture'
import FixturesList from '@/app/components/fixturesList'

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

const AdminFixtures = () => {
  const [activeTab, setActiveTab] = useState('list')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleFixtureAdded = () => {
    setRefreshKey(prev => prev + 1)
    setActiveTab('list')
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at top, #1a0f05 0%, ${C.bg} 40%, #050508 100%)`,
        padding: "20px",
        color: C.text,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >

        {/* HEADER */}
        <div
          style={{
            marginBottom: 28,
            padding: "24px",
            borderRadius: 20,
            background: `linear-gradient(135deg, ${C.card}, #1a1208)`,
            border: `1px solid ${C.border}`,
            boxShadow: "0 0 25px rgba(255,122,24,0.12)",
          }}
        >
          <h1
            style={{
              color: C.text,
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 900,
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            📅 Fixtures Management
          </h1>

          <p
            style={{
              color: C.muted,
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            Schedule matches, update scores, and manage tournament fixtures
          </p>
        </div>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >

          <button
            onClick={() => setActiveTab('list')}
            style={{
              padding: "12px 22px",
              borderRadius: 12,
              background:
                activeTab === 'list'
                  ? `linear-gradient(135deg, ${C.accent}, #ff3c00)`
                  : C.surface,
              border: `1px solid ${
                activeTab === 'list' ? C.accent : C.border
              }`,
              color: activeTab === 'list' ? "#000" : C.text,
              fontWeight: 800,
              cursor: "pointer",
              transition: "0.25s",
              boxShadow:
                activeTab === 'list'
                  ? "0 0 18px rgba(255,122,24,0.35)"
                  : "none",
            }}
          >
            📋 All Fixtures
          </button>

          <button
            onClick={() => setActiveTab('add')}
            style={{
              padding: "12px 22px",
              borderRadius: 12,
              background:
                activeTab === 'add'
                  ? `linear-gradient(135deg, ${C.accent}, #ff3c00)`
                  : C.surface,
              border: `1px solid ${
                activeTab === 'add' ? C.accent : C.border
              }`,
              color: activeTab === 'add' ? "#000" : C.text,
              fontWeight: 800,
              cursor: "pointer",
              transition: "0.25s",
              boxShadow:
                activeTab === 'add'
                  ? "0 0 18px rgba(255,122,24,0.35)"
                  : "none",
            }}
          >
            ➕ Schedule New Match
          </button>

        </div>

        {/* CONTENT */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${C.border}`,
            borderRadius: 22,
            padding: "20px",
            overflowX: "auto",
            backdropFilter: "blur(12px)",
          }}
        >
          {activeTab === 'add' ? (
            <AddFixture onFixtureAdded={handleFixtureAdded} />
          ) : (
            <FixturesList key={refreshKey} />
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminFixtures