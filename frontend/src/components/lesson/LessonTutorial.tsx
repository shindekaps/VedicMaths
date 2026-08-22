import React, { useState, useEffect } from 'react';
import { type Lesson } from '../../api/lessons';
import { VisualizerTemplate } from '../visualizer/VisualizerTemplate';
import { buildLesson1, buildLesson2, buildLesson3, buildLesson4 } from '../visualizer/sutra1';
import { buildNikhilamSub, buildNikhilamMulBelow, buildNikhilamMulAbove, buildNikhilamDiv } from '../visualizer/sutra2';
import { buildUrdhvaTwo, buildUrdhvaThree, buildUrdhvaDec, buildUrdhvaSquare } from '../visualizer/sutra3';
import { buildParavartyaSingle, buildParavartyaTwo, buildParavartyaLarge, buildParavartyaLinear } from '../visualizer/sutra4';
import { buildSunyamZero, buildSunyamQuad, buildSunyamRational, buildSunyamSystem } from '../visualizer/sutra5';
import { buildAnurupyeProportion, buildAnurupyeSolve, buildAnurupyePartial, buildAnurupyeGeo } from '../visualizer/sutra6';
import { buildSankalanaSimple, buildSankalanaMulti, buildSankalanaWord, buildSankalanaInequality } from '../visualizer/sutra7';
import { buildPuranaComplete, buildPuranaSolve, buildPuranaSimplify, buildPuranaGeo } from '../visualizer/sutra8';
import { buildChalanaSequence, buildChalanaCalc, buildChalanaDiff, buildChalanaOptimize } from '../visualizer/sutra9';
import { buildYavadunam100, buildYavadunam1000, buildYavadunamCube, buildYavadunamFactor } from '../visualizer/sutra10';
import { buildVyastiSeries, buildVyastiProb, buildVyastiStats, buildVyastiSum } from '../visualizer/sutra11';
import { buildShesaDivisibility, buildShesaCastNines, buildShesaModular, buildShesaError } from '../visualizer/sutra12';
import { buildSopantyaPoly, buildSopantyaSequence, buildSopantyaCalc, buildSopantyaComplex } from '../visualizer/sutra13';
import { buildEkanyunenaMul, buildEkanyunenaDiv, buildEkanyunenaAlgebra, buildEkanyunenaGP } from '../visualizer/sutra14';
import { buildGunitaFactor, buildGunitaIdentity, buildGunitaPoly, buildGunitaSystem } from '../visualizer/sutra15';
import { buildGunakaPoly, buildGunakaRoot, buildGunakaVerify, buildGunakaAdvanced } from '../visualizer/sutra16';

interface LessonTutorialProps {
  lesson: Lesson;
  onNext: () => void;
}

// -------------------------------------------------------------------
// Builder lookup: sutraBuilders[sutraNumber][lessonNumber] = builder fn
// -------------------------------------------------------------------
const sutraBuilders: Record<number, Record<number, (p: any) => any>> = {
  1: { 1: buildLesson1, 2: buildLesson2, 3: buildLesson3, 4: buildLesson4 },
  2: { 1: buildNikhilamSub, 2: buildNikhilamMulBelow, 3: buildNikhilamMulAbove, 4: buildNikhilamDiv },
  3: { 1: buildUrdhvaTwo, 2: buildUrdhvaThree, 3: buildUrdhvaDec, 4: buildUrdhvaSquare },
  4: { 1: buildParavartyaSingle, 2: buildParavartyaTwo, 3: buildParavartyaLarge, 4: buildParavartyaLinear },
  5: { 1: buildSunyamZero, 2: buildSunyamQuad, 3: buildSunyamRational, 4: buildSunyamSystem },
  6: { 1: buildAnurupyeProportion, 2: buildAnurupyeSolve, 3: buildAnurupyePartial, 4: buildAnurupyeGeo },
  7: { 1: buildSankalanaSimple, 2: buildSankalanaMulti, 3: buildSankalanaWord, 4: buildSankalanaInequality },
  8: { 1: buildPuranaComplete, 2: buildPuranaSolve, 3: buildPuranaSimplify, 4: buildPuranaGeo },
  9: { 1: buildChalanaSequence, 2: buildChalanaCalc, 3: buildChalanaDiff, 4: buildChalanaOptimize },
  10: { 1: buildYavadunam100, 2: buildYavadunam1000, 3: buildYavadunamCube, 4: buildYavadunamFactor },
  11: { 1: buildVyastiSeries, 2: buildVyastiProb, 3: buildVyastiStats, 4: buildVyastiSum },
  12: { 1: buildShesaDivisibility, 2: buildShesaCastNines, 3: buildShesaModular, 4: buildShesaError },
  13: { 1: buildSopantyaPoly, 2: buildSopantyaSequence, 3: buildSopantyaCalc, 4: buildSopantyaComplex },
  14: { 1: buildEkanyunenaMul, 2: buildEkanyunenaDiv, 3: buildEkanyunenaAlgebra, 4: buildEkanyunenaGP },
  15: { 1: buildGunitaFactor, 2: buildGunitaIdentity, 3: buildGunitaPoly, 4: buildGunitaSystem },
  16: { 1: buildGunakaPoly, 2: buildGunakaRoot, 3: buildGunakaVerify, 4: buildGunakaAdvanced },
};

