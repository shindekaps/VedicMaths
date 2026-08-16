import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym } from '../helpers';

export function buildChalanaCalc(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  // Frame 1
  log.push(['Concept', 'Difference Quotient']);
  frames.push({
    cap: `Consider a function f(x) and its rate of change.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Function',
        nodes: [cell('f(x)')]
      }
    ],
    wires: [],
    flyers: []
  });
  
  // Frame 2
  log.push(['Formula', '[f(x+h) - f(x)] / h']);
  frames.push({
    cap: `The difference quotient measures the average rate of change over an interval h.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Quotient',
        nodes: [
          cell('f(x+h)'), sym('-'), cell('f(x)'), sym('/'), cell('h', 'tail', { tag: 'difference' })
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  return {
    title: 'Sutra 9 - Chalana-Kalanabyham: Calculus Concepts',
    ruleHTML: '<em>Chalana-Kalanabyham</em> helps in understanding derivatives via differences.',
    frames,
    note: `Visualizes the foundational concept of derivatives.`
  };
}
