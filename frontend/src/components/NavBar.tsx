const VIEWS = [
  { id: "landing", label: "🏠 Landing" },
  { id: "curriculum", label: "📚 Curriculum" },
  { id: "lesson", label: "✨ Lesson View" },
  { id: "practice", label: "⚡ Practice" },
  { id: "games", label: "🎮 Game Modes" },
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "leaderboard", label: "🏆 Leaderboard" },
  { id: "quiz", label: "📝 Quiz" },
];

interface NavBarProps {
  active: string;
  setActive: (id: string) => void;
}

export const NavBar = ({ active, setActive }: NavBarProps) => {
  return (
    <nav className="bg-[#1A1208] border-b-2 border-[#E8650A] flex items-center px-5 gap-1 flex-wrap h-16">
      <div className="text-[#E8650A] font-serif font-bold text-base px-4 py-3 border-r border-[#ffffff22] mr-2">
        वैदिक <span className="text-white">Path</span>
      </div>
      {VIEWS.map((v) => (
        <button
          key={v.id}
          onClick={() => setActive(v.id)}
          className={`px-3 py-2 rounded text-xs transition-all ${
            active === v.id
              ? "bg-[#E8650A] text-white font-bold"
              : "text-[#aaa] hover:text-white"
          }`}
        >
          {v.label}
        </button>
      ))}
    </nav>
  );
};
