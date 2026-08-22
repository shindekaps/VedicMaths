import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildChalanaSequence, buildChalanaCalc, buildChalanaDiff, buildChalanaOptimize } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildChalanaSequence, 2: buildChalanaCalc, 3: buildChalanaDiff, 4: buildChalanaOptimize };
export const defaultParams: Record<number, any> = {
    1: { first: 2, diff: 3, n: 10 },
    2: {},
    3: {},
    4: {},
  };
export const validators: Record<number, (p: any) => string | null> = {};

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });
  return null;
}

export const config = {
  builders,
  defaultParams,
  validators,
  InputControls
};
