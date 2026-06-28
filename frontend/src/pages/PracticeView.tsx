import { useState, useEffect } from "react";
import { startPracticeSession, getNextProblem, submitAnswer, type Problem } from "@/api/practice";
import { useAuthStore } from "@/stores/authStore";

interface PracticeViewProps {
  sutraID: string;
}

export const PracticeView = ({ sutraID }: PracticeViewProps) => {
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [ans, setAns] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const initSession = async () => {
      const { sessionID } = await startPracticeSession(sutraID);
      setSessionID(sessionID);
      const prob = await getNextProblem(sutraID);
      setProblem(prob);
    };
    initSession();
  }, [sutraID]);

  const submit = async () => {
    if (!sessionID || !problem || !user) return;
    
    const result = await submitAnswer({
      user_id: user.id, // Assuming user ID is in store
      sutra_id: sutraID,
      session_id: sessionID,
      user_answer: ans,
      correct_answer: problem.answer,
    });
    
    setIsCorrect(result.correct);
    setSubmitted(true);
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <div className="bg-[#FBF7EE] min-h-screen flex flex-col items-center justify-center p-10">
      <div className="bg-white border border-[#E8DEC8] rounded-2xl p-12 text-center shadow-sm max-w-md w-full">
        <h2 className="text-sm text-[#0D8A7A] font-mono font-bold uppercase tracking-widest mb-3">Practice Session</h2>
        <div className="font-serif text-5xl font-bold text-[#1A1208] mb-8">{problem.question}</div>
        
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
          <div className={`p-4 rounded-lg font-bold ${isCorrect ? 'bg-[#E8F5EB] text-[#2A7A3B]' : 'bg-[#FFE9EA] text-[#C0272D]'}`}>
            {isCorrect ? "Correct!" : `Incorrect. Answer was ${problem.answer}`}
          </div>
        )}
      </div>
    </div>
  );
};
