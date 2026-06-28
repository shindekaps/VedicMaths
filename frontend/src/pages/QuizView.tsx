import { useState } from "react";
import { theme } from "@/theme";

// QuizView component for interactive testing
export const QuizView = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const options = [
    { id: "a", label: "9204", correct: false },
    { id: "b", label: "9306", correct: false },
    { id: "c", label: "9506", correct: true },
    { id: "d", label: "9406", correct: false },
  ];

  return (
    <div className="bg-bg min-h-screen flex flex-col items-center justify-center p-10">
      {/* Header */}
      <div className="w-full max-w-[600px] mb-8">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs text-muted font-mono uppercase tracking-widest">QUESTION 5 OF 10 · NIKHILAM QUIZ</div>
          <div className="bg-rubyLight text-ruby text-xs font-bold px-3 py-1 rounded-full">⏱ 00:42</div>
        </div>
        <div className="h-1.5 bg-border rounded-full">
          <div className="w-1/2 h-full bg-accent rounded-full" />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-[600px] bg-card border border-border rounded-2xl p-9 mb-5 shadow-sm">
        <div className="text-xs text-accent font-mono font-bold uppercase tracking-widest mb-3.5">Using Nikhilam Sutra</div>
        <div className="font-serif text-4xl font-bold text-deep text-center py-4 tracking-tighter">97 × 98 = ?</div>
      </div>

      {/* Options */}
      <div className="w-full max-w-[600px] grid grid-cols-2 gap-3 mb-5">
        {options.map(o => {
          const isSelected = selected === o.id;
          const showResult = confirmed;
          const bg = showResult ? (o.correct ? "bg-greenLight" : (isSelected ? "bg-rubyLight" : "bg-card")) : (isSelected ? "bg-tealLight" : "bg-card");
          const border = showResult ? (o.correct ? "border-green" : (isSelected ? "border-ruby" : "border-border")) : (isSelected ? "border-accent" : "border-border");

          return (
            <button key={o.id} onClick={() => !confirmed && setSelected(o.id)} className={`border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${bg} ${border}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                isSelected ? (showResult ? (o.correct ? "bg-green text-white" : "bg-ruby text-white") : "bg-accent text-white") : "bg-border text-muted"
              }`}>
                {o.id.toUpperCase()}
              </div>
              <span className="font-serif text-[22px] font-bold text-deep">{o.label}</span>
            </button>
          );
        })}
      </div>

      {!confirmed ? (
        <button onClick={() => selected && setConfirmed(true)} className={`rounded-xl px-12 py-3.5 text-sm font-bold transition-all ${selected ? "bg-primary text-white" : "bg-border text-muted"}`}>
          Confirm Answer
        </button>
      ) : (
        <div className={`w-full max-w-[600px] rounded-xl p-5 ${selected === "c" ? "bg-greenLight border border-green" : "bg-rubyLight border border-ruby"}`}>
          <div className={`font-serif text-base font-bold mb-1.5 ${selected === "c" ? "text-green" : "text-ruby"}`}>
            {selected === "c" ? "🎉 Correct! +15 XP" : "Not quite — the answer is 9506"}
          </div>
          <div className="text-[13px] text-ink leading-loose">
            <b>Solution:</b> Deficit of 97 = 3, deficit of 98 = 2.<br />
            Cross: 97 − 2 = <b>95</b> (left part) | 3 × 2 = <b>06</b> (right part) → <b>9506</b>
          </div>
        </div>
      )}
    </div>
  );
};
