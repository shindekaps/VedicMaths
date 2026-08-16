import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSankalanaMulti(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Step 1', 'Write down the simultaneous equations']);
  frames.push({
    cap: 'Consider the equations: 3x + 2y = 12 and 2x + y = 7',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Eq 1',
        nodes: [cell('3x'), sym('+'), cell('2y'), sym('='), cell('12')]
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Eq 2',
        nodes: [cell('2x'), sym('+'), cell('y'), sym('='), cell('7')]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 2', 'Multiply Eq 2 by 2 to match y coefficients']);
  frames.push({
    cap: 'Multiply the second equation by 2 so that the coefficients of y are the same.',
    log: [...log],
    lines: [
      {
        id: `L1`,
        label: 'Eq 1',
        nodes: [cell('3x'), sym('+'), cell('2y'), sym('='), cell('12')],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Eq 2 × 2',
        nodes: [cell('4x', 'res', { pop: true }), sym('+'), cell('2y', 'res', { pop: true }), sym('='), cell('14', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 3', 'Subtract Eq 1 from the new Eq 2']);
  frames.push({
    cap: 'Subtract Equation 1 from the modified Equation 2 to eliminate y.',
    log: [...log],
    lines: [
      {
        id: `L3`,
        label: 'Eq 2 × 2',
        nodes: [cell('4x'), sym('+'), cell('2y'), sym('='), cell('14')],
        muted: true
      },
      {
        id: `L1`,
        label: 'Eq 1',
        nodes: [cell('3x'), sym('+'), cell('2y'), sym('='), cell('12')],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Subtract',
        nodes: [cell('x', 'res', { pop: true }), sym('='), cell('2', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 4', 'Substitute x = 2 into Eq 2']);
  frames.push({
    cap: 'Substitute x = 2 into 2x + y = 7',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Substitute',
        nodes: [cell('2(2)'), sym('+'), cell('y'), sym('='), cell('7')]
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Simplify',
        nodes: [cell('4'), sym('+'), cell('y'), sym('='), cell('7')]
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell('y'), sym('='), cell('3', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Sankalana-Vyavaharana: Simultaneous Equations',
    ruleHTML: 'Addition and Subtraction applied to multiple variables.',
    frames,
    note: 'Solve simultaneous equations easily by adding or subtracting them.'
  };
}
