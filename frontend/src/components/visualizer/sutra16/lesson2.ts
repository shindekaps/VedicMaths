import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildGunakaRoot(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: 'If P(1)=0 then (x-1) is a factor',
    log: [['Start', 'Check P(1)']],
    lines: [
      { id: 'l1', label: 'P(x)', nodes: [cell('x² - 3x + 2')] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: '1 - 3 + 2 = 0',
    log: [['Result', 'P(1)=0']],
    lines: [
      { id: 'l2', label: 'Sum', nodes: [cell('1 - 3 + 2 = 0', 'res', {pop: true})] },
      { id: 'l3', label: 'Factor', nodes: [cell('(x-1) is a factor!', 'res')] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Root Finding',
    ruleHTML: 'Gunakasamuccayah',
    frames,
    note: 'Identifying factors using coefficients.'
  };
}
