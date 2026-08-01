import React from 'react';
import type { CellDef } from './types';

export const Cell = ({ def }: { def: CellDef }) => {
  let cls = 'vvm-cell';
  if (def.cls) cls += ' vvm-' + def.cls;
  if (def.sm) cls += ' vvm-sm';
  if (def.pop) cls += ' vvm-pop';
  
  return (
    <div className={cls} data-k={def.id}>
      {def.text}
      {def.tag && <span className="vvm-tag">{def.tag}</span>}
      {def.carry && <span className="vvm-carry">+{def.carry}</span>}
    </div>
  );
};