// -------------------------------------------------------------------
// Default parameters per sutra/lesson
// -------------------------------------------------------------------
const defaultParams: Record<number, Record<number, any>> = {
  1: {
    1: { n: 65 },
    2: { a: 42, b: 48 },
    3: { den: 19 },
    4: { num: 4275, den: 19 },
  },
  2: {
    1: { base: 1000, num: 387 },
    2: { a: 94, b: 92 },
    3: { a: 108, b: 107 },
    4: { num: 1232, den: 9 },
  },
  3: {
    1: { a: 23, b: 45 },
    2: { a: 123, b: 456 },
    3: { a: 2.3, b: 4.5 },
    4: { n: 23 },
  },
  4: {
    1: { num: 1352, den: 12 },
    2: { coeffs: [1, 5, 6], divisorK: 2 },
    3: { num: 1234, den: 121 },
    4: { a: 3, b: 5, c: 20 },
  },
  5: {
    1: { a: 3, b: 5 },
    2: { a: 1, b: -7, c: 12 },
    3: {},
    4: { sumVal: 5, prodVal: 6 },
  },
  6: {
    1: { a: 3, b: 5, c: 7 },
    2: { a: 3, b: 5, c: 12 },
    3: {},
    4: {},
  },
  7: {
    1: { a: 2, b: 3, c: 11 },
    2: { a1: 3, b1: 2, c1: 12, a2: 2, b2: 1, c2: 7 },
    3: {},
    4: { a: 2, b: 3, c: 9 },
  },
  8: {
    1: { b: 6, c: 5 },
    2: { b: 5, c: 6 },
    3: {},
    4: {},
  },
  9: {
    1: { first: 2, diff: 3, n: 10 },
    2: {},
    3: {},
    4: {},
  },
  10: {
    1: { n: 98 },
    2: { n: 998 },
    3: { n: 99 },
    4: { n: 9999 },
  },
  11: {
    1: { n: 10 },
    2: {},
    3: {},
    4: { n: 100 },
  },
  12: {
    1: { n: 2350 },
    2: { a: 23, b: 45 },
    3: {},
    4: {},
  },
  13: {
    1: {},
    2: {},
    3: {},
    4: {},
  },
  14: {
    1: { n: 35 },
    2: {},
    3: {},
    4: {},
  },
  15: {
    1: {},
    2: {},
    3: {},
    4: {},
  },
  16: {
    1: { coeffs: [3, 2, -5, 7] },
    2: {},
    3: {},
    4: {},
  },
};

// -------------------------------------------------------------------
// Validation functions per sutra/lesson (return error string or null)
// -------------------------------------------------------------------
const validators: Record<number, Record<number, (p: any) => string | null>> = {
  1: {
    1: (p) => (!Number.isInteger(p.n) || p.n % 10 !== 5 || p.n < 15) ? 'Number must end in 5 (e.g. 25, 65, 105).' : null,
    2: (p) => {
      if (!Number.isInteger(p.a) || !Number.isInteger(p.b) || p.a < 11 || p.b < 11) return 'Please enter valid numbers (min 2 digits).';
      const sA = String(p.a), sB = String(p.b);
      if (sA.length !== sB.length) return 'Numbers must have the same number of digits.';
      let splitFound = false;
      for (let k = 1; k < sA.length; k++) {
        const pA = sA.slice(0, -k), pB = sB.slice(0, -k);
        const rA = Number(sA.slice(-k)), rB = Number(sB.slice(-k));
        if (pA === pB && rA + rB === Math.pow(10, k)) { splitFound = true; break; }
      }
      return splitFound ? null : 'Leading parts must match, and last digits must sum to 10, 100, or 1000.';
    },
    4: (p) => (!Number.isInteger(p.num) || p.num < 100) ? 'Enter a whole number of at least 3 digits.' : null,
  },
  2: {
    1: (p) => (!Number.isInteger(p.base) || !Number.isInteger(p.num) || p.num >= p.base || p.num <= 0) ? 'Subtrahend must be smaller than base (power of 10).' : null,
    2: (p) => (!Number.isInteger(p.a) || !Number.isInteger(p.b) || p.a <= 0 || p.b <= 0) ? 'Please enter valid positive numbers to multiply.' : null,
    3: (p) => (!Number.isInteger(p.a) || !Number.isInteger(p.b) || p.a <= 0 || p.b <= 0) ? 'Please enter valid positive numbers to multiply.' : null,
    4: (p) => (!Number.isInteger(p.num) || !Number.isInteger(p.den) || p.num <= 0 || p.den <= 0) ? 'Please enter valid positive numbers for division.' : null,
  },
};

