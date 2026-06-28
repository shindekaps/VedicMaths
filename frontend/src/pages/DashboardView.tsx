import { theme } from "@/theme";

// Dashboard component showing user statistics and activity
export const DashboardView = ({ setActive }: { setActive: (id: string) => void }) => {
  const activity = [3, 5, 2, 7, 4, 6, 1];
  
  return (
    <div className="bg-bg min-h-screen p-9">
      {/* Header */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <div className="text-sm text-muted mb-1">Good morning,</div>
          <h2 className="font-serif text-[28px] text-deep mb-2">Arjun Sharma 👋</h2>
          <div className="flex gap-3">
            <span className="bg-saffronLight text-primary text-xs px-3 py-1 rounded-full font-bold">🔥 14 Day Streak</span>
            <span className="bg-tealLight text-accent text-xs px-3 py-1 rounded-full font-bold">Level 8 · Scholar</span>
          </div>
        </div>
        <button onClick={() => setActive("practice")} className="bg-primary text-white rounded-lg px-6 py-3 text-sm font-bold hover:bg-opacity-90">
          Continue Learning →
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total XP", value: "4,820", color: "text-secondary" },
          { label: "Sutras Mastered", value: "5 / 16", color: "text-accent" },
          { label: "Problems Solved", value: "1,247", color: "text-indigo-800" },
          { label: "Accuracy", value: "83%", color: "text-green-700" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="text-[10px] text-muted font-mono mb-2">{s.label.toUpperCase()}</div>
            <div className={`font-serif text-[26px] font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-sm font-bold text-deep mb-4">This Week's Activity</div>
        <div className="flex gap-2 items-end h-20 mb-2">
            {activity.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-accent rounded-t-sm" style={{ height: `${v * 10}px` }} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
