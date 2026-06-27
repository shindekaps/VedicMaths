import { useState } from "react";
import { theme } from "@/theme";

// Mock data based on the prototype
const SUTRAS = [
  { id: 1, name: "Ekadhikena Purvena", meaning: "By one more than the previous", topic: "Squaring numbers ending in 5", category: "Multiplication", color: theme.colors.saffron, icon: "①", mastery: 100 },
  { id: 2, name: "Nikhilam Navatashcaramam", meaning: "All from 9 and the last from 10", topic: "Multiplication near base numbers (10, 100…)", category: "Multiplication", color: theme.colors.teal, icon: "②", mastery: 85 },
  { id: 3, name: "Urdhva Tiryagbhyam", meaning: "Vertically and Cross-wise", topic: "General multiplication of any numbers", category: "Multiplication", color: theme.colors.indigo, icon: "③", mastery: 60 },
  { id: 4, name: "Paravartya Yojayet", meaning: "Transpose and Apply", topic: "Division and equations", category: "Division", color: theme.colors.ruby, icon: "④", mastery: 40 },
  { id: 5, name: "Shunyam Samyasamuccaye", meaning: "If the sum is the same, that sum is zero", topic: "Solving equations quickly", category: "Algebra", color: theme.colors.lotus, icon: "⑤", mastery: 20 },
];

interface CurriculumViewProps {
  setActive: (id: string) => void;
}

export const CurriculumView = ({ setActive }: CurriculumViewProps) => {
  const categories = ["All", "Multiplication", "Division", "Algebra", "Squares & Cubes"];
  const [cat, setCat] = useState("All");

  return (
    <div className="bg-[#FBF7EE] min-h-screen p-9">
      <div className="mb-7">
        <h2 className="font-serif text-[30px] text-[#1A1208] mb-1.5">Vedic Mathematics Curriculum</h2>
        <p className="text-[#8B7355] text-sm">16 Sutras across 3 levels. Unlock the next Sutra by mastering the previous.</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {categories.map(c => (
          <button 
            key={c} 
            onClick={() => setCat(c)} 
            className={`rounded-full px-4 py-1 text-xs border transition-colors ${
              cat === c 
                ? "bg-[#E8650A] text-white border-[#E8650A] font-bold" 
                : "bg-white text-[#8B7355] border-[#E8DEC8]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Sutra grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUTRAS.map(s => (
          <div 
            key={s.id} 
            onClick={() => setActive("lesson")} 
            className="bg-white border border-[#E8DEC8] rounded-[10px] p-[16px_20px] cursor-pointer flex gap-3 transition-all relative overflow-hidden border-t-[4px] shadow-sm hover:shadow-md"
            style={{ borderTopColor: s.color }}
          >
            <div className="w-10 h-10 rounded-[8px] flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}44`, color: s.color }}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <div className="font-serif text-[15px] font-bold text-[#1A1208] truncate">{s.name}</div>
                <div className="text-[11px] font-bold font-mono" style={{ color: s.color }}>{s.mastery}%</div>
              </div>
              <div className="text-[12px] text-[#8B7355] italic mb-1 truncate">"{s.meaning}"</div>
              <div className="text-[12px] text-[#2D2010] mb-2 truncate">{s.topic}</div>
              <div className="flex justify-end">
                <div className="text-[10px] font-bold font-mono" style={{ color: s.color }}>
                  {s.mastery === 0 ? "LOCKED" : s.mastery === 100 ? "✓ MASTERED" : "IN PROGRESS"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
