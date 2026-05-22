export const tournament = {
  groups: {
    A: ["A1", "A2", "A3"],
    B: ["B1", "B2", "B3"],
  },

  groupMatches: {
    A: [
      { home: "A1", away: "A2" },
      { home: "A1", away: "A3" },
      { home: "A2", away: "A3" },
    ],
    B: [
      { home: "B1", away: "B2" },
      { home: "B1", away: "B3" },
      { home: "B2", away: "B3" },
    ],
  },

  knockout: {
    semiFinals: [
      { home: "A1", away: "B2" },
      { home: "B1", away: "A2" },
    ],
  },

  info: {
    name: "Pre-Eid Friendship Cup 2026",
    venue: "Tin Tala Math, Habildar Mor, 60 Feet",
    format: "45 min match system",
    startTime: "06:00 AM",
  }
}