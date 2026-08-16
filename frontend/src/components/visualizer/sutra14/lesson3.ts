import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildEkanyunenaAlgebra(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: 'Extracting (x-1) factor from a polynomial',
    log: [['Start', 'Factor extraction']],
    lines: [
      { id: 'l1', label: 'Poly', nodes: [cell('x²'), sym('-'), cell('1')] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: 'Difference of squares: (x-1)(x+1)',
    log: [['Result', '(x-1)(x+1)']],
    lines: [
      { id: 'l2', label: 'Factors', nodes: [cell('(x-1)'), cell('(x+1)')] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Algebraic Applications',
    ruleHTML: 'Ekanyunena Purvena',
    frames,
    note: 'Polynomial factorization.'
  };
}
