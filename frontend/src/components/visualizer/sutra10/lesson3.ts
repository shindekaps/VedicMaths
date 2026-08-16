import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym } from '../helpers';

export function buildYavadunamCube(p: any): LessonModel {
  const n = p.n || 99;
  const base = 100;
  const d = base - n; // deficiency
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  log.push(['Setup', `n = ${n}, base = ${base}, deficiency = ${d}`]);
  frames.push({
    cap: `Cubing ${n}. Find deficiency from base ${base}.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Setup',
        nodes: [
          cell(n.toString()), sym('below'), cell(base.toString()), sym('→'), cell(d.toString(), 'tail', { tag: 'd' })
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  // Part 1: (a - 2d)
  const part1 = n - 2*d;
  log.push(['Part 1', `n - 2d = ${n} - 2(${d}) = ${part1}`]);
  
  // Part 2: 3d^2
  const part2 = 3 * d * d;
  const part2Str = part2.toString().padStart(2, '0');
  log.push(['Part 2', `3d² = 3(${d})² = ${part2Str}`]);
  
  frames.push({
    cap: `Cubing formula using deficiency involves three parts.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Parts',
        nodes: [
          cell(part1.toString()), sym('|'), cell(part2Str), sym('|'), cell('...')
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  return {
    title: 'Sutra 10 - Yavadunam: Cubing',
    ruleHTML: 'Extend the deficiency concept to cubing.',
    frames,
    note: `Advanced application of Yavadunam.`
  };
}
