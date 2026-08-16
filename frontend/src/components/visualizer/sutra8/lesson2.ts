import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildPuranaSolve(p: any): LessonModel {
  const b = p.b || 5;
  const c = p.c || 6;
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Step 1', `Identify equation: x² + ${b}x + ${c} = 0`]);
  frames.push({
    cap: `Solve the quadratic equation x² + ${b}x + ${c} = 0 by completing the square.`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Equation',
        nodes: [cell('x²'), sym('+'), cell(`${b}x`), sym('+'), cell(`${c}`), sym('='), cell('0')]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 2', `Move constant to right side: x² + ${b}x = ${-c}`]);
  frames.push({
    cap: 'Subtract the constant term from both sides.',
    log: [...log],
    lines: [
      {
        id: `L1`,
        label: 'Equation',
        nodes: [cell('x²'), sym('+'), cell(`${b}x`), sym('+'), cell(`${c}`), sym('='), cell('0')],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Move C',
        nodes: [cell('x²'), sym('+'), cell(`${b}x`), sym('='), cell(`${-c}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  const bHalfStr = b % 2 === 0 ? `${b/2}` : `${b}/2`;
  const bHalfSqStr = b % 2 === 0 ? `${(b/2)*(b/2)}` : `${b*b}/4`;
  log.push(['Step 3', `Add (${bHalfStr})² = ${bHalfSqStr} to both sides`]);
  frames.push({
    cap: `Add the square of half the x coefficient to complete the square on the left.`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Add to both',
        nodes: [cell('x²'), sym('+'), cell(`${b}x`), sym('+'), cell(`${bHalfSqStr}`, 'res', { pop: true }), sym('='), cell(`${-c}`), sym('+'), cell(`${bHalfSqStr}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  const rhsStr = b % 2 === 0 ? `${-c + (b/2)*(b/2)}` : `${-c * 4 + b*b}/4`;
  log.push(['Step 4', 'Factor the left side as a perfect square']);
  frames.push({
    cap: 'Express the left side as a squared binomial and simplify the right side.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Factor',
        nodes: [cell(`(x + ${bHalfStr})²`, 'res', { pop: true }), sym('='), cell(`${rhsStr}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Puranapuranabhyam: Solving Quadratics',
    ruleHTML: 'By the completion or non-completion.',
    frames,
    note: 'We can solve for x by taking the square root of both sides next.'
  };
}
