import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildPuranaComplete, buildPuranaSolve, buildPuranaSimplify, buildPuranaGeo } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildPuranaComplete, 2: buildPuranaSolve, 3: buildPuranaSimplify, 4: buildPuranaGeo };
export const defaultParams: Record<number, any> = {
    1: { b: 6, c: 5 },
    2: { b: 5, c: 6 },
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
