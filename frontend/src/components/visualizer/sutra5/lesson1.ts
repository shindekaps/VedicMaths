import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSunyamZero(p: any): LessonModel {
  const a = p.a || 3;
  const b = p.b || 5;
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  // Frame 1
  log.push(['Start', `Equation: (x - ${a})(x - ${b}) = 0`]);
  frames.push({
    cap: 'We have a product of two factors equal to zero.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Eq',
        nodes: [cell(`(x - ${a})`), cell(`(x - ${b})`), sym('='), cell('0')]
      }
    ],
    wires: [], flyers: []
  });

  // Frame 2
  log.push(['Sutra 5', 'If the product is zero, one of the factors must be zero.']);
  frames.push({
    cap: 'According to Sunyam Samyasamuccaye, if product is zero, one factor is zero.',
    log: [...log],
    lines: frames[0].lines,
    wires: [], flyers: []
  });

  // Frame 3
  log.push(['Solve 1', `x - ${a} = 0 → x = ${a}`]);
  frames.push({
    cap: `First factor: x - ${a} = 0 gives x = ${a}.`,
    log: [...log],
    lines: [
      ...frames[0].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Case 1',
        nodes: [cell(`x - ${a}`), sym('='), cell('0'), sym('→'), cell(`x = ${a}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  // Frame 4
  log.push(['Solve 2', `x - ${b} = 0 → x = ${b}`]);
  frames.push({
    cap: `Second factor: x - ${b} = 0 gives x = ${b}.`,
    log: [...log],
    lines: [
      ...frames[2].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Case 2',
        nodes: [cell(`x - ${b}`), sym('='), cell('0'), sym('→'), cell(`x = ${b}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  // Frame 5
  log.push(['Result', `Solutions: x = ${a} or x = ${b}`]);
  frames.push({
    cap: `The solutions are x = ${a} and x = ${b}.`,
    log: [...log],
    lines: [
      ...frames[3].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Solutions',
        nodes: [cell(`x = ${a}`), sym('or'), cell(`x = ${b}`)]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Finding Zero Solutions',
    ruleHTML: 'Sunyam Samyasamuccaye: If Samuccaya is same, then zero.',
    frames,
    note: 'Applicable for polynomial equations in factored form.'
  };
}
