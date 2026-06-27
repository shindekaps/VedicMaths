import { useState } from "react";
import { theme } from "@/theme";

interface PracticeViewProps {
  sutraID: string;
}

// PracticeView handles the interactive practice session
export const PracticeView = ({ sutraID }: PracticeViewProps) => {
  const [ans, setAns] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  // In a real app, this would be fetched from the backend via React Query
  const currentProblem = { question: "95 * 95", answer: "9025" };

  const submit = async () => {
    // Production logic: Send answer to backend
    // const result = await api.post(`/practice/${sessionID}/answer`, { answer: ans });
    const isCorrect = ans === currentProblem.answer;
    setCorrect(isCorrect);
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FBF7EE] min-h-screen flex flex-col items-center justify-center p-10">
      <div className="bg-white border border-[#E8DEC8] rounded-2xl p-12 text-center shadow-sm max-w-md w-full">
        <h2 className="text-sm text-[#0D8A7A] font-mono font-bold uppercase tracking-widest mb-3">Practice Session</h2>
        <div className="font-serif text-5xl font-bold text-[#1A1208] mb-8">{currentProblem.question}</div>
        
        {!submitted ? (
          <div className="flex flex-col gap-4">
            <input
              value={ans}
              onChange={(e) => setAns(e.target.value)}
              placeholder="Your answer"
              className="border-2 border-[#E8DEC8] rounded-lg p-4 text-center text-xl focus:border-[#0D8A7A] outline-none"
            />
            <button 
              onClick={submit} 
              className="bg-[#0D8A7A] text-white rounded-lg p-4 font-bold hover:bg-[#075E53]"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className={`p-4 rounded-lg font-bold ${correct ? 'bg-[#E8F5EB] text-[#2A7A3B]' : 'bg-[#FFE9EA] text-[#C0272D]'}`}>
            {correct ? "Correct! +20 XP" : `Incorrect. Answer was ${currentProblem.answer}`}
          </div>
        )}
      </div>
    </div>
  );
};
