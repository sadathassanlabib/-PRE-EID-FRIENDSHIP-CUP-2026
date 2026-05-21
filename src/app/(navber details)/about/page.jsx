'use client'
import React from 'react'

const About = () => {
  return (
    <section className="w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white py-16 px-5">

      <div className="max-w-4xl mx-auto text-center">

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          📖 ABOUT THE TOURNAMENT
        </h2>

        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-blue-500 mx-auto mb-6 rounded-full"></div>

        {/* Description */}
        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
          The <span className="text-orange-400 font-semibold">
          Pre-Eid Friendship Cup 2026</span> is more than just a football tournament —
          it is a celebration of friendship, unity, and passion for the beautiful game ⚽🌙
          organized among local players who share the same love for football.
        </p>

        <p className="text-gray-400 text-sm md:text-base mt-4 leading-relaxed">
          With fast-paced 4v4 matches, competitive spirit, and unforgettable moments,
          this tournament brings together rising talents, creative midfielders,
          fearless strikers, and strong defenders under one goal —
          to enjoy football with respect and excitement.
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition">
            <h3 className="text-orange-400 font-bold text-lg">⚽ FORMAT</h3>
            <p className="text-gray-400 text-sm mt-2">
              4v4 fast-paced street football matches
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition">
            <h3 className="text-blue-400 font-bold text-lg">🏆 GOAL</h3>
            <p className="text-gray-400 text-sm mt-2">
              Build friendship, competition & unforgettable memories
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition">
            <h3 className="text-green-400 font-bold text-lg">🌙 THEME</h3>
            <p className="text-gray-400 text-sm mt-2">
              Pre-Eid celebration with unity & sports spirit
            </p>
          </div>

        </div>

        {/* Closing line */}
        <p className="text-gray-500 text-xs md:text-sm mt-10">
          “Football is not just a game here — it’s a bond.” ⚽🤝
        </p>

      </div>

    </section>
  )
}

export default About