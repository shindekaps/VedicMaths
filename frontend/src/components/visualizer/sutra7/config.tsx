import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildSankalanaSimple, buildSankalanaMulti, buildSankalanaWord, buildSankalanaInequality } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildSankalanaSimple, 2: buildSankalanaMulti, 3: buildSankalanaWord, 4: buildSankalanaInequality };
export const defaultParams: Record<number, any> = {
    1: { a: 2, b: 3, c: 11 },
    2: { a1: 3, b1: 2, c1: 12, a2: 2, b2: 1, c2: 7 },
    3: {},
    4: { a: 2, b: 3, c: 9 },
  };
export const validators: Record<number, (p: any) => string | null> = {};

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

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
  return null;
}

export const config = {
  builders,
  defaultParams,
  validators,
  InputControls
};
