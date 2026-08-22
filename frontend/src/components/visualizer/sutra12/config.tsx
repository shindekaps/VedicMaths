import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildShesaDivisibility, buildShesaCastNines, buildShesaModular, buildShesaError } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildShesaDivisibility, 2: buildShesaCastNines, 3: buildShesaModular, 4: buildShesaError };
export const defaultParams: Record<number, any> = {
    1: { n: 2350 },
    2: { a: 23, b: 45 },
    3: {},
    4: {},
  };
export const validators: Record<number, (p: any) => string | null> = {};

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

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
  return null;
}

export const config = {
  builders,
  defaultParams,
  validators,
  InputControls
};
