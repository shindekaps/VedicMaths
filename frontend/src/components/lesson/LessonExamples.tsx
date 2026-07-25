import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Lesson } from '../../api/lessons';
import { Sutra1PartitionVisualizer, Sutra3DigitGridVisualizer, Sutra2ComplementVisualizer } from '../Visualizers';
import { formatSuperscripts } from '../../utils/mathUtils';

interface LessonExamplesProps {
  lesson: Lesson;
  onComplete: () => void;
}

export const LessonExamples: React.FC<LessonExamplesProps> = ({ lesson, onComplete }) => {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [revealedStepsCount, setRevealedStepsCount] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  const currentEx = lesson.examples[exampleIndex];
  const allRevealed = currentEx ? revealedStepsCount >= currentEx.steps.length : false;

  useEffect(() => {
    if (!isRevealing || !currentEx) return;

    const interval = setInterval(() => {
      setRevealedStepsCount((prev) => {
        if (prev < currentEx.steps.length) {
          return prev + 1;
        } else {
          setIsRevealing(false);
          return prev;
        }
      });
    }, 100); // 100ms delay between step animations

    return () => clearInterval(interval);
  }, [isRevealing, currentEx]);

  // Reset steps reveal whenever active example changes
  useEffect(() => {
    setRevealedStepsCount(0);
    setIsRevealing(false);
  }, [exampleIndex]);

  if (!currentEx) {
    return (
      <div className="bg-white rounded-[32px] p-8 text-center w-full max-w-lg mx-auto">
        <p className="text-slate-500">No examples found for this lesson.</p>
        <button onClick={onComplete} className="mt-4 bg-violet text-white px-6 py-2.5 rounded-2xl font-bold">
          Continue
        </button>
      </div>
    );
  }

  const handleNextExample = () => {
    if (exampleIndex < lesson.examples.length - 1) {
      setExampleIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const stepColorSet = [
    { bg: 'linear-gradient(135deg, #0EA5E9, #06B6D4)', titleColor: '#0C4A6E' },
    { bg: 'linear-gradient(135deg, #7C3AED, #A78BFA)', titleColor: '#5B21B6' },
    { bg: 'linear-gradient(135deg, #10B981, #6EE7B7)', titleColor: '#065F46' },
  ];

  return (
    <div className="w-full flex flex-col flex-1 bg-[#F8F4FF] min-h-0 max-w-lg mx-auto rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl animate-fadeUp">
      {/* Teal gradient header */}
      <div className="bg-gradient-to-br from-[#0C4A6E] to-[#0EA5E9] px-5 py-5 text-white flex-shrink-0">
        <div className="text-[9px] font-bold tracking-[2px] uppercase text-white/40">
          Step {exampleIndex + 1} of {lesson.examples.length} · Worked Example
        </div>
        <h2 className="font-serif text-lg font-black text-sky-200 mt-1.5 leading-tight">
          Solve: {formatSuperscripts(currentEx.problem)}
        </h2>
        <p className="text-[10px] text-white/50 mt-1">Follow each step</p>
      </div>

      {/* Scrollable content body */}
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar min-h-0">
        {/* Partition / Grid Visualizations */}
        {lesson.sutraNumber === 1 ? (
          <Sutra1PartitionVisualizer problem={currentEx.problem} />
        ) : lesson.sutraNumber === 2 ? (
          <Sutra2ComplementVisualizer problem={currentEx.problem} />
        ) : lesson.sutraNumber === 3 ? (
          <Sutra3DigitGridVisualizer problem={currentEx.problem} />
        ) : (
          /* General Equation Card for other Sutras */
          <div className="bg-white rounded-[14px] p-5 border border-indigo-100 text-center shadow-sm flex flex-col items-center">
            <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-indigo-500 mb-2">
              Equation
            </div>
            <div className="text-3xl font-black text-[#1E1B4B] font-serif tracking-tight my-1">
              {formatSuperscripts(currentEx.problem)}
            </div>
            <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed font-semibold">
              {formatSuperscripts(currentEx.explanation)}
            </p>
          </div>
        )}

        {/* Revealed Step Cards */}
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {currentEx.steps.slice(0, revealedStepsCount).map((stepText, idx) => {
              const sc = stepColorSet[idx % stepColorSet.length] || stepColorSet[0];
              return (
                <motion.div
                  key={idx}
                  layout
                  className="flex gap-2.5 bg-white rounded-[10px] p-2.5 px-3 border border-[#E0F2FE] shadow-sm"
                  initial={{ scale: 0.9, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                >
                  <div
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5"
                    style={{ background: sc.bg }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-extrabold" style={{ color: sc.titleColor }}>
                      Step {idx + 1}
                    </div>
                    <div className="text-[11px] text-slate-600 leading-snug font-mono">
                      {formatSuperscripts(stepText)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Answer Card – shown after all steps revealed */}
          {allRevealed && (
            <motion.div
              layout
              className="flex gap-2.5 rounded-[10px] p-2.5 px-3 border-2"
              style={{ background: '#D1FAE5', borderColor: '#10B981' }}
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: [0.9, 1.04, 1], opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              <div className="w-[22px] h-[22px] rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-extrabold" style={{ color: '#065F46' }}>Answer</div>
                <div className="text-sm font-black text-[#065F46] font-mono">
                  {formatSuperscripts(currentEx.solution)}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3.5 border-t border-[#E0F2FE] bg-white/60 flex-shrink-0">
        {!allRevealed ? (
          <button
            onClick={() => setIsRevealing(true)}
            disabled={isRevealing}
            className="w-full py-3 rounded-xl font-serif font-black text-sm text-white shadow-md active:scale-[0.98] transition-transform disabled:opacity-75"
            style={{ background: 'linear-gradient(135deg, #0C4A6E, #0EA5E9)' }}
          >
            {isRevealing ? 'Revealing Steps...' : 'Reveal Steps 👇'}
          </button>
        ) : (
          <button
            onClick={handleNextExample}
            className="w-full py-3 rounded-xl font-serif font-black text-sm text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #0C4A6E, #0EA5E9)' }}
          >
            {exampleIndex < lesson.examples.length - 1 ? 'Next Example ➜' : 'Practice Examples ➜'}
          </button>
        )}
      </div>
    </div>
  );
};
