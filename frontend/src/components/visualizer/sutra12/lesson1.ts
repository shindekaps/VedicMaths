import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildShesaDivisibility(p: any): LessonModel {
  const n = parseInt(p.n) || 2350;
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  frames.push({
    cap: `Checking divisibility for ${n}`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Number',
        nodes: [cell(n.toString(), '', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Divisibility Rules',
    ruleHTML: 'Using remainders by the last digit to check divisibility.',
    frames,
    note: 'Sutra 12'
  };
}
