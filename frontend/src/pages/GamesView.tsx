export const GamesView = () => {
  const games = [
    { name: "Speed Blitz", sub: "Solve 20 sums before time runs out!", badge: "Hot", bg: "linear-gradient(135deg,#064E3B,#10B981)", icon: "⚡" },
    { name: "Number Ninja", sub: "Slash falling numbers fast!", badge: "New", bg: "linear-gradient(135deg,#1E1B4B,#7C3AED)", icon: "🥷" },
    { name: "Sutra Wars", sub: "Battle opponents in real-time.", badge: "", bg: "linear-gradient(135deg,#7C1D1D,#DC2626)", icon: "⚔️" },
    { name: "Vedic Quest", sub: "Solve puzzles to unlock secrets.", badge: "", bg: "linear-gradient(135deg,#92400E,#F59E0B)", icon: "🗺️" },
    { name: "Pattern Memory", sub: "Reproduce Vedic calculation patterns.", badge: "", bg: "linear-gradient(135deg,#701A75,#EC4899)", icon: "🧠" },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      <div className="p-6 pt-10 pb-4 border-b border-white/10 bg-white/5">
        <h2 className="text-lg font-extrabold text-white">🎮 Game Zone</h2>
        <p className="text-xs text-gold font-bold mt-1">🪙 3,240</p>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {games.map((g) => (
          <div key={g.name} className="rounded-[16px] p-3 flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform" style={{ background: g.bg }}>
            <div className="w-11 h-11 rounded-[14px] bg-white/10 flex items-center justify-center text-xl shrink-0">{g.icon}</div>
            <div className="flex-1">
              <h3 className="text-[13px] font-extrabold text-white">{g.name}</h3>
              <p className="text-[10px] text-white/50 mt-0.5">{g.sub}</p>
              {g.badge && <div className="flex gap-1 mt-1"><span className="text-[9px] font-bold text-saffron uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-full">{g.badge}</span></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
