import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSopantyaCalc(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: 'Taylor Series approximation conceptually',
    log: [['Concept', 'Polynomial approximation']],
    lines: [
      { id: 'l1', label: 'f(x)', nodes: [cell('f(a)'), sym('+'), cell("f'(a)(x-a)")] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Calculus Applications',
    ruleHTML: 'Sopantyadvayamantyam',
    frames,
    note: 'Visualizing series approximation.'
  };
}
