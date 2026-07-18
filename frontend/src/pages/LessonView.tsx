import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLessonsBySutra, type Lesson } from '../api/lessons';
import { useProgress } from '../api/stats';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

import { LessonIntro } from '../components/lesson/LessonIntro';
import { LessonTheory } from '../components/lesson/LessonTheory';
import { LessonExamples } from '../components/lesson/LessonExamples';
import { LessonPractice } from '../components/lesson/LessonPractice';
import { LessonQuiz } from '../components/lesson/LessonQuiz';
import { LessonComplete } from '../components/lesson/LessonComplete';
import { LessonCard } from '../components/LessonCard';
import { VedicBackground } from '../components/VedicBackground';
import { VedicLoader } from '../components/VedicLoader';

interface LessonViewProps {
  setActive: (id: string) => void;
  sutraID: string;
}

export const LessonView = ({ setActive, sutraID }: LessonViewProps) => {
  const { data: lessons, isLoading: isLessonsLoading, error: lessonsError } = useLessonsBySutra(sutraID);
  const { data: progressRes, isLoading: isProgressLoading } = useProgress();
  const queryClient = useQueryClient();

  // State to track active lesson and active step
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [step, setStep] = useState(0); // 0: Intro, 1: Theory, 2: Examples, 3: Practice, 4: Quiz, 5: Complete

  // Shared states between components
  const [practiceSessionID, setPracticeSessionID] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);

  // Reset lesson states
  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setStep(0);
    setPracticeSessionID(null);
    setCorrectCount(0);
    setQuizCorrectCount(0);
  };

  const handleDeselectLesson = async () => {
    if (step === 5 && selectedLesson) {
      const hasPassed = quizCorrectCount >= 15;
      const xpEarned = hasPassed ? ((correctCount + quizCorrectCount) * 15 + 100) : 0;
      if (xpEarned > 0) {
        const currentXP = parseInt(localStorage.getItem('accumulated_xp') || '0', 10);
        localStorage.setItem('accumulated_xp', (currentXP + xpEarned).toString());
      }

      try {
        await api.put(`/progress/lessons/${selectedLesson.lessonId}`, {
          status: hasPassed ? 'completed' : 'in_progress',
          timeSpent: 300,
          score: Math.round((quizCorrectCount / 20) * 100),
        });
      } catch (err) {
        console.error('Failed to submit lesson progress:', err);
      }

      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['dailyStats'] });
    }

    // Deselect
    setSelectedLesson(null);
    setStep(0);
    setPracticeSessionID(null);
    setCorrectCount(0);
    setQuizCorrectCount(0);
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else {
      handleDeselectLesson();
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

  const stepsNames = ['Intro', 'Theory', 'Examples', 'Practice', 'Quiz', 'Finish'];

  const isLoading = isLessonsLoading || isProgressLoading;

  if (isLoading) {
    return (
      <div role="status" className="min-h-screen bg-navy text-white flex items-center justify-center">
        <VedicLoader message="Waking up the math masters... ⏰" />
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

  // ── RENDER 1: LESSONS LIST DIRECTORY ──
  if (!selectedLesson) {
    const firstLesson = lessons[0];
    return (
      <div className="min-h-screen bg-[#F8F4FF] pb-20 relative overflow-hidden font-['Nunito',sans-serif]">
        <VedicBackground variant="light" />

        {/* COMPACT HEADER STRIP */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 px-6 py-4.5 text-white shadow-md relative overflow-hidden">
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
            <span className="text-[10px] font-black bg-white/10 border border-white/10 px-3 py-1 rounded-full text-white/80 select-none">
              📚 Learn Path
            </span>
          </div>
        </div>

        {/* LESSONS DIRECTORY */}
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
                <LessonCard
                  key={les.lessonId}
                  lessonId={les.lessonId}
                  lessonNumber={les.lessonNumber}
                  title={les.title}
                  description={les.description}
                  estimatedMinutes={les.estimatedMinutes}
                  status={status}
                  onClick={handleLessonClick}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
                  }}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
    );
  }

  // ── RENDER 2: ACTIVE LESSON FLOW ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white font-sans flex flex-col relative overflow-hidden pb-20">
      <VedicBackground variant="dark" />

      {/* Top Header */}
      <header className="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-white/[0.02] backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={handlePrevStep}
          className={`bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1 rounded-full text-white/80 hover:text-white font-black flex items-center gap-1.5 transition-all text-[10px] active:scale-95 shadow-sm ${
            step >= 4 ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          <span>←</span>
          <span>{step === 0 ? 'Lessons' : 'Back'}</span>
        </button>
        <span className="font-serif font-black text-white/90 text-xs tracking-wide uppercase text-center mx-2">
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

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative z-10 items-center justify-start px-4 py-2 sm:px-6">
        {step === 0 && <LessonIntro lesson={selectedLesson} onStart={() => setStep(1)} />}
        {step === 1 && <LessonTheory lesson={selectedLesson} onNext={() => setStep(2)} />}
        {step === 2 && <LessonExamples lesson={selectedLesson} onComplete={() => setStep(3)} />}
        {step === 3 && (
          <LessonPractice 
            sutraID={sutraID} 
            lesson={selectedLesson} 
            onSessionStart={(sid) => setPracticeSessionID(sid)}
            onComplete={(cnt) => {
              setCorrectCount(cnt);
              setStep(4);
            }} 
          />
        )}
        {step === 4 && (
          <LessonQuiz 
            sutraID={sutraID} 
            lesson={selectedLesson} 
            practiceSessionID={practiceSessionID} 
            onComplete={(cnt) => {
              setQuizCorrectCount(cnt);
              setStep(5);
            }} 
          />
        )}
        {step === 5 && (
          <LessonComplete 
            quizCorrectCount={quizCorrectCount} 
            correctCount={correctCount} 
            onRetry={() => setStep(4)} 
            onFinish={handleDeselectLesson} 
          />
        )}
      </main>
    </div>
  );
};
