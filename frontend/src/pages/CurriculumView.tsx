import { useState, useMemo } from "react";
import { useSutras } from "@/api/lessons";

interface CurriculumViewProps {
  setActive: (id: string) => void;
  navigateToLesson: (sutraID: string) => void;
}

const TABS = ["All", "Easy", "Medium", "Hard"];

// Expert pedagogical classification for Vedic Mathematics Sutras
const getDifficulty = (index: number): "Easy" | "Medium" | "Hard" => {
  if (index <= 5) return "Easy";
  if (index <= 10) return "Medium";
  return "Hard";
};

export const CurriculumView = ({ setActive, navigateToLesson }: CurriculumViewProps) => {
  const { data: SUTRAS, isLoading, error } = useSutras();
  const [activeTab, setActiveTab] = useState("All");

  const filteredSutras = useMemo(() => {
    if (!SUTRAS) return [];
    if (activeTab === "All") return SUTRAS.sort((a, b) => a.order_index - b.order_index);
    return SUTRAS.filter((s) => getDifficulty(s.order_index) === activeTab).sort(
      (a, b) => a.order_index - b.order_index
    );
  }, [SUTRAS, activeTab]);

  const getCategoryColor = (index: number) => {
    const colors = ["bg-green", "bg-violet", "bg-saffron", "bg-gray-400"];
    return colors[(index - 1) % colors.length];
  };

  if (isLoading) return <div className="p-10 text-center text-ink">Loading...</div>;
  if (error) return <div className="p-10 text-center text-pink">Error loading curriculum</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 p-6 pt-10 pb-6 text-white">
        <h2 className="text-xl font-extrabold mb-1">16 Vedic Sutras</h2>
        <p className="text-xs text-white/60 mb-4">Your structured learning path</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                activeTab === tab ? "bg-gold text-slate-900" : "bg-white/10 text-white/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {filteredSutras.map((s) => (
          <div 
            key={s.id} 
            onClick={() => navigateToLesson(s.id)} 
            className="flex items-center gap-3 p-3 rounded-[14px] border border-gray-100 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className={`w-9 h-9 rounded-[12px] flex items-center justify-center text-white font-bold text-sm ${getCategoryColor(s.order_index)}`}>
              {s.order_index}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-ink text-xs">{s.name}</h3>
              <p className="text-[10px] text-sub mt-0.5">"{s.meaning}"</p>
            </div>
            <span className="text-[10px] font-bold text-green bg-green-50 px-2.5 py-1 rounded-full">Done</span>
          </div>
        ))}
      </div>
    </div>
  );
};
