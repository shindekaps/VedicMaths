import { useState } from "react";

// Mock data based on the prototype
const GAMES = [
  { id: "blitz", name: "Speed Blitz", emoji: "⚡", color: "saffron", tag: "Solo", desc: "Answer as many problems as possible in 60 seconds. Bonus XP for speed combos.", preview: "60s · Combo · Lives" },
  { id: "ninja", name: "Number Ninja", emoji: "🥷", color: "indigo", tag: "Solo", desc: "Falling numbers — tap the correct answer before it hits the ground. Increasing speed.", preview: "Arcade · Waves · Boss" },
  { id: "wars", name: "Sutra Wars", emoji: "⚔️", color: "ruby", tag: "1v1 Live", desc: "Challenge a friend or random opponent in real-time. First to 10 correct wins.", preview: "Live · 1v1 · ELO" },
  { id: "quest", name: "Vedic Quest", emoji: "🗺️", color: "teal", tag: "Campaign", desc: "Story-driven math adventure. Solve puzzles using Vedic techniques to unlock ancient secrets.", preview: "Story · 15 Chapters" },
  { id: "memory", name: "Pattern Memory", emoji: "🧠", color: "lotus", tag: "Brain Training", desc: "Remember and reproduce Vedic calculation patterns. Tests working memory alongside math.", preview: "Memory · Patterns" },
  { id: "collab", name: "Team Challenge", emoji: "👥", color: "green", tag: "Team", desc: "Classes compete together. Every student's correct answer adds to the team total.", preview: "30 Players · Live" },
];

export const GamesView = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <div className="bg-bg min-h-screen p-9">
      <div className="mb-7">
        <h2 className="font-serif text-[30px] text-deep mb-1.5">Game Modes</h2>
        <p className="text-muted text-sm">6 ways to learn through play. Every game teaches real Vedic techniques.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMES.map(g => (
          <div key={g.id} onClick={() => setActiveGame(activeGame === g.id ? null : g.id)} 
               className={`bg-card border-2 rounded-2xl overflow-hidden cursor-pointer transition-all ${activeGame === g.id ? 'border-primary' : 'border-border'}`}>
            {/* Game header */}
            <div className={`bg-${g.color}/10 p-6 border-b border-${g.color}/20`}>
              <div className="flex justify-between items-start">
                <div className="text-4xl">{g.emoji}</div>
                <div className={`bg-${g.color}/20 border border-${g.color}/40 rounded-lg px-2.5 py-0.5 text-${g.color} text-[10px] font-bold font-mono uppercase tracking-widest`}>
                    {g.tag}
                </div>
              </div>
              <div className="font-serif text-lg font-bold text-deep mt-3">{g.name}</div>
              <div className="text-[11px] text-muted font-mono mt-1">{g.preview}</div>
            </div>
            <div className="p-5">
              <p className="text-sm text-ink leading-relaxed mb-4">{g.desc}</p>
              {activeGame === g.id && (
                <button className={`bg-${g.color} text-white rounded-lg px-5 py-2.5 text-sm font-bold w-full`}>
                    Play Now {g.emoji}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
