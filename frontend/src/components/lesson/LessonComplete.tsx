import React from 'react';
import { motion } from 'framer-motion';

interface LessonCompleteProps {
  quizCorrectCount: number;
  correctCount: number;
  onRetry: () => void;
  onFinish: () => void;
}

export const LessonComplete: React.FC<LessonCompleteProps> = ({
  quizCorrectCount,
  correctCount,
  onRetry,
  onFinish,
}) => {
  const hasPassed = quizCorrectCount >= 15;
  const accuracy = Math.round((quizCorrectCount / 20) * 100);
  const xpEarned = hasPassed ? ((correctCount + quizCorrectCount) * 15 + 100) : 0;

  return (
    <div className="w-full text-center space-y-6 animate-fadeUp relative z-10 max-w-lg mx-auto text-white">
      {/* Animated icon */}
      <div className="flex flex-col items-center">
        <motion.div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto border-2 ${
            hasPassed 
              ? 'bg-green-500/10 border-green-500/20 shadow-green-500/10' 
              : 'bg-red-500/10 border-red-500/20 shadow-red-500/10'
          } shadow-xl`}
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          {hasPassed ? '🏆' : '❌'}
        </motion.div>
        {hasPassed ? (
          <div className="flex gap-1.5 mt-4 select-none">
            <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</span>
          </div>
        ) : (
          <div className="text-red-400 font-extrabold text-[9px] mt-3 uppercase tracking-wider">
            Required score to pass: 75% (15/20)
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-black text-white mb-1">
          {hasPassed ? 'Lesson Mastered!' : 'Quiz Failed!'}
        </h1>
        <p className={`text-[10px] font-black uppercase tracking-widest ${hasPassed ? 'text-green-400' : 'text-red-400'}`}>
          {hasPassed ? 'Super Job, Vedic Warrior!' : 'Keep practicing to master this sutra!'}
        </p>
      </div>
      
      <p className="text-white/70 leading-relaxed text-xs max-w-xs mx-auto">
        {hasPassed 
          ? 'You parsed the theory, analyzed the working examples, and successfully passed the quiz!'
          : 'You finished the quiz, but did not reach the passing score of 75%. Try again to master the lesson!'
        }
      </p>

      {/* Performance Stats Panel */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 w-full flex justify-around text-center divide-x divide-white/10 shadow-lg">
        <div className="flex-grow flex-shrink-0 w-1/3">
          <span className="text-xs font-black text-gold/90 block">
            {quizCorrectCount}/20
          </span>
          <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-0.5">Correct</span>
        </div>
        <div className="flex-grow flex-shrink-0 w-1/3">
          <span className={`text-xs font-black block ${hasPassed ? 'text-success' : 'text-red-400'}`}>
            {accuracy}%
          </span>
          <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-0.5">Accuracy</span>
        </div>
        <div className="flex-grow flex-shrink-0 w-1/3">
          <span className="text-xs font-black text-violet-300 block">
            +{xpEarned} XP
          </span>
          <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-0.5">XP Reward</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {!hasPassed && (
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-violet to-indigo hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg"
          >
            Retry Quiz 🔄
          </button>
        )}
        <button
          onClick={onFinish}
          className="bg-gradient-to-r from-[#0C4A6E] to-[#0EA5E9] hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg"
        >
          {hasPassed ? 'Finish Lesson & Return' : 'Return to Curriculum'}
        </button>
      </div>
    </div>
  );
};
