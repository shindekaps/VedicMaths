import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildSopantyaPoly, buildSopantyaSequence, buildSopantyaCalc, buildSopantyaComplex } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildSopantyaPoly, 2: buildSopantyaSequence, 3: buildSopantyaCalc, 4: buildSopantyaComplex };
export const defaultParams: Record<number, any> = {
    1: {},
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
