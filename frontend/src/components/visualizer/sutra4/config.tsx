import React from 'react';
import { NumberInput, labelCls, opCls, selectCls } from '../ui-helpers';
import { buildParavartyaSingle, buildParavartyaTwo, buildParavartyaLarge, buildParavartyaLinear } from './index';

export const builders: Record<number, (p: any) => any> = { 1: buildParavartyaSingle, 2: buildParavartyaTwo, 3: buildParavartyaLarge, 4: buildParavartyaLinear };
export const defaultParams: Record<number, any> = {
    1: { num: 1352, den: 12 },
    2: { coeffs: [1, 5, 6], divisorK: 2 },
    3: { num: 1234, den: 121 },
    4: { a: 3, b: 5, c: 20 },
  };
export const validators: Record<number, (p: any) => string | null> = {};

export function InputControls({ lessonNum, params, setParams }: { lessonNum: number; params: any; setParams: (p: any) => void }) {
  const set = (key: string) => (v: number) => setParams({ ...params, [key]: v });

    if (lessonNum === 2) {
      const coeffs: number[] = params.coeffs || [1, 5, 6];
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <span className={labelCls}>Coefficients:</span>
          {coeffs.map((c: number, i: number) => (
            <NumberInput key={i} value={c} onChange={(v: number) => {
              const newCoeffs = [...coeffs];
              newCoeffs[i] = v;
              setParams({ ...params, coeffs: newCoeffs });
            }} />
          ))}
          <button className="text-xs bg-white/10 rounded px-2 py-1 text-white/60" onClick={() => setParams({ ...params, coeffs: [...coeffs, 0] })}>+term</button>
          {coeffs.length > 2 && <button className="text-xs bg-white/10 rounded px-2 py-1 text-white/60" onClick={() => setParams({ ...params, coeffs: coeffs.slice(0, -1) })}>−term</button>}
          <span className={opCls}>÷ (x +</span>
          <NumberInput value={params.divisorK} onChange={set('divisorK')} />
          <span className={opCls}>)</span>
        </div>
      );
    }
    if (lessonNum === 1 || lessonNum === 3) return (
      <div className="flex items-center gap-3">
        <span className={labelCls}>Try it with:</span>
        <NumberInput value={params.num} onChange={set('num')} wide />
        <span className={labelCls + " px-1"}>÷</span>
        <NumberInput value={params.den} onChange={set('den')} />
      </div>
    );
    if (lessonNum === 4) return (
      <div className="flex items-center gap-3">
        <NumberInput value={params.a} onChange={set('a')} />
        <span className={labelCls}>x +</span>
        <NumberInput value={params.b} onChange={set('b')} />
        <span className={opCls}>=</span>
        <NumberInput value={params.c} onChange={set('c')} />
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
