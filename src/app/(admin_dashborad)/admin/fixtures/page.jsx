'use client'
import React, { useState } from 'react'
import AddFixture from '@/app/components/addFixture'
import FixturesList from '@/app/components/fixturesList'

const C = {
  bg: "#06060f", surface: "#0c0c1d", card: "#101024", border: "#1c1c38",
  accent: "#00d4ff", text: "#e2e4f0", muted: "#4a4a6a",
}

const AdminFixtures = () => {
  const [activeTab, setActiveTab] = useState('list')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleFixtureAdded = () => {
    setRefreshKey(prev => prev + 1)
    setActiveTab('list')
  }

  return (
    <div style={{ padding: "32px", maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: C.text, fontSize: 28, fontFamily: "'Bebas Neue', sans-serif", marginBottom: 8 }}>
          📅 Fixtures Management
        </h1>
        <p style={{ color: C.muted }}>Schedule matches, update scores, and manage tournament fixtures</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('list')}
          style={{
            padding: "10px 24px", borderRadius: 8,
            background: activeTab === 'list' ? C.accent : C.surface,
            border: `1px solid ${activeTab === 'list' ? C.accent : C.border}`,
            color: activeTab === 'list' ? "#000" : C.text,
            fontWeight: "bold", cursor: "pointer",
          }}
        >
          📋 All Fixtures
        </button>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            padding: "10px 24px", borderRadius: 8,
            background: activeTab === 'add' ? C.accent : C.surface,
            border: `1px solid ${activeTab === 'add' ? C.accent : C.border}`,
            color: activeTab === 'add' ? "#000" : C.text,
            fontWeight: "bold", cursor: "pointer",
          }}
        >
          ➕ Schedule New Match
        </button>
      </div>

      {activeTab === 'add' ? (
        <AddFixture onFixtureAdded={handleFixtureAdded} />
      ) : (
        <FixturesList key={refreshKey} />
      )}
    </div>
  )
}

export default AdminFixtures