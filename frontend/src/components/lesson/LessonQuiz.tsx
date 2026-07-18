import React from 'react';
import { motion } from 'framer-motion';
import { type Lesson } from '../../api/lessons';
import { useLessonQuiz } from '../../hooks/useLessonQuiz';

interface LessonQuizProps {
  sutraID: string;
  lesson: Lesson;
  practiceSessionID: string | null;
  onComplete: (quizCorrectCount: number) => void;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({ sutraID, lesson, practiceSessionID, onComplete }) => {
  const {
    quizQuestions,
    currentQuizIndex,
    quizSubmitted,
    quizSelectedOption,
    setQuizSelectedOption,
    loadingQuiz,
    quizMcqOptions,
    quizCorrectAnswerVal,
    handleQuizConfirm,
    handleQuizNext,
  } = useLessonQuiz(sutraID, lesson.lessonId, practiceSessionID);

  return (
    <div className="w-full space-y-4.5 animate-fadeUp relative z-10 text-white max-w-lg mx-auto">
      {/* Header bar */}
      <div className="flex justify-between items-center px-2">
        <div className="text-sm font-black text-[#A78BFA] tracking-wide">📝 Final Quiz</div>
        <div className="text-xs text-white/40 font-bold">Q {currentQuizIndex + 1} of 20</div>
      </div>

      {loadingQuiz ? (
        <div className="bg-white/5 border border-white/10 rounded-[28px] p-12 text-center w-full animate-pulse">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-white/60 text-xs">Assembling quiz questions...</p>
        </div>
      ) : quizQuestions.length > 0 && quizQuestions[currentQuizIndex] ? (
        <div className="flex flex-col gap-4 w-full">
          {/* Progress Pips */}
          <div className="flex gap-1.5 justify-center mb-1">
            {Array.from({ length: 20 }).map((_, idx) => {
              let pipStyle = "bg-white/10";
              if (idx < currentQuizIndex) pipStyle = "bg-violet-400"; // done
              else if (idx === currentQuizIndex) pipStyle = "bg-gold animate-pulse"; // current
              return <div key={idx} className={`h-1.5 flex-1 rounded-full ${pipStyle}`} />;
            })}
          </div>

          {/* Quiz Question Box */}
          <div className="bg-violet-950/20 border-2 border-[#A78BFA]/25 rounded-3xl p-6 text-center">
            <span className="text-[9px] font-black text-[#A78BFA] uppercase tracking-widest block mb-2">
              Question {currentQuizIndex + 1} · {lesson.title}
            </span>
            <div className="text-4xl font-black text-[#A78BFA] font-serif tracking-tight">
              {(quizQuestions[currentQuizIndex].questionText || "").replace(/\^2/g, "²")}
            </div>
            <span className="text-[9px] text-white/45 font-bold block mt-3">
              Pick the correct answer
            </span>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {quizMcqOptions.map((opt, oIdx) => {
              const optionLetter = ['A', 'B', 'C', 'D'][oIdx] || 'A';
              const isSelected = quizSelectedOption === opt;
              const showResult = quizSubmitted;
              const isCorrectOpt = opt === quizCorrectAnswerVal;

              let btnStyle = "bg-white/5 border-white/10 text-white hover:bg-white/10";
              let badgeStyle = "bg-white/10 text-white/80";

              if (showResult) {
                if (isCorrectOpt) {
                  btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300";
                  badgeStyle = "bg-emerald-500 text-white";
                } else if (isSelected) {
                  btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                  badgeStyle = "bg-rose-500 text-white";
                } else {
                  btnStyle = "bg-white/5 border-white/5 text-white/40 opacity-40 pointer-events-none";
                }
              } else if (isSelected) {
                btnStyle = "bg-violet-500/20 border-violet text-violet-300";
                badgeStyle = "bg-violet text-white";
              }

              return (
                <motion.button
                  key={opt}
                  onClick={() => !quizSubmitted && setQuizSelectedOption(opt)}
                  disabled={quizSubmitted}
                  className={`border-2 rounded-2xl p-4 flex items-center gap-4 transition-all w-full text-left ${btnStyle}`}
                  whileHover={!quizSubmitted ? { scale: 1.01 } : {}}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${badgeStyle}`}>
                    {optionLetter}
                  </div>
                  <span className="font-serif text-xl font-bold flex-grow">{opt}</span>
                  {showResult && isCorrectOpt && <span className="text-xs">✓</span>}
                  {showResult && isSelected && !isCorrectOpt && <span className="text-xs">✗</span>}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-3.5 flex gap-3">
            {!quizSubmitted ? (
              <button
                onClick={handleQuizConfirm}
                disabled={!quizSelectedOption}
                className="flex-1 bg-gradient-to-r from-violet to-saffron text-white rounded-2xl py-3.5 font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={() => handleQuizNext(onComplete)}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-violet hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl py-3.5 font-black text-sm shadow-lg"
              >
                {currentQuizIndex < 19 ? 'Next Question ➜' : 'Finish Quiz 🏆'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-center w-full">
          <p className="text-white/60 text-xs">Quiz generator is currently offline.</p>
          <button onClick={() => onComplete(0)} className="mt-6 bg-violet px-6 py-2.5 rounded-2xl font-bold text-xs">
            Skip Quiz
          </button>
        </div>
      )}
    </div>
  );
};
