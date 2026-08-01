import React, { useState, useEffect } from 'react';
import { type Lesson } from '../../api/lessons';
import { VisualizerTemplate } from '../visualizer/VisualizerTemplate';
import { buildLesson1, buildLesson2, buildLesson3, buildLesson4 } from '../visualizer/lessons';

interface LessonTutorialProps {
  lesson: Lesson;
  onNext: () => void;
}

export const LessonTutorial: React.FC<LessonTutorialProps> = ({ lesson, onNext }) => {
  const [params, setParams] = useState<any>({});

  // Set default initial parameters based on lesson
  useEffect(() => {
    if (lesson.lessonNumber === 1) setParams({ n: 65 });
    else if (lesson.lessonNumber === 2) setParams({ a: 42, b: 48 });
    else setParams({ n: 65 });
  }, [lesson.lessonNumber]);

  let errorMsg: string | null = null;
  let model;

  if (lesson.lessonNumber === 1 || !lesson.lessonNumber) {
    if (!Number.isInteger(params.n) || params.n % 10 !== 5 || params.n < 15) {
      errorMsg = 'Number must end in 5 (e.g. 25, 65, 105).';
    } else {
      model = buildLesson1(params);
    }
  } else if (lesson.lessonNumber === 2) {
    if (!Number.isInteger(params.a) || !Number.isInteger(params.b) || params.a < 11 || params.b < 11) {
      errorMsg = 'Please enter valid numbers (min 2 digits).';
    } else {
      const sA = String(params.a), sB = String(params.b);
      if (sA.length !== sB.length) {
        errorMsg = 'Numbers must have the same number of digits.';
      } else {
        let splitFound = false;
        for (let k = 1; k < sA.length; k++) {
          const pA = sA.slice(0, -k), pB = sB.slice(0, -k);
          const rA = Number(sA.slice(-k)), rB = Number(sB.slice(-k));
          if (pA === pB && rA + rB === Math.pow(10, k)) {
            splitFound = true;
            model = buildLesson2({ ...params, prev: pA, la: sA.slice(-k), lb: sB.slice(-k), k });
            break;
          }
        }
        if (!splitFound) {
          errorMsg = 'Leading parts must match, and last digits must sum to 10, 100, or 1000.';
        }
      }
    }
  } else if (lesson.lessonNumber === 3) {
    model = buildLesson3(params);
  } else if (lesson.lessonNumber === 4) {
    if (!Number.isInteger(params.num) || params.num < 100) {
      errorMsg = 'Enter a whole number of at least 3 digits.';
    } else {
      model = buildLesson4(params);
    }
  } else {
    model = buildLesson1(params); // Fallback 
  }

  let inputControls = null;
  if (lesson.lessonNumber === 1 || !lesson.lessonNumber) {
    inputControls = (
      <div className="flex items-center gap-3">
        <span className="text-white/60 text-sm font-bold">Try it with:</span>
        <input 
          type="number" 
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono w-24 focus:outline-none focus:border-saffron"
          value={params.n || ''}
          onChange={(e) => setParams({ ...params, n: Number(e.target.value) })}
          min={15} max={995} step={10}
        />
      </div>
    );
  } else if (lesson.lessonNumber === 2) {
    inputControls = (
      <div className="flex items-center gap-3">
        <span className="text-white/60 text-sm font-bold">Try it with:</span>
        <input 
          type="number" 
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono w-20 focus:outline-none focus:border-saffron"
          value={params.a || ''}
          onChange={(e) => setParams({ ...params, a: Number(e.target.value) })}
        />
        <span className="text-white/40 font-bold">×</span>
        <input 
          type="number" 
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono w-20 focus:outline-none focus:border-saffron"
          value={params.b || ''}
          onChange={(e) => setParams({ ...params, b: Number(e.target.value) })}
        />
      </div>
    );
  } else if (lesson.lessonNumber === 3) {
    inputControls = (
      <div className="flex items-center gap-3">
        <span className="text-white/60 text-sm font-bold">1 / </span>
        <select 
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-saffron"
          value={params.den || 19}
          onChange={(e) => setParams({ ...params, den: Number(e.target.value) })}
        >
          <option value="19">19</option>
          <option value="29">29</option>
          <option value="39">39</option>
          <option value="49">49</option>
        </select>
      </div>
    );
  } else if (lesson.lessonNumber === 4) {
    inputControls = (
      <div className="flex items-center gap-3">
        <span className="text-white/60 text-sm font-bold">Try it with:</span>
        <input 
          type="number" 
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono w-24 focus:outline-none focus:border-saffron"
          value={params.num || ''}
          onChange={(e) => setParams({ ...params, num: Number(e.target.value) })}
        />
        <span className="text-white/60 text-sm font-bold px-1">÷</span>
        <select 
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-saffron"
          value={params.den || 19}
          onChange={(e) => setParams({ ...params, den: Number(e.target.value) })}
        >
          <option value="19">19</option>
          <option value="29">29</option>
          <option value="39">39</option>
          <option value="49">49</option>
        </select>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeUp relative z-10 pb-8 space-y-6">
      <div className="bg-[#0F172A] p-6 rounded-[32px] shadow-2xl border border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h4 className="text-white font-black text-xl">Interactive Tutorial</h4>
          {inputControls}
        </div>
        
        {errorMsg ? (
          <div className="flex items-center justify-center min-h-[280px] bg-[#0d1117] rounded-lg border border-red-500/20 text-red-400 font-medium px-4 text-center">
            ⚠ {errorMsg}
          </div>
        ) : (
          <VisualizerTemplate model={model} />
        )}
      </div>

      <div className="max-w-2xl mx-auto mt-8">
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-violet to-saffron hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg shadow-violet/25"
        >
          Next: Examples ➜
        </button>
      </div>
    </div>
  );
};