// -------------------------------------------------------------------
// Input field component helpers
// -------------------------------------------------------------------
const inputCls = "bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono w-20 focus:outline-none focus:border-saffron";
const inputClsWide = "bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono w-24 focus:outline-none focus:border-saffron";
const labelCls = "text-white/60 text-sm font-bold";
const opCls = "text-white/40 font-bold";
const selectCls = "bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-saffron";

function NumberInput({ value, onChange, wide, min, max, step }: { value: any; onChange: (v: number) => void; wide?: boolean; min?: number; max?: number; step?: number }) {
  return (
    <input
      type="number"
      className={wide ? inputClsWide : inputCls}
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min} max={max} step={step}
    />
  );
}

// -------------------------------------------------------------------
// Input controls per sutra/lesson
// -------------------------------------------------------------------
function getInputControls(
  sutraNum: number,
  lessonNum: number,
  params: any,
  setParams: (p: any) => void
): React.ReactNode {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

  // Sutra 1
  if (sutraNum === 1) {
    if (lessonNum === 1) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Try it with:</span>
        <NumberInput value={params.n} onChange={set('n')} wide min={15} max={995} step={10} />
      </div>
    );
    if (lessonNum === 2) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Try it with:</span>
        <NumberInput value={params.a} onChange={set('a')} />
        <span className={opCls}>×</span>
        <NumberInput value={params.b} onChange={set('b')} />
      </div>
    );
    if (lessonNum === 3) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>1 / </span>
        <select className={selectCls} value={params.den || 19} onChange={(e) => setParams({ ...params, den: Number(e.target.value) })}>
          <option value="19">19</option><option value="29">29</option>
          <option value="39">39</option><option value="49">49</option>
        </select>
      </div>
    );
    if (lessonNum === 4) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Try it with:</span>
        <NumberInput value={params.num} onChange={set('num')} wide />
        <span className={labelCls + " px-1"}>÷</span>
        <select className={selectCls} value={params.den || 19} onChange={(e) => setParams({ ...params, den: Number(e.target.value) })}>
          <option value="19">19</option><option value="29">29</option>
          <option value="39">39</option><option value="49">49</option>
        </select>
      </div>
    );
  }

  // Sutra 2
  if (sutraNum === 2) {
    if (lessonNum === 1) return (
      <div className="flex items-center gap-3">
        <select className={selectCls} value={params.base || 1000} onChange={(e) => setParams({ ...params, base: Number(e.target.value) })}>
          <option value="100">100</option><option value="1000">1000</option><option value="10000">10000</option>
        </select>
        <span className={opCls}>−</span>
        <NumberInput value={params.num} onChange={set('num')} wide />
      </div>
    );
    if (lessonNum === 2 || lessonNum === 3) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Try it with:</span>
        <NumberInput value={params.a} onChange={set('a')} />
        <span className={opCls}>×</span>
        <NumberInput value={params.b} onChange={set('b')} />
      </div>
    );
    if (lessonNum === 4) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Try it with:</span>
        <NumberInput value={params.num} onChange={set('num')} wide />
        <span className={labelCls + " px-1"}>÷</span>
        <NumberInput value={params.den} onChange={set('den')} />
      </div>
    );
  }

  // Sutra 3 — Urdhva Tiryagbhyam
  if (sutraNum === 3) {
    if (lessonNum === 1 || lessonNum === 2 || lessonNum === 3) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Try it with:</span>
        <NumberInput value={params.a} onChange={set('a')} />
        <span className={opCls}>×</span>
        <NumberInput value={params.b} onChange={set('b')} />
      </div>
    );
    if (lessonNum === 4) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Square of:</span>
        <NumberInput value={params.n} onChange={set('n')} wide />
      </div>
    );
  }

  // Sutra 4 — Paravartya Yojayet
  if (sutraNum === 4) {
    if (lessonNum === 2) {
      const coeffs: number[] = params.coeffs || [1, 5, 6];
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <span className={labelCls}>Coefficients:</span>
          {coeffs.map((c: number, i: number) => (
            <NumberInput key={i} value={c} onChange={(v: number) => {
              const newCoeffs = [...coeffs];
              newCoeffs[i] = v;
              setParams({ ...params, coeffs: newCoeffs });
            }} />
          ))}
          <button className="text-xs bg-white/10 rounded px-2 py-1 text-white/60" onClick={() => setParams({ ...params, coeffs: [...coeffs, 0] })}>+term</button>
          {coeffs.length > 2 && <button className="text-xs bg-white/10 rounded px-2 py-1 text-white/60" onClick={() => setParams({ ...params, coeffs: coeffs.slice(0, -1) })}>−term</button>}
          <span className={opCls}>÷ (x +</span>
          <NumberInput value={params.divisorK} onChange={set('divisorK')} />
          <span className={opCls}>)</span>
        </div>
      );
    }
    if (lessonNum === 1 || lessonNum === 3) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Try it with:</span>
        <NumberInput value={params.num} onChange={set('num')} wide />
        <span className={labelCls + " px-1"}>÷</span>
        <NumberInput value={params.den} onChange={set('den')} />
      </div>
    );
    if (lessonNum === 4) return (
      <div className="flex items-center gap-3">
        <NumberInput value={params.a} onChange={set('a')} />
        <span className={labelCls}>x +</span>
        <NumberInput value={params.b} onChange={set('b')} />
        <span className={opCls}>=</span>
        <NumberInput value={params.c} onChange={set('c')} />
      </div>
    );
  }

  // Sutra 5 — Sunyam
  if (sutraNum === 5) {
    if (lessonNum === 1) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>(x -</span>
        <NumberInput value={params.a} onChange={set('a')} />
        <span className={labelCls}>)(x -</span>
        <NumberInput value={params.b} onChange={set('b')} />
        <span className={labelCls}>) = 0</span>
      </div>
    );
  }

  // Sutra 7 — Sankalana
  if (sutraNum === 7) {
    if (lessonNum === 1) return (
      <div className="flex items-center gap-3">
        <NumberInput value={params.a} onChange={set('a')} />
        <span className={labelCls}>x +</span>
        <NumberInput value={params.b} onChange={set('b')} />
        <span className={opCls}>=</span>
        <NumberInput value={params.c} onChange={set('c')} />
      </div>
    );
    if (lessonNum === 4) return (
      <div className="flex items-center gap-3">
        <NumberInput value={params.a} onChange={set('a')} />
        <span className={labelCls}>x +</span>
        <NumberInput value={params.b} onChange={set('b')} />
        <span className={opCls}>&gt;</span>
        <NumberInput value={params.c} onChange={set('c')} />
      </div>
    );
  }

  // Sutra 10 — Yavadunam
  if (sutraNum === 10) {
    if (lessonNum <= 3) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Number:</span>
        <NumberInput value={params.n} onChange={set('n')} wide />
      </div>
    );
    if (lessonNum === 4) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Factorise:</span>
        <NumberInput value={params.n} onChange={set('n')} wide />
      </div>
    );
  }

  // Sutra 11 — Vyasti
  if (sutraNum === 11) {
    if (lessonNum === 1 || lessonNum === 4) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>n =</span>
        <NumberInput value={params.n} onChange={set('n')} wide />
      </div>
    );
  }

  // Sutra 12 — Shesa
  if (sutraNum === 12) {
    if (lessonNum === 1) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Check:</span>
        <NumberInput value={params.n} onChange={set('n')} wide />
      </div>
    );
    if (lessonNum === 2) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Verify:</span>
        <NumberInput value={params.a} onChange={set('a')} />
        <span className={opCls}>×</span>
        <NumberInput value={params.b} onChange={set('b')} />
      </div>
    );
  }

  // Sutra 14 — Ekanyunena
  if (sutraNum === 14 && lessonNum === 1) return (
    <div className="flex items-center gap-3">
      <span className={labelCls}>Multiply:</span>
      <NumberInput value={params.n} onChange={set('n')} wide />
      <span className={opCls}>× 99</span>
    </div>
  );

  // Default: no special input controls — lesson uses its built-in defaults
  return null;
}

// -------------------------------------------------------------------
// Main Component
// -------------------------------------------------------------------
export const LessonTutorial: React.FC<LessonTutorialProps> = ({ lesson, onNext }) => {
  const [params, setParams] = useState<any>({});

  const sutraNum = lesson.sutraNumber || 1;
  const lessonNum = lesson.lessonNumber || 1;

  // Set default initial parameters based on sutra and lesson
  useEffect(() => {
    const defaults = defaultParams[sutraNum]?.[lessonNum] ?? {};
    setParams(defaults);
  }, [sutraNum, lessonNum]);

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
  const validator = validators[sutraNum]?.[lessonNum];
  const errorMsg = validator ? validator(params) : null;

  // Build model
  let model;
  if (!errorMsg) {
    const builder = sutraBuilders[sutraNum]?.[lessonNum];
    if (builder) {
      try {
        model = builder(buildParams);
      } catch (e) {
        // Graceful fallback if builder crashes
        console.error(`Builder error for sutra ${sutraNum} lesson ${lessonNum}:`, e);
      }
    }
  }

  const inputControls = getInputControls(sutraNum, lessonNum, params, setParams);

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
