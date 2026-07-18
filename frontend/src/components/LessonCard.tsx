import React from 'react';
import { motion, type Variants } from 'framer-motion';

export interface LessonCardProps {
  lessonId: string;
  lessonNumber: number;
  title: string;
  description?: string;
  estimatedMinutes: number;
  status: 'completed' | 'in_progress' | 'locked';
  onClick: () => void;
  variants?: Variants;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lessonNumber,
  title,
  description,
  estimatedMinutes,
  status,
  onClick,
  variants,
}) => {
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

  return (
    <motion.div
      onClick={onClick}
      className={`flex items-center gap-5 p-6 bg-white border-2 border-violet-100/50 rounded-3xl transition-all duration-200 relative overflow-hidden ${
        isLocked
          ? 'opacity-65 cursor-not-allowed select-none bg-slate-50/50'
          : 'hover:shadow-card-hover hover:border-violet-200 cursor-pointer shadow-sm'
      }`}
      variants={variants}
      whileHover={!isLocked ? { y: -4 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
    >
      {/* Number Badge */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm select-none flex-shrink-0 ${
        isLocked ? 'bg-slate-200 text-slate-400' : 'bg-violet-50 text-violet shadow-inner'
      }`}>
        {lessonNumber}
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusBadgeStyles}`}>
            {statusText}
          </span>
          <span className="text-[9px] font-extrabold text-sub uppercase flex items-center gap-0.5">
            ⏱️ {estimatedMinutes} min
          </span>
        </div>
        <h3 className="font-serif text-sm font-black text-ink mt-1 truncate">{title}</h3>
        <p className="text-[10px] text-sub font-semibold mt-0.5 truncate">{description || 'Learn mental math tricks'}</p>
      </div>

      {/* Lock or Chevron */}
      <div className="flex-shrink-0 text-violet font-bold text-base pl-2">
        {isLocked ? <span className="text-slate-300">🔒</span> : <span>➜</span>}
      </div>
    </motion.div>
  );
};
export default LessonCard;
