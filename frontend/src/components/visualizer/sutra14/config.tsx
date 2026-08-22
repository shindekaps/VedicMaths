import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildEkanyunenaMul, buildEkanyunenaDiv, buildEkanyunenaAlgebra, buildEkanyunenaGP } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildEkanyunenaMul, 2: buildEkanyunenaDiv, 3: buildEkanyunenaAlgebra, 4: buildEkanyunenaGP };
export const defaultParams: Record<number, any> = {
    1: { n: 35 },
    2: {},
    3: {},
    4: {},
  };
export const validators: Record<number, (p: any) => string | null> = {};

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

    if (lessonNum === 1) return (
    <div className="flex items-center gap-3">
      <span className={labelCls}>Multiply:</span>
      <NumberInput value={params.n} onChange={set('n')} wide />
      <span className={opCls}>× 99</span>
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
