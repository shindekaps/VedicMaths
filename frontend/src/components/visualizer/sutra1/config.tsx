import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildLesson1, buildLesson2, buildLesson3, buildLesson4 } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildLesson1, 2: buildLesson2, 3: buildLesson3, 4: buildLesson4 };
export const defaultParams: Record<number, any> = {
    1: { n: 65 },
    2: { a: 42, b: 48 },
    3: { den: 19 },
    4: { num: 4275, den: 19 },
  };
export const validators: Record<number, (p: any) => string | null> = {
    1: (p: any) => (!Number.isInteger(p.n) || p.n % 10 !== 5 || p.n < 15) ? 'Number must end in 5 (e.g. 25, 65, 105).' : null,
    2: (p: any) => {
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
    4: (p: any) => (!Number.isInteger(p.num) || p.num < 100) ? 'Enter a whole number of at least 3 digits.' : null,
  };

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

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
  return null;
}

export const config = {
  builders,
  defaultParams,
  validators,
  InputControls
};
