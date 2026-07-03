interface DashboardViewProps {
  setActive: (id: string) => void;
}

export const DashboardView = ({ setActive }: DashboardViewProps) => {
  return (
    <div className="bg-bg min-h-screen flex flex-col pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-violet-800 p-8 pt-12 pb-10 text-white rounded-b-[40px] shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-xs font-semibold opacity-70">Good Morning 👋</div>
            <div className="text-2xl font-bold">Kapil</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-saffron flex items-center justify-center font-bold text-lg shadow-lg">K</div>
        </div>
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 text-sm font-bold shadow-md">
          🔥 12-Day Streak &nbsp;&nbsp; ⭐ 1,450 XP
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-8 flex-1">
        
        {/* Module Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-violet-100 flex flex-col gap-2 cursor-pointer transition-transform hover:scale-[1.03]" onClick={() => setActive("curriculum")}>
            <div className="text-3xl">📖</div>
            <div className="font-bold text-ink">Curriculum</div>
            <div className="text-xs text-sub">16 Sutras</div>
            <div className="h-2 rounded-full bg-gray-100 mt-2">
              <div className="h-full rounded-full bg-violet" style={{ width: "50%" }}></div>
            </div>
          </div>
          
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-violet-100 flex flex-col gap-2 cursor-pointer transition-transform hover:scale-[1.03]" onClick={() => setActive("practice")}>
            <div className="text-3xl">✏️</div>
            <div className="font-bold text-ink">Practice Quiz</div>
            <div className="text-xs text-sub">120 Questions</div>
            <div className="h-2 rounded-full bg-gray-100 mt-2">
              <div className="h-full rounded-full bg-gold" style={{ width: "35%" }}></div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-violet-100 flex flex-col gap-2 cursor-pointer transition-transform hover:scale-[1.03]" onClick={() => setActive("games")}>
            <div className="text-3xl">🎮</div>
            <div className="font-bold text-ink">Game Mode</div>
            <div className="text-xs text-sub">5 Games</div>
            <div className="h-2 rounded-full bg-gray-100 mt-2">
              <div className="h-full rounded-full bg-green" style={{ width: "20%" }}></div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-violet-100 flex flex-col gap-2 cursor-pointer transition-transform hover:scale-[1.03]" onClick={() => setActive("progress")}>
            <div className="text-3xl">📊</div>
            <div className="font-bold text-ink">Your Stats</div>
            <div className="text-xs text-sub">Progress Track</div>
            <div className="h-2 rounded-full bg-gray-100 mt-2">
              <div className="h-full rounded-full bg-pink" style={{ width: "60%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
