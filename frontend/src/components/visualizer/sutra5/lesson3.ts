import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSunyamRational(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  // Frame 1
  log.push(['Start', 'Rational Eq: 1/(x-1) + 1/(x-2) = 0']);
  frames.push({
    cap: 'Solve the given rational equation.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Eq',
        nodes: [cell('1/(x-1)'), sym('+'), cell('1/(x-2)'), sym('='), cell('0')]
      }
    ],
    wires: [], flyers: []
  });

  // Frame 2
  log.push(['Simplify', 'Cross multiply to get common denominator']);
  frames.push({
    cap: 'Cross-multiply numerator and denominator.',
    log: [...log],
    lines: [
      ...frames[0].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Numerator',
        nodes: [cell('(x-2) + (x-1)'), sym('='), cell('0', '', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  // Frame 3
  log.push(['Solve', '2x - 3 = 0 → x = 3/2']);
  frames.push({
    cap: 'Simplify and solve for x.',
    log: [...log],
    lines: [
      ...frames[1].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell('2x - 3 = 0'), sym('→'), cell('x = 3/2', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Solving Rational Equations',
    ruleHTML: 'Sunyam Samyasamuccaye.',
    frames,
    note: 'When sum of fractions is zero.'
  };
}
