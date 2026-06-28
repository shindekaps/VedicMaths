import { useState } from "react";
import { theme } from "@/theme";
import { useSutras } from "@/api/lessons";

interface CurriculumViewProps {
  setActive: (id: string) => void;
}

// Map order_index to a color for variety
const getColor = (index: number) => {
  const colors = [theme.colors.saffron, theme.colors.teal, theme.colors.indigo, theme.colors.ruby, theme.colors.lotus];
  return colors[index % colors.length];
};

export const CurriculumView = ({ setActive }: CurriculumViewProps) => {
  const { data: SUTRAS, isLoading, error } = useSutras();
  const categories = ["All", "Multiplication", "Division", "Algebra", "Squares & Cubes"];
  const [cat, setCat] = useState("All");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading curriculum</div>;

  return (
    <div className="bg-[#FBF7EE] min-h-screen p-9">
      <div className="mb-7">
        <h2 className="font-serif text-[30px] text-[#1A1208] mb-1.5">Vedic Mathematics Curriculum</h2>
        <p className="text-[#8B7355] text-sm">16 Sutras. Unlock the next Sutra by mastering the previous.</p>
      </div>

      {/* Sutra grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUTRAS?.sort((a,b) => a.OrderIndex - b.OrderIndex).map(s => {
          const color = getColor(s.OrderIndex);
          return (
            <div 
              key={s.ID} 
              onClick={() => setActive("lesson")} 
              className="bg-white border border-[#E8DEC8] rounded-[10px] p-[16px_20px] cursor-pointer flex gap-3 transition-all relative overflow-hidden border-t-[4px] shadow-sm hover:shadow-md"
              style={{ borderTopColor: color }}
            >
              <div className="w-10 h-10 rounded-[8px] flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}44`, color: color }}>
                {s.OrderIndex}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-serif text-[15px] font-bold text-[#1A1208] truncate">{s.Name}</div>
                </div>
                <div className="text-[12px] text-[#8B7355] italic mb-1 truncate">"{s.Meaning}"</div>
                <div className="text-[12px] text-[#2D2010] mb-2 truncate">{s.Description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
