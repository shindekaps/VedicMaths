import React from 'react';
import { motion } from 'framer-motion';
import { type Lesson } from '../../api/lessons';
import { useLessonPractice } from '../../hooks/useLessonPractice';
import { formatSuperscripts } from '../../utils/mathUtils';

interface LessonPracticeProps {
  sutraID: string;
  lesson: Lesson;
  onSessionStart: (sessionID: string) => void;
  onComplete: (correctCount: number) => void;
}

export const LessonPractice: React.FC<LessonPracticeProps> = ({ sutraID, lesson, onSessionStart, onComplete }) => {
  const {
    practiceSessionID,
    practiceProblem,
    submitted,
    isAnsCorrect,
    attemptedCount,
    loadingProblem,
    mcqOptions,
    selectedOption,
    timeLeft,
    correctAnswerVal,
    explanationSteps,
    handleOptionClick,
    loadNextPracticeQuestion,
  } = useLessonPractice(sutraID, lesson.lessonId);

  // Propagate session ID up to parent when it is initialized
  React.useEffect(() => {
    if (practiceSessionID) {
      onSessionStart(practiceSessionID);
    }
  }, [practiceSessionID, onSessionStart]);

  return (
    <div className="w-full space-y-4.5 animate-fadeUp relative z-10 text-white max-w-lg mx-auto">
      {/* Header bar */}
      <div className="flex justify-between items-center px-2">
        <div className="text-sm font-black text-cyan-400 tracking-wide">✏️ Your Turn</div>
        <div className="text-xs text-white/40 font-bold">Q {Math.min(attemptedCount + 1, 6)} of 6</div>
      </div>

      {loadingProblem ? (
        <div className="bg-white/5 border border-white/10 rounded-[28px] p-12 text-center w-full animate-pulse">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-white/60 text-xs">Generating a new equation...</p>
        </div>
      ) : practiceProblem ? (
        <div className="flex flex-col gap-4 w-full">
          {/* Timer Row */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-1000"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-cyan-400 w-6 text-right select-none">{timeLeft}s</span>
          </div>

          {/* Question Box */}
          <div className="bg-white/5 border-2 border-cyan-400/25 rounded-3xl p-6 text-center">
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest block mb-2">
              Apply {lesson.title}
            </span>
            <div className="text-4xl font-black text-cyan-300 font-serif tracking-tight">
              {formatSuperscripts(practiceProblem.questionText || "")}
            </div>
            <span className="text-[9px] text-white/45 font-bold block mt-3">
              💡 Tip: Find the deficit or multiply vertically!
            </span>
          </div>

          {/* MCQ Options */}
          <div className="grid grid-cols-2 gap-3.5">
            {mcqOptions.map((opt) => {
              const isSelected = selectedOption === opt;
              const showResult = submitted;
              const isCorrectOpt = opt === correctAnswerVal;

              let btnStyle = "bg-white/5 border-white/10 text-white hover:bg-white/10";
              if (showResult) {
                if (isCorrectOpt) {
                  btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10";
                } else if (isSelected) {
                  btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/10";
                } else {
                  btnStyle = "bg-white/5 border-white/5 text-white/40 opacity-40 pointer-events-none";
                }
              } else if (isSelected) {
                btnStyle = "bg-violet-500/20 border-violet text-violet-300";
              }

              return (
                <motion.button
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  disabled={submitted}
                  className={`border-2 rounded-2xl py-4 text-center font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 ${btnStyle}`}
                  whileHover={!submitted ? { scale: 1.02 } : {}}
                >
                  <span>{formatSuperscripts(opt)}</span>
                  {showResult && isCorrectOpt && <span className="text-xs">✓</span>}
                  {showResult && isSelected && !isCorrectOpt && <span className="text-xs">✗</span>}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {submitted && (
            <motion.div
              className={`border-2 rounded-2xl p-5 flex flex-col gap-2 text-left relative overflow-hidden ${
                isAnsCorrect
                  ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                  : 'bg-rose-500/10 border-rose-400/40 text-rose-200 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
              }`}
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              {/* Confetti Particles */}
              {isAnsCorrect && (
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 left-[20%] text-lg"
                    animate={{ y: [-10, -80], x: [0, -15, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2 }}
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    className="absolute bottom-0 left-[50%] text-lg"
                    animate={{ y: [-10, -90], x: [0, 10, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.4 }}
                  >
                    ⭐
                  </motion.div>
                  <motion.div
                    className="absolute bottom-0 left-[80%] text-lg"
                    animate={{ y: [-10, -75], x: [0, -10, 10], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.1 }}
                  >
                    🎉
                  </motion.div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {isAnsCorrect ? (
                  <motion.span
                    className="text-lg"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                  >
                    🎉
                  </motion.span>
                ) : (
                  <span className="text-lg">⏰</span>
                )}
                <span className="text-xs font-black uppercase tracking-wider">
                  {isAnsCorrect 
                    ? 'Woohoo! Correct! Super Job! ⭐' 
                    : selectedOption === correctAnswerVal && timeLeft === 0
                      ? "Time's Up! Here's the solution!"
                      : 'Time for a Clue!'}
                </span>
              </div>

              <p className="text-[10px] text-white/75 font-semibold leading-normal">
                {isAnsCorrect
                  ? `Awesome speed! You've earned +15 XP. Keep up the streak! 🚀`
                  : selectedOption === correctAnswerVal && timeLeft === 0
                    ? `You ran out of time! The correct answer was indeed ${formatSuperscripts(correctAnswerVal)}. Let's learn why:`
                    : `The correct answer was ${formatSuperscripts(correctAnswerVal)}. Let's learn how to solve it!`}
              </p>

              {explanationSteps && explanationSteps.length > 0 && (
                <div className="mt-1 text-[9px] bg-white/5 border border-white/10 p-2.5 rounded-xl font-mono text-cyan-200">
                  <div className="font-extrabold uppercase text-[8px] text-cyan-400">💡 Solution:</div>
                  <div className="mt-1 space-y-0.5">
                    {explanationSteps.map((stepText, sIdx) => (
                      <div key={sIdx}>{formatSuperscripts(stepText)}</div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Footer Navigation Bar */}
          <div className="mt-3.5 flex flex-col gap-2">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-violet to-saffron transition-all duration-300"
                style={{ width: `${(attemptedCount / 6) * 100}%` }}
              />
            </div>
            
            {submitted && (
              <button
                onClick={() => loadNextPracticeQuestion(onComplete)}
                className="bg-gradient-to-r from-cyan-500 to-violet hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg mt-1"
              >
                {attemptedCount >= 6 ? 'Complete Practice! ➜' : 'Next Question ➜'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-center w-full">
          <p className="text-white/60 text-xs">Practice generator is currently offline.</p>
          <button onClick={() => onComplete(0)} className="mt-6 bg-violet px-6 py-2.5 rounded-2xl font-bold text-xs">
            Skip to Finish
          </button>
        </div>
      )}
    </div>
  );
};
