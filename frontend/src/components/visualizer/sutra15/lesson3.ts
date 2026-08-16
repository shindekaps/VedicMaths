import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildGunitaPoly(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: 'Solve (2x+3)(x-1) = 0 step by step',
    log: [['Start', 'Equation']],
    lines: [
      { id: 'l1', label: 'Eq', nodes: [cell('(2x+3)(x-1)'), sym('='), cell('0')] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: 'Set each factor to zero',
    log: [['Solve', '2x+3=0 or x-1=0']],
    lines: [
      { id: 'l2', label: 'Roots', nodes: [cell('x = -3/2', 'res'), sym(','), cell('x = 1', 'res')] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Polynomial Equations',
    ruleHTML: 'Gunitasamuccayah',
    frames,
    note: 'Finding roots.'
  };
}
