import React from 'react';
import { motion } from 'framer-motion';

export interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  layout?: 'horizontal' | 'vertical';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  layout = 'horizontal',
  onClick,
}) => {
  if (layout === 'horizontal') {
    return (
      <motion.div
        onClick={onClick}
        className="flex items-center gap-3 bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 shadow-md hover:bg-white/12 transition-colors cursor-pointer"
        whileHover={{ scale: 1.02 }}
      >
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-[10px] text-violet-200 uppercase font-extrabold tracking-wider">
            {label}
          </div>
          <div className="text-base font-black text-white">{value}</div>
        </div>
      </motion.div>
    );
  }

  // Vertical layout (used in ProgressView)
  return (
    <motion.div
      onClick={onClick}
      className="bg-white/10 backdrop-blur-md rounded-3xl p-4 text-center border border-white/15 shadow-lg relative overflow-hidden group"
      whileHover={{ scale: 1.04, y: -2 }}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-black text-white">{value}</div>
      <div className="text-[9px] text-violet-200 font-extrabold uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </motion.div>
  );
};
