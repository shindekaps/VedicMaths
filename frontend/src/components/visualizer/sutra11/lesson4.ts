import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildVyastiSum(p: any): LessonModel {
  const n = parseInt(p.n) || 100;
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  const sum = (n * (n + 1)) / 2;

  frames.push({
    cap: `Sum of 1 to ${n} using Gauss's pairing trick`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Formula',
        nodes: [cell('1'), sym('+'), cell(n.toString()), sym('='), cell((n+1).toString())]
      }
    ],
    wires: [], flyers: []
  });
  
  log.push(['Sum', sum.toString()]);
  
  frames.push({
    cap: `Result: ${n/2} pairs of ${n+1} = ${sum}`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Sum',
        nodes: [cell(sum.toString(), 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Summation Techniques',
    ruleHTML: 'Collective summation using individual pairs.',
    frames,
    note: 'Sutra 11'
  };
}
