import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildGunakaPoly, buildGunakaRoot, buildGunakaVerify, buildGunakaAdvanced } from './index';

export const builders: Record<number, (p: any) => any> = { 
  1: buildGunakaPoly, 
  2: buildGunakaRoot, 
  3: buildGunakaVerify, 
  4: buildGunakaAdvanced 
};

export const defaultParams: Record<number, any> = {
  1: { coeffs: [3, 2, -5, 7] },
  2: {},
  3: { a: 2, b: 1, c: 1, d: 2 }, // default for (2x + 1)(x + 2)
  4: {},
};

export const validators: Record<number, (p: any) => string | null> = {
  3: (p: any) => {
    if (p.a === 0 || p.c === 0) return 'Coefficient of x cannot be zero.';
    return null;
  }
};

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

  if (lessonNum === 3) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <span className={labelCls}>Verify:</span>
        <span className="text-white font-mono">(</span>
        <NumberInput value={params.a} onChange={set('a')} />
        <span className="text-white font-mono">x +</span>
        <NumberInput value={params.b} onChange={set('b')} />
        <span className="text-white font-mono">)(</span>
        <NumberInput value={params.c} onChange={set('c')} />
        <span className="text-white font-mono">x +</span>
        <NumberInput value={params.d} onChange={set('d')} />
        <span className="text-white font-mono">)</span>
      </div>
    );
  }

  return null;
}

export const config = {
  builders,
  defaultParams,
  validators,
  InputControls
};
