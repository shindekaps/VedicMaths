import { useState } from "react";
import { QuizStep } from "./QuizStep";

export const QuizWrapper = ({ stepData }: { stepData: any }) => {
  const [currentQ] = useState(1);
  const totalQ = 1; // This would come from stepData in a real implementation

  return (
    <div className="flex flex-col h-full bg-white rounded-[38px] p-8 text-ink shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black">{stepData.title}</h2>
        <span className="font-bold">Q {currentQ} / {totalQ}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div className="h-full bg-saffron rounded-full" style={{ width: `${(currentQ / totalQ) * 100}%` }} />
      </div>
      <QuizStep stepData={stepData} />
    </div>
  );
};
