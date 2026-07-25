import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePracticeSession } from '../hooks/usePracticeSession';
import { VedicBackground } from '../components/VedicBackground';
import { useSutras, useLessonsBySutra } from '../api/lessons';
import { VedicLoader } from '../components/VedicLoader';
import { formatSuperscripts } from '../utils/mathUtils';

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
      <div className="min-h-screen bg-bg text-ink flex items-center justify-center">
        <VedicLoader message="Preparing Vedic math board... ⚡" />
      </div>
    );
  }

  const formattedQuestion = problem ? formatSuperscripts(problem.questionText || (problem as any).question || "") : "";

  return (
    <div className="min-h-screen bg-bg text-ink font-sans flex flex-col p-4 relative overflow-hidden pb-20 justify-center items-center">
      <VedicBackground variant="light" />
      
      {/* ── CASE 1: CONFIGURATION SCREEN ── */}
      {!isActive ? (
        <div className="w-full max-w-md space-y-6 z-10 animate-fadeUp bg-card border border-violet-200/60 rounded-[32px] p-8 shadow-card-hover text-ink">
          <div className="text-center">
            <span className="text-3xl">⚙️</span>
            <h2 className="text-2xl font-serif font-black tracking-tight text-violet mt-2">Practice Dashboard</h2>
            <p className="text-[11px] text-sub mt-1">Configure your Vedic math training session</p>
          </div>

          <div className="space-y-4">
            {/* 1. Sutra Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-saffron">Select Sutra</label>
              <select 
                value={selectedSutraId} 
                onChange={(e) => setSelectedSutraId(e.target.value)}
                className="w-full bg-bg border border-violet-200 rounded-2xl p-4 text-xs font-black text-ink focus:border-saffron focus:outline-none transition-colors"
              >
                {sutras?.map((s) => (
                  <option key={s.id} value={s.id} className="bg-card text-ink">
                    Sutra {s.sutraId}: {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Lesson Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-saffron">Select Lesson</label>
              <select 
                value={selectedLessonId} 
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full bg-bg border border-violet-200 rounded-2xl p-4 text-xs font-black text-ink focus:border-saffron focus:outline-none transition-colors"
              >
                <option value="all" className="bg-card text-ink">🌟 All Lessons (Combined)</option>
                {lessons?.map((l) => (
                  <option key={l.lessonId} value={l.lessonId} className="bg-card text-ink">
                    Lesson {l.lessonNumber}: {l.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Difficulty */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-saffron">Select Difficulty</label>
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-bg border border-violet-200 rounded-2xl p-4 text-xs font-black text-ink focus:border-saffron focus:outline-none transition-colors"
              >
                <option value="dynamic" className="bg-card text-ink">⚡ Dynamic (Adaptive Rules)</option>
                <option value="1" className="bg-card text-ink">🌱 Easy</option>
                <option value="2" className="bg-card text-ink">🚀 Medium</option>
                <option value="3" className="bg-card text-ink">🧙 Hard</option>
              </select>
            </div>

            {/* 4. Number of Questions */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-saffron block">Questions Count</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTotalQuestions(num)}
                    className={`py-3 rounded-2xl font-black text-xs transition-all border ${
                      totalQuestions === num
                        ? 'bg-saffron border-saffron text-white shadow-md shadow-saffron/20'
                        : 'bg-bg border-violet-200 text-ink hover:bg-violet-50'
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
              className="bg-bg hover:bg-violet-50 border border-violet-200 transition-transform active:scale-95 text-ink rounded-2xl py-3.5 px-4 font-black text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleStartPractice}
              className="flex-1 bg-gradient-to-r from-saffron to-violet hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl py-3.5 font-black text-xs shadow-lg shadow-saffron/20"
            >
              Start Practice Session 🚀
            </button>
          </div>
        </div>
      ) : (
        /* ── CASE 2: ACTIVE DRILL STATE ── */
        !isFinished ? (
          <div className="w-full max-w-lg space-y-4 z-10 animate-fadeUp text-ink">
            {/* Top Info Header */}
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-black text-saffron tracking-wide">✏️ Practice Mode</span>
              <span className="text-xs text-sub font-bold">
                Q {Math.min(attemptedCount + 1, config?.totalQuestions || 10)} of {config?.totalQuestions}
              </span>
            </div>

            {/* Timer Progress Row */}
            {problem && (
              <div className="flex items-center gap-3 bg-card border border-violet-200 rounded-full px-4 py-2 shadow-sm">
                <div className="flex-grow h-1.5 bg-violet-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-saffron to-gold transition-all duration-1000"
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-saffron w-6 text-right select-none">{timeLeft}s</span>
              </div>
            )}

            {/* Equation Display Box */}
            <div className="bg-card border-2 border-violet-200 rounded-3xl p-6 text-center shadow-sm">
              <span className="text-[9px] font-black text-saffron uppercase tracking-widest block mb-2">
                Solve the Equation
              </span>
              <div className="text-4xl font-black text-violet font-serif tracking-tight">
                {formattedQuestion}
              </div>
              <span className="text-[9px] text-sub font-bold block mt-3">
                💡 Find the correct numerical answer below
              </span>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              {mcqOptions.map((opt) => {
                const isSelected = selectedOption === opt;
                const showResult = submitted;
                const isCorrectOpt = opt === correctAnswerVal;

                let btnStyle = "bg-card border-violet-200 text-ink hover:bg-violet-50/50";
                if (showResult) {
                  if (isCorrectOpt) {
                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md shadow-emerald-500/10";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-50 border-rose-500 text-rose-700 shadow-md shadow-rose-500/10";
                  } else {
                    btnStyle = "bg-bg border-violet-100 text-sub opacity-40 pointer-events-none";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-violet-50 border-violet text-violet-700";
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

            {/* Fancy Animated Feedback Panel */}
            {submitted && (
              <motion.div
                className={`border-2 rounded-2xl p-5 flex flex-col gap-2 text-left relative overflow-hidden ${
                  isAnsCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm'
                    : 'bg-rose-50 border-rose-200 text-rose-800 shadow-sm'
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

                <p className="text-[10px] text-sub font-semibold leading-normal">
                  {isAnsCorrect
                    ? `Awesome speed! You've earned +15 XP. Keep up the streak! 🚀`
                    : selectedOption === correctAnswerVal && timeLeft === 0
                      ? `You ran out of time! The correct answer was indeed ${formatSuperscripts(correctAnswerVal)}. Let's learn why:`
                      : `The correct answer was ${formatSuperscripts(correctAnswerVal)}. Let's learn how to solve it!`}
                </p>

                {explanationSteps && explanationSteps.length > 0 && (
                  <div className="mt-1 text-[9px] bg-violet-50 border border-violet-200 p-2.5 rounded-xl font-mono text-ink">
                    <div className="font-extrabold uppercase text-[8px] text-saffron">💡 Solution:</div>
                    <div className="mt-1 space-y-0.5">
                      {explanationSteps.map((stepText, sIdx) => (
                        <div key={sIdx}>{formatSuperscripts(stepText)}</div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Bottom Progress and Next Button */}
            <div className="mt-3.5 flex flex-col gap-2">
              <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-saffron via-violet to-gold transition-all duration-300"
                  style={{ width: `${(attemptedCount / (config?.totalQuestions || 10)) * 100}%` }}
                />
              </div>
              
              {submitted && (
                <button
                  onClick={loadNextQuestion}
                  className="bg-gradient-to-r from-saffron to-violet hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg shadow-saffron/20 mt-1"
                >
                  {attemptedCount >= (config?.totalQuestions || 10) ? 'Complete Practice! ➜' : 'Next Question ➜'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── CASE 3: PRACTICE DRILL COMPLETED ── */
          <div className="w-full max-w-sm text-center space-y-6 z-10 animate-fadeUp bg-card border border-violet-200/60 rounded-[32px] p-8 shadow-card-hover text-ink">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-[36px] bg-gradient-to-br from-saffron to-violet shadow-lg flex items-center justify-center text-5xl mb-2 animate-bounce">
                🏆
              </div>
              <div className="flex gap-1.5 mb-2 select-none">
                <span className="text-2xl animate-bounce text-gold" style={{ animationDelay: '0.1s' }}>⭐</span>
                <span className="text-2xl animate-bounce text-gold" style={{ animationDelay: '0.2s' }}>⭐</span>
                <span className="text-2xl animate-bounce text-gold" style={{ animationDelay: '0.3s' }}>⭐</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-black text-ink mb-1">Practice Complete!</h1>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Mastery Level Increased!</p>
            </div>

            <p className="text-sub leading-relaxed text-xs max-w-xs mx-auto">
              You successfully completed all {config?.totalQuestions} practice equations! Fantastic mental math exercises.
            </p>

            {/* Performance Stats Panel */}
            <div className="bg-violet-50 border border-violet-100 rounded-3xl p-5 w-full flex justify-around text-center divide-x divide-violet-200 shadow-sm">
              <div className="flex-1">
                <span className="text-xs font-black text-saffron block">🎯 {correctCount}/{config?.totalQuestions}</span>
                <span className="text-[9px] text-sub/65 font-bold uppercase tracking-wider block mt-0.5">Correct</span>
              </div>
              <div className="flex-grow flex-shrink-0 w-1/3">
                <span className="text-xs font-black text-emerald-600 block">
                  🎯 {Math.round((correctCount / (config?.totalQuestions || 10)) * 100)}%
                </span>
                <span className="text-[9px] text-sub/65 font-bold uppercase tracking-wider block mt-0.5">Accuracy</span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-black text-violet block">
                  💎 +{correctCount * 15 + 50} XP
                </span>
                <span className="text-[9px] text-sub/65 font-bold uppercase tracking-wider block mt-0.5">XP Earned</span>
              </div>
            </div>

            <button
              onClick={handleFinishPractice}
              className="bg-gradient-to-r from-saffron to-violet hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg shadow-saffron/20"
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
