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
    <div className="bg-bg min-h-screen p-6 md:p-10">
      <h2 className="font-serif text-4xl font-extrabold text-ink mb-2">Leaderboard</h2>
      <p className="text-sub text-lg mb-8">Top students by XP this week.</p>

      {/* Podium */}
      <div className="flex justify-center gap-6 mb-12 items-end">
        {[players[1], players[0], players[2]].map((p, i) => {
          const heights = ["h-24", "h-40", "h-20"];
          const colors = ["bg-gray-200", "bg-gold", "bg-orange-300"];
          return (
            <div key={p.rank} className="flex flex-col items-center gap-3">
              <div className="text-4xl">{p.avatar}</div>
              <div className="text-xs font-bold text-ink">{p.name.split(" ")[0]}</div>
              <div className={`w-20 ${heights[i]} ${colors[i]} rounded-t-[16px] flex items-start justify-center pt-4 text-3xl shadow-md`}>
                {medals[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm">
        {players.map(p => (
          <div key={p.rank} className={`p-5 flex items-center gap-4 border-b border-gray-50 last:border-0 ${p.isMe ? 'bg-violet-50' : ''}`}>
            <span className={`font-bold w-6 text-center ${p.rank <= 3 ? 'text-gold' : 'text-sub'}`}>
              {p.rank}
            </span>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">{p.avatar}</div>
            <div className="flex-1">
              <div className={`font-bold text-ink ${p.isMe ? 'text-violet' : ''}`}>{p.name} {p.isMe && <span className="text-xs text-saffron"> (You)</span>}</div>
              <div className="text-xs text-sub">{p.level}</div>
            </div>
            <div className="font-bold text-ink">{p.xp.toLocaleString()} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
};
