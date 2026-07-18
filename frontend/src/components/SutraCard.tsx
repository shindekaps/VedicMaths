import React from 'react';
import { motion } from 'framer-motion';

export interface SutraCardProps {
  sutraId: number;
  name: string;
  sanskritName?: string;
  description?: string;
  color?: string;
  icon?: string;
  status: 'completed' | 'in_progress' | 'locked';
  percent: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  onClick: () => void;
}

export const SutraCard: React.FC<SutraCardProps> = ({
  sutraId,
  name,
  sanskritName,
  description,
  color,
  icon,
  status,
  percent,
  difficulty,
  onClick,
}) => {
  const isLocked = status === 'locked';

  // Colors based on status
  const statusBadgeStyles = {
    completed: 'bg-emerald-50 text-success border border-emerald-100',
    in_progress: 'bg-amber-50 text-saffron border border-amber-100',
    locked: 'bg-gray-100 text-slate-400 border border-gray-200/60',
  }[status];

  // Children-friendly names
  const difficultyLabel =
    difficulty === 'Easy' ? '🌱 Starter' : difficulty === 'Medium' ? '🚀 Explorer' : '⚡ Wizard';

  const statusLabel =
    status === 'completed'
      ? '🏆 Mastered!'
      : status === 'in_progress'
      ? '🔥 Learning'
      : '🔒 Locked';

  return (
    <motion.div
      layout
      onClick={onClick}
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 },
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={
        isLocked
          ? { rotate: [-1, 1, -1, 1, 0], transition: { duration: 0.3 } } // Playful lock shake
          : { scale: 1.03, y: -4, transition: { type: 'spring', stiffness: 300, damping: 12 } } // Bouncy hover
      }
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-5 p-6 bg-white border-2 border-violet-100/50 rounded-3xl transition-all duration-200 relative overflow-hidden ${
        isLocked
          ? 'opacity-60 cursor-not-allowed border-dashed bg-slate-50/50'
          : 'hover:shadow-card-hover hover:border-violet-200 cursor-pointer shadow-sm'
      }`}
    >
      {/* Left: Sutra original emoji icon */}
      <div
        style={{ backgroundColor: isLocked ? '#E2E8F0' : color || '#7C3AED' }}
        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white font-serif font-black text-xl shadow-inner shadow-black/15 select-none flex-shrink-0 ${
          isLocked ? 'opacity-60 filter grayscale-[50%]' : ''
        }`}
      >
        {icon || sutraId}
      </div>

      {/* Center: Info fields */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusBadgeStyles}`}>
            {statusLabel}
          </span>
          <span
            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
              difficulty === 'Easy'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                : 'bg-red-50 text-red-600 border border-red-100'
            }`}
          >
            {difficultyLabel}
          </span>
        </div>

        <h3 className="font-serif text-sm font-black text-ink truncate mt-1">
          {name}
        </h3>
        
        <p className="text-[11px] text-sub font-bold italic mt-0.5 truncate">
          {sanskritName || description}
        </p>

        {/* Progress Fill bar (only for In Progress / Completed) */}
        {!isLocked && percent > 0 && (
          <div className="mt-2.5">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet to-indigo rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right: Chevron or Action */}
      <div className="flex-shrink-0 text-violet font-bold text-base pl-2">
        {isLocked ? (
          <span className="text-slate-300">🔒</span>
        ) : (
          <span className="text-lg">➜</span>
        )}
      </div>
    </motion.div>
  );
};
