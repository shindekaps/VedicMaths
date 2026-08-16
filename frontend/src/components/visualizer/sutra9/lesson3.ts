import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym } from '../helpers';

export function buildChalanaDiff(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  log.push(['Recurrence', 'F(n) = F(n-1) + F(n-2)']);
  frames.push({
    cap: `A Fibonacci-like recurrence where each term is the sum of the previous two.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Rule',
        nodes: [cell('F(n)', 'res'), sym('='), cell('F(n-1)', 'eka'), sym('+'), cell('F(n-2)', 'eka')]
      }
    ],
    wires: [],
    flyers: []
  });
  
  log.push(['Sequence', '1, 1, 2, 3, 5, 8, ...']);
  frames.push({
    cap: `Generating the sequence step-by-step.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Terms',
        nodes: [cell('1'), cell('1'), cell('2'), cell('3'), cell('5'), cell('8'), cell('...', 'muted')]
      }
    ],
    wires: [],
    flyers: []
  });
  
  return {
    title: 'Sutra 9 - Chalana-Kalanabyham: Difference Equations',
    ruleHTML: 'Using sums and differences of previous terms to build a sequence.',
    frames,
    note: `Example of a recursive sequence.`
  };
}
