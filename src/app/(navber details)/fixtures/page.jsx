'use client'

import React from 'react'

const Fixtures = () => {
  return (
    <section className="min-h-screen bg-black text-white py-24 px-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">

          <p className="text-xs tracking-[6px] text-gray-500 uppercase">
            Tournament Schedule
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold">
            Fixtures Overview
          </h1>

          <div className="w-24 h-[2px] bg-orange-500 mx-auto mt-6" />

        </div>

        {/* MAIN CARD */}
        <div className="border border-white/10 rounded-2xl bg-white/[0.03] p-8">

          {/* TITLE */}
          <h2 className="text-2xl font-semibold text-orange-400">
            Pre-Eid Friendship Cup 2026
          </h2>

          <p className="text-gray-400 mt-2 text-sm">
            Official tournament schedule and match structure
          </p>

          {/* INFO GRID */}
          <div className="grid md:grid-cols-2 gap-8 mt-10">

            {/* LEFT */}
            <div className="space-y-6 text-sm text-gray-300 leading-relaxed">

              <p>
                The tournament will take place on{" "}
                <span className="text-white font-medium">23rd & 24th May 2026</span>.
              </p>

              <p>
                All matches will begin{" "}
                <span className="text-orange-300 font-medium">after Fajr prayer</span>,
                ensuring a disciplined and well-organized schedule.
              </p>

              <p>
                Each match will be played in a fast-paced format of{" "}
                <span className="text-white font-medium">10+10 or 15+15 minutes</span>,
                depending on final decision.
              </p>

              <p className="text-gray-400">
                The fixture system will be either{" "}
                <span className="text-blue-300 font-medium">Knockout or League</span>,
                based on total team registration.
              </p>

            </div>

            {/* RIGHT INFO PANEL */}
            <div className="border border-white/10 rounded-xl p-6 bg-black/40">

              <h3 className="text-lg font-semibold text-white mb-6">
                Event Details
              </h3>

              <div className="space-y-5 text-sm">

                <div>
                  <p className="text-gray-500">Dates</p>
                  <p className="text-white font-medium">23–24 May 2026</p>
                </div>

                <div>
                  <p className="text-gray-500">Kickoff Time</p>
                  <p className="text-white font-medium">After Fajr Prayer</p>
                </div>

                <div>
                  <p className="text-gray-500">Venue</p>
                  <p className="text-white font-medium">
                    Three Floor Field, Habildar Mor, 60 Feet
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="text-orange-400 font-semibold">
                    Scheduling in Progress
                  </p>
                </div>

              </div>

              {/* CTA BADGE */}
              <div className="mt-8 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-center text-sm text-gray-400">
                Full fixture list will be published soon
              </div>

            </div>

          </div>

          {/* FOOT NOTE */}
          <p className="text-center text-gray-500 text-xs mt-10">
            Stay connected for match updates & live schedule
          </p>

        </div>

      </div>

    </section>
  )
}

export default Fixtures