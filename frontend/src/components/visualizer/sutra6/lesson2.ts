import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildAnurupyeSolve(p: any): LessonModel {
  const a = p.a || 3;
  const b = p.b || 5;
  const target = 20;
  const c = p.c || 12; // 3*20/5 = 12
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Start', `Ratio 1: ${a}:${b}`]);
  frames.push({
    cap: `Given a ratio ${a}:${b}. Find x if x:${target}.`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Ratio',
        nodes: [cell(`${a}:${b}`), sym('='), cell(`x:${target}`)]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Cross multiply', `${a} × ${target} = ${b} × x`]);
  frames.push({
    cap: 'Cross multiply the extremes and means.',
    log: [...log],
    lines: [
      ...frames[0].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Product',
        nodes: [cell(`${a * target}`), sym('='), cell(`${b}x`, '', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Solve', `x = ${c}`]);
  frames.push({
    cap: 'Solve for x by dividing.',
    log: [...log],
    lines: [
      ...frames[1].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell(`x = ${c}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Solving with Proportions',
    ruleHTML: 'Anurupye Sunyamanyat.',
    frames,
    note: 'Solve an unknown in a proportional relationship.'
  };
}
