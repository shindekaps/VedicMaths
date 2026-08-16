import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildVyastiSeries(p: any): LessonModel {
  const n = parseInt(p.n) || 10;
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  frames.push({
    cap: `Summing the first ${n} natural numbers.`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Series',
        nodes: [cell('1'), sym('+'), cell('2'), sym('+'), cell('...'), sym('+'), cell(n.toString())]
      }
    ],
    wires: [], flyers: []
  });

  const sum = (n * (n + 1)) / 2;
  const pairsCount = n / 2;
  const pairSum = n + 1;

  log.push(['Pairing', `First + Last = ${pairSum}`]);
  log.push(['Pairs', `${pairsCount} pairs`]);

  frames.push({
    cap: `Pairing terms: 1 + ${n} = ${pairSum}. Total ${pairsCount} pairs. Sum = ${pairsCount} × ${pairSum} = ${sum}`,
    log: [...log, ['Total Sum', sum.toString()]],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell(sum.toString(), 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Series and Summations',
    ruleHTML: 'Pairing extremes to find the whole sum (Vyastisamastih).',
    frames,
    note: 'Individual and Collective'
  };
}
