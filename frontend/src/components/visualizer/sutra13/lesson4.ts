import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSopantyaComplex(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: 'Factoring a polynomial by identifying patterns',
    log: [['Start', 'Identify patterns']],
    lines: [
      { id: 'l1', label: 'Poly', nodes: [cell('x²'), sym('+'), cell('5x'), sym('+'), cell('6')] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: 'Factors of 6 that add to 5 are 2 and 3',
    log: [['Step 1', 'Split middle term']],
    lines: [
      { id: 'l1', label: 'Poly', nodes: [cell('x²'), sym('+'), cell('2x'), sym('+'), cell('3x'), sym('+'), cell('6')] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Complex Expressions',
    ruleHTML: 'Sopantyadvayamantyam',
    frames,
    note: 'Factoring expressions.'
  };
}
