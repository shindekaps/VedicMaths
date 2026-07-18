import React from 'react';
import { motion, type Variants } from 'framer-motion';

export interface DashboardModuleCardProps {
  emoji: string;
  emojiBgColor: string;
  badgeLabel: string;
  badgeTextColor: string;
  badgeBgColor: string;
  title: string;
  description: string;
  progressLabel: string;
  progressValue: number;
  progressValueText: string;
  progressBarColor: string; // e.g. "from-violet to-indigo"
  onClick: () => void;
  variants?: Variants;
}

export const DashboardModuleCard: React.FC<DashboardModuleCardProps> = ({
  emoji,
  emojiBgColor,
  badgeLabel,
  badgeTextColor,
  badgeBgColor,
  title,
  description,
  progressLabel,
  progressValue,
  progressValueText,
  progressBarColor,
  onClick,
  variants,
}) => {
  return (
    <motion.div
      variants={variants}
      className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover border border-violet-100/50 flex flex-col gap-4 cursor-pointer relative overflow-hidden group transition-all duration-300"
      onClick={onClick}
      whileHover={{ y: -3 }}
    >
      <div className="flex justify-between items-start">
        <div className={`text-4xl ${emojiBgColor} rounded-2xl w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          {emoji}
        </div>
        <span className={`text-xs font-bold ${badgeTextColor} ${badgeBgColor} px-3 py-1 rounded-full`}>
          {badgeLabel}
        </span>
      </div>
      <div>
        <h3 className="font-serif text-lg font-black text-ink">{title}</h3>
        <p className="text-xs text-sub mt-1">{description}</p>
      </div>
      <div className="mt-2">
        <div className="flex justify-between text-[10px] font-bold text-sub mb-1">
          <span>{progressLabel}</span>
          <span>{progressValueText}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${progressBarColor} rounded-full`}
            style={{ width: `${Math.max(progressValue, 5)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};
