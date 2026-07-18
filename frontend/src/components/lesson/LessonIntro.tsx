import React from 'react';
import { type Lesson } from '../../api/lessons';

interface LessonIntroProps {
  lesson: Lesson;
  onStart: () => void;
}

export const LessonIntro: React.FC<LessonIntroProps> = ({ lesson, onStart }) => {
  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-6 animate-fadeUp">
      <div className="bg-white/5 border border-white/10 rounded-[36px] p-8 backdrop-blur-xl relative overflow-hidden shadow-glow-indigo">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-saffron/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 bg-gradient-to-tr from-violet to-saffron rounded-2xl flex items-center justify-center font-bold text-3xl text-white mx-auto mb-6 shadow-md border border-white/10">
          💡
        </div>

        <span className="text-[9px] font-black text-violet-400 uppercase tracking-[3px] block mb-2">Lesson {lesson.lessonNumber}</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
          {lesson.title}
        </h1>
        <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto font-semibold">
          {lesson.description || 'Learn mental math tricks'}
        </p>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center gap-6 text-[10px] text-white/50 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">⏱️ {lesson.estimatedMinutes} mins</span>
          <span className="flex items-center gap-1.5">🎯 Interactive Practice</span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="bg-gradient-to-r from-violet to-saffron hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg shadow-violet/25"
      >
        Start Lesson 🚀
      </button>
    </div>
  );
};
