import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildSunyamZero, buildSunyamQuad, buildSunyamRational, buildSunyamSystem } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildSunyamZero, 2: buildSunyamQuad, 3: buildSunyamRational, 4: buildSunyamSystem };
export const defaultParams: Record<number, any> = {
    1: { a: 3, b: 5 },
    2: { a: 1, b: -7, c: 12 },
    3: {},
    4: { sumVal: 5, prodVal: 6 },
  };
export const validators: Record<number, (p: any) => string | null> = {};

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

    if (lessonNum === 1) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>(x -</span>
        <NumberInput value={params.a} onChange={set('a')} />
        <span className={labelCls}>)(x -</span>
        <NumberInput value={params.b} onChange={set('b')} />
        <span className={labelCls}>) = 0</span>
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
