import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildPuranaSimplify(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Step 1', 'Consider expression x⁴ + 4']);
  frames.push({
    cap: 'Factorize x⁴ + 4 by using the completion method.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Expression',
        nodes: [cell('x⁴'), sym('+'), cell('4')]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 2', 'Complete the square by adding and subtracting 4x²']);
  frames.push({
    cap: 'Add and subtract 4x² to create a perfect square trinomial.',
    log: [...log],
    lines: [
      {
        id: `L1`,
        label: 'Expression',
        nodes: [cell('x⁴'), sym('+'), cell('4')],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Complete Sq',
        nodes: [cell('x⁴'), sym('+'), cell('4x²', 'res', { pop: true }), sym('+'), cell('4'), sym('-'), cell('4x²', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 3', 'Rewrite as difference of squares']);
  frames.push({
    cap: 'The first three terms form (x² + 2)², and 4x² is (2x)²',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Rewrite',
        nodes: [cell('(x² + 2)²', 'res', { pop: true }), sym('-'), cell('(2x)²', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 4', 'Factor using difference of squares formula']);
  frames.push({
    cap: 'Apply a² - b² = (a - b)(a + b)',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell('(x² - 2x + 2)', 'res', { pop: true }), cell('(x² + 2x + 2)', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Puranapuranabhyam: Simplifying Expressions',
    ruleHTML: 'By the completion or non-completion.',
    frames,
    note: 'Adding and subtracting a term can help factor expressions that do not seem factorable initially.'
  };
}
