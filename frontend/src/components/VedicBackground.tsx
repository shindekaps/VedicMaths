import React from 'react';
import { motion } from 'framer-motion';
import { MandalaDecor } from './MandalaDecor';

interface VedicBackgroundProps {
  variant?: 'light' | 'dark';
}

export const VedicBackground: React.FC<VedicBackgroundProps> = ({ variant = 'light' }) => {
  const isDark = variant === 'dark';
  
  // Define signs with positions, scales, opacities, and animation types
  const signs = [
    { text: '+', top: '10%', left: '5%', size: 'text-3xl sm:text-4xl', color: isDark ? 'text-violet-400/10' : 'text-violet-200/25', delay: 0 },
    { text: '×', top: '25%', right: '8%', size: 'text-4xl sm:text-5xl', color: isDark ? 'text-saffron/10' : 'text-saffron/15', delay: 1, duration: 4 },
    { text: '÷', top: '75%', left: '8%', size: 'text-3xl sm:text-4xl', color: isDark ? 'text-teal-400/10' : 'text-teal-200/25', delay: 2, duration: 5 },
    { text: '−', top: '60%', right: '6%', size: 'text-4xl sm:text-5xl', color: isDark ? 'text-gold/10' : 'text-gold/15', delay: 0.5 },
    { text: '√', top: '45%', left: '12%', size: 'text-2xl sm:text-3xl', color: isDark ? 'text-emerald-400/10' : 'text-emerald-200/20', delay: 1.5 },
    { text: '²', top: '80%', right: '15%', size: 'text-3xl', color: isDark ? 'text-pink-400/10' : 'text-pink-200/20', delay: 0.8 },
    { text: 'π', top: '15%', right: '25%', size: 'text-2xl sm:text-3xl', color: isDark ? 'text-sky-400/10' : 'text-sky-200/20', delay: 2.2 },
    { text: '9', top: '35%', left: '20%', size: 'text-4xl font-serif', color: isDark ? 'text-indigo-400/5' : 'text-indigo-200/10', delay: 1.2 },
    { text: '∑', top: '65%', right: '30%', size: 'text-3xl', color: isDark ? 'text-amber-400/5' : 'text-amber-200/10', delay: 1.7 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* Background mandala patterns */}
      <div className={`absolute right-[-60px] top-[140px] ${isDark ? 'opacity-[0.015]' : 'opacity-[0.025]'} pointer-events-none`}>
        <MandalaDecor size={320} />
      </div>
      <div className={`absolute left-[-80px] bottom-[80px] ${isDark ? 'opacity-[0.01]' : 'opacity-[0.02]'} pointer-events-none -rotate-12`}>
        <MandalaDecor size={260} />
      </div>

      {/* Floating Math Symbols */}
      {signs.map((sign, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            top: sign.top,
            left: sign.left,
            right: sign.right,
          }}
          className={`${sign.size} ${sign.color} font-black select-none pointer-events-none`}
          animate={{
            y: sign.duration ? [0, -12, 0] : [0, 0],
            scale: [1, 1.05, 1],
            opacity: isDark ? [0.08, 0.12, 0.08] : [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: sign.duration || 6,
            repeat: Infinity,
            delay: sign.delay,
            ease: 'easeInOut',
          }}
        >
          {sign.text}
        </motion.div>
      ))}
    </div>
  );
};
