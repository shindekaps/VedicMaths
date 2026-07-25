import React from 'react';
import { parseSutra1Problem, parseDigitGrid, parseSutra2Problem } from '../utils/mathUtils';

interface VisualizerProps {
  problem: string;
}

export const Sutra1PartitionVisualizer: React.FC<VisualizerProps> = ({ problem }) => {
  const parsedS1 = parseSutra1Problem(problem);
  if (!parsedS1) {
    return (
      <div className="bg-white rounded-[14px] p-5 border border-indigo-100 text-center shadow-sm">
        <div className="text-3xl font-black text-[#1E1B4B] font-serif tracking-tight">{problem}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[14px] p-5 border border-indigo-100 text-center shadow-sm flex flex-col items-center">
      <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-indigo-500 mb-2">
        Ekadhikena Partition
      </div>
      <div className="flex justify-center items-center gap-1.5 my-3 text-2xl font-black font-serif text-[#1E1B4B]">
        <span className="text-violet-600 bg-violet-50 px-2.5 py-1 rounded-xl border border-violet-100">{parsedS1.lhs}</span>
        <span className="text-slate-300 font-normal">|</span>
        <span className="text-saffron bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">{parsedS1.rhs1}</span>
        <span className="text-slate-400 font-normal px-2">×</span>
        <span className="text-violet-600 bg-violet-50 px-2.5 py-1 rounded-xl border border-violet-100">{parsedS1.lhs}</span>
        <span className="text-slate-300 font-normal">|</span>
        <span className="text-saffron bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">{parsedS1.rhs2}</span>
      </div>
      <div className="w-full grid grid-cols-2 gap-4 mt-2 border-t border-slate-100 pt-3">
        <div className="text-center">
          <span className="text-[8px] font-black text-violet-400 uppercase tracking-wider block mb-1">LHS (One More)</span>
          <span className="font-mono text-xs font-bold text-violet-600">
            {parsedS1.lhs} × ({parsedS1.lhs} + 1)
          </span>
        </div>
        <div className="text-center">
          <span className="text-[8px] font-black text-amber-500 uppercase tracking-wider block mb-1">RHS (Product)</span>
          <span className="font-mono text-xs font-bold text-saffron">
            {parsedS1.rhs1} × {parsedS1.rhs2}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Sutra3DigitGridVisualizer: React.FC<VisualizerProps> = ({ problem }) => {
  const parsed = parseDigitGrid(problem);
  if (!parsed) {
    return (
      <div className="bg-white rounded-[14px] p-5 border border-indigo-100 text-center shadow-sm">
        <div className="text-3xl font-black text-[#1E1B4B] font-serif tracking-tight">{problem}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[14px] p-4 border-2 border-sky-200 text-center shadow-sm">
      <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-sky-500 mb-3">
        Digit Grid
      </div>
      <div className="flex justify-center items-center gap-6 my-2" style={{ fontFamily: "'Courier New', monospace", fontSize: 24, fontWeight: 900, color: '#0C4A6E' }}>
        <div className="text-center" style={{ lineHeight: '1.6' }}>
          {parsed.num1Digits.map((d, i) => (
            <div key={`a${i}`}>{d}</div>
          ))}
        </div>
        <div style={{ color: '#FF6B35', fontSize: 16, fontWeight: 900 }}>×</div>
        <div className="text-center" style={{ lineHeight: '1.6' }}>
          {parsed.num2Digits.map((d, i) => (
            <div key={`b${i}`}>{d}</div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-4 text-[10px] font-bold text-sky-500 mt-2">
        <span>↘ ↙ cross</span>
        <span>↕ vertical</span>
      </div>
    </div>
  );
};

export const Sutra2ComplementVisualizer: React.FC<VisualizerProps> = ({ problem }) => {
  const parsed = parseSutra2Problem(problem);
  if (!parsed) {
    return (
      <div className="bg-white rounded-[14px] p-5 border border-indigo-100 text-center shadow-sm">
        <div className="text-3xl font-black text-[#1E1B4B] font-serif tracking-tight">{problem}</div>
      </div>
    );
  }

  if (parsed.type === 'subtraction') {
    const baseStr = parsed.base.toString();
    const zeros = baseStr.length - 1;
    const numStr = parsed.num1.toString().padStart(zeros, '0');
    const digits = numStr.split('');
    // Find last non-zero digit index
    let lastNonZeroIdx = digits.length - 1;
    while (lastNonZeroIdx >= 0 && digits[lastNonZeroIdx] === '0') lastNonZeroIdx--;

    return (
      <div className="bg-white rounded-[14px] p-5 border border-pink-100 text-center shadow-sm flex flex-col items-center">
        <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-pink-500 mb-2">
          Nikhilam Complement
        </div>
        <div className="text-lg font-black text-[#1E1B4B] font-serif mb-3">
          {parsed.base} − {parsed.num1}
        </div>
        <div className="flex justify-center gap-1.5">
          {digits.map((d, i) => {
            const isLast = i === lastNonZeroIdx;
            const isTrailingZero = i > lastNonZeroIdx;
            const fromVal = isLast ? 10 : 9;
            const result = isTrailingZero ? 0 : fromVal - parseInt(d, 10);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className={`text-[8px] font-black ${isTrailingZero ? 'text-slate-300' : isLast ? 'text-pink-500' : 'text-violet-500'}`}>
                  {isTrailingZero ? '—' : `from ${fromVal}`}
                </span>
                <span className="text-xl font-black text-slate-400 font-mono">{d}</span>
                <span className="text-[10px] text-slate-300">↓</span>
                <span className={`text-xl font-black font-mono ${isTrailingZero ? 'text-slate-300' : 'text-emerald-600'}`}>
                  {isTrailingZero ? d : result}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Multiplication
  if (parsed.type === 'multiplication' && parsed.num2 !== undefined) {
    const isAbove = parsed.num1 > parsed.base;
    const label = isAbove ? 'Excess' : 'Deficiency';
    const def1 = parsed.deficiency1 ?? 0;
    const def2 = parsed.deficiency2 ?? 0;
    const lhs = isAbove ? parsed.num1 + Math.abs(def2) : parsed.num1 - def2;
    const rhs = Math.abs(def1) * Math.abs(def2);

    return (
      <div className="bg-white rounded-[14px] p-5 border border-pink-100 text-center shadow-sm flex flex-col items-center">
        <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-pink-500 mb-2">
          Nikhilam {isAbove ? 'Above' : 'Below'} Base
        </div>
        <div className="text-xs font-bold text-slate-400 mb-3">Base = {parsed.base}</div>
        <div className="flex gap-6 items-center mb-3">
          <div className="text-center">
            <div className="text-xl font-black text-[#1E1B4B] font-serif">{parsed.num1}</div>
            <div className={`text-xs font-bold ${isAbove ? 'text-emerald-500' : 'text-pink-500'}`}>
              {isAbove ? '+' : '−'}{Math.abs(def1)}
            </div>
          </div>
          <span className="text-slate-300 text-lg">×</span>
          <div className="text-center">
            <div className="text-xl font-black text-[#1E1B4B] font-serif">{parsed.num2}</div>
            <div className={`text-xs font-bold ${isAbove ? 'text-emerald-500' : 'text-pink-500'}`}>
              {isAbove ? '+' : '−'}{Math.abs(def2)}
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
          <div className="text-center">
            <span className="text-[8px] font-black text-violet-400 uppercase tracking-wider block mb-1">LHS (Cross-{isAbove ? 'Add' : 'Sub'})</span>
            <span className="font-mono text-xs font-bold text-violet-600">{lhs}</span>
          </div>
          <div className="text-center">
            <span className="text-[8px] font-black text-amber-500 uppercase tracking-wider block mb-1">RHS ({label} Product)</span>
            <span className="font-mono text-xs font-bold text-saffron">{rhs}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
