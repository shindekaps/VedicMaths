import { useState } from "react";

const players = [
  { rank: 1, name: "Priya Mehta", xp: 3240, streak: 22, level: "Vedic Master", avatar: "🧙‍♀️" },
  { rank: 2, name: "Rohan Gupta", xp: 2980, streak: 15, level: "Guru", avatar: "👨‍🎓" },
  { rank: 3, name: "Ananya Singh", xp: 2750, streak: 18, level: "Guru", avatar: "👩‍💻" },
  { rank: 4, name: "Arjun Sharma", xp: 2420, streak: 14, level: "Scholar", avatar: "👦", isMe: true },
  { rank: 5, name: "Kavitha Nair", xp: 2180, streak: 9, level: "Scholar", avatar: "👩" },
  { rank: 6, name: "Dev Patel", xp: 1950, streak: 7, level: "Adept", avatar: "👨" },
  { rank: 7, name: "Meera Joshi", xp: 1820, streak: 11, level: "Adept", avatar: "👩‍🏫" },
];

export const LeaderboardView = () => {
  const [tab, setTab] = useState("weekly");
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="bg-bg min-h-screen p-9">
      <h2 className="font-serif text-[30px] text-deep mb-1.5">Leaderboard</h2>
      <p className="text-muted text-sm mb-6">Top students by XP this week. Resets every Monday.</p>

      {/* Podium */}
      <div className="flex justify-center gap-4 mb-8 items-end">
        {[players[1], players[0], players[2]].map((p, i) => {
          const heights = ["h-24", "h-32", "h-20"];
          const colors = ["border-muted bg-muted/10", "border-gold bg-gold/10", "border-saffron bg-saffron/10"];
          return (
            <div key={p.rank} className="flex flex-col items-center gap-2">
              <div className="text-3xl">{p.avatar}</div>
              <div className="text-sm font-bold text-deep">{p.name.split(" ")[0]}</div>
              <div className="text-xs text-muted font-mono">{p.xp.toLocaleString()} XP</div>
              <div className={`w-20 ${heights[i]} ${colors[i]} border-2 rounded-t-[6px] flex items-start justify-center pt-2 text-2xl`}>
                {medals[p.rank - 1]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {["weekly", "monthly", "alltime"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1 text-xs border transition-colors capitalize ${
            tab === t ? "bg-deep text-white border-deep" : "bg-card text-muted border-border"
          }`}>{t}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-3 px-5 bg-[#F5F0E8] grid grid-cols-[48px_1fr_100px_80px_80px] text-[10px] text-muted font-mono tracking-widest font-bold">
          <span>RANK</span><span>STUDENT</span><span>XP</span><span>STREAK</span><span>LEVEL</span>
        </div>
        {players.map(p => (
          <div key={p.rank} className={`p-3.5 px-5 grid grid-cols-[48px_1fr_100px_80px_80px] border-b border-border items-center ${p.isMe ? 'bg-saffronLight' : ''}`}>
            <span className={`font-mono font-bold text-[15px] ${p.rank <= 3 ? 'text-gold' : 'text-muted'}`}>
              {p.rank <= 3 ? medals[p.rank - 1] : `#${p.rank}`}
            </span>
            <div className="flex gap-2.5 items-center">
              <div className="text-xl">{p.avatar}</div>
              <div className={`text-sm ${p.isMe ? 'font-bold' : ''} text-deep`}>
                {p.name} {p.isMe && <span className="text-saffron text-[11px]"> ← You</span>}
              </div>
            </div>
            <span className="font-mono font-bold text-gold text-sm">{p.xp.toLocaleString()}</span>
            <span className="text-[13px] text-ruby">🔥 {p.streak}d</span>
            <span className="text-[11px] text-accent font-bold">{p.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
