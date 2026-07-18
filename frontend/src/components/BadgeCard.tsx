import React from 'react';
import { motion } from 'framer-motion';

export interface BadgeCardProps {
  id: string;
  name: string;
  icon: string;
  desc: string;
  isUnlocked: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  id,
  name,
  icon,
  desc,
  isUnlocked,
}) => {
  return (
    <motion.div
      key={id}
      className={`flex flex-col items-center bg-white rounded-3xl p-5 border shadow-sm text-center relative overflow-hidden group transition-all ${
        isUnlocked
          ? 'border-violet-100/50 hover:shadow-card-hover'
          : 'border-gray-200/50 opacity-50 bg-slate-50/40'
      }`}
      whileHover={isUnlocked ? { scale: 1.06, rotate: [0, -1, 1, 0], transition: { duration: 0.3 } } : {}}
    >
      {/* Badge Emoji */}
      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl mb-3 shadow-inner ${
        isUnlocked ? 'bg-violet-50/70 text-4xl' : 'bg-slate-100 text-slate-300 filter grayscale'
      }`}>
        {isUnlocked ? icon : '🔒'}
      </div>

      <span className="text-xs font-black text-ink">{name}</span>
      <span className="text-[9px] text-sub mt-1 leading-snug font-medium max-w-[90px]">{desc}</span>

      {/* Ribbon or master banner if unlocked */}
      {isUnlocked && (
        <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
      )}
    </motion.div>
  );
};
export default BadgeCard;
