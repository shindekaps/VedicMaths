import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildPuranaComplete(p: any): LessonModel {
  const b = p.b || 6;
  const c = p.c || 5;
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Step 1', `Identify expression: x² + ${b}x + ${c}`]);
  frames.push({
    cap: `We want to complete the square for x² + ${b}x + ${c}`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Expression',
        nodes: [cell('x²'), sym('+'), cell(`${b}x`), sym('+'), cell(`${c}`)]
      }
    ],
    wires: [], flyers: []
  });

  const bHalf = b / 2;
  const bHalfSq = bHalf * bHalf;
  log.push(['Step 2', `Take half of x coefficient (${bHalf}) and square it (${bHalfSq})`]);
  frames.push({
    cap: `Add and subtract (${b}/2)² = ${bHalfSq} to complete the square.`,
    log: [...log],
    lines: [
      {
        id: `L1`,
        label: 'Expression',
        nodes: [cell('x²'), sym('+'), cell(`${b}x`), sym('+'), cell(`${c}`)],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Add & Sub',
        nodes: [cell('x²'), sym('+'), cell(`${b}x`), sym('+'), cell(`${bHalfSq}`, 'res', { pop: true }), sym('-'), cell(`${bHalfSq}`, 'res', { pop: true }), sym('+'), cell(`${c}`)]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 3', 'Factor the perfect square trinomial']);
  frames.push({
    cap: `The first three terms form a perfect square: (x + ${bHalf})²`,
    log: [...log],
    lines: [
      {
        id: `L2`,
        label: 'Add & Sub',
        nodes: [cell('x²'), sym('+'), cell(`${b}x`), sym('+'), cell(`${bHalfSq}`), sym('-'), cell(`${bHalfSq}`), sym('+'), cell(`${c}`)],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Factor',
        nodes: [cell(`(x + ${bHalf})²`, 'res', { pop: true }), sym('-'), cell(`${bHalfSq}`), sym('+'), cell(`${c}`)]
      }
    ],
    wires: [], flyers: []
  });

  const constant = c - bHalfSq;
  log.push(['Step 4', `Simplify the constants: ${c} - ${bHalfSq} = ${constant}`]);
  const sign = constant >= 0 ? '+' : '-';
  const absConstant = Math.abs(constant);
  frames.push({
    cap: `Simplify to get the final completed square form.`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell(`(x + ${bHalf})²`), sym(sign), cell(`${absConstant}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Puranapuranabhyam: Completing the Square',
    ruleHTML: 'By the completion or non-completion.',
    frames,
    note: 'Used to write quadratic expressions in vertex form.'
  };
}
