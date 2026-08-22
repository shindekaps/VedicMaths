import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildNikhilamSub, buildNikhilamMulBelow, buildNikhilamMulAbove, buildNikhilamDiv } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildNikhilamSub, 2: buildNikhilamMulBelow, 3: buildNikhilamMulAbove, 4: buildNikhilamDiv };
export const defaultParams: Record<number, any> = {
    1: { base: 1000, num: 387 },
    2: { a: 94, b: 92 },
    3: { a: 108, b: 107 },
    4: { num: 1232, den: 9 },
  };
export const validators: Record<number, (p: any) => string | null> = {
    1: (p: any) => (!Number.isInteger(p.base) || !Number.isInteger(p.num) || p.num >= p.base || p.num <= 0) ? 'Subtrahend must be smaller than base (power of 10).' : null,
    2: (p: any) => (!Number.isInteger(p.a) || !Number.isInteger(p.b) || p.a <= 0 || p.b <= 0) ? 'Please enter valid positive numbers to multiply.' : null,
    3: (p: any) => (!Number.isInteger(p.a) || !Number.isInteger(p.b) || p.a <= 0 || p.b <= 0) ? 'Please enter valid positive numbers to multiply.' : null,
    4: (p: any) => (!Number.isInteger(p.num) || !Number.isInteger(p.den) || p.num <= 0 || p.den <= 0) ? 'Please enter valid positive numbers for division.' : null,
  };

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

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
  return null;
}

export const config = {
  builders,
  defaultParams,
  validators,
  InputControls
};
