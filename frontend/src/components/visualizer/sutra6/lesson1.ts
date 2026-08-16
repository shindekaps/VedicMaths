import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildAnurupyeProportion(p: any): LessonModel {
  const a = p.a || 3;
  const b = p.b || 5;
  const c = p.c || 7;
  const d = p.d || 'x';
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Start', `Proportion: ${a} : ${b} = ${c} : ${d}`]);
  frames.push({
    cap: 'We have a proportion between two ratios.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Prop',
        nodes: [cell(`${a}`), sym(':'), cell(`${b}`), sym('='), cell(`${c}`), sym(':'), cell(`${d}`)]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Fraction', `${a}/${b} = ${c}/${d}`]);
  frames.push({
    cap: 'Write ratios as fractions.',
    log: [...log],
    lines: [
      ...frames[0].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Frac',
        nodes: [cell(`${a}/${b}`), sym('='), cell(`${c}/${d}`, '', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Solve', `${a}${d} = ${b * c} → ${d} = ${b * c}/${a}`]);
  frames.push({
    cap: 'Cross multiply and solve for the unknown.',
    log: [...log],
    lines: [
      ...frames[1].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell(`${a}${d}`), sym('='), cell(`${b * c}`), sym('→'), cell(`${d} = ${(b * c / a).toFixed(2)}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Proportional Relations',
    ruleHTML: 'Anurupye Sunyamanyat: If one is in ratio, other is zero.',
    frames,
    note: 'Solve for x using cross multiplication.'
  };
}
