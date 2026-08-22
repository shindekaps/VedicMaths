import React, { useState, useEffect } from 'react';
import { type Lesson } from '../../api/lessons';
import { VisualizerTemplate } from '../visualizer/VisualizerTemplate';
import { sutraConfigs } from '../visualizer';

interface LessonTutorialProps {
  lesson: Lesson;
  onNext: () => void;
}

export const LessonTutorial: React.FC<LessonTutorialProps> = ({ lesson, onNext }) => {
  const [params, setParams] = useState<any>({});

  const sutraNum = lesson.sutraNumber || 1;
  const lessonNum = lesson.lessonNumber || 1;

  const config = sutraConfigs[sutraNum];

  // Set default initial parameters based on sutra and lesson
  useEffect(() => {
    const defaults = config?.defaultParams?.[lessonNum] ?? {};
    setParams(defaults);
  }, [sutraNum, lessonNum, config]);

  // Special pre-processing for sutra 1 lesson 2 (needs derived params)
  let buildParams = { ...params };
  if (sutraNum === 1 && lessonNum === 2) {
    const sA = String(params.a), sB = String(params.b);
    for (let k = 1; k < sA.length; k++) {
      const pA = sA.slice(0, -k), pB = sB.slice(0, -k);
      const rA = Number(sA.slice(-k)), rB = Number(sB.slice(-k));
      if (pA === pB && rA + rB === Math.pow(10, k)) {
        buildParams = { ...params, prev: pA, la: sA.slice(-k), lb: sB.slice(-k), k };
        break;
      }
    }
  }

  // Validate
  const validator = config?.validators?.[lessonNum];
  const errorMsg = validator ? validator(params) : null;

  // Build model
  let model;
  if (!errorMsg) {
    const builder = config?.builders?.[lessonNum];
    if (builder) {
      try {
        model = builder(buildParams);
      } catch (e) {
        // Graceful fallback if builder crashes
        console.error(`Builder error for sutra ${sutraNum} lesson ${lessonNum}:`, e);
      }
    }
  }

  const InputControls = config?.InputControls;

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeUp relative z-10 pb-8 space-y-6">
      <div className="bg-[#0F172A] p-6 rounded-[32px] shadow-2xl border border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h4 className="text-white font-black text-xl">Interactive Tutorial</h4>
          {InputControls && <InputControls lessonNum={lessonNum} params={params} setParams={setParams} />}
        </div>
        
        {errorMsg ? (
          <div className="flex items-center justify-center min-h-[280px] bg-[#0d1117] rounded-lg border border-red-500/20 text-red-400 font-medium px-4 text-center">
            ⚠ {errorMsg}
          </div>
        ) : model ? (
          <VisualizerTemplate model={model} />
        ) : (
          <div className="flex items-center justify-center min-h-[280px] bg-[#0d1117] rounded-lg border border-white/10 text-white/40 font-medium px-4 text-center">
            Loading visualizer...
          </div>
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
