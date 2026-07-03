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
      user_id: user.id,
      sutra_id: sutraID,
      session_id: sessionID,
      user_answer: ans,
      correct_answer: problem.answer,
    });
    
    setIsCorrect(result.correct);
    setSubmitted(true);
  };

  if (!problem) return <div className="p-10 text-center text-ink">Loading problem...</div>;

  return (
    <div className="bg-bg min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-card border border-gray-100 rounded-[32px] p-8 md:p-12 text-center shadow-lg max-w-md w-full">
        <h2 className="text-xs text-sub font-bold uppercase tracking-widest mb-4">Practice Session</h2>
        <div className="font-serif text-5xl font-black text-ink mb-10">{problem.question}</div>
        
        {!submitted ? (
          <div className="flex flex-col gap-4">
            <input
              value={ans}
              onChange={(e) => setAns(e.target.value)}
              placeholder="Your answer"
              className="border-2 border-gray-100 rounded-2xl p-4 text-center text-xl focus:border-violet outline-none transition-colors"
            />
            <button 
              onClick={submit} 
              className="bg-gradient-to-r from-violet to-saffron text-white rounded-2xl p-4 font-bold hover:scale-[1.02] transition-transform shadow-md"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className={`p-6 rounded-2xl font-bold text-lg ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'}`}>
            {isCorrect ? "Correct! ✨" : `Incorrect. Answer was ${problem.answer}`}
          </div>
        )}
      </div>
    </div>
  );
};
