import { useState } from "react";
import { useLessonsBySutra } from "@/api/lessons";

interface LessonViewProps {
  setActive: (id: string) => void;
  sutraID: string;
}

export const LessonView = ({ setActive, sutraID }: LessonViewProps) => {
  const { data: lessons, isLoading, error } = useLessonsBySutra(sutraID);
  const [step, setStep] = useState(0);

  if (isLoading) return <div className="p-10 text-center text-white">Loading lesson...</div>;
  if (error || !lessons || lessons.length === 0) return <div className="p-10 text-center text-pink-500">Error loading lesson</div>;

  const cur = lessons[step];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 pt-10 pb-4 border-b border-white/10 bg-white/5">
        <div className="text-[10px] font-bold text-violet-300 uppercase tracking-widest mb-1">Lesson Step {step + 1} / {lessons.length}</div>
        <h2 className="text-xl font-extrabold text-white">{cur.title}</h2>
      </div>

      {/* Progress Strip */}
      <div className="flex items-center gap-2 p-4 overflow-x-auto scrollbar-hide bg-black/20">
        {lessons.map((_, i) => (
          <div
            key={i}
            onClick={() => setStep(i)}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer ${
              step === i ? "bg-saffron text-white" : i < step ? "bg-violet-600 text-white" : "bg-white/10 text-white/50"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="bg-white rounded-[24px] p-6 text-slate-900 mb-8">
          <p className="text-sm leading-relaxed">{cur.content}</p>
        </div>

        <div className="mt-auto flex gap-4">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 bg-white/10 text-white rounded-[16px] py-4 font-bold hover:bg-white/20 transition-colors">Back</button>
          )}
          {step < lessons.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="flex-1 bg-violet-600 text-white rounded-[16px] py-4 font-bold hover:bg-violet-700 transition-colors">Next</button>
          ) : (
            <button onClick={() => setActive("practice")} className="flex-1 bg-saffron text-white rounded-[16px] py-4 font-bold hover:bg-orange-600 transition-colors">Start Practice ⚡</button>
          )}
        </div>
      </div>
    </div>
  );
};
