import React from 'react';
import { parseSutra1Problem, parseDigitGrid } from '../utils/mathUtils';

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
