'use client'

import React from 'react'

const Fixtures = () => {

  const day1Matches = [
    { time: "06:00 AM", match: "A1 vs A2" },
    { time: "06:45 AM", match: "B1 vs B2" },
    { time: "07:30 AM", match: "A1 vs A3" },
    { time: "08:15 AM", match: "B1 vs B3" },
    { time: "09:00 AM", match: "A2 vs A3" },
    { time: "09:45 AM", match: "B2 vs B3" },
  ]

  const day2Matches = [
    { time: "06:00 AM", match: "Semi Final 1 (A1 vs B2)" },
    { time: "06:45 AM", match: "Semi Final 2 (B1 vs A2)" },
    { time: "07:45 AM", match: "3rd Place Match" },
    { time: "08:30 AM", match: "FINAL 🏆" },
  ]

  return (
    <section className="min-h-screen bg-black text-white py-24 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">

          <p className="text-xs tracking-[6px] text-gray-500 uppercase">
            Official Tournament Fixtures
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold">
            Pre-Eid Friendship Cup 2026
          </h1>

          <p className="text-gray-400 mt-3 text-sm">
            Group Stage + Knockout Stage Schedule
          </p>

          <div className="w-24 h-[2px] bg-orange-500 mx-auto mt-6" />

        </div>

        {/* EVENT INFO CARD */}
        <div className="border border-white/10 rounded-2xl bg-white/[0.03] p-6 mb-10">

          <h2 className="text-2xl font-bold text-orange-400 mb-4">
            🏟️ Tournament Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">

            <div>
              <p className="text-gray-500">📅 Dates</p>
              <p className="text-white font-medium">23–24 May 2026</p>
            </div>

            <div>
              <p className="text-gray-500">⏰ Kickoff Time</p>
              <p className="text-white font-medium">From 6:00 AM (Daily)</p>
            </div>

            <div>
              <p className="text-gray-500">🏟️ Venue</p>
              <p className="text-white font-medium">
                Tin Tala Math, Habildar Mor, 60 Feet
              </p>
            </div>

            <div>
              <p className="text-gray-500">⚽ Match Format</p>
              <p className="text-white font-medium">
                15 min + 5 min break + 15 min (45 min total)
              </p>
            </div>

            <div>
              <p className="text-gray-500">🏆 Stage Format</p>
              <p className="text-white font-medium">
                Group Stage → Semi Final → 3rd Place → Final
              </p>
            </div>

            <div>
              <p className="text-gray-500">📊 Structure</p>
              <p className="text-white font-medium">
                Round Robin + Knockout System
              </p>
            </div>

          </div>

        </div>

        {/* DAY 1 */}
        <div className="mb-10 border border-white/10 rounded-2xl bg-white/[0.03] p-6">

          <h2 className="text-2xl font-bold text-orange-400 mb-4">
            Day 1 – Group Stage (23 May 2026)
          </h2>

          <div className="space-y-3">

            {day1Matches.map((m, i) => (
              <div key={i} className="flex justify-between border-b border-white/10 pb-2 text-sm">
                <span className="text-gray-400">{m.time}</span>
                <span className="text-white font-medium">{m.match}</span>
              </div>
            ))}

          </div>

        </div>

        {/* DAY 2 */}
        <div className="border border-white/10 rounded-2xl bg-white/[0.03] p-6">

          <h2 className="text-2xl font-bold text-orange-400 mb-4">
            Day 2 – Knockout Stage (24 May 2026)
          </h2>

          <div className="space-y-3">

            {day2Matches.map((m, i) => (
              <div key={i} className="flex justify-between border-b border-white/10 pb-2 text-sm">
                <span className="text-gray-400">{m.time}</span>
                <span className="text-white font-medium">{m.match}</span>
              </div>
            ))}

          </div>

        </div>

        

      </div>

    </section>
  )
}

export default Fixtures