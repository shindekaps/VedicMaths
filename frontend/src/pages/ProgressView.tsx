export const ProgressView = () => {
  const players = [
    { rank: 1, name: "Arjun S.", xp: 2880, avatar: "A" },
    { rank: 2, name: "Priya M.", xp: 2340, avatar: "P" },
    { rank: 3, name: "Kapil (You)", xp: 1450, avatar: "K" },
  ];

  return (
    <div className="bg-[#F8F4FF] min-h-screen flex flex-col font-['Nunito',sans-serif] text-[#1E1B4B]">
      {/* Header - Gradient */}
      <div className="bg-gradient-to-br from-[#1E1B4B] to-[#7C3AED] p-8 pt-10 pb-10 text-white rounded-b-[40px] shadow-lg">
        <div className="text-xl font-bold">📊 My Progress</div>
        <div className="text-xs opacity-60 mt-1">Week of June 23–29, 2026</div>
        
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { val: "12", label: "Day Streak" },
            { val: "1,450", label: "Total XP" },
            { val: "8/16", label: "Sutras Done" }
          ].map((item, i) => (
            <div key={i} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-black">{item.val}</div>
              <div className="text-[10px] opacity-70 mt-1 font-bold">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {/* Badges Section */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-[#6B7280] mb-4">🏅 Badges Earned</h2>
          <div className="flex gap-4">
            {[
              { icon: "🏆", name: "First Win" },
              { icon: "🔥", name: "10-Day Streak" }
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-3xl shadow-sm border border-gray-100">
                  {b.icon}
                </div>
                <span className="text-[10px] font-bold text-[#6B7280]">{b.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-[#6B7280] mb-4">🏆 Leaderboard</h2>
          <div className="bg-white rounded-[32px] p-2 shadow-sm border border-gray-100">
            {players.map((p) => (
              <div 
                key={p.rank} 
                className={`p-4 flex items-center gap-4 rounded-2xl border ${p.rank === 3 ? 'bg-violet-50 border-violet-100' : 'bg-transparent border-transparent'} hover:border-gray-100 transition-colors`}
              >
                <span className={`font-black w-6 text-center ${p.rank <= 3 ? 'text-[#FFD700]' : 'text-[#6B7280]'}`}>
                  {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : p.rank === 3 ? "🥉" : p.rank}
                </span>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">{p.avatar}</div>
                <div className="flex-1">
                  <div className="font-bold text-[#1E1B4B]">{p.name}</div>
                  <div className="text-[10px] font-bold text-[#6B7280] uppercase">{p.level}</div>
                </div>
                <div className="font-bold text-[#1E1B4B]">{p.xp.toLocaleString()} XP</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
