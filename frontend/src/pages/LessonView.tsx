import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLessonsBySutra, type Lesson } from '../api/lessons';
import { startPracticeSession, getNextProblem, submitAnswer, type Problem } from '../api/practice';
import { useProgress } from '../api/stats';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';
import { MandalaDecor } from '../components/MandalaDecor';

interface LessonViewProps {
  setActive: (id: string) => void;
  sutraID: string;
}

const generateMCQOptions = (answerStr: string) => {
  const ans = parseInt(answerStr, 10);
  if (isNaN(ans)) {
    return [answerStr, "10", "20", "30"].sort(() => Math.random() - 0.5);
  }
  const set = new Set<string>([answerStr]);
  const offsets = [10, -10, 2, -2, 20, -20, 100, -100, 1, -1, 5, -5];
  while (set.size < 4) {
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    const candidate = ans + offset;
    if (candidate > 0) {
      set.add(candidate.toString());
    }
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
};

// Parse multiplication/squaring problem string for digit grid visualization
const parseDigitGrid = (problem: string): { num1Digits: number[]; num2Digits: number[] } | null => {
  try {
    if (problem.includes('²')) {
      const num = parseInt(problem.replace('²', '').trim(), 10);
      if (isNaN(num)) return null;
      const digits = num.toString().split('').map(Number);
      return { num1Digits: digits, num2Digits: digits };
    }
    const match = problem.match(/(\d+)\s*[×x*]\s*(\d+)/i);
    if (match) {
      return {
        num1Digits: match[1].split('').map(Number),
        num2Digits: match[2].split('').map(Number),
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const LessonView = ({ setActive, sutraID }: LessonViewProps) => {
  const { data: lessons, isLoading: isLessonsLoading, error: lessonsError } = useLessonsBySutra(sutraID);
  const { data: progressRes, isLoading: isProgressLoading } = useProgress();
  const { user } = useAuthStore();

  // State to track which lesson is active. If null, show the list of lessons.
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Slideshow States
  const [step, setStep] = useState(0); // 0: Intro, 1: Theory, 2: Examples, 3: Practice, 4: Quiz, 5: Complete
  const [exampleIndex, setExampleIndex] = useState(0);
  const [revealedStepsCount, setRevealedStepsCount] = useState(0);

  // Practice States
  const [practiceSessionID, setPracticeSessionID] = useState<string | null>(null);
  const [practiceProblem, setPracticeProblem] = useState<Problem | null>(null);
  const [userAns, setUserAns] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isAnsCorrect, setIsAnsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [loadingProblem, setLoadingProblem] = useState(false);

  // MCQ & Timer States
  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctAnswerVal, setCorrectAnswerVal] = useState<string>('');
  const [explanationSteps, setExplanationSteps] = useState<string[]>([]);

  // Quiz States
  const [quizQuestions, setQuizQuestions] = useState<Problem[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizAnsCorrect, setQuizAnsCorrect] = useState<boolean | null>(null);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizMcqOptions, setQuizMcqOptions] = useState<string[]>([]);
  const [quizCorrectAnswerVal, setQuizCorrectAnswerVal] = useState<string>('');
  const [quizExplanationSteps, setQuizExplanationSteps] = useState<string[]>([]);
  const [quizTimeLeft, setQuizTimeLeft] = useState(30);

  // Local expression solver
  const solveProblemLocally = (questionText: string): number => {
    let clean = questionText.replace('×', '*').replace('=', '').replace('?', '').trim();
    if (clean.includes('²')) {
      const num = parseInt(clean.replace('²', '').trim(), 10);
      return num * num;
    }
    if (clean.includes('*')) {
      const parts = clean.split('*');
      const num1 = parseInt(parts[0].trim(), 10);
      const num2 = parseInt(parts[1].trim(), 10);
      if (!isNaN(num1) && !isNaN(num2)) {
        return num1 * num2;
      }
    }
    return 0;
  };

  // Initialize Practice Session when entering practice step
  useEffect(() => {
    if (step === 3 && sutraID && selectedLesson) {
      const initPractice = async () => {
        try {
          setLoadingProblem(true);
          const { sessionID } = await startPracticeSession(sutraID);
          setPracticeSessionID(sessionID);
          const prob = await getNextProblem(sutraID);
          setPracticeProblem(prob);
        } catch (err) {
          console.error('Failed to initialize practice session:', err);
        } finally {
          setLoadingProblem(false);
        }
      };
      initPractice();
    }
  }, [step, sutraID, selectedLesson]);

  // Generate MCQ options and reset timer when a problem is loaded
  useEffect(() => {
    if (practiceProblem) {
      const qText = practiceProblem.questionText || (practiceProblem as any).question || '';
      const localAns = solveProblemLocally(qText).toString();
      setCorrectAnswerVal(localAns);
      setMcqOptions(generateMCQOptions(localAns));
      setSelectedOption(null);
      setExplanationSteps([]);
      setTimeLeft(30);
    }
  }, [practiceProblem]);

  // Timeout handler
  const handleTimeout = async () => {
    if (submitted || !practiceSessionID || !practiceProblem || !user) return;
    try {
      const res = await submitAnswer({
        user_id: user.userId || user.id,
        sutra_id: sutraID,
        session_id: practiceSessionID,
        user_answer: '0',
        correct_answer: correctAnswerVal,
      });
      setIsAnsCorrect(false);
      setSubmitted(true);
      setExplanationSteps(res.solutionSteps || []);
    } catch (err) {
      console.error('Timeout submit failed:', err);
      setIsAnsCorrect(false);
      setSubmitted(true);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (step === 3 && !submitted && timeLeft > 0 && practiceProblem) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted && step === 3 && practiceProblem) {
      handleTimeout();
    }
  }, [step, timeLeft, submitted, practiceProblem]);

  // Initialize Quiz questions when entering Quiz step
  const initQuiz = async () => {
    try {
      setLoadingQuiz(true);
      const qList: Problem[] = [];
      for (let i = 0; i < 3; i++) {
        const prob = await getNextProblem(sutraID);
        qList.push(prob);
      }
      setQuizQuestions(qList);
      setCurrentQuizIndex(0);
      setQuizCorrectCount(0);
    } catch (err) {
      console.error('Failed to initialize quiz:', err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  useEffect(() => {
    if (step === 4 && sutraID && selectedLesson) {
      initQuiz();
    }
  }, [step, sutraID, selectedLesson]);

  // Load active quiz question
  const loadQuizQuestion = (index: number) => {
    if (!quizQuestions[index]) return;
    const currentProb = quizQuestions[index];
    const qText = currentProb.questionText || (currentProb as any).question || '';
    const localAns = solveProblemLocally(qText).toString();
    setQuizCorrectAnswerVal(localAns);
    setQuizMcqOptions(generateMCQOptions(localAns));
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setQuizAnsCorrect(null);
    setQuizExplanationSteps([]);
    setQuizTimeLeft(30);
  };

  useEffect(() => {
    if (quizQuestions.length > 0 && quizQuestions[currentQuizIndex]) {
      loadQuizQuestion(currentQuizIndex);
    }
  }, [quizQuestions, currentQuizIndex]);

  // Quiz timeout handler
  const handleQuizTimeout = async () => {
    if (quizSubmitted || !practiceSessionID || !quizQuestions[currentQuizIndex] || !user) return;
    try {
      const res = await submitAnswer({
        user_id: user.userId || user.id,
        sutra_id: sutraID,
        session_id: practiceSessionID,
        user_answer: '0',
        correct_answer: quizCorrectAnswerVal,
      });
      setQuizAnsCorrect(false);
      setQuizSubmitted(true);
      setQuizExplanationSteps(res.solutionSteps || []);
    } catch (err) {
      console.error('Quiz Timeout submit failed:', err);
      setQuizAnsCorrect(false);
      setQuizSubmitted(true);
    }
  };

  // Quiz Countdown Timer Effect
  useEffect(() => {
    if (step === 4 && !quizSubmitted && quizTimeLeft > 0 && quizQuestions.length > 0) {
      const timer = setInterval(() => {
        setQuizTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (quizTimeLeft === 0 && !quizSubmitted && step === 4 && quizQuestions.length > 0) {
      handleQuizTimeout();
    }
  }, [step, quizTimeLeft, quizSubmitted, quizQuestions]);

  // Confirm Quiz Answer
  const handleQuizConfirm = async () => {
    if (quizSubmitted || !quizSelectedOption || !practiceSessionID || !quizQuestions[currentQuizIndex] || !user) return;

    try {
      const res = await submitAnswer({
        user_id: user.userId || user.id,
        sutra_id: sutraID,
        session_id: practiceSessionID,
        user_answer: quizSelectedOption.trim(),
        correct_answer: quizCorrectAnswerVal,
      });

      setQuizAnsCorrect(res.correct);
      setQuizSubmitted(true);
      setQuizExplanationSteps(res.solutionSteps || []);

      if (res.correct) {
        setQuizCorrectCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to submit quiz answer:', err);
    }
  };

  const handleQuizNext = () => {
    if (currentQuizIndex < 2) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      handleNextStep();
    }
  };

  // Reset lesson state when selecting/deselecting a lesson
  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setStep(0);
    setExampleIndex(0);
    setRevealedStepsCount(0);
    setUserAns('');
    setSubmitted(false);
    setIsAnsCorrect(null);
    setCorrectCount(0);
    setMcqOptions([]);
    setSelectedOption(null);
    setCorrectAnswerVal('');
    setExplanationSteps([]);
    setTimeLeft(30);

    // Reset Quiz states
    setQuizQuestions([]);
    setCurrentQuizIndex(0);
    setQuizSubmitted(false);
    setQuizSelectedOption(null);
    setQuizAnsCorrect(null);
    setQuizCorrectCount(0);
    setQuizMcqOptions([]);
    setQuizCorrectAnswerVal('');
    setQuizExplanationSteps([]);
    setQuizTimeLeft(30);
  };

  const handleDeselectLesson = () => {
    setSelectedLesson(null);
    setMcqOptions([]);
    setSelectedOption(null);
    setCorrectAnswerVal('');
    setExplanationSteps([]);

    // Reset Quiz states
    setQuizQuestions([]);
    setCurrentQuizIndex(0);
    setQuizSubmitted(false);
    setQuizSelectedOption(null);
    setQuizAnsCorrect(null);
    setQuizCorrectCount(0);
    setQuizMcqOptions([]);
    setQuizCorrectAnswerVal('');
    setQuizExplanationSteps([]);
    setQuizTimeLeft(30);
  };

  const handleOptionClick = async (option: string) => {
    if (submitted || !practiceSessionID || !practiceProblem || !user) return;

    setSelectedOption(option);
    setUserAns(option);

    try {
      const res = await submitAnswer({
        user_id: user.userId || user.id,
        sutra_id: sutraID,
        session_id: practiceSessionID,
        user_answer: option.trim(),
        correct_answer: correctAnswerVal,
      });

      setIsAnsCorrect(res.correct);
      setSubmitted(true);
      setExplanationSteps(res.solutionSteps || []);

      if (res.correct) {
        setCorrectCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  // Determine completed count
  const lessonsCompletedCount = useMemo(() => {
    if (!progressRes?.success || !lessons) return 0;
    const currentSutraNumber = lessons[0]?.sutraNumber;
    const match = progressRes.data.sutraProgress?.find((p) => p.sutraId === currentSutraNumber);
    return match ? match.lessonsCompleted : 0;
  }, [progressRes, lessons]);

  const getLessonStatus = (index: number) => {
    if (index < lessonsCompletedCount) return 'completed';
    if (index === lessonsCompletedCount) return 'in_progress';
    return 'locked';
  };

  const isLoading = isLessonsLoading || isProgressLoading;

  if (isLoading) {
    return (
      <div role="status" className="min-h-screen bg-navy text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <span className="text-sm font-bold text-slate-300">Waking up the math masters... ⏰</span>
        </div>
      </div>
    );
  }

  if (lessonsError || !lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-navy text-white flex items-center justify-center p-6">
        <div className="text-center bg-white/5 border border-white/10 rounded-[32px] p-8 max-w-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Lesson Unavailable</h2>
          <p className="text-white/60 mb-6">We couldn't retrieve this lesson content right now.</p>
          <button
            onClick={() => setActive('curriculum')}
            className="bg-gradient-to-r from-violet to-saffron px-6 py-3 rounded-2xl font-bold w-full"
          >
            Back to Curriculum
          </button>
        </div>
      </div>
    );
  }

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else {
      handleDeselectLesson();
    }
  };

  const handleNextExample = () => {
    if (selectedLesson && exampleIndex < selectedLesson.examples.length - 1) {
      setExampleIndex((prev) => prev + 1);
      setRevealedStepsCount(0);
    } else {
      handleNextStep();
    }
  };

  const handleRevealStep = () => {
    if (selectedLesson) {
      const currentExample = selectedLesson.examples[exampleIndex];
      if (currentExample && revealedStepsCount < currentExample.steps.length) {
        setRevealedStepsCount((prev) => prev + 1);
      }
    }
  };

  const handlePracticeSubmit = async () => {
    if (!practiceSessionID || !practiceProblem || !user || !selectedLesson) return;

    try {
      const res = await submitAnswer({
        user_id: user.userId || user.id,
        sutra_id: sutraID,
        session_id: practiceSessionID,
        user_answer: userAns.trim(),
        correct_answer: practiceProblem.answer,
      });

      setIsAnsCorrect(res.correct);
      setSubmitted(true);

      if (res.correct) {
        setCorrectCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  const loadNextPracticeQuestion = async () => {
    if (correctCount >= 3) {
      handleNextStep();
      return;
    }

    try {
      setLoadingProblem(true);
      setUserAns('');
      setSubmitted(false);
      setIsAnsCorrect(null);
      const prob = await getNextProblem(sutraID);
      setPracticeProblem(prob);
    } catch (err) {
      console.error('Failed to load next problem:', err);
    } finally {
      setLoadingProblem(false);
    }
  };

  const renderContent = (markdown: string) => {
    const lines = markdown.split('\n');
    return (
      <div className="space-y-4 text-left leading-relaxed text-slate-800">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('##')) {
            return (
              <h3 key={idx} className="text-base font-black text-violet mt-5 mb-2 border-b border-violet-100 pb-1.5">
                {trimmed.replace('##', '').trim()}
              </h3>
            );
          }
          if (trimmed.startsWith('#')) {
            return (
              <h2 key={idx} className="text-lg font-black text-ink mt-6 mb-3">
                {trimmed.replace('#', '').trim()}
              </h2>
            );
          }
          if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
            return (
              <div key={idx} className="flex gap-3 items-start my-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet mt-2 flex-shrink-0" />
                <span className="font-extrabold text-sm text-slate-700">{trimmed.substring(1).trim()}</span>
              </div>
            );
          }
          if (trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.') || trimmed.startsWith('4.')) {
            return (
              <div key={idx} className="flex gap-3 items-start my-2">
                <span className="font-black text-violet text-sm">{trimmed.split('.')[0]}.</span>
                <span className="font-extrabold text-sm text-slate-700">{trimmed.substring(trimmed.indexOf('.') + 1).trim()}</span>
              </div>
            );
          }
          if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
            return (
              <div key={idx} className="bg-violet-50/50 border border-violet-100 p-4 rounded-2xl font-mono text-center text-lg text-violet font-black my-4">
                {trimmed.replace(/`/g, '')}
              </div>
            );
          }
          return trimmed ? (
            <p key={idx} className="text-sm text-slate-700 font-extrabold">
              {trimmed}
            </p>
          ) : null;
        })}
      </div>
    );
  };

  const stepsNames = ['Intro', 'Theory', 'Examples', 'Practice', 'Quiz', 'Finish'];

  // ── RENDER 1: LESSONS LIST DIRECTORY ──
  if (!selectedLesson) {
    const firstLesson = lessons[0];
    return (
      <div className="min-h-screen bg-[#F8F4FF] pb-20 relative overflow-hidden font-['Nunito',sans-serif]">
        {/* Playful Floating Math Symbols */}
        <div className="absolute top-24 left-6 text-violet-200/20 text-4xl select-none pointer-events-none font-bold animate-pulse">+</div>
        <div className="absolute top-48 right-12 text-saffron/15 text-5xl select-none pointer-events-none font-bold animate-bounce" style={{ animationDuration: '3s' }}>×</div>
        <div className="absolute bottom-36 left-10 text-teal-200/20 text-4xl select-none pointer-events-none font-bold animate-bounce" style={{ animationDuration: '4s' }}>÷</div>

        {/* ── COMPACT HEADER STRIP ── */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 px-6 py-4.5 text-white rounded-b-3xl shadow-md relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-saffron/15 rounded-full blur-[30px] pointer-events-none" />
          <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActive('curriculum')}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-base transition-all active:scale-95"
              >
                ←
              </button>
              <div>
                <span className="text-[9px] font-black text-gold uppercase tracking-widest block">Sutra {firstLesson.sutraNumber}</span>
                <h2 className="text-lg font-serif font-black tracking-tight mt-0.5">Select a Lesson</h2>
              </div>
            </div>
            {/* Playful mini label for children */}
            <span className="text-[10px] font-black bg-white/10 border border-white/10 px-3 py-1 rounded-full text-white/80 select-none">
              📚 Learn Path
            </span>
          </div>
        </div>

        {/* ── LESSONS DIRECTORY ── */}
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
          >
            {lessons.map((les, idx) => {
              const status = getLessonStatus(idx);
              const isLocked = status === 'locked';

              const statusBadgeStyles = {
                completed: 'bg-emerald-50 text-success border border-emerald-100',
                in_progress: 'bg-amber-50 text-saffron border border-amber-100',
                locked: 'bg-gray-100 text-slate-400 border border-gray-200/60',
              }[status];

              const statusText = {
                completed: '🏆 Mastered!',
                in_progress: '🔥 Learning',
                locked: '🔒 Locked',
              }[status];

              const handleLessonClick = () => {
                if (isLocked) {
                  toast.error(`Oops! 🔒 Lesson ${les.lessonNumber} is sleeping. Complete previous lessons to wake it up! ⏰`, {
                    icon: '🔒',
                    style: {
                      borderRadius: '24px',
                      background: '#FF6B35',
                      color: '#fff',
                      fontWeight: '900',
                      fontSize: '13px',
                      fontFamily: "'Nunito', sans-serif",
                    },
                  });
                  return;
                }
                handleSelectLesson(les);
              };

              return (
                <motion.div
                  key={les.id}
                  onClick={handleLessonClick}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={
                    isLocked
                      ? { rotate: [-1, 1, -1, 1, 0], transition: { duration: 0.3 } }
                      : { scale: 1.02, x: 4, transition: { type: 'spring', stiffness: 300 } }
                  }
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center gap-5 p-5 bg-white border-2 border-violet-100/50 rounded-3xl transition-all duration-200 ${
                    isLocked ? 'opacity-65 cursor-not-allowed border-dashed bg-slate-50/50' : 'hover:shadow-card-hover cursor-pointer'
                  }`}
                >
                  {/* Number Badge */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm select-none flex-shrink-0 ${
                    isLocked ? 'bg-slate-200 text-slate-400' : 'bg-violet-50 text-violet shadow-inner'
                  }`}>
                    {les.lessonNumber}
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusBadgeStyles}`}>
                        {statusText}
                      </span>
                      <span className="text-[9px] font-extrabold text-sub uppercase flex items-center gap-0.5">
                        ⏱️ {les.estimatedMinutes} min
                      </span>
                    </div>
                    <h3 className="font-serif text-sm font-black text-ink mt-1 truncate">{les.title}</h3>
                    <p className="text-[10px] text-sub font-semibold mt-0.5 truncate">{les.description || 'Learn mental math tricks'}</p>
                  </div>

                  {/* Lock or Chevron */}
                  <div className="flex-shrink-0 text-violet font-bold text-base pl-2">
                    {isLocked ? <span className="text-slate-300">🔒</span> : <span>➜</span>}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    );
  }

  // ── RENDER 2: INTERACTIVE SLIDESHOW & PRACTICE FLOW ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white font-sans flex flex-col relative overflow-hidden pb-20">

      {/* Top Header — full-width mobile-first */}
      <header className="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-white/[0.02] backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={handlePrevStep}
            className="bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1 rounded-full text-white/80 hover:text-white font-black flex items-center gap-1.5 transition-all text-[10px] active:scale-95 shadow-sm"
          >
            <span>←</span>
            <span>{step === 0 ? 'Lessons' : 'Back'}</span>
          </button>
          <span className="font-serif font-black text-white/90 text-xs tracking-wide uppercase truncate max-w-[100px] text-center">
            {selectedLesson.title}
          </span>
          <span className="bg-white/10 border border-white/15 px-2.5 py-1 rounded-full text-[8px] font-black text-gold/90 shadow-sm tracking-wider">
            Step {step + 1}/{stepsNames.length}
          </span>
        </header>

      {/* Step Tracker */}
      <div className="px-4 py-3 flex gap-1.5 justify-center w-full max-w-lg mx-auto">
          {stepsNames.map((name, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`h-1 w-full rounded-full transition-all duration-300 ${
                  idx === step ? 'bg-gold shadow-glow' : idx < step ? 'bg-violet' : 'bg-white/10'
                }`}
              />
              <span className={`text-[7px] font-black uppercase tracking-wider ${idx === step ? 'text-gold' : 'text-white/30'}`}>
                {name}
              </span>
            </div>
          ))}
      </div>

      {/* Main Content Body — full width mobile-first */}
      <main className={`flex-1 flex flex-col overflow-y-auto custom-scrollbar relative z-10 ${step === 2 ? 'p-0' : 'items-center justify-start px-4 py-2 sm:px-6'}`}>
          {/* Step 0: Intro */}
          {step === 0 && (
            <div className="w-full max-w-lg mx-auto text-center space-y-6 animate-fadeUp">
              <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-violet to-saffron shadow-lg flex items-center justify-center text-4xl mx-auto">
                📝
              </div>
              <div>
                <h1 className="text-2xl font-black mb-1.5 text-white leading-tight">{selectedLesson.title}</h1>
                <p className="text-[10px] font-black text-gold uppercase tracking-widest">Lesson {selectedLesson.lessonNumber}</p>
              </div>
              <p className="text-white/70 leading-relaxed text-xs max-w-sm mx-auto">
                {selectedLesson.description || 'Learn this powerful mental calculation method step-by-step.'}
              </p>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 text-left space-y-3.5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gold">Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-white/40 block font-bold uppercase tracking-wider">Difficulty</span>
                    <span className="text-xs font-black text-white/90 block mt-0.5">Medium ⚡</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 block font-bold uppercase tracking-wider">Duration</span>
                    <span className="text-xs font-black text-white/90 block mt-0.5">5 mins ⏱️</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="bg-gradient-to-r from-violet to-saffron hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg"
              >
                Start Lesson 🚀
              </button>
            </div>
          )}

          {/* Step 1: Theory */}
          {step === 1 && (
            <div className="w-full max-w-lg mx-auto space-y-5 animate-fadeUp relative z-10">
              <div className="bg-[#FFFDF6] rounded-[32px] p-6 text-slate-900 shadow-2xl border-2 border-amber-100/70 max-h-[50vh] overflow-y-auto custom-scrollbar relative">
                {renderContent(selectedLesson.content)}
              </div>

              {/* Guru's Secret Tip */}
              <motion.div
                className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-100 rounded-3xl p-4.5 flex gap-4 items-center text-slate-800 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="text-4xl flex-shrink-0 animate-bounce" style={{ animationDuration: '3s' }}>🧙‍♂️</div>
                <div>
                  <h5 className="text-[10px] font-black text-saffron uppercase tracking-widest">Guru's Math Magic Tip!</h5>
                  <p className="text-[11px] text-slate-700 font-bold leading-normal mt-0.5">
                    "Every Vedic math formula has a secret pattern. Find the pattern, and you can calculate faster than a flash of lightning! ⚡"
                  </p>
                </div>
              </motion.div>

              <button
                onClick={handleNextStep}
                className="bg-gradient-to-r from-violet to-saffron hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg"
              >
                Practice Examples ➜
              </button>
            </div>
          )}

          {/* Step 2: Examples – Visual Explainer (matches visual design) */}
          {step === 2 && selectedLesson.examples && selectedLesson.examples.length > 0 && (() => {
            const currentEx = selectedLesson.examples[exampleIndex];
            const allRevealed = revealedStepsCount >= currentEx.steps.length;
            const parsed = parseDigitGrid(currentEx.problem);
            const stepColorSet = [
              { bg: 'linear-gradient(135deg, #0EA5E9, #06B6D4)', titleColor: '#0C4A6E' },
              { bg: 'linear-gradient(135deg, #7C3AED, #A78BFA)', titleColor: '#5B21B6' },
              { bg: 'linear-gradient(135deg, #10B981, #6EE7B7)', titleColor: '#065F46' },
            ];

            return (
              <div className="w-full flex flex-col flex-1 bg-[#F8F4FF] min-h-0 max-w-lg mx-auto rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl">
                {/* Teal gradient header */}
                <div className="bg-gradient-to-br from-[#0C4A6E] to-[#0EA5E9] px-5 py-5 text-white">
                  <div className="text-[9px] font-bold tracking-[2px] uppercase text-white/40">
                    Step {exampleIndex + 1} of {selectedLesson.examples.length} · Worked Example
                  </div>
                  <h2 className="font-serif text-lg font-black text-sky-200 mt-1.5 leading-tight">
                    Solve: {currentEx.problem}
                  </h2>
                  <p className="text-[10px] text-white/50 mt-1">Follow each step</p>
                </div>

                {/* Scrollable content body */}
                <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                  {/* Digit Grid Visualization (Only for Sutra 3: Urdhva Tiryagbhyam) */}
                  {selectedLesson.sutraNumber === 3 && parsed ? (
                    <div className="bg-white rounded-[14px] p-4 border-2 border-sky-200 text-center shadow-sm">
                      <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-sky-500 mb-3">
                        Digit Grid
                      </div>
                      <div className="flex justify-center items-center gap-6 my-2" style={{ fontFamily: "'Courier New', monospace", fontSize: 24, fontWeight: 900, color: '#0C4A6E' }}>
                        <div className="text-center" style={{ lineHeight: '1.6' }}>
                          {parsed.num1Digits.map((d, i) => (
                            <div key={`a${i}`}>{d}</div>
                          ))}
                        </div>
                        <div style={{ color: '#FF6B35', fontSize: 16, fontWeight: 900 }}>×</div>
                        <div className="text-center" style={{ lineHeight: '1.6' }}>
                          {parsed.num2Digits.map((d, i) => (
                            <div key={`b${i}`}>{d}</div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-center gap-4 text-[10px] font-bold text-sky-500 mt-2">
                        <span>↘ ↙ cross</span>
                        <span>↕ vertical</span>
                      </div>
                    </div>
                  ) : (
                    /* General Equation Card for other Sutras */
                    <div className="bg-white rounded-[14px] p-5 border border-indigo-100 text-center shadow-sm flex flex-col items-center">
                      <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-indigo-500 mb-2">
                        Equation
                      </div>
                      <div className="text-3xl font-black text-[#1E1B4B] font-serif tracking-tight my-1">
                        {currentEx.problem}
                      </div>
                      <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed font-semibold">
                        {currentEx.explanation}
                      </p>
                    </div>
                  )}

                  {/* Revealed Step Cards */}
                  <div className="flex flex-col gap-2">
                    <AnimatePresence>
                      {currentEx.steps.slice(0, revealedStepsCount).map((stepText, idx) => {
                        const sc = stepColorSet[idx % stepColorSet.length];
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
                              <div className="text-[11px] text-slate-600 leading-snug" style={{ fontFamily: "'Courier New', monospace" }}>
                                {stepText}
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
                          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 15, fontWeight: 900, color: '#065F46' }}>
                            {currentEx.solution}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="px-4 py-3.5 border-t border-[#E0F2FE] bg-white/60">
                  {!allRevealed ? (
                    <button
                      onClick={handleRevealStep}
                      className="w-full py-3 rounded-xl font-serif font-black text-sm text-white shadow-md active:scale-[0.98] transition-transform"
                      style={{ background: 'linear-gradient(135deg, #0C4A6E, #0EA5E9)' }}
                    >
                      Reveal Step {revealedStepsCount + 1} 👇
                    </button>
                  ) : (
                    <button
                      onClick={handleNextExample}
                      className="w-full py-3 rounded-xl font-serif font-black text-sm text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
                      style={{ background: 'linear-gradient(135deg, #0C4A6E, #0EA5E9)' }}
                    >
                      {exampleIndex < selectedLesson.examples.length - 1 ? 'Next Example →' : 'Try It Yourself →'}
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Step 3: Practice */}
          {step === 3 && (
            <div className="w-full space-y-4.5 animate-fadeUp relative z-10 text-white">
              {/* Header bar matching s-prac-head */}
              <div className="flex justify-between items-center px-2">
                <div className="text-sm font-black text-cyan-400 tracking-wide">✏️ Your Turn</div>
                <div className="text-xs text-white/40 font-bold">Q {Math.min(correctCount + 1, 3)} of 3</div>
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

                  {/* Question Box s-q-box */}
                  <div className="bg-white/5 border-2 border-cyan-400/25 rounded-3xl p-6 text-center">
                    <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest block mb-2">
                      Apply {selectedLesson.title}
                    </span>
                    <div className="text-4xl font-black text-cyan-300 font-serif tracking-tight">
                      {practiceProblem.questionText}
                    </div>
                    <span className="text-[9px] text-white/45 font-bold block mt-3">
                      💡 Tip: Find the deficit or multiply vertically!
                    </span>
                  </div>

                  {/* MCQ Options s-opts */}
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

                  {/* Feedback Section s-feedback */}
                  {submitted && (
                    <motion.div
                      className={`border-2 rounded-2xl p-4 flex flex-col gap-1 text-left ${
                        isAnsCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      }`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="text-[11px] font-black uppercase tracking-wider">
                        {isAnsCorrect ? '✅ Correct! Super Job! 🎉' : '❌ Incorrect. Clue below!'}
                      </div>
                      <p className="text-[10px] text-white/75 font-semibold leading-normal mt-0.5">
                        {isAnsCorrect
                          ? `Excellent speed! You've earned +15 XP. Keep up the streak! ⭐`
                          : `The correct answer was ${correctAnswerVal}. Let's keep trying! 💪`}
                      </p>
                      {explanationSteps && explanationSteps.length > 0 && (
                        <div className="mt-2 text-[9px] bg-white/5 border border-white/10 p-2.5 rounded-xl font-mono text-cyan-200">
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

                  {/* Footer Navigation Bar */}
                  <div className="mt-3.5 flex flex-col gap-2">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 via-violet to-saffron transition-all duration-300"
                        style={{ width: `${(correctCount / 3) * 100}%` }}
                      />
                    </div>
                    
                    {submitted && (
                      <button
                        onClick={loadNextPracticeQuestion}
                        className="bg-gradient-to-r from-cyan-500 to-violet hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg mt-1"
                      >
                        {correctCount >= 3 ? 'Complete Lesson! ➜' : 'Next Question ➜'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-center w-full">
                  <p className="text-white/60 text-xs">Practice generator is currently offline.</p>
                  <button onClick={handleNextStep} className="mt-6 bg-violet px-6 py-2.5 rounded-2xl font-bold text-xs">
                    Skip to Finish
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Quiz */}
          {step === 4 && (
            <div className="w-full space-y-4.5 animate-fadeUp relative z-10 text-white">
              {/* Header bar matching s-quiz-head */}
              <div className="flex justify-between items-center px-2">
                <div className="text-sm font-black text-[#A78BFA] tracking-wide">📝 Final Quiz</div>
                <div className="text-xs text-white/40 font-bold">Q {currentQuizIndex + 1} of 3</div>
              </div>

              {loadingQuiz ? (
                <div className="bg-white/5 border border-white/10 rounded-[28px] p-12 text-center w-full animate-pulse">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                  <p className="text-white/60 text-xs">Assembling quiz questions...</p>
                </div>
              ) : quizQuestions.length > 0 && quizQuestions[currentQuizIndex] ? (
                <div className="flex flex-col gap-4 w-full">
                  {/* Progress Pips s-quiz-prog */}
                  <div className="flex gap-1.5 justify-center mb-1">
                    {[0, 1, 2].map((idx) => {
                      let pipStyle = "bg-white/10";
                      if (idx < currentQuizIndex) pipStyle = "bg-violet-400"; // done
                      else if (idx === currentQuizIndex) pipStyle = "bg-gold animate-pulse"; // current
                      return <div key={idx} className={`h-1.5 flex-1 rounded-full ${pipStyle}`} />;
                    })}
                  </div>

                  {/* Quiz Question Box s-quiz-q */}
                  <div className="bg-violet-950/20 border-2 border-[#A78BFA]/25 rounded-3xl p-6 text-center">
                    <span className="text-[9px] font-black text-[#A78BFA] uppercase tracking-widest block mb-2">
                      Question {currentQuizIndex + 1} · {selectedLesson.title}
                    </span>
                    <div className="text-4xl font-black text-[#A78BFA] font-serif tracking-tight">
                      {quizQuestions[currentQuizIndex].questionText}
                    </div>
                    <span className="text-[9px] text-white/45 font-bold block mt-3">
                      Pick the correct answer
                    </span>
                  </div>

                  {/* Options s-quiz-opts */}
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
                          className={`border-2 rounded-2xl p-4.5 flex items-center gap-4 transition-all w-full text-left ${btnStyle}`}
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

                  {/* Explanation Section */}
                  {quizSubmitted && (
                    <motion.div
                      className="bg-[#A78BFA]/10 border border-[#A78BFA]/20 rounded-2xl p-4 text-left"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="text-[10px] font-black text-[#A78BFA] mb-1.5 uppercase tracking-wider">
                        {quizAnsCorrect ? '🎉 Correct! +25 XP' : '❌ Not quite! Solution Steps:'}
                      </div>
                      <p className="text-[10px] text-white/70 font-semibold leading-normal">
                        {quizExplanationSteps.length > 0
                          ? quizExplanationSteps.join(' | ')
                          : `Solve step-by-step to get ${quizCorrectAnswerVal}`}
                      </p>
                    </motion.div>
                  )}

                  {/* Footer confirm / next button */}
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
                        onClick={handleQuizNext}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-violet hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl py-3.5 font-black text-sm shadow-lg"
                      >
                        {currentQuizIndex < 2 ? 'Next Question ➜' : 'Finish Quiz 🏆'}
                      </button>
                    )}
                    
                    {!quizSubmitted && (
                      <button
                        onClick={handleQuizNext}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-3.5 font-black text-xs text-white/60 transition-colors"
                      >
                        Skip
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-center w-full">
                  <p className="text-white/60 text-xs">Quiz generator is currently offline.</p>
                  <button onClick={handleNextStep} className="mt-6 bg-violet px-6 py-2.5 rounded-2xl font-bold text-xs">
                    Skip Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 5 && (
            <div className="w-full text-center space-y-6 animate-fadeUp relative z-10">
              {/* Animated trophy and stars */}
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/20 shadow-xl flex items-center justify-center text-4xl mx-auto"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  🏆
                </motion.div>
                <div className="flex gap-1.5 mt-4 select-none">
                  <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
                  <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
                  <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-black text-white mb-1">Lesson Mastered!</h1>
                <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Super Job, Vedic Warrior!</p>
              </div>
              
              <p className="text-white/70 leading-relaxed text-xs max-w-xs mx-auto">
                You parsed the theory, analyzed the working examples, and solved the math equations!
              </p>

              {/* Performance Stats Panel */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 w-full flex justify-around text-center divide-x divide-white/10 shadow-lg">
                <div className="flex-1">
                  <span className="text-xs font-black text-gold/90 block">⏱️ 2m 45s</span>
                  <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-0.5">Time Spent</span>
                </div>
                <div className="flex-grow flex-shrink-0 w-1/3">
                  <span className="text-xs font-black text-success block">
                    🎯 {Math.round(((correctCount + quizCorrectCount) / 6) * 100)}%
                  </span>
                  <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-0.5">Accuracy</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black text-violet-300 block">
                    💎 +{(correctCount + quizCorrectCount) * 15 + 100} XP
                  </span>
                  <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-0.5">XP Reward</span>
                </div>
              </div>

              <button
                onClick={handleDeselectLesson}
                className="bg-gradient-to-r from-violet to-saffron hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg"
              >
                Finish Lesson & Return
              </button>
            </div>
          )}
      </main>
    </div>
  );
};
