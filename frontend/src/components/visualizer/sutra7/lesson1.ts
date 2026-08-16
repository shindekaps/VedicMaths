import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSankalanaSimple(p: any): LessonModel {
  const a = p.a || 2;
  const b = p.b || 3;
  const c = p.c || 11;
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  // Frame 1
  log.push(['Step 1', `Identify the equation: ${a}x + ${b} = ${c}`]);
  frames.push({
    cap: `We want to solve the linear equation ${a}x + ${b} = ${c}`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Equation',
        nodes: [cell(`${a}x`), sym('+'), cell(`${b}`), sym('='), cell(`${c}`)]
      }
    ],
    wires: [], flyers: []
  });

  // Frame 2
  log.push(['Step 2', `Subtract ${b} from both sides`]);
  const cMinusB = c - b;
  frames.push({
    cap: `Subtract ${b} from both sides to isolate the x term.`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq-1}`,
        label: 'Equation',
        nodes: [cell(`${a}x`), sym('+'), cell(`${b}`), sym('='), cell(`${c}`)],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Subtract',
        nodes: [cell(`${a}x`), sym('='), cell(`${c}`), sym('-'), cell(`${b}`, 'res', { pop: true })]
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Simplify',
        nodes: [cell(`${a}x`), sym('='), cell(`${cMinusB}`, 'res')]
      }
    ],
    wires: [], flyers: []
  });

  // Frame 3
  log.push(['Step 3', `Divide by ${a}`]);
  const ans = cMinusB / a;
  frames.push({
    cap: `Divide by ${a} to find x.`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq-1}`,
        label: 'Simplify',
        nodes: [cell(`${a}x`), sym('='), cell(`${cMinusB}`)],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Divide',
        nodes: [cell('x'), sym('='), cell(`${cMinusB}`), sym('÷'), cell(`${a}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  // Frame 4
  log.push(['Step 4', `Final answer: x = ${ans}`]);
  frames.push({
    cap: `The solution is x = ${ans}`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell('x'), sym('='), cell(`${ans}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Sankalana-Vyavaharana: Simple Linear Equations',
    ruleHTML: 'By addition and by subtraction.',
    frames,
    note: 'This sutra is used to solve simple linear equations by transferring terms.'
  };
}
