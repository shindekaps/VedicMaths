import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSankalanaInequality(p: any): LessonModel {
  const a = p.a || 2;
  const b = p.b || 3;
  const c = p.c || 9;
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Step 1', `Identify the inequality: ${a}x + ${b} > ${c}`]);
  frames.push({
    cap: `Solve the inequality ${a}x + ${b} > ${c}`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Inequality',
        nodes: [cell(`${a}x`), sym('+'), cell(`${b}`), sym('>'), cell(`${c}`)]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 2', `Subtract ${b} from both sides`]);
  const cMinusB = c - b;
  frames.push({
    cap: `Subtract ${b} to isolate the term with x.`,
    log: [...log],
    lines: [
      {
        id: `L1`,
        label: 'Inequality',
        nodes: [cell(`${a}x`), sym('+'), cell(`${b}`), sym('>'), cell(`${c}`)],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Subtract',
        nodes: [cell(`${a}x`), sym('>'), cell(`${cMinusB}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 3', `Divide by ${a}`]);
  const ans = cMinusB / a;
  frames.push({
    cap: `Divide by ${a} to solve for x.`,
    log: [...log],
    lines: [
      {
        id: `L2`,
        label: 'Subtract',
        nodes: [cell(`${a}x`), sym('>'), cell(`${cMinusB}`)],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Divide',
        nodes: [cell('x'), sym('>'), cell(`${ans}`, 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Sankalana-Vyavaharana: Inequalities',
    ruleHTML: 'By addition and by subtraction.',
    frames,
    note: 'The same rules apply for inequalities as for linear equations.'
  };
}
