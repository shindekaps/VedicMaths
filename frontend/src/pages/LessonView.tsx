import { useState } from "react";
import { theme } from "@/theme";
import { useLessonsBySutra } from "@/api/lessons";

interface LessonViewProps {
  setActive: (id: string) => void;
  sutraID: string; // Passed from curriculum
}

export const LessonView = ({ setActive, sutraID }: LessonViewProps) => {
  const { data: lessons, isLoading, error } = useLessonsBySutra(sutraID);
  const [step, setStep] = useState(0);

  if (isLoading) return <div>Loading lesson...</div>;
  if (error || !lessons || lessons.length === 0) return <div>Error loading lesson</div>;

  const cur = lessons[step];

  return (
    <div className="bg-[#FBF7EE] min-h-screen flex">
      {/* Sidebar progress */}
      <div className="w-[220px] bg-[#FFFDF7] border-r border-[#E8DEC8] p-4 flex-shrink-0">
        <div className="text-[10px] text-[#8B7355] font-mono tracking-widest uppercase mb-4">Lesson</div>
        <div className="font-serif text-[15px] font-bold text-[#1A1208] mb-5">{cur.title}</div>
        
        {lessons.map((s, i) => (
          <div key={s.id} onClick={() => setStep(i)} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer mb-1 ${step === i ? 'bg-[#E6F7F5] border border-[#075E53]/30' : ''}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${i < step ? 'bg-[#0D8A7A] text-white' : step === i ? 'bg-[#0D8A7A] text-white' : 'bg-[#E8DEC8] text-[#8B7355]'}`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`text-[12px] ${step === i ? 'text-[#0D8A7A]' : 'text-[#8B7355]'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      {/* Main lesson area */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-[680px]">
          <div className="flex justify-between items-center mb-7">
            <div>
              <div className="text-[12px] text-[#8B7355] font-mono tracking-wider mb-1">STEP {step + 1} OF {lessons.length}</div>
              <h2 className="font-serif text-[28px] text-[#1A1208]">{cur.title}</h2>
            </div>
            <div className="flex gap-1">
              {lessons.map((_, i) => (
                <div key={i} className={`w-8 h-1 rounded ${i <= step ? 'bg-[#0D8A7A]' : 'bg-[#E8DEC8]'}`} />
              ))}
            </div>
          </div>

          {/* Content card */}
          <div className="bg-white border border-[#E8DEC8] rounded-xl p-8 mb-5 shadow-sm">
            <p className="text-[16px] text-[#2D2010] leading-loose mb-5">{cur.content}</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="bg-white text-[#8B7355] border border-[#E8DEC8] rounded-lg px-6 py-3 text-sm hover:bg-gray-50">← Back</button>
            )}
            {step < lessons.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="bg-[#0D8A7A] text-white rounded-lg px-7 py-3 text-sm font-bold hover:bg-[#075E53]">Next Step →</button>
            ) : (
              <button onClick={() => setActive("practice")} className="bg-[#E8650A] text-white rounded-lg px-7 py-3 text-sm font-bold hover:bg-[#C04E00]">Start Practice ⚡</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
