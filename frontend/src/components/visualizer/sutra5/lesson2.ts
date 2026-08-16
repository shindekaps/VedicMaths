import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSunyamQuad(p: any): LessonModel {
  const a = p.a || 1;
  const b = p.b || -7;
  const c = p.c || 12;
  const r1 = 3;
  const r2 = 4;
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  // Frame 1
  log.push(['Start', `Quadratic: ${a}x² ${b > 0 ? '+' : '-'} ${Math.abs(b)}x + ${c} = 0`]);
  frames.push({
    cap: 'We have a quadratic equation.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Eq',
        nodes: [cell(`${a}x² ${b > 0 ? '+' : '-'} ${Math.abs(b)}x + ${c}`), sym('='), cell('0')]
      }
    ],
    wires: [], flyers: []
  });

  // Frame 2
  log.push(['Factor', 'Find two numbers that multiply to 12 and add to -7']);
  frames.push({
    cap: 'Factor the quadratic into two linear binomials.',
    log: [...log],
    lines: [
      ...frames[0].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Factors',
        nodes: [cell(`(x - ${r1})`), cell(`(x - ${r2})`), sym('='), cell('0', '', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  // Frame 3
  log.push(['Solve', `Solutions: x = ${r1}, ${r2}`]);
  frames.push({
    cap: `Using Sutra 5, set each factor to 0. Solutions: x = ${r1}, ${r2}.`,
    log: [...log],
    lines: [
      ...frames[1].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell(`x = ${r1}`), sym(','), cell(`x = ${r2}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Quadratic Equations',
    ruleHTML: 'Sunyam Samyasamuccaye.',
    frames,
    note: 'Find factors and solve.'
  };
}
