'use client'
import React from 'react'

const About = () => {
  return (
    <section className="w-full bg-black text-white py-24 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">

          <p className="text-xs tracking-[6px] text-gray-500 uppercase">
            Official Tournament Information
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            About The Event
          </h2>

          <div className="w-24 h-[2px] bg-orange-500 mx-auto mt-6" />

        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* LEFT TEXT */}
          <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">

            <p>
              <span className="text-white font-semibold">
                Pre-Eid Friendship Cup 2026
              </span>{" "}
              is a community football tournament created to celebrate friendship,
              discipline, and competitive spirit among local players.
            </p>

            <p>
              This event brings together passionate footballers in a structured
              and respectful environment where teamwork and performance matter most.
            </p>

            <p>
              Matches are designed to be fast and intense, ensuring every moment
              on the field feels meaningful and competitive.
            </p>

            <p className="text-gray-400">
              Organized by <span className="text-orange-400 font-medium">Sorob</span>,
              this tournament aims to create lasting memories before Eid.
            </p>

          </div>

          {/* RIGHT INFO PANEL */}
          <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.03]">

            <h3 className="text-lg font-semibold mb-6 text-orange-400">
              Tournament Details
            </h3>

            <div className="space-y-5 text-sm">

              <div>
                <p className="text-gray-500">Date</p>
                <p className="text-white font-medium">23–24 May 2026</p>
              </div>

              <div>
                <p className="text-gray-500">Time</p>
                <p className="text-white font-medium">After Fajr Prayer</p>
              </div>

              <div>
                <p className="text-gray-500">Venue</p>
                <p className="text-white font-medium">
                  Three Floor Field, Habildar Mor, 60 Feet
                </p>

                <a
                  href="https://maps.app.goo.gl/wiBya55uQeNYBW1L9"
                  target="_blank"
                  className="inline-block mt-2 text-orange-400 hover:text-orange-300 text-xs underline"
                >
                  Open in Google Maps →
                </a>
              </div>

              <div>
                <p className="text-gray-500">Match Format</p>
                <p className="text-white font-medium">
                  10+10 min or 15+15 min (final decision)
                </p>
              </div>

              <div>
                <p className="text-gray-500">System</p>
                <p className="text-white font-medium">
                  Knockout or League (based on registration)
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* FEATURE STRIP */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">

          <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
            <p className="text-orange-400 font-semibold">FAST MATCHES</p>
            <p className="text-gray-400 text-sm mt-2">
              High intensity short-duration football games
            </p>
          </div>

          <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
            <p className="text-blue-400 font-semibold">FAIR PLAY</p>
            <p className="text-gray-400 text-sm mt-2">
              Respect, discipline, and sportsmanship first
            </p>
          </div>

          <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
            <p className="text-green-400 font-semibold">COMMUNITY EVENT</p>
            <p className="text-gray-400 text-sm mt-2">
              Built for friendship and local football culture
            </p>
          </div>

        </div>

      </div>

    </section>
  )
}

export default About