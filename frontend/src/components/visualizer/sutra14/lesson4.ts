import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildEkanyunenaGP(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: 'Geometric series sum formula derivation visually',
    log: [['Start', 'Sum of GP']],
    lines: [
      { id: 'l1', label: 'Series', nodes: [cell('1'), sym('+'), cell('x'), sym('+'), cell('x²')] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Geometric Progressions',
    ruleHTML: 'Ekanyunena Purvena',
    frames,
    note: 'Visualizing series sum.'
  };
}
