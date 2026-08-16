import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSopantyaPoly(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: 'Finding next terms in a polynomial sequence using differences.',
    log: [['Step 1', 'Identify pattern']],
    lines: [
      { id: 'l1', label: 'Sequence', nodes: [cell('1'), sym(','), cell('4'), sym(','), cell('9'), sym(','), cell('16')] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: 'Differences between terms are 3, 5, 7...',
    log: [['Step 2', 'Find differences']],
    lines: [
      { id: 'l1', label: 'Sequence', nodes: [cell('1'), sym(','), cell('4'), sym(','), cell('9'), sym(','), cell('16')] },
      { id: 'l2', label: 'Differences', nodes: [cell('3', 'res'), sym(','), cell('5', 'res'), sym(','), cell('7', 'res')] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Polynomial Patterns',
    ruleHTML: 'Sopantyadvayamantyam - Ultimate and twice the penultimate',
    frames,
    note: 'Shows the differences of a quadratic sequence.'
  };
}
