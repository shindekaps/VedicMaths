import { useAuthStore } from '../stores/authStore';

interface NavBarProps {
  active: string;
  setActive: (id: string) => void;
}

export const NavBar = ({ active, setActive }: NavBarProps) => {
  const { logout } = useAuthStore();
  const VIEWS = [
    { id: "dashboard", label: "Home", icon: "🏠" },
    { id: "curriculum", label: "Learn", icon: "📚" },
    { id: "games", label: "Games", icon: "🎮" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white border-b border-gray-100 z-50 h-16 items-center px-8 justify-between">
        <div className="font-serif font-black text-2xl text-violet">VedicPath</div>
        <div className="flex gap-8 items-center">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive(v.id)}
              className={`font-bold transition-colors ${active === v.id ? "text-violet" : "text-sub hover:text-ink"}`}
            >
              {v.label}
            </button>
          ))}
          <div className="h-4 w-px bg-gray-200 mx-2" />
          <button
            onClick={logout}
            className="font-bold text-sub hover:text-red-600 transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 flex items-center justify-around py-2 shadow-lg z-50">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v.id)}
            className={`flex flex-col items-center gap-1 p-2 text-[10px] font-bold transition-colors ${
              active === v.id ? "text-violet" : "text-gray-400"
            }`}
          >
            <span className="text-xl">{v.icon}</span>
            <span>{v.label}</span>
          </button>
        ))}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 p-2 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </nav>
    </>
  );
};
