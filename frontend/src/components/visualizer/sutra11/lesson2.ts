import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildVyastiProb(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  frames.push({
    cap: 'P(A or B) = P(A) + P(B) - P(A and B)',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Formula',
        nodes: [
          cell('P(A∪B)'), sym('='),
          cell('P(A)'), sym('+'),
          cell('P(B)'), sym('-'),
          cell('P(A∩B)')
        ]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Probability and Combinations',
    ruleHTML: 'Analyzing individual and collective probabilities.',
    frames,
    note: 'Sutra 11'
  };
}
