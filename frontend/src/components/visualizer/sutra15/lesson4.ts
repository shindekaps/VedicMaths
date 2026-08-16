import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildGunitaSystem(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: 'Solve a simple 2-variable system',
    log: [['Start', 'System']],
    lines: [
      { id: 'l1', label: 'Eq1', nodes: [cell('x+y'), sym('='), cell('5')] },
      { id: 'l2', label: 'Eq2', nodes: [cell('x-y'), sym('='), cell('1')] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Systems of Equations',
    ruleHTML: 'Gunitasamuccayah',
    frames,
    note: 'Solving linear systems.'
  };
}
