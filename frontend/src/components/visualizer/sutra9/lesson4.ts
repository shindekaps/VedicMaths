import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym } from '../helpers';

export function buildChalanaOptimize(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  log.push(['Goal', 'Find Max/Min by examining differences']);
  frames.push({
    cap: `To optimize a function, we look at where its differences (derivative) approach zero.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Condition',
        nodes: [cell('f(x+h) - f(x)'), sym('≈'), cell('0', 'res', { pop: true })]
      }
    ],
    wires: [],
    flyers: []
  });
  
  return {
    title: 'Sutra 9 - Chalana-Kalanabyham: Optimization',
    ruleHTML: 'Optimization involves finding where the rate of change is zero.',
    frames,
    note: `Connecting discrete differences to optimization.`
  };
}
