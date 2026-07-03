import { useState } from "react";

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
    <div className="bg-bg min-h-screen flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="w-full max-w-[600px] mb-8">
        <div className="flex justify-between items-center mb-3">
          <div className="text-[10px] text-sub font-bold uppercase tracking-widest">Question 5 of 10</div>
          <div className="bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full">⏱ 00:42</div>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-gradient-to-r from-violet to-saffron rounded-full" />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-[600px] bg-card rounded-[32px] p-8 mb-6 shadow-sm border border-gray-100">
        <div className="text-[10px] text-violet font-bold uppercase tracking-widest mb-3">Using Nikhilam Sutra</div>
        <div className="font-serif text-4xl font-black text-ink text-center py-6 tracking-tight">97 × 98 = ?</div>
      </div>

      {/* Options */}
      <div className="w-full max-w-[600px] grid grid-cols-2 gap-4 mb-6">
        {options.map(o => {
          const isSelected = selected === o.id;
          const showResult = confirmed;
          const baseClasses = "border-2 rounded-2xl p-6 flex items-center gap-4 transition-all ";
          
          let stateClasses = "bg-white border-gray-100 ";
          if (showResult && o.correct) stateClasses = "bg-green-100 border-green-500 ";
          else if (showResult && isSelected && !o.correct) stateClasses = "bg-pink-100 border-pink-500 ";
          else if (isSelected) stateClasses = "bg-violet-50 border-violet ";

          return (
            <button key={o.id} onClick={() => !confirmed && setSelected(o.id)} className={baseClasses + stateClasses}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                isSelected ? 'bg-violet text-white' : 'bg-gray-100 text-sub'
              }`}>
                {o.id.toUpperCase()}
              </div>
              <span className="font-serif text-2xl font-bold text-ink">{o.label}</span>
            </button>
          );
        })}
      </div>

      {!confirmed ? (
        <button 
          onClick={() => selected && setConfirmed(true)} 
          disabled={!selected}
          className={`rounded-2xl px-12 py-4 font-black transition-all ${selected ? "bg-gradient-to-r from-violet to-saffron text-white shadow-lg hover:scale-[1.02]" : "bg-gray-200 text-sub"}`}
        >
          Confirm Answer
        </button>
      ) : (
        <div className={`w-full max-w-[600px] rounded-2xl p-6 border ${selected === "c" ? "bg-green-50 border-green-200" : "bg-pink-50 border-pink-200"}`}>
          <div className={`font-serif text-lg font-bold mb-2 ${selected === "c" ? "text-green-700" : "text-pink-700"}`}>
            {selected === "c" ? "🎉 Correct! +15 XP" : "Not quite — the answer is 9506"}
          </div>
          <div className="text-sm text-ink leading-relaxed">
            <b>Solution:</b> Deficit of 97 is 3, deficit of 98 is 2. 
            Cross subtract: 97 - 2 = 95 | 3 × 2 = 06. → 9506
          </div>
        </div>
      )}
    </div>
  );
};
