import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildUrdhvaTwo, buildUrdhvaThree, buildUrdhvaDec, buildUrdhvaSquare } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildUrdhvaTwo, 2: buildUrdhvaThree, 3: buildUrdhvaDec, 4: buildUrdhvaSquare };
export const defaultParams: Record<number, any> = {
    1: { a: 23, b: 45 },
    2: { a: 123, b: 456 },
    3: { a: 2.3, b: 4.5 },
    4: { n: 23 },
  };
export const validators: Record<number, (p: any) => string | null> = {};

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

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
  return null;
}

export const config = {
  builders,
  defaultParams,
  validators,
  InputControls
};
