import React from 'react';

export const inputCls = "bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono w-20 focus:outline-none focus:border-saffron";
export const inputClsWide = "bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono w-24 focus:outline-none focus:border-saffron";
export const labelCls = "text-white/60 text-sm font-bold";
export const opCls = "text-white/40 font-bold";
export const selectCls = "bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-saffron";

export function NumberInput({ value, onChange, wide, min, max, step }: { value: any; onChange: (v: number) => void; wide?: boolean; min?: number; max?: number; step?: number }) {
  return (
    <input
      type="number"
      className={wide ? inputClsWide : inputCls}
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min} max={max} step={step}
    />
  );
}
