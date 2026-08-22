import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildVyastiSeries, buildVyastiProb, buildVyastiStats, buildVyastiSum } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildVyastiSeries, 2: buildVyastiProb, 3: buildVyastiStats, 4: buildVyastiSum };
export const defaultParams: Record<number, any> = {
    1: { n: 10 },
    2: {},
    3: {},
    4: { n: 100 },
  };
export const validators: Record<number, (p: any) => string | null> = {};

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

    if (lessonNum === 1 || lessonNum === 4) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>n =</span>
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
