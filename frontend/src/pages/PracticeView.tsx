import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePracticeSession } from '../hooks/usePracticeSession';
import { VedicBackground } from '../components/VedicBackground';
import { useSutras, useLessonsBySutra } from '../api/lessons';

interface PracticeViewProps {
  sutraID: string;
  setActive: (view: string) => void;
}

export const PracticeView = ({ sutraID, setActive }: PracticeViewProps) => {
  // Config states (defaults)
  const { data: sutras, isLoading: isSutrasLoading } = useSutras();
  const [selectedSutraId, setSelectedSutraId] = useState(sutraID || "");
  const [selectedLessonId, setSelectedLessonId] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("dynamic");
  const [totalQuestions, setTotalQuestions] = useState(10);

  // Fetch lessons dynamically based on selected sutra
  const { data: lessons } = useLessonsBySutra(selectedSutraId);

  // Sync selectedSutraId if prop updates
  useEffect(() => {
    if (sutraID) {
      setSelectedSutraId(sutraID);
    }
  }, [sutraID]);

  // Set default selectedSutraId once sutras load
  useEffect(() => {
    if (!selectedSutraId && sutras && sutras.length > 0) {
      setSelectedSutraId(sutras[0].id);
    }
  }, [sutras, selectedSutraId]);

  // Reset lesson selection when sutra changes
  useEffect(() => {
    setSelectedLessonId("all");
  }, [selectedSutraId]);

  const {
    isActive,
    config,
    problem,
    mcqOptions,
    correctAnswerVal,
    selectedOption,
    submitted,
    isAnsCorrect,
    explanationSteps,
    loadingProblem,
    timeLeft,
    correctCount,
    attemptedCount,
    isFinished,
    startSession,
    handleOptionClick,
    loadNextQuestion,
    handleFinishPractice,
  } = usePracticeSession(setActive);

  const handleStartPractice = () => {
    if (!selectedSutraId) return;
    startSession({
      sutraId: selectedSutraId,
      lessonId: selectedLessonId,
      difficulty: selectedDifficulty,
      totalQuestions: totalQuestions,
    });
  };

  const isLoading = isSutrasLoading || (loadingProblem && attemptedCount === 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-300">Preparing Vedic math board... ⚡</p>
        </div>
      </div>
    );
  }

  const formattedQuestion = problem ? (problem.questionText || (problem as any).question || "").replace(/\^2/g, "²") : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white font-sans flex flex-col p-4 relative overflow-hidden pb-20 justify-center items-center">
      <VedicBackground variant="dark" />
      
      {/* ── CASE 1: CONFIGURATION SCREEN ── */}
      {!isActive ? (
        <div className="w-full max-w-md space-y-6 z-10 animate-fadeUp bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center">
            <span className="text-3xl">⚙️</span>
            <h2 className="text-2xl font-serif font-black tracking-tight text-cyan-300 mt-2">Practice Dashboard</h2>
            <p className="text-[11px] text-white/50 mt-1">Configure your Vedic math training session</p>
          </div>

          <div className="space-y-4">
            {/* 1. Sutra Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Select Sutra</label>
              <select 
                value={selectedSutraId} 
                onChange={(e) => setSelectedSutraId(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-xs font-black text-white focus:border-cyan-400 focus:outline-none transition-colors"
              >
                {sutras?.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-950 text-white">
                    Sutra {s.sutraId}: {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Lesson Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Select Lesson</label>
              <select 
                value={selectedLessonId} 
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-xs font-black text-white focus:border-cyan-400 focus:outline-none transition-colors"
              >
                <option value="all" className="bg-slate-950 text-white">🌟 All Lessons (Combined)</option>
                {lessons?.map((l) => (
                  <option key={l.lessonId} value={l.lessonId} className="bg-slate-950 text-white">
                    Lesson {l.lessonNumber}: {l.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Difficulty */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Select Difficulty</label>
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-xs font-black text-white focus:border-cyan-400 focus:outline-none transition-colors"
              >
                <option value="dynamic" className="bg-slate-950 text-white">⚡ Dynamic (Adaptive Rules)</option>
                <option value="1" className="bg-slate-950 text-white">🌱 Easy</option>
                <option value="2" className="bg-slate-950 text-white">🚀 Medium</option>
                <option value="3" className="bg-slate-950 text-white">🧙 Hard</option>
              </select>
            </div>

            {/* 4. Number of Questions */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">Questions Count</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTotalQuestions(num)}
                    className={`py-3 rounded-2xl font-black text-xs transition-all border ${
                      totalQuestions === num
                        ? 'bg-cyan-500 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => setActive('dashboard')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 transition-transform active:scale-95 text-white rounded-2xl py-3.5 px-4 font-black text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleStartPractice}
              className="flex-1 bg-gradient-to-r from-cyan-400 to-violet hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl py-3.5 font-black text-xs shadow-lg"
            >
              Start Practice Session 🚀
            </button>
          </div>
        </div>
      ) : (
        /* ── CASE 2: ACTIVE DRILL STATE ── */
        !isFinished ? (
          <div className="w-full max-w-lg space-y-4 z-10 animate-fadeUp">
            {/* Top Info Header */}
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-black text-cyan-400 tracking-wide">✏️ Practice Mode</span>
              <span className="text-xs text-white/40 font-bold">
                Q {Math.min(attemptedCount + 1, config?.totalQuestions || 10)} of {config?.totalQuestions}
              </span>
            </div>

            {/* Timer Progress Row */}
            {problem && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-1000"
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-cyan-400 w-6 text-right select-none">{timeLeft}s</span>
              </div>
            )}

            {/* Equation Display Box */}
            <div className="bg-white/5 border-2 border-cyan-400/25 rounded-3xl p-6 text-center">
              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest block mb-2">
                Solve the Equation
              </span>
              <div className="text-4xl font-black text-cyan-300 font-serif tracking-tight">
                {formattedQuestion}
              </div>
              <span className="text-[9px] text-white/45 font-bold block mt-3">
                💡 Find the correct numerical answer below
              </span>
            </div>

            {/* Options Grid */}
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
                    <span>{opt}</span>
                    {showResult && isCorrectOpt && <span className="text-xs">✓</span>}
                    {showResult && isSelected && !isCorrectOpt && <span className="text-xs">✗</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Fancy Animated Feedback Panel */}
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
                {/* Confetti Sparkles when correct */}
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
                      ? `You ran out of time! The correct answer was indeed ${correctAnswerVal}. Let's learn why:`
                      : `The correct answer was ${correctAnswerVal}. Let's learn how to solve it!`}
                </p>

                {explanationSteps && explanationSteps.length > 0 && (
                  <div className="mt-1 text-[9px] bg-white/5 border border-white/10 p-2.5 rounded-xl font-mono text-cyan-200">
                    <div className="font-extrabold uppercase text-[8px] text-cyan-400">💡 Solution:</div>
                    <div className="mt-1 space-y-0.5">
                      {explanationSteps.map((stepText, sIdx) => (
                        <div key={sIdx}>{stepText}</div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Bottom Progress and Next Button */}
            <div className="mt-3.5 flex flex-col gap-2">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 via-violet to-saffron transition-all duration-300"
                  style={{ width: `${(attemptedCount / (config?.totalQuestions || 10)) * 100}%` }}
                />
              </div>
              
              {submitted && (
                <button
                  onClick={loadNextQuestion}
                  className="bg-gradient-to-r from-cyan-500 to-violet hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg mt-1"
                >
                  {attemptedCount >= (config?.totalQuestions || 10) ? 'Complete Practice! ➜' : 'Next Question ➜'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── CASE 3: PRACTICE DRILL COMPLETED ── */
          <div className="w-full max-w-sm text-center space-y-6 z-10 animate-fadeUp bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-[36px] bg-gradient-to-br from-violet to-saffron shadow-lg flex items-center justify-center text-5xl mb-2 animate-bounce">
                🏆
              </div>
              <div className="flex gap-1.5 mb-2 select-none">
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-black text-white mb-1">Practice Complete!</h1>
              <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Mastery Level Increased!</p>
            </div>

            <p className="text-white/70 leading-relaxed text-xs max-w-xs mx-auto">
              You successfully completed all {config?.totalQuestions} practice equations! Fantastic mental math exercises.
            </p>

            {/* Performance Stats Panel */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 w-full flex justify-around text-center divide-x divide-white/10 shadow-lg">
              <div className="flex-1">
                <span className="text-xs font-black text-gold/90 block">🎯 {correctCount}/{config?.totalQuestions}</span>
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-0.5">Correct</span>
              </div>
              <div className="flex-grow flex-shrink-0 w-1/3">
                <span className="text-xs font-black text-success block">
                  🎯 {Math.round((correctCount / (config?.totalQuestions || 10)) * 100)}%
                </span>
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-0.5">Accuracy</span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-black text-violet-300 block">
                  💎 +{correctCount * 15 + 50} XP
                </span>
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-0.5">XP Earned</span>
              </div>
            </div>

            <button
              onClick={handleFinishPractice}
              className="bg-gradient-to-r from-violet to-saffron hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg"
            >
              Finish & Return to Dashboard
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default PracticeView;
