'use client'

import React, { useState } from 'react'

const AddTeam = () => {
  const [name, setName] = useState('')
  const [captain, setCaptain] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name) {
      setMessage({ type: 'error', text: 'Team name is required ⚠️' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('http://localhost:5000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          captain,
        }),
      })

      if (!res.ok) throw new Error('Failed to create team')

      const data = await res.json()

      setMessage({ type: 'success', text: `Team "${data.name}" created successfully 🏆` })

      // reset form
      setName('')
      setCaptain('')
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong ❌' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">🏟️ Add New Team</h1>
        <p className="text-gray-400 text-sm">
          Create a new tournament team and assign a captain.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Team Name */}
          <div>
            <label className="text-sm text-gray-300">Team Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Team Falcons"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
            />
          </div>

          {/* Captain */}
          <div>
            <label className="text-sm text-gray-300">Captain Name</label>
            <input
              type="text"
              value={captain}
              onChange={(e) => setCaptain(e.target.value)}
              placeholder="e.g. Tamim Rahman"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`text-sm p-3 rounded-xl border ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 transition font-semibold text-white"
          >
            {loading ? 'Creating Team...' : 'Create Team 🚀'}
          </button>

        </form>
      </div>
    </div>
  )
}

 AddTeam