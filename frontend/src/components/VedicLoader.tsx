import React from 'react';
import { motion } from 'framer-motion';

interface VedicLoaderProps {
  message?: string;
  size?: number; // Size of the Rishi character image
}

export const VedicLoader: React.FC<VedicLoaderProps> = ({ 
  message = "Waking up the math formulas… ⏰", 
  size = 140 
}) => {
  // 8 Math symbols to rotate around the center
  const orbitSymbols = [
    { char: '+', angle: 0, color: 'text-violet-500' },
    { char: '×', angle: 45, color: 'text-saffron' },
    { char: '÷', angle: 90, color: 'text-cyan-500' },
    { char: '−', angle: 135, color: 'text-gold' },
    { char: '√', angle: 180, color: 'text-emerald-500' },
    { char: '²', angle: 225, color: 'text-pink-500' },
    { char: 'π', angle: 270, color: 'text-sky-500' },
    { char: '∑', angle: 315, color: 'text-amber-600' }
  ];

  // Orbit radius (reverted to 0.75 as preferred)
  const radius = size * 0.75;

  return (
    <div className="flex flex-col items-center justify-center p-8 z-50 select-none pointer-events-none">
      {/* ── NATIVE HARDWARE-ACCELERATED ANIMATIONS ── */}
      <style>{`
        @keyframes custom-orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes custom-orbit-counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-orbit-spin {
          animation: custom-orbit-spin 10s linear infinite;
        }
        .animate-orbit-counter-spin {
          animation: custom-orbit-counter-spin 10s linear infinite;
        }
      `}</style>
      
      {/* ── ROTATING ORBIT CONTAINER ── */}
      <div 
        className="relative flex items-center justify-center overflow-visible" 
        style={{ width: size * 2, height: size * 2 }}
      >
        {/* Rotating Outer Ring of Symbols (Pure CSS Animation) */}
        <div className="absolute inset-0 flex items-center justify-center z-20 animate-orbit-spin">
          {orbitSymbols.map((sym, index) => {
            const rad = (sym.angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  transform: `translate(${x}px, ${y}px)`
                }}
                className={`text-xl sm:text-2xl font-black ${sym.color} select-none`}
              >
                {/* Counter-rotate the symbol so it remains upright (Pure CSS Animation) */}
                <div className="animate-orbit-counter-spin">
                  {sym.char}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center: Meditating Rishi Character SVG (Floating using tailwind transition) */}
        <div 
          className="relative flex items-center justify-center z-10 animate-float"
          style={{ width: size, height: size, animationDuration: '4s' }}
        >
          <img 
            src="/rishi-loading.png" 
            alt="Meditating Rishi" 
            className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(255,107,53,0.15)]"
          />
        </div>
      </div>

      {/* ── LOADING MESSAGE ── */}
      {message && (
        <motion.span 
          className="text-sm font-bold text-sub mt-4 text-center max-w-xs block leading-relaxed"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}
        </motion.span>
      )}
    </div>
  );
};

export default VedicLoader;
