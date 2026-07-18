import React from 'react';
import { motion, type Variants } from 'framer-motion';

export interface LeaderboardRowProps {
  rank: number;
  avatar?: string;
  name: string;
  streak: number;
  level?: string;
  xp: number;
  isCurrentUser: boolean;
  variants?: Variants;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  rank,
  avatar,
  name,
  streak,
  level,
  xp,
  isCurrentUser,
  variants,
}) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ scale: 1.01, transition: { type: 'spring', stiffness: 300 } }}
      className={`p-4 flex items-center gap-4 rounded-3xl border-2 transition-all ${
        isCurrentUser
          ? 'bg-gradient-to-r from-amber-50/40 to-violet-50/40 border-violet-200 shadow-sm'
          : 'bg-transparent border-transparent hover:bg-slate-50/50'
      }`}
    >
      {/* Rank badge */}
      <span className="font-serif font-black w-8 text-center text-lg flex-shrink-0">
        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
      </span>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-100 to-indigo-100 flex items-center justify-center font-bold text-sm text-violet flex-shrink-0 shadow-inner">
        {avatar || '👤'}
      </div>

      {/* Profile info */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-serif text-sm font-black text-ink">
            {name}
          </span>
          {streak > 0 && (
            <span className="text-[10px] font-bold text-saffron bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              🔥{streak}
            </span>
          )}
        </div>
        <span className="text-[9px] font-extrabold text-sub uppercase tracking-wider">
          {level || 'Apprentice'}
        </span>
      </div>

      {/* Score */}
      <div className="text-right flex-shrink-0">
        <span className="font-serif text-sm font-black text-violet">
          {xp.toLocaleString()}
        </span>
        <span className="text-[9px] font-black text-sub uppercase block mt-0.5">
          XP Points
        </span>
      </div>
    </motion.div>
  );
};
export default LeaderboardRow;
