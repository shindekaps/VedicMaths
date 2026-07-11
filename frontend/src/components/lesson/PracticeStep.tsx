import { useState, useEffect } from "react";
import { getNextProblem, type Problem } from "@/api/practice";

export const PracticeStep = ({ sutraID }: { sutraID: string }) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getNextProblem(sutraID);
        setProblem(data);
      } catch (e) {
        console.error("Failed to fetch practice problem", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [sutraID]);

  if (loading) return <div className="text-white p-8">Generating problem...</div>;
  if (!problem) return <div className="text-white p-8">Failed to load problem.</div>;

  return (
    <div className="flex flex-col h-full bg-white rounded-[38px] p-8 text-ink shadow-2xl">
      <h2 className="text-2xl font-black mb-4">Your Turn</h2>
      <div className="text-4xl font-mono font-bold text-violet mb-6">{problem.question}</div>
      <div className="grid grid-cols-2 gap-4">
        {/* Simplified mock options based on answer */}
        <button className="p-4 bg-gray-100 rounded-xl font-bold hover:bg-violet-100 transition-colors">
          {problem.answer}
        </button>
        {/* ... add more mock options ... */}
      </div>
    </div>
  );
};
