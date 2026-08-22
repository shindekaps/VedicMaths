import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildAnurupyeProportion, buildAnurupyeSolve, buildAnurupyePartial, buildAnurupyeGeo } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildAnurupyeProportion, 2: buildAnurupyeSolve, 3: buildAnurupyePartial, 4: buildAnurupyeGeo };
export const defaultParams: Record<number, any> = {
    1: { a: 3, b: 5, c: 7 },
    2: { a: 3, b: 5, c: 12 },
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
