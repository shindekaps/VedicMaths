import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildYavadunam100, buildYavadunam1000, buildYavadunamCube, buildYavadunamFactor } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildYavadunam100, 2: buildYavadunam1000, 3: buildYavadunamCube, 4: buildYavadunamFactor };
export const defaultParams: Record<number, any> = {
    1: { n: 98 },
    2: { n: 998 },
    3: { n: 99 },
    4: { n: 9999 },
  };
export const validators: Record<number, (p: any) => string | null> = {};

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

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
  return null;
}

export const config = {
  builders,
  defaultParams,
  validators,
  InputControls
};
