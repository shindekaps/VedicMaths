import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildVyastiStats(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  frames.push({
    cap: 'Calculating Mean of a small dataset.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Dataset',
        nodes: [cell('x1, x2, ..., xn')]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Statistical Analysis',
    ruleHTML: 'Understanding the whole dataset through individual parts.',
    frames,
    note: 'Sutra 11'
  };
}
