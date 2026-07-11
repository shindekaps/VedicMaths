import { useState } from "react";
import { useLessonsBySutra } from "@/api/lessons";
import { SutraShowcase } from "@/components/lesson/blocks/SutraShowcase";
import { ChallengeHook } from "@/components/lesson/blocks/ChallengeHook";
import { ConceptExplanation } from "@/components/lesson/blocks/ConceptExplanation";
import { MathematicalProof } from "@/components/lesson/blocks/MathematicalProof";
import { WorkedExample } from "@/components/lesson/blocks/WorkedExample";
import { PracticeStep } from "@/components/lesson/PracticeStep";
import { QuizWrapper } from "@/components/lesson/QuizWrapper";
import { CompleteStep } from "@/components/lesson/CompleteStep";
import type { Lesson, Block } from "@/types/lesson";

interface LessonViewProps {
  setActive: (id: string) => void;
  sutraID: string;
}

export const LessonView = ({ setActive, sutraID }: LessonViewProps) => {
  const { data: lessons, isLoading, error } = useLessonsBySutra(sutraID);
  const [sectionIndex, setSectionIndex] = useState(0);

  if (isLoading) return <div className="p-10 text-center text-white bg-navy min-h-screen">Loading...</div>;
  if (error) return <div className="p-10 text-center text-pink bg-navy min-h-screen">Error.</div>;
  if (!lessons || lessons.length === 0) return <div className="p-10 text-center text-white bg-navy min-h-screen">No lessons.</div>;

  const lesson = lessons[0] as unknown as Lesson;
  const sections = lesson.sections;

  if (!lesson || !sections || sections.length === 0) return <div className="p-10 text-center text-white bg-navy min-h-screen">Lesson content unavailable.</div>;

  const currentSection = sections[sectionIndex];

  const renderBlock = (block: Block, i: number) => {
    switch (block.type) {
      case "sutra_showcase":
        return <SutraShowcase key={i} data={block.data} />;
      case "challenge_hook":
        return <ChallengeHook key={i} data={block.data} />;
      case "concept_explanation":
        return <ConceptExplanation key={i} data={block.data} />;
      case "mathematical_proof":
        return <MathematicalProof key={i} data={block.data} />;
      case "worked_example":
        return <WorkedExample key={i} data={block.data} />;
      case "practice_service_wrapper":
      case "practice":
        return <PracticeStep key={i} sutraID={lesson.sutra_id.toString()} />;
      case "quiz":
        return <QuizWrapper key={i} stepData={block.data} />;
      case "complete":
        return <CompleteStep key={i} stepData={block.data} />;
      default:
        return <div key={i} className="text-white">Unknown block type: {block.type}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-navy text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation - Responsive */}
      <div className="w-full md:w-64 bg-white p-4 overflow-y-auto">
        <h2 className="text-ink font-bold mb-4 hidden md:block">Lesson Sections</h2>
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {sections.map((section, i) => (
              <button 
                key={section.id} 
                onClick={() => setSectionIndex(i)}
                className={`p-3 rounded-xl text-left flex items-center gap-2 flex-shrink-0 ${i === sectionIndex ? 'bg-violet text-white' : 'bg-gray-100 text-ink'}`}
              >
                <span>{section.icon}</span>
                <span className="hidden md:inline font-bold">{section.title}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 md:p-8 overflow-y-auto">
        <button onClick={() => setActive("curriculum")} className="text-white/60 font-bold mb-6">← Back to Curriculum</button>
        <h1 className="text-3xl font-bold mb-6">{currentSection.title}</h1>
        <div className="space-y-6">
          {currentSection.blocks.map((block, i) => renderBlock(block, i))}
        </div>
      </div>
    </div>
  );
};
