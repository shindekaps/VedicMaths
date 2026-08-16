import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildAnurupyePartial(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Start', 'Fraction: 1 / (x-1)(x-2)']);
  frames.push({
    cap: 'Decompose the given fraction into partial fractions.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Frac',
        nodes: [cell('1 / ((x-1)(x-2))')]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Decompose', 'A/(x-1) + B/(x-2)']);
  frames.push({
    cap: 'Express as sum of fractions with unknowns A and B.',
    log: [...log],
    lines: [
      ...frames[0].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Form',
        nodes: [cell('A/(x-1)'), sym('+'), cell('B/(x-2)', '', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Solve', 'A = -1, B = 1']);
  frames.push({
    cap: 'Find values of A and B using Anurupye Sunyamanyat.',
    log: [...log],
    lines: [
      ...frames[1].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell('-1/(x-1)'), sym('+'), cell('1/(x-2)', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Partial Fractions',
    ruleHTML: 'Anurupye Sunyamanyat.',
    frames,
    note: 'Decomposition using proportionality.'
  };
}
