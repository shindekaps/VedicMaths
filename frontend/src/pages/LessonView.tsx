import { useState } from "react";
import { theme } from "@/theme";

// Lesson step structure
interface LessonStep {
  title: string;
  content: string;
  example: { eq: string; label: string } | null;
}

const steps: LessonStep[] = [
  { title: "What is Nikhilam?", content: "The Nikhilam Sutra states: 'All from 9 and the last from 10.' It's used to multiply numbers that are close to a base like 10, 100, or 1000. Instead of direct multiplication, we work with the deficit (how far each number is from the base).", example: null },
  { title: "Find the Deficit", content: "For any number, subtract it from the nearest base (10, 100, 1000…). This gives the deficit.", example: { eq: "97 → 100 − 97 = 3\n98 → 100 − 98 = 2", label: "Deficits for 97 × 98" } },
  { title: "Cross Subtract", content: "Subtract one number's deficit from the other number. Both give the same result — this becomes the LEFT part of the answer.", example: { eq: "97 − 2 = 95\n  (or 98 − 3 = 95) ✓", label: "Left part = 95" } },
  { title: "Multiply Deficits", content: "Multiply the two deficits together. This is the RIGHT part of the answer. The number of digits must equal the number of zeros in the base.", example: { eq: "3 × 2 = 06", label: "Right part = 06 (2 digits for base 100)" } },
  { title: "Combine!", content: "Join the left part and right part to get the final answer.", example: { eq: "95 | 06 = 9506\n97 × 98 = 9506 ✓", label: "Final Answer" } },
];

interface LessonViewProps {
  setActive: (id: string) => void;
}

export const LessonView = ({ setActive }: LessonViewProps) => {
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="bg-[#FBF7EE] min-h-screen flex">
      {/* Sidebar progress */}
      <div className="w-[220px] bg-[#FFFDF7] border-r border-[#E8DEC8] p-4 flex-shrink-0">
        <div className="text-[10px] text-[#8B7355] font-mono tracking-widest uppercase mb-4">Sutra 2 · Lesson 1</div>
        <div className="font-serif text-[15px] font-bold text-[#1A1208] mb-1">Nikhilam</div>
        <div className="text-[12px] text-[#8B7355] italic mb-5">"All from 9, last from 10"</div>
        
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer mb-1 ${step === i ? 'bg-[#E6F7F5] border border-[#075E53]/30' : ''}`}>
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
              <div className="text-[12px] text-[#8B7355] font-mono tracking-wider mb-1">STEP {step + 1} OF {steps.length}</div>
              <h2 className="font-serif text-[28px] text-[#1A1208]">{cur.title}</h2>
            </div>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div key={i} className={`w-8 h-1 rounded ${i <= step ? 'bg-[#0D8A7A]' : 'bg-[#E8DEC8]'}`} />
              ))}
            </div>
          </div>

          {/* Content card */}
          <div className="bg-white border border-[#E8DEC8] rounded-xl p-8 mb-5 shadow-sm">
            <p className="text-[16px] text-[#2D2010] leading-loose mb-5">{cur.content}</p>
            {cur.example && (
              <div className="bg-gradient-to-br from-[#E6F7F5] to-[#E6F7F5]/40 border border-[#0D8A7A]/30 rounded-lg p-5">
                <div className="text-[11px] text-[#0D8A7A] font-mono font-bold uppercase tracking-widest mb-3">{cur.example.label}</div>
                <pre className="font-serif text-[22px] text-[#1A1208] leading-loose">{cur.example.eq}</pre>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="bg-white text-[#8B7355] border border-[#E8DEC8] rounded-lg px-6 py-3 text-sm hover:bg-gray-50">← Back</button>
            )}
            {step < steps.length - 1 ? (
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
