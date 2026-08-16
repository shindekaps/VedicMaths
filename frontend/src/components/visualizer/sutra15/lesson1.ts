import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildGunitaFactor(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: 'Verify factorization by checking digit sums',
    log: [['Start', '(x+2)(x+3) = x²+5x+6']],
    lines: [
      { id: 'l1', label: 'Eq', nodes: [cell('(x+2)(x+3)'), sym('='), cell('x²+5x+6')] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: 'Check at x=1: (1+2)(1+3) = 1+5+6',
    log: [['Substitute', 'x=1']],
    lines: [
      { id: 'l1', label: 'Eq', nodes: [cell('(1+2)(1+3)'), sym('='), cell('1+5+6')] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: '3 × 4 = 12, and 12 = 12 ✓',
    log: [['Verify', '12 = 12']],
    lines: [
      { id: 'l2', label: 'Result', nodes: [cell('3 × 4'), sym('='), cell('12')] },
      { id: 'l3', label: 'Match', nodes: [cell('12', 'res', {pop: true}), sym('='), cell('12', 'res', {pop: true})] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Factorization Verification',
    ruleHTML: 'Gunitasamuccayah - Product of sum = sum of products',
    frames,
    note: 'Verifying algebraic identities using numerical substitution.'
  };
}
