import { useState } from "react";
import { useLessonsBySutra } from "@/api/lessons";
import { IntroStep } from "@/components/lesson/IntroStep";

interface LessonViewProps {
  setActive: (id: string) => void;
  sutraID: string;
}

export const LessonView = ({ setActive, sutraID }: LessonViewProps) => {
  const { data: lessons, isLoading, error } = useLessonsBySutra(sutraID);
  const [step, setStep] = useState(0);

  if (isLoading) return <div className="p-10 text-center text-white">Loading...</div>;
  if (error) return <div className="p-10 text-center text-pink">Error.</div>;
  if (!lessons || lessons.length === 0) return <div className="p-10 text-center text-white">No lessons.</div>;

  const lesson = lessons[0];
  const steps = lesson.steps as Array<Array<{ Key: string; Value: any }>>;

  if (!lesson || !steps || steps.length === 0) return <div className="p-10 text-center text-white">Lesson content unavailable.</div>;

  const renderStep = () => {
    const currentStepArray = steps[step];
    // Find the object with Key "type" to determine the type
    const typeObj = currentStepArray.find(i => i.Key === "type");
    const dataObj = currentStepArray.find(i => i.Key === "data");
    
    switch (typeObj?.Value) {
      case "intro":
        return <IntroStep stepData={dataObj?.Value} />;
      default:
        return <div className="text-white">Unknown step type: {typeObj?.Value}</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-navy text-white font-sans p-6 overflow-y-auto">
      {/* Top Bar - Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setActive("curriculum")} className="text-white/60 font-bold">← Back</button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow mb-8">
        {renderStep()}
      </div>

      {/* Navigation & Progress */}
      <div className="flex flex-col gap-6 mt-auto">
        <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-saffron' : 'w-2 bg-white/20'}`} />
            ))}
        </div>

        <button 
          onClick={() => step < steps.length - 1 ? setStep(step + 1) : setActive("practice")} 
          className="w-full bg-violet rounded-full py-5 font-bold text-lg shadow-lg shadow-violet/30 transition-colors"
        >
          {step === 0 ? "Start Learning →" : step < steps.length - 1 ? "Next Step" : "Practice ⚡"}
        </button>
      </div>
    </div>
  );
};
